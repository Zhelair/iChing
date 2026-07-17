import { ArrowRight, BookOpen, LockKeyhole } from 'lucide-react'
import { useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { HexagramFigure } from '../components/HexagramFigure'
import { HOME_HEXAGRAM } from '../data/homeFeature'
import { useI18n } from '../i18n/I18nContext'

export function HomePage() {
  const { preferences, t } = useI18n()
  const objectRef = useRef<HTMLDivElement>(null)

  function moveObject(event: ReactPointerEvent<HTMLDivElement>) {
    if (preferences.reduceMotion || event.pointerType === 'touch') return
    const object = objectRef.current
    if (!object) return
    const bounds = object.getBoundingClientRect()
    const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width))
    const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height))
    object.style.setProperty('--card-rx', `${(.5 - y) * 4}deg`)
    object.style.setProperty('--card-ry', `${(x - .5) * 5}deg`)
    object.style.setProperty('--card-light-x', `${x * 100}%`)
    object.style.setProperty('--card-light-y', `${y * 100}%`)
    object.style.setProperty('--shadow-x', `${(.5 - x) * 12}px`)
    object.style.setProperty('--shadow-y', `${8 + (.5 - y) * 8}px`)
  }

  function resetObject() {
    const object = objectRef.current
    if (!object) return
    object.style.setProperty('--card-rx', '0deg')
    object.style.setProperty('--card-ry', '0deg')
    object.style.setProperty('--card-light-x', '50%')
    object.style.setProperty('--card-light-y', '28%')
    object.style.setProperty('--shadow-x', '0px')
    object.style.setProperty('--shadow-y', '12px')
  }

  return (
    <div className="page-shell py-10 sm:py-16 lg:py-20">
      <section className="grid items-center gap-12 lg:grid-cols-[1.12fr_.88fr] lg:gap-16">
        <div>
          <p className="eyebrow mb-6">{t('home.eyebrow')}</p>
          <h1 className="home-title max-w-3xl font-medium leading-[.94] tracking-[-.052em]">{t('home.title')}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">{t('home.body')}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/reading" className="button-primary">
              {t('home.start')} <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link to="/start" className="button-secondary">
              <BookOpen size={18} aria-hidden="true" /> {t('home.guide')}
            </Link>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-[var(--ink-soft)]"><LockKeyhole size={16} aria-hidden="true" /> {t('home.privacy')}</p>
        </div>

        <div ref={objectRef} className="home-object mx-auto w-full max-w-[28rem]" onPointerMove={moveObject} onPointerLeave={resetObject}>
          <span className="home-object__shadow" aria-hidden="true" />
          <div className="surface home-object__card flex min-h-[31rem] flex-col items-center justify-between overflow-hidden p-8 text-center sm:p-10">
            <span className="home-object__light" aria-hidden="true" />
            <div className="home-object__meta flex w-full items-center justify-between text-xs font-bold uppercase tracking-[.16em] text-[var(--ink-soft)]">
              <span>{HOME_HEXAGRAM.id}</span><span>{HOME_HEXAGRAM.chinese}</span>
            </div>
            <div className="home-object__hexagram"><HexagramFigure linesBottomUp={HOME_HEXAGRAM.linesBottomUp} label={t('home.featuredTitle')} className="text-[var(--obsidian)]" /></div>
            <div className="home-object__copy">
              <p className="font-editorial text-3xl">{t('home.featuredTitle')}</p>
              <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-[var(--ink-soft)]">{t('home.promise')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
