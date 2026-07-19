import { ArrowRight, BookOpen, HeartHandshake, Languages, LockKeyhole, Settings2 } from 'lucide-react'
import { useMemo, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { HexagramFigure } from '../components/HexagramFigure'
import { getDailyHomeHexagrams } from '../data/homeFeature'
import type { Locale } from '../domain/types'
import { useI18n } from '../i18n/I18nContext'

const preferencesCopy: Record<Locale, { title: string; body: string; settings: string; support: string }> = {
  en: {
    title: 'Make the practice yours',
    body: 'English · Български · Русский. Choose a visual atmosphere, motion, and optional sound in Settings. Support is always optional too.',
    settings: 'Open Settings',
    support: 'Feedback & support',
  },
  bg: {
    title: 'Настройте практиката по свой начин',
    body: 'English · Български · Русский. Изберете визуална атмосфера, движение и звук по желание в Настройки. Подкрепата също винаги е по желание.',
    settings: 'Отвори Настройки',
    support: 'Обратна връзка и подкрепа',
  },
  ru: {
    title: 'Настройте практику под себя',
    body: 'English · Български · Русский. Выберите визуальную атмосферу, движение и необязательный звук в Настройках. Поддержка тоже всегда добровольна.',
    settings: 'Открыть Настройки',
    support: 'Обратная связь и поддержка',
  },
}

export function HomePage() {
  const { preferences, t } = useI18n()
  const welcome = preferencesCopy[preferences.locale]
  const featured = useMemo(() => getDailyHomeHexagrams(), [])
  const [primary, ...companions] = featured
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
          <aside className="home-preferences mt-5" aria-labelledby="home-preferences-title">
            <span className="home-preferences__icon"><Languages size={20} aria-hidden="true" /></span>
            <div>
              <p id="home-preferences-title" className="font-bold text-[var(--ink)]">{welcome.title}</p>
              <p className="mt-1 text-xs leading-5 text-[var(--ink-soft)]">{welcome.body}</p>
              <div className="home-preferences__links mt-3">
                <Link to="/settings"><Settings2 size={15} aria-hidden="true" /> {welcome.settings}</Link>
                <Link to="/support"><HeartHandshake size={15} aria-hidden="true" /> {welcome.support}</Link>
              </div>
            </div>
          </aside>
        </div>

        <div ref={objectRef} className="home-object mx-auto w-full max-w-[31rem]" onPointerMove={moveObject} onPointerLeave={resetObject}>
          <span className="home-object__shadow" aria-hidden="true" />
          <div className="surface home-object__card flex min-h-[31rem] flex-col items-center justify-between overflow-hidden p-8 text-center sm:p-10">
            <span className="home-object__light" aria-hidden="true" />
            <div className="home-object__meta flex w-full items-center justify-between text-xs font-bold uppercase tracking-[.16em] text-[var(--ink-soft)]">
              <span>{String(primary.id).padStart(2, '0')}</span><span>{primary.chinese}</span>
            </div>
            <div className="home-object__hexagram"><HexagramFigure linesBottomUp={primary.linesBottomUp} label={primary.editorial[preferences.locale].title} className="text-[var(--obsidian)]" /></div>
            <div className="home-object__copy">
              <p className="font-editorial text-3xl">{primary.editorial[preferences.locale].title}</p>
              <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-[var(--ink-soft)]">{t('home.promise')}</p>
            </div>
          </div>
          <div className="home-companions" aria-label={preferences.locale === 'ru' ? 'Ещё два образа дня' : preferences.locale === 'bg' ? 'Още два образа за деня' : 'Two more images for today'}>
            {companions.map((hexagram, index) => (
              <Link key={hexagram.id} to={`/hexagrams/${hexagram.id}`} aria-label={`${hexagram.id}. ${hexagram.editorial[preferences.locale].title}`} className="home-companion" style={{ '--companion-delay': `${160 + index * 90}ms` } as CSSProperties}>
                <HexagramFigure linesBottomUp={hexagram.linesBottomUp} label={hexagram.editorial[preferences.locale].title} className="home-companion__figure text-[var(--obsidian)]" />
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
