import type { AiModel, AiProviderId, AiProviderName, AiRequestPreview, AiSourcePacket } from './types'

export const AI_PROVIDERS: Record<AiProviderId, {
  name: AiProviderName
  endpoint: AiRequestPreview['endpoint']
  models: readonly { id: AiModel; label: string }[]
}> = {
  deepseek: {
    name: 'DeepSeek',
    endpoint: 'https://api.deepseek.com/chat/completions',
    models: [
      { id: 'deepseek-v4-flash', label: 'V4 Flash · faster, lower cost' },
      { id: 'deepseek-v4-pro', label: 'V4 Pro · deeper reflection' },
    ],
  },
  openai: {
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    models: [
      { id: 'gpt-5-mini', label: 'GPT-5 mini · faster, lower cost' },
      { id: 'gpt-5.2', label: 'GPT-5.2 · deeper reflection' },
    ],
  },
  anthropic: {
    name: 'Anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    models: [
      { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 · faster' },
      { id: 'claude-sonnet-5', label: 'Claude Sonnet 5 · deeper reflection' },
    ],
  },
}

export const DEFAULT_AI_MODELS: Record<AiProviderId, AiModel> = {
  deepseek: 'deepseek-v4-flash',
  openai: 'gpt-5-mini',
  anthropic: 'claude-haiku-4-5',
}

const SYSTEM_GUARDRAILS = `You are an optional reflection aid inside Yi Path. Treat the supplied Chinese text and Yi Path editorial as sources, not material to rewrite. Offer careful questions and patterns for reflection. Do not predict events, claim supernatural certainty, diagnose, provide legal/medical/financial advice, or present yourself as an authoritative translation. Clearly cite hexagram and moving-line identifiers from sourceIds. Distinguish observation from inference. Keep the response calm, concise, and in the requested locale.`

export function buildRequestPreview(packet: AiSourcePacket, providerId: AiProviderId, model: AiModel): AiRequestPreview {
  const provider = AI_PROVIDERS[providerId]
  return {
    endpoint: provider.endpoint,
    providerId,
    provider: provider.name,
    model,
    messages: [
      { role: 'system', content: SYSTEM_GUARDRAILS },
      { role: 'user', content: JSON.stringify(packet, null, 2) },
    ],
  }
}

type OpenAiChunk = { choices?: Array<{ delta?: { content?: string } }> }
type AnthropicChunk = { type?: string; delta?: { type?: string; text?: string } }

async function consumeSse(response: Response, preview: AiRequestPreview, onText: (text: string) => void) {
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
        const parsed = JSON.parse(data) as OpenAiChunk & AnthropicChunk
        const delta = preview.providerId === 'anthropic'
          ? (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta' ? parsed.delta.text : undefined)
          : parsed.choices?.[0]?.delta?.content
        if (delta) { complete += delta; onText(complete) }
      } catch {
        // Ignore malformed provider events without logging user content.
      }
    }
    if (done) break
  }
  if (!complete.trim()) throw new Error('provider-empty')
  return complete.trim()
}

export async function streamAiReflection(apiKey: string, preview: AiRequestPreview, onText: (text: string) => void, signal?: AbortSignal) {
  const anthropic = preview.providerId === 'anthropic'
  const headers: Record<string, string> = anthropic
    ? {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      }
    : { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` }
  const body = anthropic
    ? {
        model: preview.model,
        system: preview.messages[0].content,
        messages: preview.messages.slice(1),
        stream: true,
        max_tokens: 1300,
        temperature: 0.35,
      }
    : { model: preview.model, messages: preview.messages, stream: true, temperature: 0.35, max_tokens: 1300 }
  const response = await fetch(preview.endpoint, { method: 'POST', headers, body: JSON.stringify(body), signal })
  if (!response.ok) throw new Error(`provider-${response.status}`)
  return consumeSse(response, preview, onText)
}
