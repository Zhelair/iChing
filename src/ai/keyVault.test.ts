/// <reference types="node" />
import { webcrypto } from 'node:crypto'
import { beforeAll, describe, expect, it } from 'vitest'
import { decryptApiKey, encryptApiKey } from './keyVault'

beforeAll(() => {
  Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true })
})

describe('encrypted local BYOK vault', () => {
  it('round-trips a key without placing the key or passphrase in the envelope', async () => {
    const apiKey = 'sk-deepseek-test-secret-123456'
    const passphrase = 'a private test passphrase'
    const envelope = await encryptApiKey(apiKey, passphrase)
    const serialized = JSON.stringify(envelope)

    expect(envelope.algorithm).toBe('AES-GCM')
    expect(envelope.derivation).toBe('PBKDF2-SHA-256')
    expect(envelope.iterations).toBeGreaterThanOrEqual(300_000)
    expect(serialized).not.toContain(apiKey)
    expect(serialized).not.toContain(passphrase)
    await expect(decryptApiKey(envelope, passphrase)).resolves.toBe(apiKey)
  })

  it('rejects a wrong passphrase without returning partial key material', async () => {
    const envelope = await encryptApiKey('sk-deepseek-test-secret-abcdef', 'correct horse battery staple')
    await expect(decryptApiKey(envelope, 'an incorrect passphrase')).rejects.toThrow('wrong-passphrase')
  })
})
