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

  it('keeps the Portuguese hexagram names fully localized', async () => {
    const pack = await loadEditorialPack('pt-PT')
    const expected = [
      'Gé — A revolução',
      'Dǐng — O caldeirão',
      'Zhèn — O incitar',
      'Gèn — A quietude',
      'Jiàn — O desenvolvimento gradual',
      'Guī Mèi — A jovem que se casa',
      'Fēng — A abundância',
      'Lǚ — O viajante',
      'Xùn — A suavidade penetrante',
      'Duì — A alegria',
      'Huàn — A dispersão',
      'Jié — A limitação',
      'Zhōng Fú — A verdade interior',
      'Xiǎo Guò — A preponderância do pequeno',
      'Jì Jì — Após a conclusão',
      'Wèi Jì — Antes da conclusão',
    ]

    expect(Array.from({ length: 16 }, (_, index) => pack.cards.get(index + 49)?.title)).toEqual(expected)
  })
})
