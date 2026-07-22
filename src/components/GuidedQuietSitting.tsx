import { ArrowRight, Check, Play, RotateCcw } from 'lucide-react'
import { useRef, useState } from 'react'
import { useSound } from '../audio/SoundContext'
import type { DaoCopy } from '../data/daoContent'
import type { QuietSittingCopy } from '../data/quietSittingContent'
import type { Locale } from '../domain/locales'
import type { JournalEntry } from '../domain/types'
import { saveJournalEntry, savePracticeSession } from '../storage/db'

type State = 'idle' | 'guiding' | 'complete'

export function GuidedQuietSitting({ copy, quiet, locale }: { copy: DaoCopy; quiet: QuietSittingCopy; locale: Locale }) {
  const { playPracticeCue } = useSound()
  const [state, setState] = useState<State>('idle')
  const [step, setStep] = useState(0)
  const [reflection, setReflection] = useState('')
  const [saved, setSaved] = useState(false)
  const startedAt = useRef<number>(0)
  const sessionId = useRef<string>('')

  function begin() {
    startedAt.current = Date.now(); sessionId.current = crypto.randomUUID()
    setStep(0); setReflection(''); setSaved(false); setState('guiding')
    void playPracticeCue('begin')
  }

  function continueGuidance() {
    if (step < quiet.stages.length - 1) {
      setStep((value) => value + 1)
      void playPracticeCue('begin')
      return
    }
    const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000))
    setState('complete')
    void playPracticeCue('complete')
    void savePracticeSession({ id: sessionId.current, schemaVersion: 1, createdAt: new Date().toISOString(), practiceId: 'guided-quiet-sitting-v1', durationSeconds, completed: true })
  }

  async function saveReflection() {
    if (!reflection.trim()) return
    const now = new Date().toISOString()
    const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000))
    const entry: JournalEntry = { id: crypto.randomUUID(), schemaVersion: 1, createdAt: now, updatedAt: now, locale, kind: 'practice', title: quiet.title, body: reflection.trim(), tags: ['dao', 'quiet-sitting'], sourceId: 'guided-quiet-sitting-v1', durationSeconds }
    await saveJournalEntry(entry)
    await savePracticeSession({ id: sessionId.current, schemaVersion: 1, createdAt: now, practiceId: 'guided-quiet-sitting-v1', durationSeconds, completed: true, reflectionEntryId: entry.id })
    setSaved(true)
  }

  return <section className={`surface dao-quiet-sitting is-${state}`} aria-labelledby="quiet-sitting-title">
    <header className="dao-quiet-sitting__intro">
      <p className="eyebrow">{quiet.title}</p><h2 id="quiet-sitting-title">{quiet.heading}</h2><p>{quiet.intro}</p><p className="dao-safety">{quiet.safety}</p>
    </header>
    <div className="dao-quiet-sitting__guide">
      <div className="dao-quiet-sitting__scene" aria-hidden="true">
        <svg viewBox="0 0 440 300"><path d="M83 224h274M120 224c17-71 183-71 200 0" /><path className="is-layer-one" d="M132 108h176" /><path className="is-layer-two" d="M155 74h130" /><path className="is-layer-three" d="M180 42h80" /><circle cx="220" cy="182" r="26" /></svg>
        <span>{state === 'idle' ? '01' : String(step + 1).padStart(2, '0')}</span>
      </div>
      {state === 'idle' ? <div className="dao-quiet-sitting__card"><p>{quiet.why}</p><button type="button" className="button-primary" onClick={begin}><Play size={18} />{copy.start}</button></div> : state === 'guiding' ? <div className="dao-quiet-sitting__card" aria-live="polite">
        <ol>{quiet.stages.map((label, index) => <li key={label} className={index === step ? 'is-current' : index < step ? 'is-complete' : ''}><span>{index < step ? <Check size={13} /> : index + 1}</span>{label}</li>)}</ol>
        <p className="eyebrow">{quiet.stages[step]}</p><blockquote>{quiet.cues[step]}</blockquote>
        <button type="button" className="button-primary" onClick={continueGuidance}>{step === quiet.stages.length - 1 ? copy.finish : quiet.stages[step + 1]}<ArrowRight size={17} /></button>
      </div> : <div className="dao-quiet-sitting__card dao-quiet-sitting__reflection">
        <label htmlFor="quiet-sitting-reflection">{copy.reflection}</label><textarea id="quiet-sitting-reflection" className="field" value={reflection} onChange={(event) => { setReflection(event.target.value); setSaved(false) }} placeholder={quiet.reflection} />
        <div><button type="button" className="button-primary" disabled={!reflection.trim()} onClick={() => void saveReflection()}>{saved ? <Check size={17} /> : null}{saved ? copy.journalSaved : copy.saveReflection}</button><button type="button" className="button-secondary" onClick={begin}><RotateCcw size={16} />{copy.start}</button></div>
      </div>}
    </div>
  </section>
}
