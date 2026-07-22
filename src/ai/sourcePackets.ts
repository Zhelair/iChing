import { CONTENT_VERSION, getHexagram, type LocalizedEditorial } from '../data/hexagrams'
import type { Locale, Reading } from '../domain/types'
import type { MonthlySourcePacket, ReadingSourcePacket } from './types'

export function buildReadingPacket(
  reading: Reading,
  locale: Locale,
  editorialFor: (id: number) => LocalizedEditorial,
): ReadingSourcePacket {
  const primary = getHexagram(reading.primaryHexagramId)
  const primaryEditorial = editorialFor(primary.id)
  const moving = reading.lines.filter((line) => line.moving)
  const resulting = moving.length ? getHexagram(reading.resultingHexagramId) : null
  const resultingEditorial = resulting ? editorialFor(resulting.id) : null
  const sourceIds = [
    `hexagram:${primary.id}:judgment`,
    `yi-path:${reading.contentVersion}:hexagram:${primary.id}:core-thread`,
    ...moving.flatMap((line) => [
      `hexagram:${primary.id}:line:${line.position}`,
      `yi-path:${reading.contentVersion}:hexagram:${primary.id}:line-reflection:${line.position}`,
    ]),
  ]
  if (resulting) sourceIds.push(`yi-path:${reading.contentVersion}:hexagram:${resulting.id}:core-thread`)

  return {
    kind: 'reading',
    schemaVersion: 1,
    contentVersion: reading.contentVersion,
    locale,
    readingId: reading.id,
    question: reading.question.trim() || null,
    method: reading.method,
    primary: {
      id: primary.id,
      chinese: primary.chinese,
      title: primaryEditorial.title,
      judgment: primary.classical.judgment,
      editorial: primaryEditorial.coreThread,
    },
    movingLines: moving.map((line) => ({
      position: line.position,
      receivedChinese: primary.classical.lines[line.position - 1],
      editorial: primaryEditorial.lineReflections[String(line.position)],
    })),
    resulting: resulting && resultingEditorial ? {
      id: resulting.id,
      chinese: resulting.chinese,
      title: resultingEditorial.title,
      editorial: resultingEditorial.coreThread,
    } : null,
    sourceIds,
    request: `Respond in locale ${locale}. Reflect on tensions, choices, and useful questions visible in these sources. Cite sourceIds inline. This is reflection, not prediction or advice.`,
  }
}

export function buildMonthlyPacket(
  readings: Reading[],
  locale: Locale,
  from: Date,
  to: Date,
  titleFor: (id: number) => string,
): MonthlySourcePacket {
  const inRange = readings.filter((reading) => {
    const time = new Date(reading.createdAt).getTime()
    return time >= from.getTime() && time <= to.getTime()
  })
  const hexagrams = new Map<number, number>()
  const positions = new Map<number, number>()
  const methods = new Map<Reading['method'], number>()
  for (const reading of inRange) {
    hexagrams.set(reading.primaryHexagramId, (hexagrams.get(reading.primaryHexagramId) ?? 0) + 1)
    methods.set(reading.method, (methods.get(reading.method) ?? 0) + 1)
    for (const line of reading.lines) if (line.moving) positions.set(line.position, (positions.get(line.position) ?? 0) + 1)
  }
  return {
    kind: 'monthly-pattern',
    schemaVersion: 1,
    contentVersion: CONTENT_VERSION,
    locale,
    range: { from: from.toISOString(), to: to.toISOString() },
    readingCount: inRange.length,
    recurringHexagrams: [...hexagrams.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0]).map(([id, count]) => {
      const hexagram = getHexagram(id)
      return { id, chinese: hexagram.chinese, title: titleFor(id), count }
    }),
    changingLinePositions: [...positions.entries()].sort((a, b) => a[0] - b[0]).map(([position, count]) => ({ position, count })),
    methods: [...methods.entries()].sort((a, b) => b[1] - a[1]).map(([method, count]) => ({ method, count })),
    sourceIds: inRange.map((reading) => `reading:${reading.id}`),
    journalNotesIncluded: false,
    questionsIncluded: false,
    request: `Respond in locale ${locale}. Describe modest, non-causal patterns in these local counts and offer questions for review. Do not infer missing personal details. This is reflection, not prediction or advice.`,
  }
}
