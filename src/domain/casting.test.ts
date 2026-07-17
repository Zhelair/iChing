import { describe, expect, it } from 'vitest'
import { HEXAGRAMS, findHexagramByPattern } from '../data/hexagrams'
import {
  castCoins,
  coinTotal,
  createCastLine,
  patternFromLines,
  polarityFor,
  transformedPolarityFor,
} from './casting'
import type { LineValue } from './types'

describe('three-coin rules', () => {
  it.each([
    [['tails', 'tails', 'tails'], 6],
    [['heads', 'tails', 'tails'], 7],
    [['heads', 'heads', 'tails'], 8],
    [['heads', 'heads', 'heads'], 9],
  ] as const)('maps %j to %i', (coins, expected) => {
    expect(coinTotal(coins)).toBe(expected)
  })

  it('maps 6/7/8/9 to their primary and transformed polarities', () => {
    const values: LineValue[] = [6, 7, 8, 9]
    expect(values.map(polarityFor)).toEqual(['yin', 'yang', 'yin', 'yang'])
    expect(values.map(transformedPolarityFor)).toEqual(['yang', 'yang', 'yin', 'yin'])
  })

  it('turns deterministic random bytes into three visible coins', () => {
    expect(castCoins(new Uint8Array([0, 1, 1]))).toEqual({
      coins: ['tails', 'heads', 'heads'],
      value: 8,
    })
  })
})

describe('hexagram transformation and lookup', () => {
  it('preserves bottom-to-top order and flips only moving lines', () => {
    const values: LineValue[] = [9, 8, 7, 6, 7, 8]
    const lines = values.map((value, index) => createCastLine((index + 1) as 1 | 2 | 3 | 4 | 5 | 6, value))

    expect(findHexagramByPattern(patternFromLines(lines)).id).toBe(63)
    expect(findHexagramByPattern(patternFromLines(lines, true)).id).toBe(31)
    expect(lines.filter((line) => line.moving).map((line) => line.position)).toEqual([1, 4])
  })

  it('looks up every one of the 64 unique King Wen patterns', () => {
    expect(HEXAGRAMS).toHaveLength(64)
    const patterns = new Set(HEXAGRAMS.map((hexagram) => hexagram.linesBottomUp.join(',')))
    expect(patterns.size).toBe(64)

    for (const hexagram of HEXAGRAMS) {
      expect(findHexagramByPattern(hexagram.linesBottomUp).id).toBe(hexagram.id)
    }
  })

  it('handles every possible individual line flip', () => {
    for (const hexagram of HEXAGRAMS) {
      for (let index = 0; index < 6; index += 1) {
        const transformed = [...hexagram.linesBottomUp]
        transformed[index] = transformed[index] === 'yang' ? 'yin' : 'yang'
        expect(findHexagramByPattern(transformed)).toBeDefined()
      }
    }
  })
})
