import { BookOpen, Compass, HeartHandshake, House, NotebookPen, Settings } from 'lucide-react'
import { Suspense, useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n/I18nContext'
import { Atmosphere } from './Atmosphere'
import { ReflectionCompanion } from './ReflectionCompanion'
import { DAO_COPY } from '../data/daoContent'

const navItems = [
  { to: '/', key: 'nav.home', icon: House, end: true, desktopOnly: false },
  { to: '/journal', key: 'nav.journal', icon: NotebookPen, end: false, desktopOnly: false },
  { to: '/iching', key: 'iching', icon: BookOpen, end: false, desktopOnly: false },
  { to: '/dao', key: 'dao', icon: Compass, end: false, desktopOnly: false },
  { to: '/settings', key: 'nav.settings', icon: Settings, end: false, desktopOnly: false },
  { to: '/support', key: 'nav.support', icon: HeartHandshake, end: false, desktopOnly: true },
] as const

export function AppLayout() {
  const { preferences, t } = useI18n()
  const daoCopy = DAO_COPY[preferences.locale]
  const { pathname } = useLocation()
  const frameRef = useRef<HTMLDivElement>(null)
  const ritualMode = pathname.startsWith('/cast/')
  const scene = pathname === '/'
    ? 'home'
    : pathname === '/iching/reading' || ritualMode
      ? 'ritual'
        : pathname === '/result' || pathname.startsWith('/journal')
        ? 'reflection'
        : pathname.startsWith('/iching') || pathname === '/learn' || pathname === '/start' || pathname === '/library' || pathname.startsWith('/hexagrams/') || pathname.startsWith('/dao')
          ? 'study'
          : pathname === '/settings' || pathname === '/support'
            ? 'quiet'
            : 'default'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const reset = () => {
      frame.style.setProperty('--far-x', '0px')
      frame.style.setProperty('--far-y', '0px')
      frame.style.setProperty('--mid-x', '0px')
      frame.style.setProperty('--mid-y', '0px')
      frame.style.setProperty('--near-x', '0px')
      frame.style.setProperty('--near-y', '0px')
      frame.style.setProperty('--field-light-x', '72%')
      frame.style.setProperty('--field-light-y', '18%')
    }

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const systemReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || systemReduced || preferences.reduceMotion) {
      reset()
      return
    }

    let animationFrame = 0
    let pointerX = window.innerWidth * .72
    let pointerY = window.innerHeight * .18

    const paint = () => {
      animationFrame = 0
      const normalizedX = pointerX / Math.max(window.innerWidth, 1) - .5
      const normalizedY = pointerY / Math.max(window.innerHeight, 1) - .5
      frame.style.setProperty('--far-x', `${normalizedX * -12}px`)
      frame.style.setProperty('--far-y', `${normalizedY * -9}px`)
      frame.style.setProperty('--mid-x', `${normalizedX * -24}px`)
      frame.style.setProperty('--mid-y', `${normalizedY * -18}px`)
      frame.style.setProperty('--near-x', `${normalizedX * -38}px`)
      frame.style.setProperty('--near-y', `${normalizedY * -28}px`)
      frame.style.setProperty('--field-light-x', `${pointerX / Math.max(window.innerWidth, 1) * 100}%`)
      frame.style.setProperty('--field-light-y', `${pointerY / Math.max(window.innerHeight, 1) * 100}%`)
    }

    const handlePointer = (event: PointerEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY
      if (!animationFrame) animationFrame = window.requestAnimationFrame(paint)
    }

    window.addEventListener('pointermove', handlePointer, { passive: true })
    window.addEventListener('blur', reset)
    document.documentElement.addEventListener('mouseleave', reset)
    return () => {
      window.removeEventListener('pointermove', handlePointer)
      window.removeEventListener('blur', reset)
      document.documentElement.removeEventListener('mouseleave', reset)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      reset()
    }
  }, [preferences.reduceMotion])

  return (
    <div ref={frameRef} className={`app-frame relative isolate min-h-screen overflow-x-clip ${ritualMode ? 'pb-6' : 'app-frame--with-mobile-nav'}`} data-scene={scene} data-locale={preferences.locale}>
      <Atmosphere />
      <a href="#main" className="skip-link fixed left-3 top-3 z-50 -translate-y-24 rounded-full bg-[var(--obsidian)] px-4 py-3 text-white focus:translate-y-0">{t('common.skip')}</a>
      <header className="site-header page-shell relative z-20 flex h-[4.5rem] items-center justify-between border-b border-black/8 sm:h-20">
        <NavLink to="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label={t('nav.homeLabel')}>
          <span className="brand-mark grid size-9 shrink-0 place-items-center rounded-full border border-[var(--brass)]/45 bg-white/45 font-editorial text-lg text-[var(--jade)] sm:size-10 sm:text-xl">易</span>
          <span className="min-w-0">
            <span className="block font-editorial text-lg font-semibold leading-none">Yi Path</span>
            <span className="mt-0.5 block max-w-[15rem] text-[.6rem] leading-tight text-[var(--ink-soft)] sm:mt-1 sm:max-w-none sm:text-[.65rem]">{t('brand.tagline')}</span>
          </span>
        </NavLink>
        <nav className="hidden items-center gap-1 lg:flex" aria-label={t('nav.primaryLabel')}>
          {navItems.map(({ to, key, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `min-h-11 rounded-full px-4 py-3 text-sm font-semibold transition-colors ${isActive ? 'bg-[var(--jade-light)] text-[var(--jade)]' : 'text-[var(--ink-soft)] hover:bg-white/55 hover:text-[var(--ink)]'}`}>
              {key === 'iching' ? daoCopy.navIChing : key === 'dao' ? daoCopy.navDao : t(key)}
            </NavLink>
          ))}
        </nav>
      </header>

      <main id="main" className="relative z-10">
        <Suspense fallback={<div className="page-shell py-16" role="status"><div className="route-loading"><span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" /> {t('common.loading')}</div></div>}>
          <div key={pathname} className="route-view"><Outlet /></div>
        </Suspense>
      </main>

      <ReflectionCompanion />

      {!ritualMode ? <nav className="mobile-navigation fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-[1.35rem] border border-white/20 bg-[var(--obsidian)] p-1.5 text-white shadow-2xl lg:hidden" aria-label={t('nav.primaryLabel')}>
        {navItems.filter(({ desktopOnly }) => !desktopOnly).map(({ to, key, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[.65rem] font-semibold ${isActive ? 'bg-white/13 text-[#f4dfaa]' : 'text-white/68'}`}>
            <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
            <span className="mobile-navigation__label" lang={preferences.locale}>{key === 'iching' ? daoCopy.navIChing : key === 'dao' ? daoCopy.navDao : t(key)}</span>
          </NavLink>
        ))}
      </nav> : null}
    </div>
  )
}
