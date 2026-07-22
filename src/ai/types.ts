import type { Locale, ReadingMethod } from '../domain/types'

export type DeepSeekModel = 'deepseek-v4-flash' | 'deepseek-v4-pro'
export type ReflectionKind = 'reading' | 'monthly-pattern'

export type AiRequestPreview = {
  endpoint: 'https://api.deepseek.com/chat/completions'
  provider: 'DeepSeek'
  model: DeepSeekModel
  messages: Array<{ role: 'system' | 'user'; content: string }>
}

export type ReadingSourcePacket = {
  kind: 'reading'
  schemaVersion: 1
  contentVersion: string
  locale: Locale
  readingId: string
  question: string | null
  method: ReadingMethod
  primary: { id: number; chinese: string; title: string; judgment: string; editorial: string }
  movingLines: Array<{ position: number; receivedChinese: string; editorial: string }>
  resulting: { id: number; chinese: string; title: string; editorial: string } | null
  sourceIds: string[]
  request: string
}

export type MonthlySourcePacket = {
  kind: 'monthly-pattern'
  schemaVersion: 1
  contentVersion: string
  locale: Locale
  range: { from: string; to: string }
  readingCount: number
  recurringHexagrams: Array<{ id: number; chinese: string; title: string; count: number }>
  changingLinePositions: Array<{ position: number; count: number }>
  methods: Array<{ method: ReadingMethod; count: number }>
  sourceIds: string[]
  journalNotesIncluded: false
  questionsIncluded: false
  request: string
}

export type AiSourcePacket = ReadingSourcePacket | MonthlySourcePacket

export type AiReflectionRecord = {
  id: string
  schemaVersion: 1
  createdAt: string
  provider: 'DeepSeek'
  model: DeepSeekModel
  kind: ReflectionKind
  locale: Locale
  sourceIds: string[]
  contentVersion: string
  sourceReadingId?: string
  dateRange?: { from: string; to: string }
  response: string
}
