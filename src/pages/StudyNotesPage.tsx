import { ArrowLeft, BookOpenText, Search, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { JournalEntryExportActions } from '../components/JournalEntryExportActions'
import { JournalModeNav } from '../components/JournalModeNav'
import { PageIntro } from '../components/PageIntro'
import { DAO_COPY } from '../data/daoContent'
import { STUDY_NOTES_COPY } from '../data/studyNotesContent'
import type { StudyNote } from '../domain/types'
import { useI18n } from '../i18n/I18nContext'
import { deleteStudyNote, getStudyNotes, saveStudyNote } from '../storage/db'

const DAO_WORK_ID = 'dao-water-introduction-v1'

export function StudyNotesPage() {
  const { preferences } = useI18n()
  const locale = preferences.locale
  const copy = STUDY_NOTES_COPY[locale]
  const dao = DAO_COPY[locale]
  const [notes, setNotes] = useState<StudyNote[]>([])
  const [loaded, setLoaded] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => { void getStudyNotes().then((items) => { setNotes(items); setSelectedId(items[0]?.id ?? null); setLoaded(true) }) }, [])

  const filtered = useMemo(() => notes.filter((note) => {
    const passage = dao.passages.find(({ id }) => id === note.anchor.passageId)
    return [passage?.title, passage?.body, note.body, note.tags.join(' ')].join(' ').toLocaleLowerCase(locale).includes(query.trim().toLocaleLowerCase(locale))
  }), [dao.passages, locale, notes, query])
  const selected = notes.find(({ id }) => id === selectedId) ?? filtered[0] ?? null

  async function updateNote(note: StudyNote) {
    await saveStudyNote(note)
    setNotes((items) => items.map((item) => item.id === note.id ? note : item))
  }

  async function removeNote(note: StudyNote) {
    await deleteStudyNote(note.id)
    const remaining = notes.filter(({ id }) => id !== note.id)
    setNotes(remaining)
    setSelectedId(remaining[0]?.id ?? null)
  }

  return <div className="page-shell py-10 sm:py-16">
    <PageIntro eyebrow={copy.eyebrow} title={copy.title} body={copy.intro} />
    <JournalModeNav copy={copy} />
    {!loaded ? <div className="surface mt-8 p-8">…</div> : notes.length === 0 ? <section className="surface study-notes-empty mt-8">
      <BookOpenText size={34} aria-hidden="true" /><h2>{copy.empty}</h2><p>{copy.emptyBody}</p><Link to="/dao/study/start" className="button-primary">{copy.beginStudy}</Link>
    </section> : <div className="study-notes-layout mt-8">
      <aside className="study-notes-rail surface">
        <label className="search-field"><Search size={17} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} /></label>
        <p className="eyebrow mt-6">{copy.contents} · {filtered.length}</p>
        <nav>{filtered.map((note) => {
          const passage = dao.passages.find(({ id }) => id === note.anchor.passageId)
          return <button key={note.id} type="button" className={selected?.id === note.id ? 'is-active' : ''} onClick={() => setSelectedId(note.id)}>
            <span>{new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(new Date(note.updatedAt))}</span><strong>{passage?.title ?? note.anchor.quote}</strong><small>{note.body}</small>
          </button>
        })}</nav>
      </aside>
      {filtered.length === 0 ? <div className="surface p-8 text-[var(--ink-soft)]">{copy.noResults}</div> : selected ? <StudyNoteEditor key={selected.id} note={selected} locale={locale} dao={dao} copy={copy} onSave={updateNote} onRemove={removeNote} /> : null}
    </div>}
  </div>
}

function StudyNoteEditor({ note, locale, dao, copy, onSave, onRemove }: { note: StudyNote; locale: Parameters<typeof Intl.DateTimeFormat>[0]; dao: typeof DAO_COPY[keyof typeof DAO_COPY]; copy: StudyNotesCopy; onSave: (note: StudyNote) => Promise<void>; onRemove: (note: StudyNote) => Promise<void> }) {
  const [body, setBody] = useState(note.body)
  const [saved, setSaved] = useState(false)
  const passage = dao.passages.find(({ id }) => id === note.anchor.passageId)
  const title = passage?.title ?? note.anchor.quote
  const exportEntry = { id: note.id, schemaVersion: 1 as const, createdAt: note.createdAt, updatedAt: note.updatedAt, locale: note.locale, kind: 'study' as const, title, body, tags: note.tags, sourceId: `${note.anchor.workId}:${note.anchor.passageId}` }

  async function save() {
    const updated = { ...note, body: body.trim(), updatedAt: new Date().toISOString() }
    await onSave(updated)
    setSaved(true)
  }

  return <article className="study-note-page surface">
    <header><p className="eyebrow">{copy.noteOn}</p><h2>{title}</h2><p>{new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeStyle: 'short' }).format(new Date(note.updatedAt))}</p></header>
    <section className="study-note-source"><span>{copy.sourcePassage}</span><blockquote>{passage?.body ?? note.anchor.quote}</blockquote></section>
    <div className="study-note-editor"><label htmlFor={`study-note-${note.id}`}>{copy.reflection}</label><textarea id={`study-note-${note.id}`} className="field" value={body} onChange={(event) => { setBody(event.target.value); setSaved(false) }} /></div>
    <footer>
      <button type="button" className="button-primary" disabled={!body.trim()} onClick={() => void save()}>{saved ? copy.saved : copy.save}</button>
      <JournalEntryExportActions entry={exportEntry} locale={note.locale} />
      {note.anchor.workId === DAO_WORK_ID ? <Link to="/dao/study/themes" className="button-secondary"><ArrowLeft size={16} />{copy.backToStudy}</Link> : null}
      <button type="button" className="button-text danger-action" onClick={() => void onRemove(note)}><Trash2 size={16} />{copy.remove}</button>
    </footer>
  </article>
}

type StudyNotesCopy = (typeof STUDY_NOTES_COPY)[keyof typeof STUDY_NOTES_COPY]
