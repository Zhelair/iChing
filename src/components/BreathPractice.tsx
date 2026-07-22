import { Check, Pause, Play, Square } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useSound } from '../audio/SoundContext'
import type { DaoCopy } from '../data/daoContent'
import type { DaoPracticeDetailCopy } from '../data/daoPracticeContent'
import type { Locale } from '../domain/locales'
import type { JournalEntry, PracticeSession } from '../domain/types'
import { saveJournalEntry, savePracticeSession } from '../storage/db'

type PracticeState = 'idle' | 'running' | 'paused' | 'complete'

export function BreathPractice({ copy, detail, locale }: { copy: DaoCopy; detail: DaoPracticeDetailCopy; locale: Locale }) {
  const { playPracticeCue } = useSound()
  const [duration, setDuration] = useState(180)
  const [remaining, setRemaining] = useState(180)
  const [state, setState] = useState<PracticeState>('idle')
  const [reflection, setReflection] = useState('')
  const [reflectionSaved, setReflectionSaved] = useState(false)
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
    const session: PracticeSession = { id: sessionId.current ?? crypto.randomUUID(), schemaVersion: 1, createdAt: new Date().toISOString(), practiceId: 'settling-breath-v1', durationSeconds: duration, completed: true }
    sessionId.current = session.id
    void savePracticeSession(session)
  }, [duration, playPracticeCue, remaining, state])

  function chooseDuration(seconds: number) {
    if (state !== 'idle') return
    setDuration(seconds)
    setRemaining(seconds)
  }

  function begin() {
    sessionId.current = crypto.randomUUID()
    completionSaved.current = false
    setRemaining(duration)
    setReflection('')
    setReflectionSaved(false)
    setState('running')
    void playPracticeCue('begin')
  }

  function finish() {
    const elapsed = duration - remaining
    setState('complete')
    void playPracticeCue('complete')
    if (completionSaved.current) return
    completionSaved.current = true
    const session: PracticeSession = { id: sessionId.current ?? crypto.randomUUID(), schemaVersion: 1, createdAt: new Date().toISOString(), practiceId: 'settling-breath-v1', durationSeconds: elapsed, completed: false }
    sessionId.current = session.id
    void savePracticeSession(session)
  }

  async function saveReflection() {
    if (!reflection.trim()) return
    const now = new Date().toISOString()
    const entry: JournalEntry = { id: crypto.randomUUID(), schemaVersion: 1, createdAt: now, updatedAt: now, locale, kind: 'practice', title: copy.practiceTitle, body: reflection.trim(), tags: ['dao', 'breath'], sourceId: 'settling-breath-v1', durationSeconds: duration - remaining }
    await saveJournalEntry(entry)
    await savePracticeSession({ id: sessionId.current ?? crypto.randomUUID(), schemaVersion: 1, createdAt: now, practiceId: 'settling-breath-v1', durationSeconds: duration - remaining, completed: remaining === 0, reflectionEntryId: entry.id })
    setReflectionSaved(true)
  }

  function reset() {
    setState('idle')
    setRemaining(duration)
  }

  const elapsed = duration - remaining
  const progress = duration ? elapsed / duration : 0
  const stage = state === 'idle' ? 0 : state === 'complete' ? 2 : progress < .18 ? 0 : progress < .85 ? 1 : 2
  const time = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`
  const circumference = 2 * Math.PI * 104

  return <section id="dao-practice" className="surface dao-practice scroll-mt-24" aria-labelledby="dao-practice-title">
    <div className="dao-practice__copy"><p className="eyebrow">{copy.practice}</p><h2 id="dao-practice-title" className="mt-3 text-3xl sm:text-5xl">{detail.howToPractice}</h2><p className="mt-4 max-w-xl leading-7 text-[var(--ink-soft)]">{detail.breathCues[1]}</p><p className="dao-safety mt-5">{copy.safety}</p></div>
    <div className={`dao-practice__player is-${state}`}>
      <ol className="dao-practice__stages" aria-label={copy.practiceTitle}>{detail.breathStages.map((label, index) => <li key={label} className={index === stage ? 'is-current' : index < stage ? 'is-complete' : ''} aria-current={index === stage ? 'step' : undefined}><span>{index < stage ? <Check size={13} /> : index + 1}</span>{label}</li>)}</ol>
      <div className="dao-practice__scene dao-practice__scene--water" aria-hidden="true">
        <svg className="dao-practice__water" viewBox="0 0 420 250"><path d="M24 163C91 109 142 192 212 142C279 94 323 162 397 105" /><path d="M24 190C99 144 153 214 228 171C293 134 342 177 397 143" /><path d="M24 216C112 184 161 227 239 201C302 180 349 202 397 177" /></svg>
        <div className="dao-practice__orb"><svg viewBox="0 0 240 240"><circle className="dao-practice__track" cx="120" cy="120" r="104" /><circle className="dao-practice__progress" cx="120" cy="120" r="104" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} /></svg><div><span className="dao-practice__phase">{state === 'complete' ? copy.complete : detail.breathStages[stage]}</span><strong>{state === 'idle' ? `${duration / 60} ${copy.minutes}` : time}</strong></div></div>
      </div>
      <div className="dao-practice__status"><span aria-hidden="true" /><p>{detail.breathStages[stage]}<strong>{detail.breathCues[stage]}</strong></p></div>
      <p className="sr-only" aria-live="polite">{detail.breathStages[stage]} · {time}</p>
      {state === 'idle' ? <><div className="dao-duration" role="group" aria-label={copy.minutes}>{[60, 180, 300].map((seconds) => <button type="button" key={seconds} className={duration === seconds ? 'is-active' : ''} onClick={() => chooseDuration(seconds)} aria-pressed={duration === seconds}>{seconds / 60} {copy.minutes}</button>)}</div><button type="button" className="button-primary dao-practice__primary" onClick={begin}><Play size={18} />{copy.start}</button></> : state === 'running' ? <div className="dao-practice__controls"><button type="button" className="button-primary" onClick={() => setState('paused')}><Pause size={18} />{copy.pause}</button><button type="button" className="button-secondary" onClick={finish}><Square size={16} />{copy.finish}</button></div> : state === 'paused' ? <div className="dao-practice__controls"><button type="button" className="button-primary" onClick={() => setState('running')}><Play size={18} />{copy.resume}</button><button type="button" className="button-secondary" onClick={finish}><Square size={16} />{copy.finish}</button></div> : <div className="dao-practice__reflection"><label htmlFor="practice-reflection">{copy.reflection}</label><textarea id="practice-reflection" className="field mt-2 min-h-32" value={reflection} onChange={(event) => { setReflection(event.target.value); setReflectionSaved(false) }} placeholder={detail.breathReflection} /><div className="mt-3 flex flex-wrap gap-3"><button type="button" className="button-primary" disabled={!reflection.trim()} onClick={() => void saveReflection()}>{reflectionSaved ? <Check size={17} /> : null}{reflectionSaved ? copy.journalSaved : copy.saveReflection}</button><button type="button" className="button-secondary" onClick={reset}>{copy.close}</button></div></div>}
    </div>
  </section>
}
