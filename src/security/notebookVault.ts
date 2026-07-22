import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { AiReflectionRecord } from '../ai/types'
import type { JournalEntry, PracticeSession, Reading, ReadingProgress, StudyNote } from '../domain/types'

const FLAG_KEY = 'yi-path:notebook-protected:v1'
const VAULT_DB_NAME = 'yi-path-notebook-vault'
const ITERATIONS = 310_000

export type NotebookData = {
  version: 1
  readings: Reading[]
  studyNotes: StudyNote[]
  journalEntries: JournalEntry[]
  readingProgress: ReadingProgress[]
  practiceSessions: PracticeSession[]
  aiReflections: AiReflectionRecord[]
}

export type EncryptedNotebookEnvelope = {
  version: 1
  algorithm: 'AES-GCM'
  derivation: 'PBKDF2-SHA-256'
  iterations: number
  salt: string
  iv: string
  ciphertext: string
  updatedAt: string
}

interface NotebookVaultDb extends DBSchema {
  vault: { key: 'notebook'; value: EncryptedNotebookEnvelope }
}

let dbPromise: Promise<IDBPDatabase<NotebookVaultDb>> | null = null
let unlocked: { key: CryptoKey; salt: Uint8Array; data: NotebookData } | null = null
let writeQueue: Promise<void> = Promise.resolve()

function getDb() {
  dbPromise ??= openDB<NotebookVaultDb>(VAULT_DB_NAME, 1, {
    upgrade(db) { db.createObjectStore('vault') },
  })
  return dbPromise
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function base64ToBytes(value: string) {
  const binary = atob(value)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

async function deriveKey(passphrase: string, salt: Uint8Array, iterations = ITERATIONS) {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt: salt as BufferSource, iterations },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

function validateNotebookData(value: unknown): NotebookData {
  const data = value as Partial<NotebookData> | null
  if (!data || data.version !== 1 || !Array.isArray(data.readings) || !Array.isArray(data.studyNotes) || !Array.isArray(data.journalEntries) || !Array.isArray(data.readingProgress) || !Array.isArray(data.practiceSessions) || !Array.isArray(data.aiReflections)) {
    throw new Error('invalid-notebook')
  }
  return data as NotebookData
}

async function envelopeFor(key: CryptoKey, salt: Uint8Array, data: NotebookData): Promise<EncryptedNotebookEnvelope> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const plaintext = new TextEncoder().encode(JSON.stringify(data))
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext)
  return {
    version: 1,
    algorithm: 'AES-GCM',
    derivation: 'PBKDF2-SHA-256',
    iterations: ITERATIONS,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
    updatedAt: new Date().toISOString(),
  }
}

export function emptyNotebookData(): NotebookData {
  return { version: 1, readings: [], studyNotes: [], journalEntries: [], readingProgress: [], practiceSessions: [], aiReflections: [] }
}

export function hasNotebookProtection() {
  try { return localStorage.getItem(FLAG_KEY) === '1' } catch { return false }
}

export function isNotebookUnlocked() {
  return unlocked !== null
}

export async function encryptNotebookData(data: NotebookData, passphrase: string) {
  if (passphrase.length < 10) throw new Error('weak-passphrase')
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await deriveKey(passphrase, salt)
  return envelopeFor(key, salt, validateNotebookData(data))
}

export async function decryptNotebookData(envelope: EncryptedNotebookEnvelope, passphrase: string) {
  if (envelope.version !== 1 || envelope.algorithm !== 'AES-GCM' || envelope.derivation !== 'PBKDF2-SHA-256') throw new Error('unsupported-notebook')
  const salt = base64ToBytes(envelope.salt)
  const key = await deriveKey(passphrase, salt, envelope.iterations)
  try {
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base64ToBytes(envelope.iv) }, key, base64ToBytes(envelope.ciphertext))
    return { key, salt, data: validateNotebookData(JSON.parse(new TextDecoder().decode(plaintext))) }
  } catch (error) {
    if (error instanceof Error && error.message === 'invalid-notebook') throw error
    throw new Error('wrong-passphrase')
  }
}

export async function notebookVaultExists() {
  return Boolean(await (await getDb()).get('vault', 'notebook'))
}

export async function enableNotebookProtection(passphrase: string, data: NotebookData) {
  const normalized = validateNotebookData(data)
  const envelope = await encryptNotebookData(normalized, passphrase)
  const salt = base64ToBytes(envelope.salt)
  const key = await deriveKey(passphrase, salt, envelope.iterations)
  await (await getDb()).put('vault', envelope, 'notebook')
  localStorage.setItem(FLAG_KEY, '1')
  unlocked = { key, salt, data: structuredClone(normalized) }
}

export async function unlockNotebook(passphrase: string) {
  const envelope = await (await getDb()).get('vault', 'notebook')
  if (!envelope) throw new Error('missing-notebook')
  const decrypted = await decryptNotebookData(envelope, passphrase)
  unlocked = decrypted
  return structuredClone(decrypted.data)
}

export async function readUnlockedNotebook() {
  await writeQueue
  if (!unlocked) throw new Error('notebook-locked')
  return structuredClone(unlocked.data)
}

export async function updateUnlockedNotebook<Result>(mutate: (data: NotebookData) => Result | Promise<Result>): Promise<Result> {
  let result!: Result
  const operation = writeQueue.then(async () => {
    if (!unlocked) throw new Error('notebook-locked')
    result = await mutate(unlocked.data)
    const envelope = await envelopeFor(unlocked.key, unlocked.salt, unlocked.data)
    await (await getDb()).put('vault', envelope, 'notebook')
  })
  writeQueue = operation.catch(() => undefined)
  await operation
  return result
}

export async function lockNotebook() {
  await writeQueue
  unlocked = null
}

export async function removeNotebookProtection() {
  await writeQueue
  await (await getDb()).delete('vault', 'notebook')
  localStorage.removeItem(FLAG_KEY)
  unlocked = null
}
