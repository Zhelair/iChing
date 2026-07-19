import { CONTENT_VERSION } from '../data/hexagrams'
import type { Preferences, Reading, Theme, YiPathExport } from '../domain/types'
import { getAllReadings } from './db'

export async function createExport(preferences: Preferences): Promise<YiPathExport> {
  return {
    app: 'yi-path',
    schemaVersion: 1,
    contentVersion: CONTENT_VERSION,
    exportedAt: new Date().toISOString(),
    readings: await getAllReadings(),
    preferences,
  }
}

function isReading(value: unknown): value is Reading {
  if (!value || typeof value !== 'object') return false
  const reading = value as Partial<Reading>
  return (
    typeof reading.id === 'string' &&
    reading.schemaVersion === 1 &&
    typeof reading.contentVersion === 'string' &&
    typeof reading.createdAt === 'string' &&
    typeof reading.primaryHexagramId === 'number' &&
    typeof reading.resultingHexagramId === 'number' &&
    Array.isArray(reading.lines) &&
    reading.lines.length === 6 &&
    reading.lines.every((line) => [6, 7, 8, 9].includes(line.value))
  )
}

export function parseExport(value: unknown): YiPathExport {
  if (!value || typeof value !== 'object') throw new Error('Backup must be an object.')
  const backup = value as Partial<YiPathExport>
  const validTheme = (theme: unknown): theme is Theme => ['daylight', 'ink-night', 'bamboo-mist'].includes(theme as Theme)
  if (
    backup.app !== 'yi-path' ||
    backup.schemaVersion !== 1 ||
    typeof backup.contentVersion !== 'string' ||
    typeof backup.exportedAt !== 'string' ||
    !Array.isArray(backup.readings) ||
    !backup.readings.every(isReading) ||
    !backup.preferences ||
    !['en', 'bg', 'ru'].includes(backup.preferences.locale) ||
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
