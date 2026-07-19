import { HEXAGRAMS, type Hexagram } from './hexagrams'

function hashDate(value: string) {
  let hash = 2166136261
  for (const character of `yi-path:${value}`) {
    hash ^= character.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function localDay(date: Date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-')
}

/** A stable, local-day selection: it changes at midnight without tracking the visitor. */
export function getDailyHomeHexagrams(date = new Date()): readonly [Hexagram, Hexagram, Hexagram] {
  let state = hashDate(localDay(date))
  const pool = [...HEXAGRAMS]
  const selection: Hexagram[] = []
  for (let index = 0; index < 3; index += 1) {
    state = Math.imul(state ^ (state >>> 15), 1 | state)
    state ^= state + Math.imul(state ^ (state >>> 7), 61 | state)
    const random = ((state ^ (state >>> 14)) >>> 0) / 4294967296
    selection.push(pool.splice(Math.floor(random * pool.length), 1)[0])
  }
  return selection as unknown as readonly [Hexagram, Hexagram, Hexagram]
}
