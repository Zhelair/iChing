import type { AiProviderId } from './types'
import { openDB, type DBSchema } from 'idb'

const ENCRYPTED_KEY_STORAGE = 'yi-path:ai-keys:v2'
const LEGACY_DEEPSEEK_STORAGE = 'yi-path:deepseek-key:v1'
const ITERATIONS = 310_000

export type EncryptedKeyEnvelope = {
  version: 1
  algorithm: 'AES-GCM'
  derivation: 'PBKDF2-SHA-256'
  iterations: number
  salt: string
  iv: string
  ciphertext: string
}

export type DeviceEncryptedKeyEnvelope = {
  version: 2
  algorithm: 'AES-GCM'
  protection: 'device-key'
  iv: string
  ciphertext: string
}

interface AiDeviceKeyDb extends DBSchema {
  keys: { key: AiProviderId; value: CryptoKey }
}

const deviceKeyDb = openDB<AiDeviceKeyDb>('yi-path-ai-device-keys', 1, {
  upgrade(db) { db.createObjectStore('keys') },
})

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

export async function encryptApiKey(apiKey: string, passphrase: string): Promise<EncryptedKeyEnvelope> {
  if (apiKey.trim().length < 10) throw new Error('invalid-key')
  if (passphrase.length < 10) throw new Error('weak-passphrase')
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(passphrase, salt)
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(apiKey.trim()))
  return {
    version: 1,
    algorithm: 'AES-GCM',
    derivation: 'PBKDF2-SHA-256',
    iterations: ITERATIONS,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
  }
}

export async function decryptApiKey(envelope: EncryptedKeyEnvelope, passphrase: string) {
  if (envelope.version !== 1 || envelope.algorithm !== 'AES-GCM' || envelope.derivation !== 'PBKDF2-SHA-256') throw new Error('unsupported-envelope')
  const salt = base64ToBytes(envelope.salt)
  const iv = base64ToBytes(envelope.iv)
  const key = await deriveKey(passphrase, salt, envelope.iterations)
  try {
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, base64ToBytes(envelope.ciphertext))
    return new TextDecoder().decode(plaintext)
  } catch {
    throw new Error('wrong-passphrase')
  }
}

async function deviceKey(provider: AiProviderId) {
  const db = await deviceKeyDb
  const existing = await db.get('keys', provider)
  if (existing) return existing
  const created = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
  await db.put('keys', created, provider)
  return created
}

export async function encryptApiKeyForDevice(apiKey: string, provider: AiProviderId): Promise<DeviceEncryptedKeyEnvelope> {
  if (apiKey.trim().length < 10) throw new Error('invalid-key')
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deviceKey(provider)
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(apiKey.trim()))
  return { version: 2, algorithm: 'AES-GCM', protection: 'device-key', iv: bytesToBase64(iv), ciphertext: bytesToBase64(new Uint8Array(ciphertext)) }
}

export async function decryptApiKeyForDevice(envelope: DeviceEncryptedKeyEnvelope, provider: AiProviderId) {
  if (envelope.version !== 2 || envelope.algorithm !== 'AES-GCM' || envelope.protection !== 'device-key') throw new Error('unsupported-envelope')
  const key = await deviceKey(provider)
  try {
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base64ToBytes(envelope.iv) }, key, base64ToBytes(envelope.ciphertext))
    return new TextDecoder().decode(plaintext)
  } catch {
    throw new Error('device-key-unavailable')
  }
}

export function isDeviceEncryptedKey(envelope: EncryptedKeyEnvelope | DeviceEncryptedKeyEnvelope | null): envelope is DeviceEncryptedKeyEnvelope {
  return envelope?.version === 2 && envelope.algorithm === 'AES-GCM' && envelope.protection === 'device-key'
}

export async function removeDeviceKey(provider: AiProviderId) {
  await (await deviceKeyDb).delete('keys', provider)
}

type EncryptedKeyRecord = Partial<Record<AiProviderId, EncryptedKeyEnvelope | DeviceEncryptedKeyEnvelope>>

function readKeyRecord(): EncryptedKeyRecord {
  try {
    return JSON.parse(localStorage.getItem(ENCRYPTED_KEY_STORAGE) ?? '{}') as EncryptedKeyRecord
  } catch {
    return {}
  }
}

export function readEncryptedKey(provider: AiProviderId = 'deepseek'): EncryptedKeyEnvelope | DeviceEncryptedKeyEnvelope | null {
  const saved = readKeyRecord()[provider]
  if (saved?.version === 1 || saved?.version === 2) return saved as EncryptedKeyEnvelope | DeviceEncryptedKeyEnvelope
  if (provider !== 'deepseek') return null
  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_DEEPSEEK_STORAGE) ?? 'null') as EncryptedKeyEnvelope | null
    return legacy?.version === 1 ? legacy : null
  } catch {
    return null
  }
}

export function storeEncryptedKey(envelope: EncryptedKeyEnvelope | DeviceEncryptedKeyEnvelope, provider: AiProviderId = 'deepseek') {
  localStorage.setItem(ENCRYPTED_KEY_STORAGE, JSON.stringify({ ...readKeyRecord(), [provider]: envelope }))
  if (provider === 'deepseek') localStorage.removeItem(LEGACY_DEEPSEEK_STORAGE)
}

export async function removeEncryptedKey(provider: AiProviderId = 'deepseek') {
  const record = readKeyRecord()
  delete record[provider]
  if (Object.keys(record).length) localStorage.setItem(ENCRYPTED_KEY_STORAGE, JSON.stringify(record))
  else localStorage.removeItem(ENCRYPTED_KEY_STORAGE)
  if (provider === 'deepseek') localStorage.removeItem(LEGACY_DEEPSEEK_STORAGE)
  await removeDeviceKey(provider)
}
