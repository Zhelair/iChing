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

function unitFraction(value: number) {
  if (!Number.isFinite(value)) throw new Error('Random values must be finite numbers.')
  return Math.min(1 - Number.EPSILON, Math.max(0, value))
}

function stalkRemainder(count: number) {
  return count % 4 || 4
}

function standardizedRemovalPath(random: () => number): [5 | 9, 4 | 8, 4 | 8] {
  const bucket = Math.floor(unitFraction(random()) * 16)
  return [
    bucket % 4 === 0 ? 9 : 5,
    (bucket & 4) === 0 ? 4 : 8,
    (bucket & 8) === 0 ? 4 : 8,
  ]
}

function choosePhysicalSplit(before: number, targetRemoved: 4 | 5 | 8 | 9, random: () => number) {
  const candidates: Array<{ left: number; right: number }> = []
  for (let left = 1; left <= before - 2; left += 1) {
    const right = before - left
    const removed = 1 + stalkRemainder(left) + stalkRemainder(right - 1)
    if (removed === targetRemoved) candidates.push({ left, right })
  }

  if (!candidates.length) throw new Error(`No physical yarrow split removes ${targetRemoved} from ${before}.`)
  return candidates[Math.floor(unitFraction(random()) * candidates.length)]
}

/**
 * Models three physical changes while preserving the standardized Zhu Xi line
 * distribution: 6/7/8/9 = 1/16, 5/16, 7/16, 3/16.
 */
export function castYarrowProcedure(random: () => number = secureFraction): YarrowProcedure {
  let remaining = 49
  const changes: YarrowChange[] = []
  const removalPath = standardizedRemovalPath(random)
  for (let index = 0; index < 3; index += 1) {
    const before = remaining
    const targetRemoved = removalPath[index]
    const { left, right } = choosePhysicalSplit(before, targetRemoved, random)
    const removed = 1 + stalkRemainder(left) + stalkRemainder(right - 1)
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
