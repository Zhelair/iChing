import { Bot, Eye, LoaderCircle, Send, Settings, Square, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAi } from '../ai/AiContext'
import { buildRequestPreview, streamDeepSeek } from '../ai/deepseek'
import type { AiReflectionRecord, AiRequestPreview, AiSourcePacket } from '../ai/types'
import { aiCopyFor } from '../i18n/aiCopy'
import { useI18n } from '../i18n/I18nContext'
import { deleteAiReflection, getAiReflections, saveAiReflection } from '../storage/db'

export function AiReflectionPanel({ packet }: { packet: AiSourcePacket }) {
  const { preferences } = useI18n()
  const ai = useAi()
  const copy = aiCopyFor(preferences.locale)
  const [preview, setPreview] = useState<AiRequestPreview | null>(null)
  const [response, setResponse] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState<AiReflectionRecord | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const packetKey = useMemo(() => JSON.stringify(packet), [packet])

  useEffect(() => {
    let active = true
    setPreview(null); setResponse(''); setError(''); setSaved(null)
    void getAiReflections(packet.kind === 'reading' ? 'reading' : 'monthly-pattern').then((items) => {
      if (!active) return
      const match = packet.kind === 'reading'
        ? items.find((item) => item.sourceReadingId === packet.readingId)
        : items.find((item) => item.dateRange?.from === packet.range.from && item.dateRange?.to === packet.range.to)
      if (match) { setSaved(match); setResponse(match.response) }
    })
    return () => { active = false; abortRef.current?.abort() }
  }, [packet.kind, packetKey])

  if (!preferences.aiEnabled) return null

  const prepare = () => {
    setPreview(buildRequestPreview(packet, ai.model))
    setError('')
  }

  const send = async () => {
    if (!preview || !ai.apiKey || sending) return
    const controller = new AbortController()
    abortRef.current = controller
    setSending(true); setError(''); setResponse(''); setSaved(null)
    try {
      const complete = await streamDeepSeek(ai.apiKey, preview, setResponse, controller.signal)
      const record: AiReflectionRecord = {
        id: crypto.randomUUID(),
        schemaVersion: 1,
        createdAt: new Date().toISOString(),
        provider: 'DeepSeek',
        model: preview.model,
        kind: packet.kind === 'reading' ? 'reading' : 'monthly-pattern',
        locale: packet.locale,
        sourceIds: packet.sourceIds,
        contentVersion: packet.contentVersion,
        sourceReadingId: packet.kind === 'reading' ? packet.readingId : undefined,
        dateRange: packet.kind === 'monthly-pattern' ? packet.range : undefined,
        response: complete,
      }
      await saveAiReflection(record)
      setSaved(record)
    } catch (reason) {
      if (!(reason instanceof DOMException && reason.name === 'AbortError')) setError(copy.providerError)
    } finally {
      setSending(false); abortRef.current = null
    }
  }

  const remove = async () => {
    if (!saved) return
    await deleteAiReflection(saved.id)
    setSaved(null); setResponse('')
  }

  return <section className="surface ai-reflection" aria-labelledby={`ai-reflection-${packet.kind}`}>
    <header><span><Bot size={22} aria-hidden="true" /></span><div><p className="eyebrow">{copy.reflectionEyebrow}</p><h2 id={`ai-reflection-${packet.kind}`}>{copy.reflectionTitle}</h2><p>{copy.reflectionBody}</p></div></header>
    {!ai.apiKey ? <div className="ai-reflection__locked"><Settings size={20} aria-hidden="true" /><p>{copy.keyNeeded}</p><Link to="/settings#ai-key-settings" className="button-secondary">{copy.openSettings}</Link></div> : <>
      <div className="ai-reflection__prepare"><button type="button" className="button-secondary" onClick={prepare}><Eye size={17} aria-hidden="true" />{preview ? copy.newPreview : copy.prepare}</button><span>{ai.model}</span></div>
      {preview ? <details className="ai-reflection__preview" open><summary>{copy.preview}</summary><p>{copy.previewBody}</p><pre>{JSON.stringify(preview, null, 2)}</pre><div><button type="button" className="button-primary" disabled={sending} onClick={() => void send()}>{sending ? <LoaderCircle className="animate-spin" size={17} /> : <Send size={17} />}{sending ? copy.streaming : copy.send}</button>{sending ? <button type="button" className="button-secondary" onClick={() => abortRef.current?.abort()}><Square size={15} />{copy.stop}</button> : null}</div></details> : null}
    </>}
    {response ? <article className="ai-reflection__response" aria-live="polite"><div><span>{saved ? copy.savedReflection : copy.streaming}</span>{saved ? <button type="button" onClick={() => void remove()}><Trash2 size={15} />{copy.deleteReflection}</button> : null}</div><p>{response}</p></article> : null}
    {error ? <p className="ai-reflection__error" role="alert">{error}</p> : null}
    <footer>{copy.reflectionDisclaimer}</footer>
  </section>
}
