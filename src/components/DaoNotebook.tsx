import { Check, NotebookPen } from 'lucide-react'
import { useState } from 'react'
import type { DaoCopy } from '../data/daoContent'
import type { Locale } from '../domain/locales'
import type { JournalEntry } from '../domain/types'
import { saveJournalEntry } from '../storage/db'

export function DaoNotebook({ copy, locale }: { copy: DaoCopy; locale: Locale }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [saved, setSaved] = useState(false)

  async function save() {
    if (!body.trim()) return
    const now = new Date().toISOString()
    const entry: JournalEntry = { id: crypto.randomUUID(), schemaVersion: 1, createdAt: now, updatedAt: now, locale, kind: 'freeform', title: title.trim() || copy.freeTitle, body: body.trim(), tags: ['dao'] }
    await saveJournalEntry(entry)
    setTitle(''); setBody(''); setSaved(true)
  }

  return <section id="dao-notebook" className="surface dao-notebook scroll-mt-24" aria-labelledby="dao-notebook-title">
    <div><span className="dao-section-icon"><NotebookPen size={22} /></span><p className="eyebrow mt-5">{copy.notebook}</p><h2 id="dao-notebook-title" className="mt-3 text-3xl sm:text-4xl">{copy.freeTitle}</h2><p className="mt-3 max-w-2xl leading-7 text-[var(--ink-soft)]">{copy.freeBody}</p></div>
    <div className="dao-notebook__form">
      <label htmlFor="dao-entry-title">{copy.freeTitleHint}</label><input id="dao-entry-title" className="field mt-2" value={title} onChange={(event) => { setTitle(event.target.value); setSaved(false) }} placeholder={copy.freeTitleHint} />
      <label className="mt-4" htmlFor="dao-entry-body">{copy.freeBodyHint}</label><textarea id="dao-entry-body" className="field mt-2 min-h-40" value={body} onChange={(event) => { setBody(event.target.value); setSaved(false) }} placeholder={copy.freeBodyHint} />
      <button type="button" className="button-primary mt-4" disabled={!body.trim()} onClick={() => void save()}>{saved ? <Check size={17} /> : <NotebookPen size={17} />}{saved ? copy.journalSaved : copy.saveJournal}</button>
    </div>
  </section>
}
