import type { CastLine, CoinSide, LineValue, Polarity } from './types'

export const COIN_VALUES: Record<CoinSide, 2 | 3> = {
  heads: 3,
  tails: 2,
}

export function coinTotal(coins: readonly CoinSide[]): LineValue {
  if (coins.length !== 3) {
    throw new Error('A line requires exactly three coins.')
  }

  const total = coins.reduce<number>((sum, side) => sum + COIN_VALUES[side], 0)
  if (total < 6 || total > 9) {
    throw new Error('Coin total must be 6, 7, 8, or 9.')
  }
  return total as LineValue
}

export function isMoving(value: LineValue): boolean {
  return value === 6 || value === 9
}

export function polarityFor(value: LineValue): Polarity {
  return value === 7 || value === 9 ? 'yang' : 'yin'
}

export function transformedPolarityFor(value: LineValue): Polarity {
  if (value === 6) return 'yang'
  if (value === 9) return 'yin'
  return polarityFor(value)
}

export function createCastLine(
  position: CastLine['position'],
  value: LineValue,
  coins?: [CoinSide, CoinSide, CoinSide],
): CastLine {
  return {
    position,
    value,
    coins,
    polarity: polarityFor(value),
    moving: isMoving(value),
    transformedPolarity: transformedPolarityFor(value),
  }
}

export function castCoins(bytes?: Uint8Array): {
  coins: [CoinSide, CoinSide, CoinSide]
  value: LineValue
} {
  const randomBytes = bytes ?? crypto.getRandomValues(new Uint8Array(3))
  if (randomBytes.length < 3) {
    throw new Error('Three random bytes are required.')
  }

  const coins = [0, 1, 2].map((index) =>
    (randomBytes[index] & 1) === 0 ? 'tails' : 'heads',
  ) as [CoinSide, CoinSide, CoinSide]

  return { coins, value: coinTotal(coins) }
}

export function patternFromLines(
  lines: readonly CastLine[],
  transformed = false,
): Polarity[] {
  if (lines.length !== 6) {
    throw new Error('A hexagram requires exactly six lines.')
  }

  const ordered = [...lines].sort((a, b) => a.position - b.position)
  return ordered.map((line) =>
    transformed ? line.transformedPolarity : line.polarity,
  )
}
