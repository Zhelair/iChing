import { openDB, type DBSchema } from 'idb'
import type { JournalEntry, PracticeSession, Reading, ReadingProgress, StudyNote, YiPathExport } from '../domain/types'
import type { AiReflectionRecord } from '../ai/types'

interface YiPathDb extends DBSchema {
  readings: {
    key: string
    value: Reading
    indexes: { 'by-created': string }
  }
  studyNotes: {
    key: string
    value: StudyNote
    indexes: { 'by-updated': string; 'by-work': string }
  }
  journalEntries: {
    key: string
    value: JournalEntry
    indexes: { 'by-created': string; 'by-kind': string }
  }
  readingProgress: {
    key: string
    value: ReadingProgress
    indexes: { 'by-updated': string }
  }
  practiceSessions: {
    key: string
    value: PracticeSession
    indexes: { 'by-created': string; 'by-practice': string }
  }
  aiReflections: {
    key: string
    value: AiReflectionRecord
    indexes: { 'by-created': string; 'by-kind': string }
  }
}

const DB_NAME = 'yi-path'
const DB_VERSION = 3

const dbPromise = openDB<YiPathDb>(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion) {
    if (oldVersion < 1) {
      const readings = db.createObjectStore('readings', { keyPath: 'id' })
      readings.createIndex('by-created', 'createdAt')
    }
    if (oldVersion < 2) {
      const notes = db.createObjectStore('studyNotes', { keyPath: 'id' })
      notes.createIndex('by-updated', 'updatedAt')
      notes.createIndex('by-work', 'anchor.workId')
      const entries = db.createObjectStore('journalEntries', { keyPath: 'id' })
      entries.createIndex('by-created', 'createdAt')
      entries.createIndex('by-kind', 'kind')
      const progress = db.createObjectStore('readingProgress', { keyPath: 'workId' })
      progress.createIndex('by-updated', 'updatedAt')
      const sessions = db.createObjectStore('practiceSessions', { keyPath: 'id' })
      sessions.createIndex('by-created', 'createdAt')
      sessions.createIndex('by-practice', 'practiceId')
    }
    if (oldVersion < 3) {
      const reflections = db.createObjectStore('aiReflections', { keyPath: 'id' })
      reflections.createIndex('by-created', 'createdAt')
      reflections.createIndex('by-kind', 'kind')
    }
  },
})

export async function saveReading(reading: Reading) {
  return (await dbPromise).put('readings', reading)
}

export async function getReading(id: string) {
  return (await dbPromise).get('readings', id)
}

export async function getAllReadings() {
  const readings = await (await dbPromise).getAllFromIndex('readings', 'by-created')
  return readings.reverse()
}

export async function clearReadings() {
  return (await dbPromise).clear('readings')
}

export async function deleteReading(id: string) {
  return (await dbPromise).delete('readings', id)
}

export async function saveStudyNote(note: StudyNote) {
  return (await dbPromise).put('studyNotes', note)
}

export async function getStudyNotes(workId?: string) {
  const db = await dbPromise
  const notes = workId
    ? await db.getAllFromIndex('studyNotes', 'by-work', workId)
    : await db.getAllFromIndex('studyNotes', 'by-updated')
  return notes.reverse()
}

export async function deleteStudyNote(id: string) {
  return (await dbPromise).delete('studyNotes', id)
}

export async function saveJournalEntry(entry: JournalEntry) {
  return (await dbPromise).put('journalEntries', entry)
}

export async function getAllJournalEntries() {
  const entries = await (await dbPromise).getAllFromIndex('journalEntries', 'by-created')
  return entries.reverse()
}

export async function deleteJournalEntry(id: string) {
  return (await dbPromise).delete('journalEntries', id)
}

export async function saveReadingProgress(progress: ReadingProgress) {
  return (await dbPromise).put('readingProgress', progress)
}

export async function getReadingProgress(workId: string) {
  return (await dbPromise).get('readingProgress', workId)
}

export async function getAllReadingProgress() {
  const progress = await (await dbPromise).getAllFromIndex('readingProgress', 'by-updated')
  return progress.reverse()
}

export async function savePracticeSession(session: PracticeSession) {
  return (await dbPromise).put('practiceSessions', session)
}

export async function getPracticeSessions(practiceId?: string) {
  const db = await dbPromise
  const sessions = practiceId
    ? await db.getAllFromIndex('practiceSessions', 'by-practice', practiceId)
    : await db.getAllFromIndex('practiceSessions', 'by-created')
  return sessions.reverse()
}

export async function saveAiReflection(reflection: AiReflectionRecord) {
  return (await dbPromise).put('aiReflections', reflection)
}

export async function getAiReflections(kind?: AiReflectionRecord['kind']) {
  const db = await dbPromise
  const reflections = kind
    ? await db.getAllFromIndex('aiReflections', 'by-kind', kind)
    : await db.getAllFromIndex('aiReflections', 'by-created')
  return reflections.reverse()
}

export async function deleteAiReflection(id: string) {
  return (await dbPromise).delete('aiReflections', id)
}

export async function clearAiReflections() {
  return (await dbPromise).clear('aiReflections')
}

export async function clearAllLocalData() {
  const db = await dbPromise
  const transaction = db.transaction(['readings', 'studyNotes', 'journalEntries', 'readingProgress', 'practiceSessions', 'aiReflections'], 'readwrite')
  await Promise.all([
    transaction.objectStore('readings').clear(),
    transaction.objectStore('studyNotes').clear(),
    transaction.objectStore('journalEntries').clear(),
    transaction.objectStore('readingProgress').clear(),
    transaction.objectStore('practiceSessions').clear(),
    transaction.objectStore('aiReflections').clear(),
  ])
  await transaction.done
}

export async function importReadings(backup: YiPathExport, mode: 'merge' | 'replace') {
  const db = await dbPromise
  const transaction = db.transaction(['readings', 'studyNotes', 'journalEntries', 'readingProgress', 'practiceSessions'], 'readwrite')
  if (mode === 'replace') await Promise.all([
    transaction.objectStore('readings').clear(), transaction.objectStore('studyNotes').clear(),
    transaction.objectStore('journalEntries').clear(), transaction.objectStore('readingProgress').clear(), transaction.objectStore('practiceSessions').clear(),
  ])
  for (const reading of backup.readings) await transaction.objectStore('readings').put(reading)
  for (const note of backup.studyNotes ?? []) await transaction.objectStore('studyNotes').put(note)
  for (const entry of backup.journalEntries ?? []) await transaction.objectStore('journalEntries').put(entry)
  for (const progress of backup.readingProgress ?? []) await transaction.objectStore('readingProgress').put(progress)
  for (const session of backup.practiceSessions ?? []) await transaction.objectStore('practiceSessions').put(session)
  await transaction.done
}

export function deleteDatabase() {
  return clearAllLocalData()
}
