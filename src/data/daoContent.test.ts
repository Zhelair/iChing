import { describe, expect, it } from 'vitest'
import { SUPPORTED_LOCALES } from '../domain/locales'
import { DAO_COPY } from './daoContent'
import { DAO_SHELL_COPY } from './daoShellContent'

describe('Dao localized content', () => {
  it('has a complete, non-empty pack for every supported locale', () => {
    expect(Object.keys(DAO_COPY).sort()).toEqual([...SUPPORTED_LOCALES].sort())
    for (const locale of SUPPORTED_LOCALES) {
      const copy = DAO_COPY[locale]
      expect(copy.navIChing.trim()).not.toBe('')
      expect(copy.navDao.trim()).not.toBe('')
      expect(copy.passages).toHaveLength(3)
      expect(copy.passages.map(({ id }) => id)).toEqual(['water', 'softness', 'daily'])
      expect(Object.entries(copy).every(([, value]) => Array.isArray(value) || (typeof value === 'string' && value.trim().length > 0))).toBe(true)
      expect(copy.passages.every(({ title, body }) => title.trim().length > 0 && body.trim().length > 80)).toBe(true)
    }
  })

  it('keeps navigation labels short enough for the five-item phone bar', () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(DAO_COPY[locale].navIChing.length).toBeLessThanOrEqual(8)
      expect(DAO_COPY[locale].navDao.length).toBeLessThanOrEqual(4)
    }
  })

  it('has complete localized navigation, status, source, and provenance copy', () => {
    expect(Object.keys(DAO_SHELL_COPY).sort()).toEqual([...SUPPORTED_LOCALES].sort())
    for (const locale of SUPPORTED_LOCALES) {
      expect(Object.values(DAO_SHELL_COPY[locale]).every((value) => value.trim().length > 0)).toBe(true)
    }
  })
})
