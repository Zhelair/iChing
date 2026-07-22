import type { AiRequestPreview, AiSourcePacket, DeepSeekModel } from './types'
import { buildRequestPreview as buildProviderPreview, streamAiReflection } from './providers'

export const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/chat/completions' as const

export function buildRequestPreview(packet: AiSourcePacket, model: DeepSeekModel): AiRequestPreview {
  return buildProviderPreview(packet, 'deepseek', model)
}

export async function streamDeepSeek(
  apiKey: string,
  preview: AiRequestPreview,
  onText: (text: string) => void,
  signal?: AbortSignal,
) {
  return streamAiReflection(apiKey, preview, onText, signal)
}
