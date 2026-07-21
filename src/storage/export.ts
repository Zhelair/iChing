import { CONTENT_VERSION, findHexagramByPattern } from '../data/hexagrams'
import { patternFromLines } from '../domain/casting'
import { isLocale } from '../domain/locales'
import type { AmbientVolume, CastLine, JournalEntry, LineValue, Polarity, PracticeSession, Preferences, Reading, ReadingMethod, ReadingProgress, StudyNote, Theme, YiPathExport } from '../domain/types'
import { getAllJournalEntries, getAllReadingProgress, getAllReadings, getPracticeSessions, getStudyNotes } from './db'

export const MAX_EXPORT_FILE_BYTES = 5 * 1024 * 1024
const MAX_IMPORTED_READINGS = 5000

function isBoundedString(value: unknown, maximum: number, allowEmpty = true): value is string {
  return typeof value === 'string' && value.length <= maximum && (allowEmpty || value.length > 0)
}

function isDate(value: unknown): value is string {
  return isBoundedString(value, 64, false) && Number.isFinite(Date.parse(value))
}

function isPolarity(value: unknown): value is Polarity {
  return value === 'yin' || value === 'yang'
}

function isLineValue(value: unknown): value is LineValue {
  return value === 6 || value === 7 || value === 8 || value === 9
}

function isCastLine(value: unknown, expectedPosition: number): value is CastLine {
  if (!value || typeof value !== 'object') return false
  const line = value as Partial<CastLine>
  if (
    line.position !== expectedPosition ||
    !isLineValue(line.value) ||
    !isPolarity(line.polarity) ||
    typeof line.moving !== 'boolean' ||
    !isPolarity(line.transformedPolarity)
  ) return false

  if (line.coins !== undefined && (
    !Array.isArray(line.coins) ||
    line.coins.length !== 3 ||
    !line.coins.every((coin) => coin === 'heads' || coin === 'tails') ||
    line.coins.reduce((total, coin) => total + (coin === 'heads' ? 3 : 2), 0) !== line.value
  )) return false

  const expectedPolarity: Polarity = line.value % 2 === 0 ? 'yin' : 'yang'
  const expectedMoving = line.value === 6 || line.value === 9
  const expectedTransformed = expectedMoving ? (expectedPolarity === 'yin' ? 'yang' : 'yin') : expectedPolarity
  return line.polarity === expectedPolarity && line.moving === expectedMoving && line.transformedPolarity === expectedTransformed
}

function isHexagramId(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 64
}

function isReadingMethod(value: unknown): value is ReadingMethod {
  return value === 'digital' || value === 'physical' || value === 'yarrow' || value === 'direct'
}

function hasConsistentHexagrams(reading: Partial<Reading>) {
  try {
    const lines = reading.lines as CastLine[]
    return findHexagramByPattern(patternFromLines(lines)).id === reading.primaryHexagramId &&
      findHexagramByPattern(patternFromLines(lines, true)).id === reading.resultingHexagramId
  } catch {
    return false
  }
}

export async function createExport(preferences: Preferences): Promise<YiPathExport> {
  const [readings, studyNotes, journalEntries, readingProgress, practiceSessions] = await Promise.all([getAllReadings(), getStudyNotes(), getAllJournalEntries(), getAllReadingProgress(), getPracticeSessions()])
  return {
    app: 'yi-path',
    schemaVersion: 1,
    contentVersion: CONTENT_VERSION,
    exportedAt: new Date().toISOString(),
    readings,
    studyNotes,
    journalEntries,
    readingProgress,
    practiceSessions,
    preferences,
  }
}

function isTags(value: unknown): value is string[] {
  return Array.isArray(value) && value.length <= 40 && value.every((tag) => isBoundedString(tag, 60, false))
}

function isStudyNote(value: unknown): value is StudyNote {
  if (!value || typeof value !== 'object') return false
  const note = value as Partial<StudyNote>
  const anchor = note.anchor
  return isBoundedString(note.id, 128, false) && note.schemaVersion === 1 && isDate(note.createdAt) && isDate(note.updatedAt) && isLocale(note.locale)
    && isBoundedString(note.body, 10000, false) && isTags(note.tags) && Boolean(anchor)
    && isBoundedString(anchor?.workId, 160, false) && isBoundedString(anchor?.passageId, 160, false)
    && Number.isInteger(anchor?.startOffset) && Number.isInteger(anchor?.endOffset) && isBoundedString(anchor?.quote, 1000)
}

function isJournalEntry(value: unknown): value is JournalEntry {
  if (!value || typeof value !== 'object') return false
  const entry = value as Partial<JournalEntry>
  return isBoundedString(entry.id, 128, false) && entry.schemaVersion === 1 && isDate(entry.createdAt) && isDate(entry.updatedAt) && isLocale(entry.locale)
    && (entry.kind === 'freeform' || entry.kind === 'study' || entry.kind === 'practice') && isBoundedString(entry.title, 300, false)
    && isBoundedString(entry.body, 20000, false) && isTags(entry.tags)
    && (entry.sourceId === undefined || isBoundedString(entry.sourceId, 240, false))
    && (entry.durationSeconds === undefined || (Number.isInteger(entry.durationSeconds) && entry.durationSeconds >= 0 && entry.durationSeconds <= 86400))
}

