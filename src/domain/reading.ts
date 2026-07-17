import { CONTENT_VERSION, findHexagramByPattern, getHexagram } from '../data/hexagrams'
import { createCastLine, patternFromLines } from './casting'
import type { CastLine, LineValue, Locale, Reading, ReadingMethod } from './types'

export function createReading(input: {
  method: ReadingMethod
  locale: Locale
  question: string
  lines: CastLine[]
}): Reading {
  const primary = findHexagramByPattern(patternFromLines(input.lines))
  const resulting = findHexagramByPattern(patternFromLines(input.lines, true))
  const now = new Date().toISOString()

  return {
    id: crypto.randomUUID(),
    schemaVersion: 1,
    contentVersion: CONTENT_VERSION,
    createdAt: now,
    updatedAt: now,
    method: input.method,
    locale: input.locale,
    question: input.question.trim(),
    lines: input.lines,
    primaryHexagramId: primary.id,
    resultingHexagramId: resulting.id,
    note: '',
    tags: [],
  }
}

export function linesFromKnownHexagram(id: number, movingPositions: number[]): CastLine[] {
  const hexagram = getHexagram(id)
  return hexagram.linesBottomUp.map((polarity, index) => {
    const position = (index + 1) as CastLine['position']
    const moving = movingPositions.includes(position)
    const value: LineValue = polarity === 'yang' ? (moving ? 9 : 7) : (moving ? 6 : 8)
    return createCastLine(position, value)
  })
}
