export const SUPPORTED_LOCALES = ['en', 'bg', 'ru', 'de', 'it', 'fr', 'es', 'pt-PT', 'pl'] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const BUILT_IN_CONTENT_LOCALES = ['en', 'bg', 'ru'] as const satisfies readonly Locale[]
export type BuiltInContentLocale = (typeof BUILT_IN_CONTENT_LOCALES)[number]
export const EXTENDED_LOCALES = ['de', 'it', 'fr', 'es', 'pt-PT', 'pl'] as const satisfies readonly Exclude<Locale, BuiltInContentLocale>[]
export type ExtendedLocale = (typeof EXTENDED_LOCALES)[number]

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  bg: 'Български',
  ru: 'Русский',
  de: 'Deutsch',
  it: 'Italiano',
  fr: 'Français',
  es: 'Español',
  'pt-PT': 'Português',
  pl: 'Polski',
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

export function isBuiltInContentLocale(locale: Locale): locale is BuiltInContentLocale {
  return (BUILT_IN_CONTENT_LOCALES as readonly string[]).includes(locale)
}
