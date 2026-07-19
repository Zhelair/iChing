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

export type YarrowChange = {
  before: number
  left: number
  right: number
  removed: number
  remaining: number
}

export type YarrowProcedure = {
  changes: [YarrowChange, YarrowChange, YarrowChange]
  value: LineValue
}

function secureFraction() {
  const bytes = crypto.getRandomValues(new Uint32Array(1))
  return bytes[0] / 4294967296
}

/** Models the three changes described for the forty-nine active yarrow stalks. */
export function castYarrowProcedure(random: () => number = secureFraction): YarrowProcedure {
  let remaining = 49
  const changes: YarrowChange[] = []
  for (let index = 0; index < 3; index += 1) {
    const fraction = Math.min(.999999999, Math.max(0, random()))
    const left = 1 + Math.floor(fraction * (remaining - 1))
    const right = remaining - left
    const rightAfterOneIsSetAside = right - 1
    const leftRemainder = left % 4 || 4
    const rightRemainder = rightAfterOneIsSetAside % 4 || 4
    const removed = 1 + leftRemainder + rightRemainder
    const before = remaining
    remaining -= removed
    changes.push({ before, left, right, removed, remaining })
  }
  const value = remaining / 4
  if (![6, 7, 8, 9].includes(value)) throw new Error('The yarrow procedure did not produce a valid line.')
  return { changes: changes as [YarrowChange, YarrowChange, YarrowChange], value: value as LineValue }
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
