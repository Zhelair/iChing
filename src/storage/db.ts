import { openDB, type DBSchema } from 'idb'
import type { Reading, YiPathExport } from '../domain/types'

interface YiPathDb extends DBSchema {
  readings: {
    key: string
    value: Reading
    indexes: { 'by-created': string }
  }
}

const DB_NAME = 'yi-path'
const DB_VERSION = 1

const dbPromise = openDB<YiPathDb>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    const readings = db.createObjectStore('readings', { keyPath: 'id' })
    readings.createIndex('by-created', 'createdAt')
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

export async function importReadings(backup: YiPathExport, mode: 'merge' | 'replace') {
  const db = await dbPromise
  const transaction = db.transaction('readings', 'readwrite')
  if (mode === 'replace') await transaction.store.clear()
  for (const reading of backup.readings) await transaction.store.put(reading)
  await transaction.done
}

export function deleteDatabase() {
  return clearReadings()
}
