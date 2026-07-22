import { describe, expect, it } from 'vitest'
import { SUPPORTED_LOCALES } from '../domain/locales'
import { aiCopyFor, AI_COPY_STATUS } from './aiCopy'
import { companionCopyFor, companionCopyStatus } from './companionCopy'
import { beadCopyFor, beadCopyStatus } from './featureCopy'

describe('new feature locale contracts', () => {
  it.each(SUPPORTED_LOCALES)('has complete bead, companion, and AI copy for %s', (locale) => {
    const bead = beadCopyFor(locale)
    const companion = companionCopyFor(locale)
    const ai = aiCopyFor(locale)
    expect(Object.values(bead).flatMap((value) => Array.isArray(value) ? value : [value]).every(Boolean)).toBe(true)
    expect(companion.actions.cat).toHaveLength(3)
    expect(companion.actions.dog).toHaveLength(3)
    expect(Object.values(ai).every(Boolean)).toBe(true)
    expect(beadCopyStatus(locale)).toBe(locale === 'en' ? 'source-authored' : 'ai-assisted-ui-draft-needs-native-review')
    expect(companionCopyStatus(locale)).toBe(locale === 'en' ? 'source-authored' : 'ai-assisted-ui-draft-needs-native-review')
    expect(AI_COPY_STATUS[locale]).toBe(locale === 'en' ? 'source-authored' : 'ai-assisted-ui-draft-needs-native-review')
  })

  it('uses the correct product and provider names in the English BYOK warning', () => {
    const copy = aiCopyFor('en')
    expect(copy.warningProvider).toContain('Yi Path')
    expect(copy.warningProvider).toContain('DeepSeek')
    expect(copy.warningProvider).not.toContain('JobSensei')
  })
})
