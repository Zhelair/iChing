import type { ExtendedLocale } from '../domain/locales'

export type HistoryScene = 'bone' | 'scroll' | 'stalk' | 'numbers' | 'wings' | 'coins' | 'compass'

export type HistoryChapterCopy = {
  id: string
  era: string
  title: string
  body: string
  note?: string
  scene: HistoryScene
}

export type JournalCopy = {
  yarrow: string
  eyebrow: string
  title: string
  body: string
  search: string
  all: string
  digital: string
  physical: string
  direct: string
  readings: string
  recurring: string
  seen: string
  empty: string
  emptyBody: string
  begin: string
  noResults: string
  question: string
  untitled: string
  note: string
  noteHint: string
  tags: string
  tagsHint: string
  save: string
  saved: string
  review: string
  remove: string
  removeTitle: string
  removeBody: string
  removeCancel: string
  removeConfirm: string
  undo: string
  undoAction: string
  backups: string
  settings: string
  contents: string
  changed: string
  stable: string
  thisMonth: string
}

export type SupportCopy = {
  eyebrow: string
  title: string
  intro: string
  feedbackTitle: string
  feedbackBody: string
  name: string
  email: string
  message: string
  placeholder: string
  copyFeedback: string
  copied: string
  sendFeedback: string
  sending: string
  sent: string
  sendFailed: string
  tryLater: string
  writeFirst: string
  copyFailed: string
  supportTitle: string
  supportBody: string
  bmac: string
  bmacComing: string
  feedbackHeading: string
  feedbackName: string
  feedbackEmail: string
}

export type ExportDocumentCopy = {
  primary: string
  resulting: string
  changing: string
  reflection: string
  when: string
  question: string
  method: string
  line: string
  note: string
  stored: string
  subject: string
  methods: { digital: string; physical: string; yarrow: string; direct: string }
  values: { '6': string; '7': string; '8': string; '9': string }
}

export type UiLocalePack = {
  locale: ExtendedLocale
  variant: string
  status: 'ai-assisted-ui-draft-needs-native-review'
  translations: Record<string, string>
  features: {
    history: {
      eyebrow: string
      title: string
      contents: string
      replay: string
      oracleSource: string
      yarrowSource: string
      chapters: HistoryChapterCopy[]
    }
    methodYarrow: { title: string; body: string }
    castYarrow: {
      eyebrow: string
      title: string
      body: string
      begin: string
      next: string
      nextLine: string
      complete: string
      divided: string
      removed: string
      remain: string
      mixing: string
      dividing: string
      counting: string
      source: string
    }
    journal: JournalCopy
    support: SupportCopy
    settingsPrivacy: { eyebrow: string; title: string; intro: string; local: string; access: string; exports: string; largeFile: string }
    settingsSupport: { title: string; body: string; action: string }
    ambientLevels: [string, string, string]
    exportActions: { image: string; pdf: string; saved: string; imageWorking: string; imageError: string; pdfWorking: string; pdfSaved: string; pdfError: string }
    exportDocument: ExportDocumentCopy
  }
}
