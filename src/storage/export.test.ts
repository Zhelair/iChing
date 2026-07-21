import { describe, expect, it, vi } from 'vitest'
import { findHexagramByPattern } from '../data/hexagrams'
import { patternFromLines } from '../domain/casting'
import { EXTENDED_LOCALES } from '../domain/locales'
import { linesFromKnownHexagram } from '../domain/reading'
import type { YiPathExport } from '../domain/types'
import { MAX_EXPORT_FILE_BYTES, parseExport } from './export'

vi.mock('./db', () => ({
  getAllReadings: vi.fn(async () => []),
  getStudyNotes: vi.fn(async () => []),
  getAllJournalEntries: vi.fn(async () => []),
  getAllReadingProgress: vi.fn(async () => []),
  getPracticeSessions: vi.fn(async () => []),
}))

function validBackup(): YiPathExport {
  const lines = linesFromKnownHexagram(1, [1, 4])
  return {
    app: 'yi-path',
    schemaVersion: 1,
    contentVersion: 'test-content',
    exportedAt: '2026-07-19T12:00:00.000Z',
    preferences: { locale: 'en', theme: 'daylight', sound: false, music: false, ambientVolume: 0, reduceMotion: false },
    readings: [{
      id: 'reading-1',
      schemaVersion: 1,
      contentVersion: 'test-content',
      createdAt: '2026-07-19T12:00:00.000Z',
      updatedAt: '2026-07-19T12:00:00.000Z',
      method: 'direct',
      locale: 'en',
      question: 'What is changing?',
      lines,
      primaryHexagramId: findHexagramByPattern(patternFromLines(lines)).id,
      resultingHexagramId: findHexagramByPattern(patternFromLines(lines, true)).id,
      note: '',
      tags: [],
    }],
  }
}

function copyBackup() {
  return JSON.parse(JSON.stringify(validBackup())) as YiPathExport
}

describe('Yi Path backup validation', () => {
  it('accepts a complete, internally consistent backup', () => {
    expect(parseExport(validBackup()).readings).toHaveLength(1)
    expect(MAX_EXPORT_FILE_BYTES).toBe(5 * 1024 * 1024)
  })

  it.each(EXTENDED_LOCALES)('accepts readings and preferences stored in %s', (locale) => {
    const backup = copyBackup()
    backup.preferences.locale = locale
    backup.readings[0].locale = locale
    expect(parseExport(backup).preferences.locale).toBe(locale)
  })

  it('rejects lines whose order or derived polarity was altered', () => {
    const wrongPosition = copyBackup()
    wrongPosition.readings[0].lines[0].position = 2
    expect(() => parseExport(wrongPosition)).toThrow('Invalid Yi Path backup')

    const wrongPolarity = copyBackup()
    wrongPolarity.readings[0].lines[0].polarity = 'yin'
    expect(() => parseExport(wrongPolarity)).toThrow('Invalid Yi Path backup')
  })

  it('rejects hexagram ids that do not match the imported lines', () => {
    const backup = copyBackup()
    backup.readings[0].primaryHexagramId = backup.readings[0].primaryHexagramId === 64 ? 63 : 64
    expect(() => parseExport(backup)).toThrow('Invalid Yi Path backup')
  })

  it('rejects oversized text and invalid dates', () => {
    const oversized = copyBackup()
    oversized.readings[0].question = 'x'.repeat(501)
    expect(() => parseExport(oversized)).toThrow('Invalid Yi Path backup')

    const badDate = copyBackup()
    badDate.exportedAt = 'not-a-date'
    expect(() => parseExport(badDate)).toThrow('Invalid Yi Path backup')
  })

  it('accepts the optional Dao study, journal, progress, and practice records', () => {
    const backup = copyBackup()
    backup.studyNotes = [{ id: 'note-1', schemaVersion: 1, createdAt: backup.exportedAt, updatedAt: backup.exportedAt, locale: 'en', anchor: { workId: 'dao-work', passageId: 'water', startOffset: 0, endOffset: 5, quote: 'Water' }, body: 'A study note', tags: ['dao'] }]
    backup.journalEntries = [{ id: 'entry-1', schemaVersion: 1, createdAt: backup.exportedAt, updatedAt: backup.exportedAt, locale: 'en', kind: 'practice', title: 'Settling breath', body: 'A little quieter.', tags: ['dao'], durationSeconds: 60 }]
    backup.readingProgress = [{ workId: 'dao-work', updatedAt: backup.exportedAt, passageId: 'water', progress: 1 / 3 }]
    backup.practiceSessions = [{ id: 'session-1', schemaVersion: 1, createdAt: backup.exportedAt, practiceId: 'settling-breath-v1', durationSeconds: 60, completed: true, reflectionEntryId: 'entry-1' }]
    expect(parseExport(backup).journalEntries).toHaveLength(1)
  })
})
