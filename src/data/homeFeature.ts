import type { Polarity } from '../domain/types'

export const HOME_HEXAGRAM = {
  id: 24,
  chinese: '復',
  linesBottomUp: ['yang', 'yin', 'yin', 'yin', 'yin', 'yin'] as const satisfies readonly Polarity[],
} as const
