export type Locale = 'en' | 'bg' | 'ru'

export type CoinSide = 'heads' | 'tails'
export type LineValue = 6 | 7 | 8 | 9
export type Polarity = 'yin' | 'yang'
export type ReadingMethod = 'digital' | 'physical' | 'direct'
export type Theme = 'daylight' | 'ink-night' | 'bamboo-mist'

export type CastLine = {
  position: 1 | 2 | 3 | 4 | 5 | 6
  value: LineValue
  coins?: [CoinSide, CoinSide, CoinSide]
  polarity: Polarity
  moving: boolean
  transformedPolarity: Polarity
}

export type Reading = {
  id: string
  schemaVersion: 1
  contentVersion: string
  createdAt: string
  updatedAt: string
  method: ReadingMethod
  locale: Locale
  question: string
  lines: CastLine[]
  primaryHexagramId: number
  resultingHexagramId: number
  note: string
  tags: string[]
}

export type Preferences = {
  locale: Locale
  theme: Theme
  sound: boolean
  music: boolean
  reduceMotion: boolean
}

export type YiPathExport = {
  app: 'yi-path'
  schemaVersion: 1
  contentVersion: string
  exportedAt: string
  readings: Reading[]
  preferences: Preferences
}
