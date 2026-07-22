import { openDB, type DBSchema } from 'idb'
import type { JournalEntry, PracticeSession, Reading, ReadingProgress, StudyNote, YiPathExport } from '../domain/types'
import type { AiReflectionRecord } from '../ai/types'
import { emptyNotebookData, hasNotebookProtection, readUnlockedNotebook, updateUnlockedNotebook, type NotebookData } from '../security/notebookVault'

interface YiPathDb extends DBSchema {
  readings: { key: string; value: Reading; indexes: { 'by-created': string } }
  studyNotes: { key: string; value: StudyNote; indexes: { 'by-updated': string; 'by-work': string } }
  journalEntries: { key: string; value: JournalEntry; indexes: { 'by-created': string; 'by-kind': string } }
  readingProgress: { key: string; value: ReadingProgress; indexes: { 'by-updated': string } }
  practiceSessions: { key: string; value: PracticeSession; indexes: { 'by-created': string; 'by-practice': string } }
  aiReflections: { key: string; value: AiReflectionRecord; indexes: { 'by-created': string; 'by-kind': string } }
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
      notes.createIndex('by-updated', 'updatedAt'); notes.createIndex('by-work', 'anchor.workId')
      const entries = db.createObjectStore('journalEntries', { keyPath: 'id' })
      entries.createIndex('by-created', 'createdAt'); entries.createIndex('by-kind', 'kind')
      const progress = db.createObjectStore('readingProgress', { keyPath: 'workId' })
      progress.createIndex('by-updated', 'updatedAt')
      const sessions = db.createObjectStore('practiceSessions', { keyPath: 'id' })
      sessions.createIndex('by-created', 'createdAt'); sessions.createIndex('by-practice', 'practiceId')
    }
    if (oldVersion < 3) {
      const reflections = db.createObjectStore('aiReflections', { keyPath: 'id' })
      reflections.createIndex('by-created', 'createdAt'); reflections.createIndex('by-kind', 'kind')
    }
  },
})

function newestFirst<Value extends { createdAt?: string; updatedAt?: string }>(values: Value[], field: 'createdAt' | 'updatedAt') {
  return [...values].sort((a, b) => String(b[field] ?? '').localeCompare(String(a[field] ?? '')))
}

function upsert<Value, Key>(values: Value[], value: Value, key: (item: Value) => Key) {
  const index = values.findIndex((item) => key(item) === key(value))
  if (index >= 0) values[index] = value
  else values.push(value)
}

export async function saveReading(reading: Reading) {
  if (hasNotebookProtection()) return updateUnlockedNotebook((data) => { upsert(data.readings, reading, (item) => item.id); return reading.id })
  return (await dbPromise).put('readings', reading)
}

export async function getReading(id: string) {
  if (hasNotebookProtection()) return (await readUnlockedNotebook()).readings.find((reading) => reading.id === id)
  return (await dbPromise).get('readings', id)
}

export async function getAllReadings() {
  if (hasNotebookProtection()) return newestFirst((await readUnlockedNotebook()).readings, 'createdAt')
  const readings = await (await dbPromise).getAllFromIndex('readings', 'by-created')
  return readings.reverse()
}

export async function clearReadings() {
  if (hasNotebookProtection()) return updateUnlockedNotebook((data) => { data.readings = [] })
  return (await dbPromise).clear('readings')
}

export async function deleteReading(id: string) {
  if (hasNotebookProtection()) return updateUnlockedNotebook((data) => { data.readings = data.readings.filter((item) => item.id !== id) })
  return (await dbPromise).delete('readings', id)
}

export async function saveStudyNote(note: StudyNote) {
  if (hasNotebookProtection()) return updateUnlockedNotebook((data) => { upsert(data.studyNotes, note, (item) => item.id); return note.id })
  return (await dbPromise).put('studyNotes', note)
}

