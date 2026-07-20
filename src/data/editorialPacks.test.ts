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

  it('keeps the reviewed Spanish hexagram titles fixed', async () => {
    const pack = await loadEditorialPack('es')
    const expected = [
      'Qián — Fuerza creativa',
      'Kūn — Tierra receptiva',
      'Zhūn — Dificultad al comienzo',
      'Méng — Aprender en lo desconocido',
      'Xū — Esperar con confianza',
      'Sòng — Conflicto y límites',
      'Shī — Esfuerzo colectivo y disciplina',
      'Bǐ — Mantenerse unidos',
      'Xiǎo Chù — Pequeña contención',
      'Lǚ — Caminar con cuidado',
      'Tài — Fluidez',
      'Pǐ — Estancamiento',
      'Tóng Rén — Comunidad a cielo abierto',
      'Dà Yǒu — Gran posesión',
      'Qiān — Modestia',
      'Yù — Entusiasmo',
      'Suí — Seguir',
      'Gǔ — Reparar lo deteriorado',
      'Lín — Acercamiento',
      'Guān — Contemplación',
      'Shì Kè — Morder para abrir paso',
      'Bì — Gracia',
      'Bō — Despojo',
      'Fù — Retorno',
      'Wú Wàng — Inocencia',
      'Dà Chù — Gran contención',
      'Yí — Nutrición',
      'Dà Guò — Gran exceso',
      'Kǎn — El abismo',
      'Lí — La llama que se adhiere',
      'Xián — Influencia mutua',
      'Héng — Duración',
      'Dùn — Retirada',
      'Dà Zhuàng — Gran poder',
      'Jìn — Progreso',
      'Míng Yí — Oscurecimiento de la luz',
      'Jiā Rén — La familia',
      'Kuí — Oposición',
      'Jiǎn — Obstrucción',
      'Xiè — Liberación',
      'Sǔn — Disminución',
      'Yì — Aumento',
      'Guài — Ruptura decisiva',
      'Gòu — Encuentro',
      'Cuì — Reunión',
      'Shēng — Ascenso',
      'Kùn — Opresión',
      'Jǐng — El pozo',
      'Gé — Revolución',
      'Dǐng — El caldero',
      'Zhèn — El choque que despierta',
      'Gèn — Quietud',
      'Jiàn — Desarrollo gradual',
      'Guī Mèi — La doncella que se casa',
      'Fēng — Abundancia',
      'Lǚ — El viajero',
      'Xùn — Penetración suave',
      'Duì — Intercambio gozoso',
      'Huàn — Dispersión',
      'Jié — Limitación',
      'Zhōng Fú — Verdad interior',
      'Xiǎo Guò — Pequeño exceso',
      'Jì Jì — Ya concluido',
      'Wèi Jì — Antes de concluir',
    ]

    expect(Array.from({ length: 64 }, (_, index) => pack.cards.get(index + 1)?.title)).toEqual(expected)
  })
})
