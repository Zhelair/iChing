import { ArrowLeft, Pause, Play, RotateCcw, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { recordCompanionMoment } from '../companion/life'
import { CompanionPet } from '../components/CompanionPet'
import type { PracticeSession } from '../domain/types'
import { useI18n } from '../i18n/I18nContext'
import { petExperienceCopyFor } from '../i18n/petExperienceCopy'
import { savePracticeSession } from '../storage/db'

// Thirty-five keeps the pause brief while 3 + 5 = 8 gives this playful,
// non-canonical companion practice an auspicious visual rhythm.
const DURATION = 35

export function GoldenPawPracticePage() {
  const navigate = useNavigate()
  const { preferences } = useI18n()
  const copy = petExperienceCopyFor(preferences.locale)
  const [remaining, setRemaining] = useState(DURATION)
  const [phase, setPhase] = useState<'ready' | 'running' | 'paused' | 'complete'>('ready')
  const sessionId = useRef(crypto.randomUUID())

  useEffect(() => {
    if (phase !== 'running') return
    const timer = window.setInterval(() => {
      setRemaining((current) => Math.max(0, current - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [phase])

  useEffect(() => {
    if (remaining !== 0 || phase !== 'running') return
    setPhase('complete')
    recordCompanionMoment('paw-complete')
    const session: PracticeSession = { id: sessionId.current, schemaVersion: 1, createdAt: new Date().toISOString(), practiceId: 'companion-golden-paw-v2', durationSeconds: DURATION, completed: true }
    void savePracticeSession(session)
  }, [phase, remaining])

  const start = () => {
    if (phase === 'ready') recordCompanionMoment('paw-start')
    setPhase('running')
  }

  const restart = () => {
    sessionId.current = crypto.randomUUID()
    recordCompanionMoment('paw-start')
    setRemaining(DURATION)
    setPhase('running')
  }

  const progress = (DURATION - remaining) / DURATION

  return <main className={`golden-paw-practice is-${phase}`} style={{ '--paw-progress': progress } as CSSProperties}>
    <button type="button" className="golden-paw-practice__exit" onClick={() => navigate(-1)}><ArrowLeft size={18} aria-hidden="true" />{copy.exit}</button>
    <div className="golden-paw-practice__mist" aria-hidden="true"><i /><i /><i /></div>
    <section aria-labelledby="golden-paw-title">
      <header>
        <p className="eyebrow"><Sparkles size={15} aria-hidden="true" />{copy.practiceEyebrow}</p>
        <h1 id="golden-paw-title">{copy.practiceTitle}</h1>
        <p>{phase === 'complete' ? copy.complete : copy.practiceIntro}</p>
      </header>
      <div className="golden-paw-practice__stage">
        <span className="golden-paw-practice__orbit" aria-hidden="true"><i /></span>
        <CompanionPet pet="cat" variant="golden-lucky" animation={phase === 'running' ? 'cat-paw' : phase === 'complete' ? 'cat-purr' : 'idle'} motion={preferences.petMotion && !preferences.reduceMotion} />
        <span className="golden-paw-practice__count" aria-live="polite"><strong>{remaining}</strong><small>{copy.seconds}</small></span>
      </div>
      <div className="golden-paw-practice__controls">
        {phase === 'ready' ? <button type="button" className="button-primary" onClick={start}><Play size={17} aria-hidden="true" />{copy.start}</button> : null}
        {phase === 'running' ? <button type="button" className="button-secondary" onClick={() => setPhase('paused')}><Pause size={17} aria-hidden="true" />{copy.pause}</button> : null}
        {phase === 'paused' ? <button type="button" className="button-primary" onClick={start}><Play size={17} aria-hidden="true" />{copy.resume}</button> : null}
        {phase === 'complete' ? <button type="button" className="button-primary" onClick={restart}><RotateCcw size={17} aria-hidden="true" />{copy.restart}</button> : null}
      </div>
      <footer>{copy.privacy}</footer>
    </section>
  </main>
}