export async function getStudyNotes(workId?: string) {
  if (hasNotebookProtection()) {
    const notes = (await readUnlockedNotebook()).studyNotes.filter((note) => !workId || note.anchor.workId === workId)
    return newestFirst(notes, 'updatedAt')
  }
  const db = await dbPromise
  const notes = workId ? await db.getAllFromIndex('studyNotes', 'by-work', workId) : await db.getAllFromIndex('studyNotes', 'by-updated')
  return notes.reverse()
}

export async function deleteStudyNote(id: string) {
  if (hasNotebookProtection()) return updateUnlockedNotebook((data) => { data.studyNotes = data.studyNotes.filter((item) => item.id !== id) })
  return (await dbPromise).delete('studyNotes', id)
}

export async function saveJournalEntry(entry: JournalEntry) {
  if (hasNotebookProtection()) return updateUnlockedNotebook((data) => { upsert(data.journalEntries, entry, (item) => item.id); return entry.id })
  return (await dbPromise).put('journalEntries', entry)
}

export async function getAllJournalEntries() {
  if (hasNotebookProtection()) return newestFirst((await readUnlockedNotebook()).journalEntries, 'createdAt')
  const entries = await (await dbPromise).getAllFromIndex('journalEntries', 'by-created')
  return entries.reverse()
}

export async function deleteJournalEntry(id: string) {
  if (hasNotebookProtection()) return updateUnlockedNotebook((data) => { data.journalEntries = data.journalEntries.filter((item) => item.id !== id) })
  return (await dbPromise).delete('journalEntries', id)
}

export async function saveReadingProgress(progress: ReadingProgress) {
  if (hasNotebookProtection()) return updateUnlockedNotebook((data) => { upsert(data.readingProgress, progress, (item) => item.workId); return progress.workId })
  return (await dbPromise).put('readingProgress', progress)
}

export async function getReadingProgress(workId: string) {
  if (hasNotebookProtection()) return (await readUnlockedNotebook()).readingProgress.find((item) => item.workId === workId)
  return (await dbPromise).get('readingProgress', workId)
}

export async function getAllReadingProgress() {
  if (hasNotebookProtection()) return newestFirst((await readUnlockedNotebook()).readingProgress, 'updatedAt')
  const progress = await (await dbPromise).getAllFromIndex('readingProgress', 'by-updated')
  return progress.reverse()
}

export async function savePracticeSession(session: PracticeSession) {
  if (hasNotebookProtection()) return updateUnlockedNotebook((data) => { upsert(data.practiceSessions, session, (item) => item.id); return session.id })
  return (await dbPromise).put('practiceSessions', session)
}

export async function getPracticeSessions(practiceId?: string) {
  if (hasNotebookProtection()) {
    const sessions = (await readUnlockedNotebook()).practiceSessions.filter((session) => !practiceId || session.practiceId === practiceId)
    return newestFirst(sessions, 'createdAt')
  }
  const db = await dbPromise
  const sessions = practiceId ? await db.getAllFromIndex('practiceSessions', 'by-practice', practiceId) : await db.getAllFromIndex('practiceSessions', 'by-created')
  return sessions.reverse()
}

export async function saveAiReflection(reflection: AiReflectionRecord) {
  if (hasNotebookProtection()) return updateUnlockedNotebook((data) => { upsert(data.aiReflections, reflection, (item) => item.id); return reflection.id })
  return (await dbPromise).put('aiReflections', reflection)
}

export async function getAiReflections(kind?: AiReflectionRecord['kind']) {
  if (hasNotebookProtection()) {
    const reflections = (await readUnlockedNotebook()).aiReflections.filter((reflection) => !kind || reflection.kind === kind)
    return newestFirst(reflections, 'createdAt')
  }
  const db = await dbPromise
  const reflections = kind ? await db.getAllFromIndex('aiReflections', 'by-kind', kind) : await db.getAllFromIndex('aiReflections', 'by-created')
  return reflections.reverse()
}

export async function deleteAiReflection(id: string) {
  if (hasNotebookProtection()) return updateUnlockedNotebook((data) => { data.aiReflections = data.aiReflections.filter((item) => item.id !== id) })
  return (await dbPromise).delete('aiReflections', id)
}

