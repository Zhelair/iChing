import { describe, expect, it } from 'vitest'
import { getDailyHomeHexagrams } from './homeFeature'

describe('home feature', () => {
  it('selects three unique hexagrams consistently for a local day', () => {
    const morning = getDailyHomeHexagrams(new Date(2026, 6, 19, 8))
    const evening = getDailyHomeHexagrams(new Date(2026, 6, 19, 22))
    expect(morning.map(({ id }) => id)).toEqual(evening.map(({ id }) => id))
    expect(new Set(morning.map(({ id }) => id))).toHaveLength(3)
    expect(morning.every(({ id }) => id >= 1 && id <= 64)).toBe(true)
  })
})
