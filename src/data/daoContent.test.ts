import { describe, expect, it } from 'vitest'
import { SUPPORTED_LOCALES } from '../domain/locales'
import { DAO_COPY } from './daoContent'
import { DAO_LEARNING_COPY } from './daoLearningContent'
import { DAO_LIVING_COPY } from './daoLivingContent'
import { DAO_ORIENTATION_COPY } from './daoOrientationContent'
import { DAO_PRACTICE_DETAIL_COPY } from './daoPracticeContent'
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

  it('has a localized learning map and practice library for every locale', () => {
    expect(Object.keys(DAO_LEARNING_COPY).sort()).toEqual([...SUPPORTED_LOCALES].sort())
    for (const locale of SUPPORTED_LOCALES) {
      const copy = DAO_LEARNING_COPY[locale]
      expect(copy.orientationTopics).toHaveLength(6)
      expect(copy.orientationTopics.every((topic) => topic.trim().length > 0)).toBe(true)
      expect(Object.entries(copy).every(([, value]) => Array.isArray(value) || (typeof value === 'string' && value.trim().length > 0))).toBe(true)
    }
  })

  it('has six sourced orientation lessons in every locale', () => {
    expect(Object.keys(DAO_ORIENTATION_COPY).sort()).toEqual([...SUPPORTED_LOCALES].sort())
    for (const locale of SUPPORTED_LOCALES) {
      const copy = DAO_ORIENTATION_COPY[locale]
      expect(copy.lessons).toHaveLength(6)
      expect(copy.lessons.every((lesson) => lesson.body.length > 250 && lesson.distinction.trim() && lesson.reflection.trim() && lesson.sourceUrl.startsWith('https://'))).toBe(true)
    }
  })

  it('localizes the two guided practices and five living contexts', () => {
    expect(Object.keys(DAO_PRACTICE_DETAIL_COPY).sort()).toEqual([...SUPPORTED_LOCALES].sort())
    expect(Object.keys(DAO_LIVING_COPY).sort()).toEqual([...SUPPORTED_LOCALES].sort())
    for (const locale of SUPPORTED_LOCALES) {
      expect(DAO_PRACTICE_DETAIL_COPY[locale].breathStages).toHaveLength(3)
      expect(DAO_PRACTICE_DETAIL_COPY[locale].openStages).toHaveLength(3)
      const living = DAO_LIVING_COPY[locale]
      expect(living.contexts).toHaveLength(5)
      expect(living.contexts.every((context) => context.prompts.length === 4 && context.prompts.every((prompt) => prompt.trim().length > 20))).toBe(true)
    }
  })
})
