/// <reference types="node" />
import { webcrypto } from 'node:crypto'
import { beforeAll, describe, expect, it } from 'vitest'

beforeAll(() => {
  Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true })
})

describe('encrypted notebook vault', () => {
  it('round-trips the notebook without placing data or passphrase in the envelope', async () => {
    const { decryptNotebookData, emptyNotebookData, encryptNotebookData } = await import('./notebookVault')
    const data = { ...emptyNotebookData(), journalEntries: [{ id: 'private-note', schemaVersion: 1 as const, createdAt: '2026-01-01', updatedAt: '2026-01-01', locale: 'en' as const, kind: 'freeform' as const, title: 'Private title', body: 'Private body', tags: [] }] }
    const passphrase = 'correct horse battery staple'
    const envelope = await encryptNotebookData(data, passphrase)
    const serialized = JSON.stringify(envelope)
    expect(serialized).not.toContain('Private body')
    expect(serialized).not.toContain(passphrase)
    await expect(decryptNotebookData(envelope, passphrase).then((result) => result.data)).resolves.toEqual(data)
  })

  it('rejects an incorrect passphrase', async () => {
    const { decryptNotebookData, emptyNotebookData, encryptNotebookData } = await import('./notebookVault')
    const envelope = await encryptNotebookData(emptyNotebookData(), 'correct horse battery staple')
    await expect(decryptNotebookData(envelope, 'this passphrase is wrong')).rejects.toThrow('wrong-passphrase')
  })

  it('creates an empty versioned notebook', async () => {
    const { emptyNotebookData } = await import('./notebookVault')
    expect(emptyNotebookData()).toEqual({
      version: 1,
      readings: [],
      studyNotes: [],
      journalEntries: [],
      readingProgress: [],
      practiceSessions: [],
      aiReflections: [],
    })
  })
})
