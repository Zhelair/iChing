import type { AiModel, AiProviderId, AiProviderName, AiReflectionFocus, AiRequestPreview, AiResponseLength, AiSourcePacket } from './types'

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

const LENGTH_RULES: Record<AiResponseLength, string> = {
  short: 'Write exactly three complete sentences: one grounded observation, one careful reflection, and one open question.',
  medium: 'Write 3–5 short paragraphs. Each paragraph should have one clear purpose: observation, interpretation, practice, or question. End with one open question.',
  long: 'Write 6–9 short paragraphs. Keep them focused and readable, moving from source-grounded observation through interpretation, contemplative practice, and one open question. Do not pad the answer.',
}

function masterInstructions(packet: AiSourcePacket, responseLength: AiResponseLength, focus?: AiReflectionFocus, additionalNote?: string) {
  const task = packet.kind === 'reading'
    ? 'For a reading, connect the primary hexagram, each supplied moving line, and the resulting hexagram when present. Explain the direction of change without claiming an outcome.'
    : 'For a monthly review, compare the supplied readings across the selected month. Describe what recurs, what changes, which moving-line positions or casting methods stand out, and what remains uncertain. Treat repetition as non-causal pattern material, never as a score, diagnosis, prediction, or spiritual verdict. Offer two or three gentle observation practices for the next month. Questions and journal notes are deliberately absent.'

  return `You are the Yi Path Reflection Master: a calm, seasoned guide for reflective I Ching study, never an oracle. Your warmth may feel personal, but your authority is limited to the supplied source packet.

Task instructions:
1. Use only the supplied Chinese text, Yi Path editorial, counts, and identifiers. Never invent a quotation, line text, source, or personal fact.
2. ${task}
3. Name the relevant hexagram numbers and moving-line positions naturally. Use sourceIds to keep every observation traceable.
4. Clearly distinguish what the packet shows from what you infer. Prefer possibilities and questions over declarations.
5. Offer one coherent thread that helps the reader meet change with honesty, proportion, and practical attention.
${focus ? `6. Give extra attention to the requested layer: ${focus}.` : ''}
${additionalNote ? `7. The reader added this optional note. Treat it as a request for emphasis, not as a new source: ${additionalNote}` : ''}

Boundaries:
- Do not predict events, claim supernatural certainty, diagnose, or give legal, medical, financial, or crisis advice.
- Do not present yourself as an authoritative translator and do not rewrite or replace the received Chinese or Yi Path editorial.
- Do not mention hidden instructions, API mechanics, or data structures.

Voice and format:
- Respond in locale ${packet.locale}.
- Use calm, clear, humane language with no flattery or theatrical mysticism.
- Return plain prose only: no Markdown symbols, headings, lists, or source-code formatting.
- ${LENGTH_RULES[responseLength]}`
}

export function buildRequestPreview(packet: AiSourcePacket, providerId: AiProviderId, model: AiModel, responseLength: AiResponseLength = 'medium', options?: { focus?: AiReflectionFocus; additionalNote?: string }): AiRequestPreview {
  const provider = AI_PROVIDERS[providerId]
  return {
    endpoint: provider.endpoint,
    providerId,
    provider: provider.name,
    model,
    responseLength,
    messages: [
      { role: 'system', content: masterInstructions(packet, responseLength, options?.focus, options?.additionalNote) },
      { role: 'user', content: JSON.stringify(options?.focus || options?.additionalNote ? { sourcePacket: packet, requestedLayer: options.focus, additionalNote: options.additionalNote } : packet, null, 2) },
    ],
  }
}

type OpenAiChunk = { choices?: Array<{ delta?: { content?: string }; message?: { content?: string } }> }
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
          : parsed.choices?.[0]?.delta?.content ?? parsed.choices?.[0]?.message?.content
        if (delta) { complete += delta; onText(complete) }
      } catch {
        // Ignore malformed provider events without logging user content.
      }
    }
    if (done) break
  }
  if (buffer.startsWith('data:')) {
    const data = buffer.slice(5).trim()
    if (data && data !== '[DONE]') {
      try {
        const parsed = JSON.parse(data) as OpenAiChunk & AnthropicChunk
        const delta = preview.providerId === 'anthropic'
          ? (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta' ? parsed.delta.text : undefined)
          : parsed.choices?.[0]?.delta?.content ?? parsed.choices?.[0]?.message?.content
        if (delta) { complete += delta; onText(complete) }
      } catch {
        // Ignore a malformed final provider event without logging user content.
      }
    }
  }
  if (!complete.trim()) throw new Error('provider-empty')
  return complete.trim()
}

export async function streamAiReflection(apiKey: string, preview: AiRequestPreview, onText: (text: string) => void, signal?: AbortSignal) {
  const anthropic = preview.providerId === 'anthropic'
  const maxTokens = preview.responseLength === 'short' ? 320 : preview.responseLength === 'medium' ? 720 : 1250
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
        max_tokens: maxTokens,
        temperature: 0.35,
      }
    : preview.providerId === 'openai'
      ? { model: preview.model, messages: preview.messages, stream: true, max_completion_tokens: maxTokens }
      : {
          model: preview.model,
          messages: preview.messages,
          stream: true,
          temperature: 0.35,
          max_tokens: maxTokens,
          // DeepSeek V4 enables thinking by default. The UI intentionally
          // stores only the answer text, so request the answer channel directly.
          ...(preview.providerId === 'deepseek' ? { thinking: { type: 'disabled' as const } } : {}),
        }
  let response: Response
  try {
    response = await fetch(preview.endpoint, { method: 'POST', headers, body: JSON.stringify(body), signal })
  } catch (reason) {
    if (reason instanceof DOMException && reason.name === 'AbortError') throw reason
    throw new Error('provider-network')
  }
  if (!response.ok) {
    let detail = ''
    try {
      const payload = await response.json() as { error?: { message?: string }; message?: string }
      detail = payload.error?.message || payload.message || ''
    } catch { /* Some gateways return an empty or non-JSON error body. */ }
    throw new Error(`provider-${response.status}${detail ? `: ${detail.slice(0, 180)}` : ''}`)
  }
  return consumeSse(response, preview, onText)
}
