import { describe, expect, it } from 'vitest'
import { getHexagram } from './hexagrams'
import { HOME_HEXAGRAM } from './homeFeature'

describe('home feature', () => {
  it('stays aligned with hexagram 24 in the full corpus', () => {
    const canonical = getHexagram(HOME_HEXAGRAM.id)
    expect(HOME_HEXAGRAM.chinese).toBe(canonical.chinese)
    expect(HOME_HEXAGRAM.linesBottomUp).toEqual(canonical.linesBottomUp)
  })
})
