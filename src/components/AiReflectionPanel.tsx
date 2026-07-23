import { Bot, Check, LoaderCircle, Send, Settings, ShieldCheck, Sparkles, Square, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAi } from '../ai/AiContext'
import { AI_PROVIDERS, buildRequestPreview, streamAiReflection } from '../ai/providers'
import type { AiReflectionFocus, AiReflectionRecord, AiRequestPreview, AiResponseLength, AiSourcePacket } from '../ai/types'
import { aiCopyFor } from '../i18n/aiCopy'
import { aiProviderCopyFor } from '../i18n/aiProviderCopy'
import { aiReflectionExperienceCopyFor } from '../i18n/aiReflectionExperienceCopy'
import { useI18n } from '../i18n/I18nContext'
import { deleteAiReflection, getAiReflections, saveAiReflection } from '../storage/db'

export function AiReflectionPanel({ packet }: { packet: AiSourcePacket }) {
  const { preferences } = useI18n()
  const ai = useAi()
  const copy = aiCopyFor(preferences.locale)
  const providerCopy = aiProviderCopyFor(preferences.locale)
  const masterCopy = aiReflectionExperienceCopyFor(preferences.locale)
  const [preview, setPreview] = useState<AiRequestPreview | null>(null)
  const [responseLength, setResponseLength] = useState<AiResponseLength>('medium')
  const [focus, setFocus] = useState<AiReflectionFocus>(packet.kind === 'reading' ? 'situation' : 'monthly-review')
  const [additionalNote, setAdditionalNote] = useState('')
  const [response, setResponse] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState<AiReflectionRecord | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const packetKey = useMemo(() => JSON.stringify(packet), [packet])

  useEffect(() => {
    let active = true
    setPreview(null); setResponse(''); setError(''); setSaved(null); setAdditionalNote(''); setFocus(packet.kind === 'reading' ? 'situation' : 'monthly-review')
    void getAiReflections(packet.kind === 'reading' ? 'reading' : 'monthly-pattern').then((items) => {
      if (!active) return
      const match = packet.kind === 'reading'
        ? items.find((item) => item.sourceReadingId === packet.readingId)
        : items.find((item) => item.dateRange?.from === packet.range.from && item.dateRange?.to === packet.range.to)
      if (match) { setSaved(match); setResponse(match.response) }
    })
    return () => { active = false; abortRef.current?.abort() }
  }, [packet.kind, packetKey])

  useEffect(() => { setPreview(null) }, [ai.model, ai.provider, responseLength])

  if (!preferences.aiEnabled) return null

  const prepare = () => {
    setPreview(buildRequestPreview(packet, ai.provider, ai.model, responseLength, { focus, additionalNote: additionalNote.trim() || undefined }))
    setError('')
  }

  const send = async () => {
    if (!preview || !ai.apiKey || sending) return
    const controller = new AbortController()
    abortRef.current = controller
    setSending(true); setError(''); setResponse(''); setSaved(null)
    try {
      const complete = await streamAiReflection(ai.apiKey, preview, setResponse, controller.signal)
      const record: AiReflectionRecord = {
        id: crypto.randomUUID(),
        schemaVersion: 1,
        createdAt: new Date().toISOString(),
        provider: preview.provider,
        model: preview.model,
        responseLength: preview.responseLength,
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
      setPreview(null)
    } catch (reason) {
      if (!(reason instanceof DOMException && reason.name === 'AbortError')) {
        const detail = reason instanceof Error ? reason.message : ''
        setError(detail === 'provider-network'
          ? `${providerCopy.error} Check your connection or browser privacy settings.`
          : detail.startsWith('provider-') ? `${providerCopy.error} ${detail.replace(/^provider-\d+:?\s*/, '')}` : providerCopy.error)
      }
    } finally {
      setSending(false); abortRef.current = null
    }
  }

  const remove = async () => {
    if (!saved) return
    if (!window.confirm('Delete this saved AI reflection?')) return
    await deleteAiReflection(saved.id)
    setSaved(null); setResponse('')
  }

  const lengths: AiResponseLength[] = ['short', 'medium', 'long']
  const focusOptions: Array<{ id: AiReflectionFocus; label: string }> = packet.kind === 'reading'
    ? [{ id: 'situation', label: masterCopy.focusSituation }, { id: 'changing-lines', label: masterCopy.focusLines }, { id: 'practical-step', label: masterCopy.focusPractice }]
    : [{ id: 'monthly-review', label: masterCopy.focusMonthly }, { id: 'practical-step', label: masterCopy.focusPractice }]
  const noteWordCount = additionalNote.trim() ? additionalNote.trim().split(/\s+/).length : 0
  const updateAdditionalNote = (value: string) => {
    const words = value.trim().split(/\s+/).filter(Boolean)
    setAdditionalNote(words.length <= 53 ? value : words.slice(0, 53).join(' '))
  }
  const lengthLabel = (length: AiResponseLength) => masterCopy[length]
  const lengthHint = (length: AiResponseLength) => length === 'short' ? masterCopy.shortHint : length === 'medium' ? '3–5 short paragraphs' : '6–9 short paragraphs'
  const sharedItems = packet.kind === 'reading'
    ? [masterCopy.readingPacket, `${packet.movingLines.length} ${masterCopy.movingLines}`, packet.question ? masterCopy.questionIncluded : masterCopy.questionExcluded]
    : [`${packet.readingCount} ${masterCopy.readings}`, masterCopy.privateExcluded]

  return <section className={`surface ai-reflection ${sending ? 'is-sending' : ''}`} aria-busy={sending} aria-labelledby={`ai-reflection-${packet.kind}`}>
    <header><span><Bot size={22} aria-hidden="true" /></span><div><p className="eyebrow">{masterCopy.optional}</p><h2 id={`ai-reflection-${packet.kind}`}>{copy.reflectionTitle}</h2><p>{masterCopy.panelBody}</p></div></header>
    {!ai.apiKey ? <div className="ai-reflection__locked"><Settings size={20} aria-hidden="true" /><p>{copy.keyNeeded}</p><Link to="/settings#ai-key-settings" className="button-secondary">{copy.openSettings}</Link></div> : <>
      <div className="ai-reflection__composer">
        <div className="ai-reflection__master"><span><Sparkles size={18} aria-hidden="true" /></span><div><strong>{masterCopy.master}</strong><p>{masterCopy.masterBody}</p></div></div>
        <fieldset className="ai-reflection__length"><legend>{masterCopy.length}</legend><div>{lengths.map((length) => <button type="button" key={length} className={responseLength === length ? 'is-selected' : ''} aria-pressed={responseLength === length} onClick={() => setResponseLength(length)}><span>{lengthLabel(length)}</span><small>{lengthHint(length)}</small></button>)}</div></fieldset>
        <fieldset className="ai-reflection__focus"><legend>{masterCopy.focus}</legend><div>{focusOptions.map((option) => <button type="button" key={option.id} className={focus === option.id ? 'is-selected' : ''} aria-pressed={focus === option.id} onClick={() => setFocus(option.id)}>{option.label}</button>)}</div></fieldset>
        <label className="ai-reflection__note"><span>{masterCopy.noteLabel}</span><textarea value={additionalNote} onChange={(event) => updateAdditionalNote(event.target.value)} placeholder={masterCopy.noteHint} rows={2} /><small>{noteWordCount}/53 {masterCopy.noteCount}</small></label>
        <div className="ai-reflection__prepare"><button type="button" className="button-secondary" onClick={prepare}><Check size={17} aria-hidden="true" />{preview ? masterCopy.reviewAgain : masterCopy.review}</button><span className={sending ? 'is-connected' : ''}><i aria-hidden="true" />{sending ? `${AI_PROVIDERS[ai.provider].name} · connected` : `${AI_PROVIDERS[ai.provider].name} · ${ai.model}`}</span></div>
      </div>
      {preview ? <section className="ai-reflection__confirmation" aria-labelledby={`ai-confirm-${packet.kind}`}><header><ShieldCheck size={20} aria-hidden="true" /><div><h3 id={`ai-confirm-${packet.kind}`}>{masterCopy.ready}</h3><p>{masterCopy.notSent}</p></div></header><div><span>{masterCopy.shared}</span><ul>{sharedItems.map((item) => <li key={item}>{item}</li>)}<li>{lengthLabel(preview.responseLength)} · {lengthHint(preview.responseLength)}</li></ul></div><footer><button type="button" className="button-primary" disabled={sending} onClick={() => void send()}>{sending ? <LoaderCircle className="animate-spin" size={17} aria-hidden="true" /> : <Send size={17} aria-hidden="true" />}{sending ? `${preview.provider} ${providerCopy.responding}` : `${providerCopy.send} ${preview.provider}`}</button>{sending ? <button type="button" className="button-secondary" onClick={() => abortRef.current?.abort()}><Square size={15} aria-hidden="true" />{copy.stop}</button> : null}</footer></section> : null}
    </>}
    {response ? <article className="ai-reflection__response" aria-live="polite"><div><span>{saved ? `${copy.savedReflection} · ${new Intl.DateTimeFormat(preferences.locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(saved.createdAt))}` : `${AI_PROVIDERS[ai.provider].name} ${providerCopy.responding}`}</span>{saved ? <button type="button" onClick={() => void remove()}><Trash2 size={15} />{copy.deleteReflection}</button> : null}</div><p>{response}</p></article> : null}
    {error ? <p className="ai-reflection__error" role="alert">{error}</p> : null}
    <footer>{masterCopy.disclaimer}</footer>
  </section>
}
