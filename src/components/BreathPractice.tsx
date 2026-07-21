import { Check, Pause, Play, Square } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useSound } from '../audio/SoundContext'
import type { DaoCopy } from '../data/daoContent'
import type { Locale } from '../domain/locales'
import type { JournalEntry, PracticeSession } from '../domain/types'
import { saveJournalEntry, savePracticeSession } from '../storage/db'

type PracticeState = 'idle' | 'running' | 'paused' | 'complete'

export function BreathPractice({ copy, locale }: { copy: DaoCopy; locale: Locale }) {
  const { playPracticeCue } = useSound()
  const [duration, setDuration] = useState(180)
  const [remaining, setRemaining] = useState(180)
  const [state, setState] = useState<PracticeState>('idle')
  const [arrival, setArrival] = useState(0)
  const [reflection, setReflection] = useState('')
  const [reflectionSaved, setReflectionSaved] = useState(false)
  const sessionId = useRef<string | null>(null)
  const completionSaved = useRef(false)
  const arrivalCuePlayed = useRef(false)

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

  function updateArrival(value: number) {
    setArrival(value)
    if (value === 100 && !arrivalCuePlayed.current) {
      arrivalCuePlayed.current = true
      void playPracticeCue('pause')
    }
    if (value < 96) arrivalCuePlayed.current = false
  }

  function begin() {
    if (arrival < 100) return
    sessionId.current = crypto.randomUUID()
    completionSaved.current = false
    setRemaining(duration)
    setReflection('')
    setReflectionSaved(false)
    setState('running')
    void playPracticeCue('begin')
  }

  function pause() {
    setState('paused')
    void playPracticeCue('pause')
  }

  function finish() {
    const elapsed = duration - remaining
    setState('complete')
    void playPracticeCue('complete')
    if (!completionSaved.current) {
      completionSaved.current = true
      const session: PracticeSession = { id: sessionId.current ?? crypto.randomUUID(), schemaVersion: 1, createdAt: new Date().toISOString(), practiceId: 'settling-breath-v1', durationSeconds: elapsed, completed: false }
      sessionId.current = session.id
      void savePracticeSession(session)
    }
  }

  async function saveReflection() {
    if (!reflection.trim()) return
    const now = new Date().toISOString()
    const entry: JournalEntry = { id: crypto.randomUUID(), schemaVersion: 1, createdAt: now, updatedAt: now, locale, kind: 'practice', title: copy.practiceTitle, body: reflection.trim(), tags: ['dao', 'breath'], sourceId: 'settling-breath-v1', durationSeconds: duration - remaining }
    await saveJournalEntry(entry)
    const session: PracticeSession = { id: sessionId.current ?? crypto.randomUUID(), schemaVersion: 1, createdAt: now, practiceId: 'settling-breath-v1', durationSeconds: duration - remaining, completed: remaining === 0, reflectionEntryId: entry.id }
    await savePracticeSession(session)
    setReflectionSaved(true)
  }

  function reset() {
    setState('idle')
    setRemaining(duration)
    setArrival(0)
    arrivalCuePlayed.current = false
  }

  const elapsed = duration - remaining
  const progress = duration ? elapsed / duration : 0
  const phase = elapsed < 10 ? copy.settle : remaining <= 10 ? copy.close : copy.breathe
  const time = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`
  const circumference = 2 * Math.PI * 104
  const stage = state === 'idle' ? 0 : state === 'complete' ? 2 : 1
  const stageLabels = [copy.settle, copy.practice, copy.reflection]

  return <section id="dao-practice" className="surface dao-practice scroll-mt-24" aria-labelledby="dao-practice-title">
    <div className="dao-practice__copy"><p className="eyebrow">{copy.practice}</p><h2 id="dao-practice-title" className="mt-3 text-3xl sm:text-5xl">{copy.practiceTitle}</h2><p className="mt-4 max-w-xl leading-7 text-[var(--ink-soft)]">{copy.practiceIntro}</p><p className="dao-safety mt-5">{copy.safety}</p></div>
    <div className={`dao-practice__player is-${state}`}>
      <ol className="dao-practice__stages" aria-label={copy.practiceTitle}>
        {stageLabels.map((label, index) => <li key={label} className={index === stage ? 'is-current' : index < stage ? 'is-complete' : ''} aria-current={index === stage ? 'step' : undefined}><span>{index < stage ? <Check size={13} /> : index + 1}</span>{label}</li>)}
      </ol>
      <div className="dao-practice__scene" aria-hidden="true">
        <div className="dao-practice__reeds" style={{ '--arrival-progress': arrival / 100 } as CSSProperties}>
          {Array.from({ length: 29 }, (_, index) => <i key={index} style={{ '--reed-index': index, '--reed-delay': `${index * -90}ms` } as CSSProperties} />)}
        </div>
        <div className="dao-practice__orb">
          <svg viewBox="0 0 240 240"><circle className="dao-practice__track" cx="120" cy="120" r="104" /><circle className="dao-practice__progress" cx="120" cy="120" r="104" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} /></svg>
          <div><span className="dao-practice__phase">{state === 'idle' ? copy.settle : state === 'complete' ? copy.complete : phase}</span><strong>{state === 'idle' ? `${duration / 60} ${copy.minutes}` : time}</strong></div>
        </div>
      </div>
      <div className="dao-practice__status" aria-hidden="true"><span /><p>{stageLabels[stage]}<strong>{state === 'idle' ? (arrival === 100 ? copy.start : copy.settle) : state === 'complete' ? copy.complete : phase}</strong></p></div>
      <p className="sr-only" aria-live="polite">{phase} · {time}</p>
      {state === 'idle' ? <>
        <div className="dao-duration" role="group" aria-label={copy.minutes}>{[60, 180, 300].map((seconds) => <button type="button" key={seconds} className={duration === seconds ? 'is-active' : ''} onClick={() => chooseDuration(seconds)} aria-pressed={duration === seconds}>{seconds / 60} {copy.minutes}</button>)}</div>
        <label className="dao-arrival" htmlFor="dao-arrival">
          <span>{arrival === 100 ? copy.start : copy.settle}</span>
          <span className="dao-arrival__track"><span aria-hidden="true" style={{ transform: `scaleX(${arrival / 100})` }} /><input id="dao-arrival" type="range" min="0" max="100" step="1" value={arrival} onInput={(event) => updateArrival(Number(event.currentTarget.value))} aria-valuetext={arrival === 100 ? copy.start : copy.settle} /></span>
        </label>
        <button type="button" className="button-primary dao-practice__primary" disabled={arrival < 100} onClick={begin}><Play size={18} />{copy.start}</button>
      </> : state === 'running' ? <div className="dao-practice__controls"><button type="button" className="button-primary" onClick={pause}><Pause size={18} />{copy.pause}</button><button type="button" className="button-secondary" onClick={finish}><Square size={16} />{copy.finish}</button></div> : state === 'paused' ? <div className="dao-practice__controls"><button type="button" className="button-primary" onClick={() => { setState('running'); void playPracticeCue('begin') }}><Play size={18} />{copy.resume}</button><button type="button" className="button-secondary" onClick={finish}><Square size={16} />{copy.finish}</button></div> : <div className="dao-practice__reflection">
        <label htmlFor="practice-reflection">{copy.reflection}</label><textarea id="practice-reflection" className="field mt-2 min-h-32" value={reflection} onChange={(event) => { setReflection(event.target.value); setReflectionSaved(false) }} placeholder={copy.reflectionHint} />
        <div className="mt-3 flex flex-wrap gap-3"><button type="button" className="button-primary" disabled={!reflection.trim()} onClick={() => void saveReflection()}>{reflectionSaved ? <Check size={17} /> : null}{reflectionSaved ? copy.journalSaved : copy.saveReflection}</button><button type="button" className="button-secondary" onClick={reset}>{copy.close}</button></div>
      </div>}
    </div>
  </section>
}
