import { CONTENT_VERSION, findHexagramByPattern } from '../data/hexagrams'
import { patternFromLines } from '../domain/casting'
import type { AmbientVolume, CastLine, LineValue, Polarity, Preferences, Reading, ReadingMethod, Theme, YiPathExport } from '../domain/types'
import { getAllReadings } from './db'

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
    isBoundedString(reading.id, 128, false) &&
    reading.schemaVersion === 1 &&
    isBoundedString(reading.contentVersion, 128, false) &&
    isDate(reading.createdAt) &&
    isDate(reading.updatedAt) &&
    isReadingMethod(reading.method) &&
    (reading.locale === 'en' || reading.locale === 'bg' || reading.locale === 'ru') &&
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
