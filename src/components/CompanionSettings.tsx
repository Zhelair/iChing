import { Bot, Check, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useSound } from '../audio/SoundContext'
import type { CompanionPet as CompanionPetKind } from '../domain/types'
import { companionCopyFor } from '../i18n/companionCopy'
import { useI18n } from '../i18n/I18nContext'
import { companionLocalCopyFor } from '../i18n/companionLocalCopy'
import { CompanionPet, type CompanionAnimation } from './CompanionPet'

function animationFor(pet: CompanionPetKind, action: 0 | 1 | 2): CompanionAnimation {
  return pet === 'cat'
    ? (['cat-purr', 'cat-treat', 'cat-paw'] as const)[action]
    : (['dog-greet', 'dog-fetch', 'dog-belly'] as const)[action]
}

function StudioToggle({ checked, onChange, label, body }: { checked: boolean; onChange: (value: boolean) => void; label: string; body: string }) {
  return <label className="companion-studio__toggle">
    <span><strong>{label}</strong><small>{body}</small></span>
    <input type="checkbox" role="switch" className="sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    <i className={checked ? 'is-on' : ''} aria-hidden="true"><span /></i>
  </label>
}

export function CompanionSettings() {
  const { preferences, updatePreference } = useI18n()
  const { playPetSound } = useSound()
  const copy = companionCopyFor(preferences.locale)
  const localCopy = companionLocalCopyFor(preferences.locale)
  const [animation, setAnimation] = useState<CompanionAnimation>('idle')
  const [animationRun, setAnimationRun] = useState(0)
  const resetTimer = useRef<number | null>(null)
  const motion = preferences.petMotion && !preferences.reduceMotion

  useEffect(() => () => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current)
  }, [])

  const interact = (action: 0 | 1 | 2) => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current)
    setAnimation(motion ? animationFor(preferences.companionPet, action) : 'idle')
    setAnimationRun((current) => current + 1)
    void playPetSound(preferences.companionPet, action)
    resetTimer.current = window.setTimeout(() => setAnimation('idle'), motion ? 2600 : 350)
  }

  return (
    <section className="surface companion-studio mt-5" aria-labelledby="companion-studio-title">
      <header className="companion-studio__header">
        <span><Bot size={23} aria-hidden="true" /></span>
        <div><p className="eyebrow">{copy.eyebrow}</p><h2 id="companion-studio-title">{copy.title}</h2><p>{copy.body}</p></div>
      </header>

      <StudioToggle
        checked={preferences.companionEnabled}
        onChange={(value) => updatePreference('companionEnabled', value)}
        label={copy.enable}
        body={copy.enableBody}
      />

      <div className={`companion-studio__body ${preferences.companionEnabled ? '' : 'is-disabled'}`} aria-disabled={!preferences.companionEnabled}>
        <div className="companion-studio__preview">
          <div className="companion-studio__stage">
            <span className="companion-studio__halo" aria-hidden="true" />
            <CompanionPet
              key={`${preferences.companionPet}-${animation}-${animationRun}`}
              pet={preferences.companionPet}
              animation={animation}
              motion={motion}
              title={preferences.companionPet === 'cat' ? copy.cat : copy.dog}
            />
          </div>
          <p><Sparkles size={14} aria-hidden="true" /> {copy.interact}</p>
          <div className="companion-studio__actions">
            {copy.actions[preferences.companionPet].map((label, index) => <button key={label} type="button" disabled={!preferences.companionEnabled} onClick={() => interact(index as 0 | 1 | 2)}>{label}</button>)}
          </div>
        </div>

        <div className="companion-studio__controls">
          <fieldset disabled={!preferences.companionEnabled}>
            <legend>{copy.choose}</legend>
            <div className="companion-studio__pet-options">
              {(['cat', 'dog'] as const).map((pet) => <label key={pet} className={preferences.companionPet === pet ? 'is-selected' : ''}>
                <input type="radio" name="companion-pet" className="sr-only" checked={preferences.companionPet === pet} onChange={() => { updatePreference('companionPet', pet); setAnimation('idle') }} />
                <span><CompanionPet pet={pet} motion={false} /></span>
                <strong>{pet === 'cat' ? copy.cat : copy.dog}</strong>
                {preferences.companionPet === pet ? <Check size={15} aria-hidden="true" /> : null}
              </label>)}
            </div>
          </fieldset>

          <fieldset disabled={!preferences.companionEnabled}>
            <legend>{copy.size}</legend>
            <div className="companion-studio__size-options">
              {(['normal', 'large'] as const).map((size) => <label key={size} className={preferences.companionSize === size ? 'is-selected' : ''}>
                <input type="radio" name="companion-size" checked={preferences.companionSize === size} onChange={() => updatePreference('companionSize', size)} />
                <span>{size === 'normal' ? copy.normal : copy.large}</span>
              </label>)}
            </div>
          </fieldset>

          <StudioToggle checked={preferences.petMotion} onChange={(value) => updatePreference('petMotion', value)} label={copy.motion} body={copy.motionBody} />
          <StudioToggle checked={preferences.petSound} onChange={(value) => updatePreference('petSound', value)} label={copy.sounds} body={copy.soundsBody} />
          <div className="companion-studio__routine">
            <strong>{localCopy.routineTitle}</strong>
            <ul>{localCopy.routine.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </div>

      <footer><ShieldCheck size={18} aria-hidden="true" /><p><strong>{copy.privacy}</strong><span>{copy.privacyBody}</span></p></footer>
    </section>
  )
}