function isReadingProgress(value: unknown): value is ReadingProgress {
  if (!value || typeof value !== 'object') return false
  const progress = value as Partial<ReadingProgress>
  return isBoundedString(progress.workId, 160, false) && isDate(progress.updatedAt) && isBoundedString(progress.passageId, 160, false)
    && typeof progress.progress === 'number' && progress.progress >= 0 && progress.progress <= 1
}

function isPracticeSession(value: unknown): value is PracticeSession {
  if (!value || typeof value !== 'object') return false
  const session = value as Partial<PracticeSession>
  return isBoundedString(session.id, 128, false) && session.schemaVersion === 1 && isDate(session.createdAt) && isBoundedString(session.practiceId, 160, false)
    && Number.isInteger(session.durationSeconds) && Number(session.durationSeconds) >= 0 && Number(session.durationSeconds) <= 86400
    && typeof session.completed === 'boolean' && (session.reflectionEntryId === undefined || isBoundedString(session.reflectionEntryId, 128, false))
}

function isReading(value: unknown): value is Reading {
  if (!value || typeof value !== 'object') return false
  const reading = value as Partial<Reading>
  return (
    isBoundedString(reading.id, 128, false) &&
    reading.schemaVersion === 1 &&
    isBoundedString(reading.contentVersion, 128, false) &&
    isDate(reading.createdAt) &&
    isDate(reading.updatedAt) &&
    isReadingMethod(reading.method) &&
    isLocale(reading.locale) &&
    isBoundedString(reading.question, 500) &&
    isHexagramId(reading.primaryHexagramId) &&
    isHexagramId(reading.resultingHexagramId) &&
    isBoundedString(reading.note, 4000) &&
    Array.isArray(reading.tags) &&
    reading.tags.length <= 40 &&
    reading.tags.every((tag) => isBoundedString(tag, 60, false)) &&
    Array.isArray(reading.lines) &&
    reading.lines.length === 6 &&
    reading.lines.every((line, index) => isCastLine(line, index + 1)) &&
    hasConsistentHexagrams(reading)
  )
}

export function parseExport(value: unknown): YiPathExport {
  if (!value || typeof value !== 'object') throw new Error('Backup must be an object.')
  const backup = value as Partial<YiPathExport>
  const validTheme = (theme: unknown): theme is Theme => ['daylight', 'ink-night', 'bamboo-mist'].includes(theme as Theme)
  const validAmbientVolume = (volume: unknown): volume is AmbientVolume => volume === 0 || volume === 0.5 || volume === 1
  if (
    backup.app !== 'yi-path' ||
    backup.schemaVersion !== 1 ||
    !isBoundedString(backup.contentVersion, 128, false) ||
    !isDate(backup.exportedAt) ||
    !Array.isArray(backup.readings) ||
    backup.readings.length > MAX_IMPORTED_READINGS ||
    !backup.readings.every(isReading) ||
    (backup.studyNotes !== undefined && (!Array.isArray(backup.studyNotes) || backup.studyNotes.length > MAX_IMPORTED_READINGS || !backup.studyNotes.every(isStudyNote))) ||
    (backup.journalEntries !== undefined && (!Array.isArray(backup.journalEntries) || backup.journalEntries.length > MAX_IMPORTED_READINGS || !backup.journalEntries.every(isJournalEntry))) ||
    (backup.readingProgress !== undefined && (!Array.isArray(backup.readingProgress) || backup.readingProgress.length > MAX_IMPORTED_READINGS || !backup.readingProgress.every(isReadingProgress))) ||
    (backup.practiceSessions !== undefined && (!Array.isArray(backup.practiceSessions) || backup.practiceSessions.length > MAX_IMPORTED_READINGS || !backup.practiceSessions.every(isPracticeSession))) ||
    !backup.preferences ||
    !isLocale(backup.preferences.locale) ||
    typeof backup.preferences.sound !== 'boolean' ||
    typeof backup.preferences.music !== 'boolean' ||
    typeof backup.preferences.reduceMotion !== 'boolean'
  ) {
    throw new Error('Invalid Yi Path backup.')
  }
  return {
    ...(backup as YiPathExport),
    preferences: {
      ...(backup.preferences as Preferences),
      theme: validTheme(backup.preferences.theme) ? backup.preferences.theme : 'daylight',
      ambientVolume: validAmbientVolume(backup.preferences.ambientVolume) ? backup.preferences.ambientVolume : backup.preferences.music ? 0.5 : 0,
    },
  }
}

export function downloadExport(backup: YiPathExport) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `yi-path-export-${new Date().toISOString().slice(0, 10)}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}