export async function clearAiReflections() {
  if (hasNotebookProtection()) return updateUnlockedNotebook((data) => { data.aiReflections = [] })
  return (await dbPromise).clear('aiReflections')
}

const allStores = ['readings', 'studyNotes', 'journalEntries', 'readingProgress', 'practiceSessions', 'aiReflections'] as const

export async function readPlainNotebookData(): Promise<NotebookData> {
  const db = await dbPromise
  const [readings, studyNotes, journalEntries, readingProgress, practiceSessions, aiReflections] = await Promise.all([
    db.getAll('readings'), db.getAll('studyNotes'), db.getAll('journalEntries'), db.getAll('readingProgress'), db.getAll('practiceSessions'), db.getAll('aiReflections'),
  ])
  return { version: 1, readings, studyNotes, journalEntries, readingProgress, practiceSessions, aiReflections }
}

export async function clearPlainNotebookData() {
  const db = await dbPromise
  const transaction = db.transaction(allStores, 'readwrite')
  await Promise.all(allStores.map((store) => transaction.objectStore(store).clear()))
  await transaction.done
}

export async function restorePlainNotebookData(data: NotebookData) {
  const db = await dbPromise
  const transaction = db.transaction(allStores, 'readwrite')
  await Promise.all(allStores.map((store) => transaction.objectStore(store).clear()))
  for (const item of data.readings) await transaction.objectStore('readings').put(item)
  for (const item of data.studyNotes) await transaction.objectStore('studyNotes').put(item)
  for (const item of data.journalEntries) await transaction.objectStore('journalEntries').put(item)
  for (const item of data.readingProgress) await transaction.objectStore('readingProgress').put(item)
  for (const item of data.practiceSessions) await transaction.objectStore('practiceSessions').put(item)
  for (const item of data.aiReflections) await transaction.objectStore('aiReflections').put(item)
  await transaction.done
}

export async function clearAllLocalData() {
  if (hasNotebookProtection()) return updateUnlockedNotebook((data) => Object.assign(data, emptyNotebookData()))
  return clearPlainNotebookData()
}

export async function importReadings(backup: YiPathExport, mode: 'merge' | 'replace') {
  if (hasNotebookProtection()) {
    return updateUnlockedNotebook((data) => {
      if (mode === 'replace') Object.assign(data, { readings: [], studyNotes: [], journalEntries: [], readingProgress: [], practiceSessions: [] })
      for (const item of backup.readings) upsert(data.readings, item, (value) => value.id)
      for (const item of backup.studyNotes ?? []) upsert(data.studyNotes, item, (value) => value.id)
      for (const item of backup.journalEntries ?? []) upsert(data.journalEntries, item, (value) => value.id)
      for (const item of backup.readingProgress ?? []) upsert(data.readingProgress, item, (value) => value.workId)
      for (const item of backup.practiceSessions ?? []) upsert(data.practiceSessions, item, (value) => value.id)
    })
  }
  const db = await dbPromise
  const transaction = db.transaction(['readings', 'studyNotes', 'journalEntries', 'readingProgress', 'practiceSessions'], 'readwrite')
  if (mode === 'replace') await Promise.all([
    transaction.objectStore('readings').clear(), transaction.objectStore('studyNotes').clear(), transaction.objectStore('journalEntries').clear(),
    transaction.objectStore('readingProgress').clear(), transaction.objectStore('practiceSessions').clear(),
  ])
  for (const item of backup.readings) await transaction.objectStore('readings').put(item)
  for (const item of backup.studyNotes ?? []) await transaction.objectStore('studyNotes').put(item)
  for (const item of backup.journalEntries ?? []) await transaction.objectStore('journalEntries').put(item)
  for (const item of backup.readingProgress ?? []) await transaction.objectStore('readingProgress').put(item)
  for (const item of backup.practiceSessions ?? []) await transaction.objectStore('practiceSessions').put(item)
  await transaction.done
}

export function deleteDatabase() { return clearAllLocalData() }
