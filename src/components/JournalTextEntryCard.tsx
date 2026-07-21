import { BookOpenText, ChevronDown, FileText, Save, Trash2, Wind } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { DaoCopy } from '../data/daoContent'
import type { Locale } from '../domain/locales'
import type { JournalEntry } from '../domain/types'
import { JournalEntryExportActions } from './JournalEntryExportActions'

type Labels = { save: string; saved: string; remove: string }

export function JournalTextEntryCard({ entry, locale, daoCopy, labels, onSave, onDelete }: { entry: JournalEntry; locale: Locale; daoCopy: DaoCopy; labels: Labels; onSave: (entry: JournalEntry) => Promise<void>; onDelete: (id: string) => Promise<void> }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(entry.title)
  const [body, setBody] = useState(entry.body)
  const [saved, setSaved] = useState(false)
  const current = { ...entry, title: title.trim() || entry.title, body: body.trim(), updatedAt: entry.updatedAt }
  const Icon = entry.kind === 'practice' ? Wind : entry.kind === 'study' ? BookOpenText : FileText
  const date = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(entry.createdAt))

  async function save() {
    const updated = { ...current, updatedAt: new Date().toISOString() }
    await onSave(updated)
    setSaved(true)
  }

  return <article className={`surface journal-text-entry ${open ? 'is-open' : ''}`}>
    <button type="button" className="journal-text-entry__summary" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
      <span className="journal-text-entry__icon"><Icon size={19} /></span>
      <span className="journal-text-entry__copy"><span>{date} · {entry.kind}</span><strong>{current.title}</strong><small>{current.body}</small></span>
      <ChevronDown className="journal-text-entry__chevron" size={18} aria-hidden="true" />
    </button>
    {open ? <div className="journal-text-entry__editor">
      <div><label htmlFor={`entry-title-${entry.id}`}>{daoCopy.freeTitleHint}</label><input id={`entry-title-${entry.id}`} className="field mt-2" value={title} onChange={(event) => { setTitle(event.target.value); setSaved(false) }} /></div>
      <div><label htmlFor={`entry-body-${entry.id}`}>{daoCopy.freeBodyHint}</label><textarea id={`entry-body-${entry.id}`} className="field mt-2 min-h-44" value={body} onChange={(event) => { setBody(event.target.value); setSaved(false) }} /></div>
      <div className="journal-text-entry__actions">
        <button type="button" className="button-primary" disabled={!title.trim() || !body.trim()} onClick={() => void save()}><Save size={16} />{saved ? labels.saved : labels.save}</button>
        <JournalEntryExportActions entry={current} locale={locale} />
        <Link className="button-secondary" to="/dao">{daoCopy.navDao}</Link>
        <button type="button" className="journal-text-entry__remove" onClick={() => void onDelete(entry.id)}><Trash2 size={15} />{labels.remove}</button>
      </div>
    </div> : null}
  </article>
}
