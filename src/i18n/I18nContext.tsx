import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AmbientVolume, Locale, Preferences } from '../domain/types'
import { translations, type TranslationKey } from './translations'

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
    return { ...defaultPreferences, ...parsed, ambientVolume, music: ambientVolume > 0 }
  } catch {
    return defaultPreferences
  }
}

type I18nContextValue = {
  preferences: Preferences
  setPreferences: (next: Preferences) => void
  updatePreference: <Key extends keyof Preferences>(key: Key, value: Preferences[Key]) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(readPreferences)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    document.documentElement.lang = preferences.locale
    document.documentElement.dataset.theme = preferences.theme
    document.documentElement.dataset.reduceMotion = String(preferences.reduceMotion)
  }, [preferences])

  const value = useMemo<I18nContextValue>(() => ({
    preferences,
    setPreferences,
    updatePreference: (key, nextValue) => setPreferences((current) => ({ ...current, [key]: nextValue })),
    t: (key) => translations[preferences.locale][key],
  }), [preferences])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider.')
  return context
}

export const localeNames: Record<Locale, string> = { en: 'English', bg: 'Български', ru: 'Русский' }
