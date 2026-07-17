import { describe, expect, it } from 'vitest'
import { CONTENT_VERSION, HEXAGRAMS } from './hexagrams'
import type { Locale } from '../domain/types'

describe('generated Yi Canon content', () => {
  it('contains a complete versioned 64-card release', () => {
    expect(CONTENT_VERSION).toMatch(/^\d{4}\.\d{2}\.\d{2}/)
    expect(HEXAGRAMS.map((card) => card.id)).toEqual(Array.from({ length: 64 }, (_, index) => index + 1))
  })

  it.each(['en', 'bg', 'ru'] as Locale[])('has complete %s editorial content for every card', (locale) => {
    for (const card of HEXAGRAMS) {
      const editorial = card.editorial[locale]
      expect(editorial.title.length).toBeGreaterThan(2)
      expect(editorial.coreThread.length).toBeGreaterThan(40)
      expect(editorial.whenItAppears.length).toBeGreaterThan(40)
      expect(editorial.reflectionQuestions.length).toBeGreaterThanOrEqual(3)
      for (const line of ['1', '2', '3', '4', '5', '6']) {
        expect(editorial.lineReflections[line]?.length).toBeGreaterThan(20)
      }
    }
  })

  it('keeps classical and provenance layers on every card', () => {
    for (const card of HEXAGRAMS) {
      expect(card.classical.judgment.length).toBeGreaterThan(3)
      expect(card.classical.lines.length).toBeGreaterThanOrEqual(6)
      expect(card.provenance.classicalSource).toContain('Zhouyi')
      expect(card.provenance.contentType.length).toBeGreaterThan(10)
    }
  })
})
