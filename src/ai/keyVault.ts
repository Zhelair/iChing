const ENCRYPTED_KEY_STORAGE = 'yi-path:deepseek-key:v1'
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

export function readEncryptedKey(): EncryptedKeyEnvelope | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(ENCRYPTED_KEY_STORAGE) ?? 'null') as EncryptedKeyEnvelope | null
    return parsed?.version === 1 ? parsed : null
  } catch {
    return null
  }
}

export function storeEncryptedKey(envelope: EncryptedKeyEnvelope) {
  localStorage.setItem(ENCRYPTED_KEY_STORAGE, JSON.stringify(envelope))
}

export function removeEncryptedKey() {
  localStorage.removeItem(ENCRYPTED_KEY_STORAGE)
}
