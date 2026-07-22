import { Check, Pause, Play, Square } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useSound } from '../audio/SoundContext'
import type { DaoCopy } from '../data/daoContent'
import type { DaoPracticeDetailCopy } from '../data/daoPracticeContent'
import type { Locale } from '../domain/locales'
import type { JournalEntry, PracticeSession } from '../domain/types'
import { saveJournalEntry, savePracticeSession } from '../storage/db'

type State = 'idle' | 'running' | 'paused' | 'complete'

export function OpenAttentionPractice({ copy, detail, locale }: { copy: DaoCopy; detail: DaoPracticeDetailCopy; locale: Locale }) {
  const { playPracticeCue } = useSound()
  const [duration, setDuration] = useState(180)
  const [remaining, setRemaining] = useState(180)
  const [state, setState] = useState<State>('idle')
  const [reflection, setReflection] = useState('')
  const [saved, setSaved] = useState(false)
  const sessionId = useRef<string | null>(null)
  const completionSaved = useRef(false)

  useEffect(() => {
    if (state !== 'running') return
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [state])

  useEffect(() => {
    if (state !== 'running' || remaining !== 0 || completionSaved.current) return
    completionSaved.current = true
    setState('complete')
    void playPracticeCue('complete')
    void savePracticeSession({ id: sessionId.current ?? crypto.randomUUID(), schemaVersion: 1, createdAt: new Date().toISOString(), practiceId: 'open-attention-v1', durationSeconds: duration, completed: true })
  }, [duration, playPracticeCue, remaining, state])

  const progress = duration ? (duration - remaining) / duration : 0
  const stage = state === 'idle' ? 0 : state === 'complete' ? 2 : progress < .28 ? 0 : progress < .7 ? 1 : 2
  const time = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`

  function begin() {
    sessionId.current = crypto.randomUUID()
    completionSaved.current = false
    setRemaining(duration)
    setReflection('')
    setSaved(false)
    setState('running')
    void playPracticeCue('begin')
  }

  function finish() {
    setState('complete')
    void playPracticeCue('complete')
    if (completionSaved.current) return
    completionSaved.current = true
    void savePracticeSession({ id: sessionId.current ?? crypto.randomUUID(), schemaVersion: 1, createdAt: new Date().toISOString(), practiceId: 'open-attention-v1', durationSeconds: duration - remaining, completed: false })
  }

  async function saveReflection() {
    if (!reflection.trim()) return
    const now = new Date().toISOString()
    const entry: JournalEntry = { id: crypto.randomUUID(), schemaVersion: 1, createdAt: now, updatedAt: now, locale, kind: 'practice', title: detail.openTitle, body: reflection.trim(), tags: ['dao', 'attention'], sourceId: 'open-attention-v1', durationSeconds: duration - remaining }
    await saveJournalEntry(entry)
    await savePracticeSession({ id: sessionId.current ?? crypto.randomUUID(), schemaVersion: 1, createdAt: now, practiceId: 'open-attention-v1', durationSeconds: duration - remaining, completed: remaining === 0, reflectionEntryId: entry.id })
    setSaved(true)
  }

  return <section className={`surface dao-practice dao-open-attention is-${state}`} style={{ '--attention-progress': progress } as CSSProperties} aria-labelledby="open-attention-practice-title">
    <div className="dao-practice__copy dao-open-attention__copy"><p className="eyebrow">{detail.openTitle}</p><h2 id="open-attention-practice-title" className="mt-3 text-3xl sm:text-5xl">{detail.howToPractice}</h2><p className="mt-4 max-w-xl leading-7 text-[var(--ink-soft)]">{detail.openIntro}</p><div className="dao-open-attention__principles" aria-hidden="true"><span>{detail.openStages[0]}</span><span>{detail.openStages[1]}</span><span>{detail.openStages[2]}</span></div><p className="dao-safety mt-5">{detail.openSafety}</p></div>
    <div className="dao-practice__player">
      <ol className="dao-practice__stages" aria-label={detail.openTitle}>{detail.openStages.map((label, index) => <li key={label} className={index === stage ? 'is-current' : index < stage ? 'is-complete' : ''} aria-current={index === stage ? 'step' : undefined}><span>{index < stage ? <Check size={13} /> : index + 1}</span>{label}</li>)}</ol>
      <div className="dao-practice__scene dao-open-attention__scene" aria-hidden="true"><svg viewBox="0 0 420 250"><circle cx="210" cy="125" r="38" /><circle cx="210" cy="125" r="78" /><circle cx="210" cy="125" r="118" /><path d="M24 177C88 132 143 196 210 153C277 110 334 166 399 116" /></svg><i className="dao-attention-node is-contact" /><i className="dao-attention-node is-near" /><i className="dao-attention-node is-far" /><i className="dao-attention-node is-space" /><div><span>{state === 'complete' ? copy.complete : detail.openStages[stage]}</span><strong>{state === 'idle' ? `${duration / 60} ${copy.minutes}` : time}</strong></div></div>
      <div className="dao-practice__status"><span aria-hidden="true" /><p>{detail.openStages[stage]}<strong>{detail.openCues[stage]}</strong></p></div>
      {state === 'idle' ? <><div className="dao-duration" role="group" aria-label={copy.minutes}>{[60, 180, 300].map((seconds) => <button type="button" key={seconds} className={duration === seconds ? 'is-active' : ''} onClick={() => { setDuration(seconds); setRemaining(seconds) }} aria-pressed={duration === seconds}>{seconds / 60} {copy.minutes}</button>)}</div><button type="button" className="button-primary dao-practice__primary" onClick={begin}><Play size={18} />{copy.start}</button></> : state === 'running' ? <div className="dao-practice__controls"><button type="button" className="button-primary" onClick={() => setState('paused')}><Pause size={18} />{copy.pause}</button><button type="button" className="button-secondary" onClick={finish}><Square size={16} />{copy.finish}</button></div> : state === 'paused' ? <div className="dao-practice__controls"><button type="button" className="button-primary" onClick={() => setState('running')}><Play size={18} />{copy.resume}</button><button type="button" className="button-secondary" onClick={finish}><Square size={16} />{copy.finish}</button></div> : <div className="dao-practice__reflection"><label htmlFor="open-attention-reflection">{copy.reflection}</label><textarea id="open-attention-reflection" className="field mt-2 min-h-32" value={reflection} onChange={(event) => { setReflection(event.target.value); setSaved(false) }} placeholder={detail.openReflection} /><div className="mt-3 flex flex-wrap gap-3"><button type="button" className="button-primary" disabled={!reflection.trim()} onClick={() => void saveReflection()}>{saved ? <Check size={17} /> : null}{saved ? copy.journalSaved : copy.saveReflection}</button><button type="button" className="button-secondary" onClick={() => { setState('idle'); setRemaining(duration) }}>{copy.close}</button></div></div>}
    </div>
  </section>
}
