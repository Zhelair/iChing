import type { AiRequestPreview, AiSourcePacket, DeepSeekModel } from './types'

export const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/chat/completions' as const

const SYSTEM_GUARDRAILS = `You are an optional reflection aid inside Yi Path. Treat the supplied Chinese text and Yi Path editorial as sources, not material to rewrite. Offer careful questions and patterns for reflection. Do not predict events, claim supernatural certainty, diagnose, provide legal/medical/financial advice, or present yourself as an authoritative translation. Clearly cite hexagram and moving-line identifiers from sourceIds. Distinguish observation from inference. Keep the response calm, concise, and in the requested locale.`

export function buildRequestPreview(packet: AiSourcePacket, model: DeepSeekModel): AiRequestPreview {
  return {
    endpoint: DEEPSEEK_ENDPOINT,
    provider: 'DeepSeek',
    model,
    messages: [
      { role: 'system', content: SYSTEM_GUARDRAILS },
      { role: 'user', content: JSON.stringify(packet, null, 2) },
    ],
  }
}

type DeepSeekChunk = { choices?: Array<{ delta?: { content?: string }; finish_reason?: string | null }> }

export async function streamDeepSeek(
  apiKey: string,
  preview: AiRequestPreview,
  onText: (text: string) => void,
  signal?: AbortSignal,
) {
  const response = await fetch(preview.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: preview.model, messages: preview.messages, stream: true, temperature: 0.35, max_tokens: 1300 }),
    signal,
  })
  if (!response.ok) throw new Error(`provider-${response.status}`)
  if (!response.body) throw new Error('provider-no-stream')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let complete = ''
  while (true) {
    const { done, value } = await reader.read()
    buffer += decoder.decode(value, { stream: !done })
    const lines = buffer.split(/\r?\n/)
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data:')) continue
      const data = line.slice(5).trim()
      if (!data || data === '[DONE]') continue
      try {
        const chunk = JSON.parse(data) as DeepSeekChunk
        const delta = chunk.choices?.[0]?.delta?.content
        if (delta) { complete += delta; onText(complete) }
      } catch {
        // Ignore a malformed provider event without exposing its contents.
      }
    }
    if (done) break
  }
  if (!complete.trim()) throw new Error('provider-empty')
  return complete.trim()
}
