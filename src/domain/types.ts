import type { Locale } from './locales'

export type { Locale } from './locales'

export type CoinSide = 'heads' | 'tails'
export type LineValue = 6 | 7 | 8 | 9
export type Polarity = 'yin' | 'yang'
export type ReadingMethod = 'digital' | 'physical' | 'yarrow' | 'beads' | 'direct'
export type Theme = 'daylight' | 'ink-night' | 'bamboo-mist'
export type AmbientVolume = 0 | 0.5 | 1
export type CompanionPet = 'cat' | 'dog'
export type CompanionSize = 'normal' | 'large'

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

export type ContentAnchor = {
  workId: string
  passageId: string
  startOffset: number
  endOffset: number
  quote: string
}

export type StudyNote = {
  id: string
  schemaVersion: 1
  createdAt: string
  updatedAt: string
  locale: Locale
  anchor: ContentAnchor
  body: string
  tags: string[]
}

export type JournalEntryKind = 'freeform' | 'study' | 'practice'

export type JournalEntry = {
  id: string
  schemaVersion: 1
  createdAt: string
  updatedAt: string
  locale: Locale
  kind: JournalEntryKind
  title: string
  body: string
  tags: string[]
  sourceId?: string
  durationSeconds?: number
}

export type ReadingProgress = {
  workId: string
  updatedAt: string
  passageId: string
  progress: number
}

export type PracticeSession = {
  id: string
  schemaVersion: 1
  createdAt: string
  practiceId: string
  durationSeconds: number
  completed: boolean
  reflectionEntryId?: string
}

export type Preferences = {
  locale: Locale
  theme: Theme
  sound: boolean
  music: boolean
  ambientVolume: AmbientVolume
  reduceMotion: boolean
  aiEnabled: boolean
  companionPet: CompanionPet
  companionSize: CompanionSize
  petSound: boolean
  petMotion: boolean
}

export type YiPathExport = {
  app: 'yi-path'
  schemaVersion: 1
  contentVersion: string
  exportedAt: string
  readings: Reading[]
  studyNotes?: StudyNote[]
  journalEntries?: JournalEntry[]
  readingProgress?: ReadingProgress[]
  practiceSessions?: PracticeSession[]
  preferences: Preferences
}
