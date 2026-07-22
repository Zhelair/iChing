import { Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSound } from '../audio/SoundContext'
import { companionCopyFor } from '../i18n/companionCopy'
import { aiCopyFor } from '../i18n/aiCopy'
import { useI18n } from '../i18n/I18nContext'
import { CompanionPet, type CompanionAnimation } from './CompanionPet'

function actionAnimation(pet: 'cat' | 'dog', action: 0 | 1 | 2): CompanionAnimation {
  if (pet === 'cat') return (['cat-purr', 'cat-treat', 'cat-paw'] as const)[action]
  return (['dog-greet', 'dog-fetch', 'dog-belly'] as const)[action]
}

export function ReflectionCompanion() {
  const { pathname } = useLocation()
  const { preferences } = useI18n()
  const { playPetSound } = useSound()
  const copy = companionCopyFor(preferences.locale)
  const aiCopy = aiCopyFor(preferences.locale)
  const [open, setOpen] = useState(false)
  const [animation, setAnimation] = useState<CompanionAnimation>('idle')
  const resetTimer = useRef<number | null>(null)
  const ritual = pathname.startsWith('/cast/') || pathname === '/iching/reading'
  const hidden = !preferences.aiEnabled || pathname === '/settings'
  const motion = preferences.petMotion && !preferences.reduceMotion

  useEffect(() => {
    setOpen(false)
    setAnimation(ritual ? 'sleep' : 'idle')
  }, [pathname, ritual])

  useEffect(() => () => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current)
  }, [])

  if (hidden) return null

  const runAction = (action: 0 | 1 | 2) => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current)
    const next = actionAnimation(preferences.companionPet, action)
    setAnimation(motion ? next : 'idle')
    void playPetSound(preferences.companionPet, action)
    resetTimer.current = window.setTimeout(() => setAnimation('idle'), motion ? 2600 : 350)
  }

  return (
    <aside className={`reflection-companion reflection-companion--${preferences.companionSize} ${ritual ? 'is-ritual' : ''}`} aria-label={copy.title}>
      {open ? (
        <div className="reflection-companion__panel" role="dialog" aria-modal="false" aria-label={copy.interact}>
          <header>
            <span><Sparkles size={15} aria-hidden="true" /> {copy.interact}</span>
            <button type="button" onClick={() => setOpen(false)} aria-label={copy.close}><X size={18} aria-hidden="true" /></button>
          </header>
          <div className="reflection-companion__panel-pet" aria-hidden="true">
            <CompanionPet pet={preferences.companionPet} animation={animation} motion={motion} />
          </div>
          <div className="reflection-companion__actions">
            {copy.actions[preferences.companionPet].map((label, index) => (
              <button key={label} type="button" onClick={() => runAction(index as 0 | 1 | 2)}>{label}</button>
            ))}
          </div>
          <nav className="reflection-companion__tools" aria-label={aiCopy.reflectionTitle}>
            <Link to="/journal/patterns"><Sparkles size={14} aria-hidden="true" />{aiCopy.openPatterns}</Link>
            <Link to="/settings#ai-key-settings">{aiCopy.openSettings}</Link>
          </nav>
          <p>{copy.noRequest}</p>
        </div>
      ) : null}

      <button
        type="button"
        className="reflection-companion__trigger"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={copy.open}
      >
        <CompanionPet pet={preferences.companionPet} animation={ritual ? 'sleep' : animation} motion={motion && !ritual} />
        <span aria-hidden="true"><Sparkles size={13} /></span>
      </button>
    </aside>
  )
}
