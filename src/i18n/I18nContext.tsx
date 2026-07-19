import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadEditorialPack, type LoadedEditorialPack } from '../data/editorialPacks'
import type { Hexagram, LocalizedEditorial } from '../data/hexagrams'
import { isBuiltInContentLocale, isLocale, LOCALE_NAMES, type ExtendedLocale } from '../domain/locales'
import type { AmbientVolume, Locale, Preferences } from '../domain/types'
import { translationsFor, type TranslationKey } from './translations'
import { getUiLocalePack } from './uiLocalePacks'

const STORAGE_KEY = 'yi-path:preferences:v1'
const defaultPreferences: Preferences = {
  locale: 'en',
  theme: 'bamboo-mist',
  sound: true,
  music: true,
  ambientVolume: 1,
  reduceMotion: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
}

function readPreferences(): Preferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultPreferences
    const parsed = JSON.parse(stored) as Partial<Preferences>
    const ambientVolume: AmbientVolume = parsed.ambientVolume === 0.5 || parsed.ambientVolume === 1
      ? parsed.ambientVolume
      : parsed.music ? 0.5 : 0
    return {
      ...defaultPreferences,
      ...parsed,
      locale: isLocale(parsed.locale) ? parsed.locale : defaultPreferences.locale,
      theme: parsed.theme === 'daylight' || parsed.theme === 'ink-night' || parsed.theme === 'bamboo-mist' ? parsed.theme : defaultPreferences.theme,
      sound: typeof parsed.sound === 'boolean' ? parsed.sound : defaultPreferences.sound,
      reduceMotion: typeof parsed.reduceMotion === 'boolean' ? parsed.reduceMotion : defaultPreferences.reduceMotion,
      ambientVolume,
      music: ambientVolume > 0,
    }
  } catch {
    return defaultPreferences
  }
}

type I18nContextValue = {
  preferences: Preferences
  setPreferences: (next: Preferences) => void
  updatePreference: <Key extends keyof Preferences>(key: Key, value: Preferences[Key]) => void
  setLocale: (locale: Locale) => Promise<void>
  pendingLocale: Locale | null
  localeError: boolean
  editorialFor: (hexagram: Hexagram) => LocalizedEditorial
  editorialMetaFor: (hexagram: Hexagram) => { status: string; variant: string; sourceLocale: string }
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(readPreferences)
  const [editorialPack, setEditorialPack] = useState<LoadedEditorialPack | null>(null)
  const [editorialLocale, setEditorialLocale] = useState<ExtendedLocale | null>(null)
  const [pendingLocale, setPendingLocale] = useState<Locale | null>(null)
  const [localeError, setLocaleError] = useState(false)
  const [initializingContent, setInitializingContent] = useState(() => !isBuiltInContentLocale(preferences.locale))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    document.documentElement.lang = preferences.locale
    document.documentElement.dataset.theme = preferences.theme
    document.documentElement.dataset.reduceMotion = String(preferences.reduceMotion)
  }, [preferences])

  useEffect(() => {
    if (isBuiltInContentLocale(preferences.locale) || editorialLocale === preferences.locale) {
      setInitializingContent(false)
      return
    }

    let cancelled = false
    setInitializingContent(true)
    try {
      getUiLocalePack(preferences.locale)
    } catch (error: unknown) {
      console.error(error)
      setLocaleError(true)
      setPreferences((current) => ({ ...current, locale: 'en' }))
      setInitializingContent(false)
      return
    }
    void loadEditorialPack(preferences.locale).then((pack) => {
      if (cancelled) return
      setEditorialPack(pack)
      setEditorialLocale(preferences.locale as ExtendedLocale)
      setInitializingContent(false)
    }).catch((error: unknown) => {
      if (cancelled) return
      console.error(error)
      setLocaleError(true)
      setPreferences((current) => ({ ...current, locale: 'en' }))
      setInitializingContent(false)
    })
    return () => { cancelled = true }
  }, [editorialLocale, preferences.locale])

  const value = useMemo<I18nContextValue>(() => {
    const activeTranslations = translationsFor(preferences.locale)
    return {
      preferences,
      setPreferences,
      updatePreference: (key, nextValue) => setPreferences((current) => ({ ...current, [key]: nextValue })),
      setLocale: async (locale) => {
        if (locale === preferences.locale) return
        setPendingLocale(locale)
        setLocaleError(false)
        try {
          if (!isBuiltInContentLocale(locale)) {
            getUiLocalePack(locale)
            const pack = await loadEditorialPack(locale)
            setEditorialPack(pack)
            setEditorialLocale(locale)
          }
          setPreferences((current) => ({ ...current, locale }))
        } catch (error: unknown) {
          console.error(error)
          setLocaleError(true)
        } finally {
          setPendingLocale(null)
        }
      },
      pendingLocale,
      localeError,
      editorialFor: (hexagram) => {
        if (isBuiltInContentLocale(preferences.locale)) return hexagram.editorial[preferences.locale]
        return editorialLocale === preferences.locale
          ? editorialPack?.cards.get(hexagram.id) ?? hexagram.editorial.en
          : hexagram.editorial.en
      },
      editorialMetaFor: (hexagram) => {
        if (isBuiltInContentLocale(preferences.locale)) {
          return { status: hexagram.provenance.status, variant: preferences.locale, sourceLocale: preferences.locale }
        }
        return editorialLocale === preferences.locale && editorialPack
          ? { status: editorialPack.status, variant: editorialPack.variant, sourceLocale: editorialPack.sourceLocale }
          : { status: 'fallback-editorial', variant: 'en', sourceLocale: 'en' }
      },
      t: (key) => activeTranslations[key],
    }
  }, [editorialLocale, editorialPack, localeError, pendingLocale, preferences])

  if (initializingContent) {
    const label = translationsFor(preferences.locale)['common.loading']
    return <div className="grid min-h-dvh place-items-center bg-[var(--paper)] text-[var(--ink)]" role="status"><span className="route-loading"><span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" /> {label}</span></div>
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider.')
  return context
}

export const localeNames = LOCALE_NAMES
