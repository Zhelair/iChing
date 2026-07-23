import { EyeOff, Sparkles, Volume2, Waves, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSound } from '../audio/SoundContext'
import { companionCopyFor } from '../i18n/companionCopy'
import { aiCopyFor } from '../i18n/aiCopy'
import { useI18n } from '../i18n/I18nContext'
import { companionRoutineForPath, welcomeAnimation } from '../companion/behavior'
import { recordCompanionMoment } from '../companion/life'
import { petExperienceCopyFor } from '../i18n/petExperienceCopy'
import { CompanionPet, type CompanionAnimation } from './CompanionPet'

function actionAnimation(pet: 'cat' | 'dog', action: 0 | 1 | 2): CompanionAnimation {
  if (pet === 'cat') return (['cat-purr', 'cat-treat', 'cat-paw'] as const)[action]
  return (['dog-greet', 'dog-fetch', 'dog-belly'] as const)[action]
}

export function ReflectionCompanion() {
  const { pathname } = useLocation()
  const { preferences, updatePreference } = useI18n()
  const { playPetSound } = useSound()
  const copy = companionCopyFor(preferences.locale)
  const aiCopy = aiCopyFor(preferences.locale)
  const experience = petExperienceCopyFor(preferences.locale)
  const [open, setOpen] = useState(false)
  const [animation, setAnimation] = useState<CompanionAnimation>('idle')
  const [animationRun, setAnimationRun] = useState(0)
  const resetTimer = useRef<number | null>(null)
  const routine = companionRoutineForPath(pathname)
  const ritual = routine.scene === 'ritual'
  const hidden = !preferences.companionEnabled
  const motion = preferences.petMotion && !preferences.reduceMotion
  const readingPage = pathname === '/result' || pathname.startsWith('/hexagrams/')

  useEffect(() => {
    setOpen(false)
    setAnimation(routine.restingPose)
    setAnimationRun((current) => current + 1)
    if (!motion || routine.welcomeDelayMs === null) return
    const welcomeTimer = window.setTimeout(() => {
      setAnimation(welcomeAnimation(preferences.companionPet))
      setAnimationRun((current) => current + 1)
      resetTimer.current = window.setTimeout(() => {
        setAnimation(routine.restingPose)
        setAnimationRun((current) => current + 1)
      }, 2400)
    }, routine.welcomeDelayMs)
    return () => window.clearTimeout(welcomeTimer)
  }, [motion, pathname, preferences.companionPet, routine.restingPose, routine.welcomeDelayMs])

  useEffect(() => {
    if (!motion || !readingPage) return
    const sleepTimer = window.setTimeout(() => {
      setAnimation('sleep')
      setAnimationRun((current) => current + 1)
    }, 35_000)
    return () => window.clearTimeout(sleepTimer)
  }, [motion, pathname, readingPage])

  useEffect(() => {
    if (!motion || ritual || readingPage) return
    const lifeTimer = window.setTimeout(() => {
      setAnimation(preferences.companionPet === 'cat' ? 'cat-stretch' : 'dog-wiggle')
      setAnimationRun((current) => current + 1)
      resetTimer.current = window.setTimeout(() => {
        setAnimation(routine.restingPose)
        setAnimationRun((current) => current + 1)
      }, 2600)
    }, 47_000)
    return () => window.clearTimeout(lifeTimer)
  }, [motion, pathname, preferences.companionPet, readingPage, ritual, routine.restingPose])

  useEffect(() => () => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current)
  }, [])

  if (hidden) return null

  const runAction = (action: 0 | 1 | 2) => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current)
    const next = actionAnimation(preferences.companionPet, action)
    recordCompanionMoment('interaction')
    setAnimation(motion ? next : 'idle')
    setAnimationRun((current) => current + 1)
    void playPetSound(preferences.companionPet, action)
    resetTimer.current = window.setTimeout(() => {
      setAnimation(routine.restingPose)
      setAnimationRun((current) => current + 1)
    }, motion ? 2600 : 350)
  }

  const togglePanel = () => {
    const life = recordCompanionMoment('interaction')
    if (!open && motion && life.interactions % 3 === 0) {
      setAnimation(preferences.companionPet === 'cat' ? 'cat-stretch' : 'dog-wiggle')
      setAnimationRun((current) => current + 1)
      if (resetTimer.current) window.clearTimeout(resetTimer.current)
      resetTimer.current = window.setTimeout(() => {
        setAnimation(routine.restingPose)
        setAnimationRun((current) => current + 1)
      }, 2600)
    }
    setOpen((current) => !current)
  }

  return (
    <aside className={`reflection-companion reflection-companion--${preferences.companionSize} ${ritual ? 'is-ritual' : ''} ${routine.scene === 'settings' ? 'is-settings' : ''}`} aria-label={copy.title}>
      {open ? (
        <div className="reflection-companion__panel" role="dialog" aria-modal="false" aria-label={copy.interact}>
          <header>
            <span><Sparkles size={15} aria-hidden="true" /> {copy.interact}</span>
            <button type="button" onClick={() => setOpen(false)} aria-label={copy.close}><X size={18} aria-hidden="true" /></button>
          </header>
          <div className="reflection-companion__panel-pet" aria-hidden="true">
            <CompanionPet key={`panel-${animation}-${animationRun}`} pet={preferences.companionPet} animation={animation} motion={motion} />
          </div>
          <div className="reflection-companion__actions">
            {copy.actions[preferences.companionPet].map((label, index) => (
              <button key={label} type="button" onClick={() => runAction(index as 0 | 1 | 2)}>{label}</button>
            ))}
          </div>
          {preferences.companionPet === 'cat' ? <Link className="reflection-companion__practice" to="/companion/golden-paw" onClick={() => setOpen(false)}><Sparkles size={15} aria-hidden="true" /><span><strong>{experience.practice}</strong><small>{experience.practiceBody}</small></span></Link> : null}
          <section className="reflection-companion__pet-controls" aria-label={copy.choose}>
            <strong>{copy.choose}</strong>
            <div>{(['cat', 'dog'] as const).map((pet) => <button key={pet} type="button" className={preferences.companionPet === pet ? 'is-selected' : ''} aria-pressed={preferences.companionPet === pet} onClick={() => { updatePreference('companionPet', pet); setAnimation('idle'); setAnimationRun((current) => current + 1) }}>{pet === 'cat' ? copy.cat : copy.dog}</button>)}</div>
            <strong>{copy.size}</strong>
            <div>{(['normal', 'large'] as const).map((size) => <button key={size} type="button" className={preferences.companionSize === size ? 'is-selected' : ''} aria-pressed={preferences.companionSize === size} onClick={() => updatePreference('companionSize', size)}>{size === 'normal' ? copy.normal : copy.large}</button>)}</div>
          </section>
          <section className="reflection-companion__quick-settings" aria-label={experience.quickSettings}>
            <strong>{experience.quickSettings}</strong>
            <div>
              <button type="button" className={preferences.petMotion ? 'is-on' : ''} onClick={() => updatePreference('petMotion', !preferences.petMotion)} aria-pressed={preferences.petMotion}><Waves size={14} aria-hidden="true" />{experience.motion}</button>
              <button type="button" className={preferences.petSound ? 'is-on' : ''} onClick={() => updatePreference('petSound', !preferences.petSound)} aria-pressed={preferences.petSound}><Volume2 size={14} aria-hidden="true" />{experience.sound}</button>
              <button type="button" onClick={() => updatePreference('companionEnabled', false)}><EyeOff size={14} aria-hidden="true" />{experience.hide}</button>
            </div>
          </section>
          <nav className="reflection-companion__tools" aria-label={aiCopy.reflectionTitle}>
            {preferences.aiEnabled ? <Link to="/journal/patterns"><Sparkles size={14} aria-hidden="true" />{aiCopy.openPatterns}</Link> : null}
            <Link to="/settings#ai-key-settings" onClick={() => setOpen(false)}>{aiCopy.openSettings}</Link>
          </nav>
        </div>
      ) : null}

      <button
        type="button"
        className="reflection-companion__trigger"
        onClick={togglePanel}
        aria-expanded={open}
        aria-label={copy.open}
      >
        <CompanionPet key={`trigger-${animation}-${animationRun}`} pet={preferences.companionPet} animation={ritual ? 'sleep' : animation} motion={motion && !ritual} />
      </button>
    </aside>
  )
}
