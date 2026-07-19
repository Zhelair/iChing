import { isBuiltInContentLocale, type ExtendedLocale, type Locale } from '../domain/locales'
import type { Hexagram, LocalizedEditorial } from './hexagrams'

type LocaleCard = LocalizedEditorial & { id: number }

export type EditorialLocalePack = {
  locale: ExtendedLocale
  variant: string
  status: string
  sourceLocale: 'en'
  cards: LocaleCard[]
}

export type LoadedEditorialPack = Pick<EditorialLocalePack, 'locale' | 'variant' | 'status' | 'sourceLocale'> & {
  cards: Map<number, LocalizedEditorial>
}

const packModules = import.meta.glob('../../content/locales/*.json', {
  eager: false,
  import: 'default',
}) as Record<string, () => Promise<unknown>>

const packCache = new Map<ExtendedLocale, LoadedEditorialPack>()
const expectedVariants: Record<ExtendedLocale, string> = {
  de: 'de-DE',
  it: 'it-IT',
  fr: 'fr-FR',
  es: 'es-ES',
  'pt-PT': 'pt-PT',
  pl: 'pl-PL',
}
const EXTENDED_PACK_STATUS = 'ai-assisted-editorial-draft-needs-native-review'

function validateCard(value: unknown, expectedId: number): value is LocaleCard {
  if (!value || typeof value !== 'object') return false
  const card = value as Partial<LocaleCard>
  return card.id === expectedId
    && typeof card.title === 'string'
    && card.title.trim().length > 2
    && typeof card.coreThread === 'string'
    && card.coreThread.trim().length > 40
    && typeof card.whenItAppears === 'string'
    && card.whenItAppears.trim().length > 40
    && Array.isArray(card.reflectionQuestions)
    && card.reflectionQuestions.length >= 3
    && card.reflectionQuestions.every((question) => typeof question === 'string' && question.trim().length > 8)
    && Boolean(card.lineReflections)
    && ['1', '2', '3', '4', '5', '6'].every((line) => typeof card.lineReflections?.[line] === 'string' && card.lineReflections[line].trim().length > 20)
    && ((expectedId !== 1 && expectedId !== 2) || (typeof card.lineReflections?.all === 'string' && card.lineReflections.all.trim().length > 20))
}

function validatePack(value: unknown, locale: ExtendedLocale): value is EditorialLocalePack {
  if (!value || typeof value !== 'object') return false
  const pack = value as Partial<EditorialLocalePack>
  return pack.locale === locale
    && pack.sourceLocale === 'en'
    && pack.variant === expectedVariants[locale]
    && pack.status === EXTENDED_PACK_STATUS
    && Array.isArray(pack.cards)
    && pack.cards.length === 64
    && pack.cards.every((card, index) => validateCard(card, index + 1))
}

export async function loadEditorialPack(locale: ExtendedLocale): Promise<LoadedEditorialPack> {
  const cached = packCache.get(locale)
  if (cached) return cached

  const path = `../../content/locales/${locale}.json`
  const loader = packModules[path]
  if (!loader) throw new Error(`Missing editorial locale pack: ${locale}`)

  const value = await loader()
  if (!validatePack(value, locale)) throw new Error(`Invalid editorial locale pack: ${locale}`)

  const loaded: LoadedEditorialPack = {
    locale: value.locale,
    variant: value.variant,
    status: value.status,
    sourceLocale: value.sourceLocale,
    cards: new Map(value.cards.map(({ id, ...editorial }) => [id, editorial])),
  }
  packCache.set(locale, loaded)
  return loaded
}

export function preloadEditorialPack(locale: ExtendedLocale) {
  void loadEditorialPack(locale)
}

export async function resolveEditorial(locale: Locale, hexagram: Hexagram): Promise<LocalizedEditorial> {
  if (isBuiltInContentLocale(locale)) return hexagram.editorial[locale]
  const pack = await loadEditorialPack(locale)
  return pack.cards.get(hexagram.id) ?? hexagram.editorial.en
}
