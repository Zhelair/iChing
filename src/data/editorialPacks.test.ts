import { describe, expect, it } from 'vitest'
import { EXTENDED_LOCALES } from '../domain/locales'
import { loadEditorialPack } from './editorialPacks'

describe('extended editorial locale packs', () => {
  it.each(EXTENDED_LOCALES)('loads a complete validated %s pack', async (locale) => {
    const pack = await loadEditorialPack(locale)
    expect(pack.locale).toBe(locale)
    expect(pack.status).toBe('ai-assisted-editorial-draft-needs-native-review')
    expect(pack.sourceLocale).toBe('en')
    expect([...pack.cards.keys()]).toEqual(Array.from({ length: 64 }, (_, index) => index + 1))
    expect(pack.cards.get(1)?.lineReflections.all?.length).toBeGreaterThan(20)
    expect(pack.cards.get(2)?.lineReflections.all?.length).toBeGreaterThan(20)
  })
})
