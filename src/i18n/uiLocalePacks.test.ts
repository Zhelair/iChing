import { describe, expect, it } from 'vitest'
import { EXTENDED_LOCALES } from '../domain/locales'
import { translations } from './translations'
import { getUiLocalePack } from './uiLocalePacks'

const featureGroups = [
  'history',
  'methodYarrow',
  'castYarrow',
  'journal',
  'support',
  'settingsPrivacy',
  'settingsSupport',
  'ambientLevels',
  'exportActions',
  'exportDocument',
] as const

const featureKeys = {
  history: ['eyebrow', 'title', 'contents', 'replay', 'oracleSource', 'yarrowSource', 'chapters'],
  methodYarrow: ['title', 'body'],
  castYarrow: ['eyebrow', 'title', 'body', 'begin', 'next', 'nextLine', 'complete', 'divided', 'removed', 'remain', 'mixing', 'dividing', 'counting', 'source'],
  journal: ['yarrow', 'beads', 'eyebrow', 'title', 'body', 'search', 'all', 'digital', 'physical', 'direct', 'readings', 'recurring', 'seen', 'empty', 'emptyBody', 'begin', 'noResults', 'question', 'untitled', 'note', 'noteHint', 'tags', 'tagsHint', 'save', 'saved', 'review', 'remove', 'removeTitle', 'removeBody', 'removeCancel', 'removeConfirm', 'undo', 'undoAction', 'backups', 'settings', 'contents', 'changed', 'stable', 'thisMonth'],
  support: ['eyebrow', 'title', 'intro', 'feedbackTitle', 'feedbackBody', 'name', 'email', 'message', 'placeholder', 'copyFeedback', 'copied', 'sendFeedback', 'sending', 'sent', 'sendFailed', 'tryLater', 'writeFirst', 'copyFailed', 'supportTitle', 'supportBody', 'bmac', 'bmacComing', 'feedbackHeading', 'feedbackName', 'feedbackEmail'],
  settingsPrivacy: ['eyebrow', 'title', 'intro', 'local', 'access', 'exports', 'largeFile'],
  settingsSupport: ['title', 'body', 'action'],
  exportActions: ['image', 'pdf', 'saved', 'imageWorking', 'imageError', 'pdfWorking', 'pdfSaved', 'pdfError'],
  exportDocument: ['primary', 'resulting', 'changing', 'reflection', 'when', 'question', 'method', 'line', 'note', 'stored', 'subject', 'methods', 'values'],
} as const

const historyStructure = [
  ['oracle-bones', 'bone'],
  ['zhouyi', 'scroll'],
  ['yarrow', 'stalk'],
  ['line-values-story', 'numbers'],
  ['ten-wings', 'wings'],
  ['coins', 'coins'],
  ['yi-path', 'compass'],
] as const

function expectCompleteStrings(value: unknown) {
  if (typeof value === 'string') {
    expect(value.trim().length).toBeGreaterThan(0)
    return
  }
  if (Array.isArray(value)) {
    value.forEach(expectCompleteStrings)
    return
  }
  if (value && typeof value === 'object') Object.values(value).forEach(expectCompleteStrings)
}

describe('extended UI locale packs', () => {
  it.each(EXTENDED_LOCALES)('matches the live UI contract for %s', (locale) => {
    const pack = getUiLocalePack(locale)
    expect(pack.status).toBe('ai-assisted-ui-draft-needs-native-review')
    expect(Object.keys(pack.translations).sort()).toEqual(Object.keys(translations.en).sort())
    expect(Object.keys(pack.features).sort()).toEqual([...featureGroups].sort())
    for (const [group, keys] of Object.entries(featureKeys)) {
      expect(Object.keys(pack.features[group as keyof typeof featureKeys]).sort()).toEqual([...keys].sort())
    }
    expect(pack.features.history.chapters.map(({ id, scene }) => [id, scene])).toEqual(historyStructure)
    expect(Object.keys(pack.features.exportDocument.methods).sort()).toEqual(['beads', 'digital', 'direct', 'physical', 'yarrow'])
    expect(Object.keys(pack.features.exportDocument.values).sort()).toEqual(['6', '7', '8', '9'])
    expectCompleteStrings(pack.translations)
    expectCompleteStrings(pack.features)
  })
})

describe('reviewed Russian interface terminology', () => {
  it('uses the approved reading and storage terms consistently', () => {
    expect(translations.ru['result.resulting']).toBe('Результирующая')
    expect(translations.ru['learn.flow.result.title']).toBe('3. Результирующая гексаграмма')
    expect(translations.ru['settings.export']).toBe('Экспортировать резервную копию JSON')
    expect(Object.values(translations.ru).some((value) => /итогов(?:ая|ой|ую) гексаграмм/i.test(value))).toBe(false)
  })
})

describe('reviewed Bulgarian interface terminology', () => {
  it('uses the approved reading and storage terms consistently', () => {
    expect(translations.bg['result.resulting']).toBe('Трансформационна')
    expect(translations.bg['learn.flow.result.title']).toBe('3. Трансформационна хексаграма')
    expect(translations.bg['method.physical.title']).toBe('Обикновени монети')
    expect(translations.bg['settings.export']).toBe('Експортирай резервно копие JSON')
    expect(Object.values(translations.bg).some((value) => /резултатн(?:а|ата|ата) хексаграм/i.test(value))).toBe(false)
    expect(Object.values(translations.bg).some((value) => /JSON архив/i.test(value))).toBe(false)
  })
})

describe('reviewed Spanish interface language', () => {
  it('uses the approved terminology and an informal singular register', () => {
    const pack = getUiLocalePack('es')
    const serialized = JSON.stringify(pack)

    expect(pack.translations['result.resulting']).toBe('Resultante')
    expect(pack.translations['learn.flow.result.title']).toBe('3. Hexagrama resultante')
    expect(pack.translations['method.physical.title']).toBe('Monedas corrientes')
    expect(pack.translations['settings.export']).toBe('Exportar copia de seguridad JSON')
    expect(pack.features.journal.direct).toBe('Entrada manual')
    expect(pack.features.methodYarrow.title).toBe('Práctica con tallos de milenrama')
    expect(serialized).not.toMatch(/Monedas reales|Entrada directa|Taller de tallos de milenrama/)
    expect(serialized).not.toMatch(/\b(?:usted|Acoja|Plantee|Haga|Elija|Introduzca|Vuelva|Comparta|Escriba|Inténtelo)\b/)
  })
})
