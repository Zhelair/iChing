import type { ExtendedLocale } from '../domain/locales'
import type { UiLocalePack } from './uiLocalePackTypes'

const uiPackModules = import.meta.glob('./locales/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

const expectedVariants: Record<ExtendedLocale, string> = {
  de: 'de-DE',
  it: 'it-IT',
  fr: 'fr-FR',
  es: 'es-ES',
  'pt-PT': 'pt-PT',
  pl: 'pl-PL',
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return Boolean(value)
    && typeof value === 'object'
    && Object.values(value as Record<string, unknown>).every((entry) => typeof entry === 'string' && entry.trim().length > 0)
}

function validateUiPack(value: unknown, locale: ExtendedLocale): value is UiLocalePack {
  if (!value || typeof value !== 'object') return false
  const pack = value as Partial<UiLocalePack>
  const features = pack.features as Partial<UiLocalePack['features']> | undefined
  return pack.locale === locale
    && pack.variant === expectedVariants[locale]
    && pack.status === 'ai-assisted-ui-draft-needs-native-review'
    && isStringRecord(pack.translations)
    && Boolean(features)
    && Boolean(features?.history)
    && Array.isArray(features?.history?.chapters)
    && features.history.chapters.length === 7
    && isStringRecord(features?.journal)
    && isStringRecord(features?.support)
    && isStringRecord(features?.settingsPrivacy)
    && isStringRecord(features?.settingsSupport)
    && Array.isArray(features?.ambientLevels)
    && features.ambientLevels.length === 3
    && features.ambientLevels.every((entry) => typeof entry === 'string' && entry.length > 0)
    && isStringRecord(features?.exportActions)
    && Boolean(features?.exportDocument)
}

const cache = new Map<ExtendedLocale, UiLocalePack>()

export function getUiLocalePack(locale: ExtendedLocale): UiLocalePack {
  const cached = cache.get(locale)
  if (cached) return cached

  const value = uiPackModules[`./locales/${locale}.json`]
  if (!validateUiPack(value, locale)) throw new Error(`Invalid UI locale pack: ${locale}`)
  cache.set(locale, value)
  return value
}
