import { describe, expect, it } from 'vitest'
import type { MonthlySourcePacket } from './types'
import { AI_PROVIDERS, buildRequestPreview } from './providers'

const packet: MonthlySourcePacket = {
  kind: 'monthly-pattern', schemaVersion: 1, contentVersion: 'test', locale: 'en',
  range: { from: '2026-07-01', to: '2026-07-31' }, readingCount: 0,
  recurringHexagrams: [], changingLinePositions: [], methods: [], sourceIds: [],
  journalNotesIncluded: false, questionsIncluded: false, request: 'Reflect carefully.',
}

describe('multi-provider BYOK previews', () => {
  it.each([
    ['deepseek', 'deepseek-v4-flash', 'https://api.deepseek.com/chat/completions', 'DeepSeek'],
    ['openai', 'gpt-5-mini', 'https://api.openai.com/v1/chat/completions', 'OpenAI'],
    ['anthropic', 'claude-haiku-4-5', 'https://api.anthropic.com/v1/messages', 'Anthropic'],
  ] as const)('builds an exact %s preview', (providerId, model, endpoint, provider) => {
    const preview = buildRequestPreview(packet, providerId, model)
    expect(preview).toMatchObject({ providerId, provider, endpoint, model, responseLength: 'medium' })
    expect(JSON.parse(preview.messages[1].content)).toEqual(packet)
    expect(preview.messages[0].content).toContain('Yi Path Reflection Master')
  })

  it('keeps every provider model choice scoped to its provider', () => {
    expect(AI_PROVIDERS.deepseek.models.map(({ id }) => id)).toEqual(['deepseek-v4-flash', 'deepseek-v4-pro'])
    expect(AI_PROVIDERS.openai.models.map(({ id }) => id)).toEqual(['gpt-5-mini', 'gpt-5.2'])
    expect(AI_PROVIDERS.anthropic.models.map(({ id }) => id)).toEqual(['claude-haiku-4-5', 'claude-sonnet-5'])
  })

  it.each([
    ['short', 'exactly three complete sentences'],
    ['medium', 'exactly two short paragraphs'],
    ['long', 'three or four short paragraphs maximum'],
  ] as const)('gives the Master a strict %s response contract', (length, instruction) => {
    const preview = buildRequestPreview(packet, 'deepseek', 'deepseek-v4-flash', length)
    expect(preview.responseLength).toBe(length)
    expect(preview.messages[0].content).toContain(instruction)
    expect(preview.messages[0].content).toContain('plain prose only')
  })
})
