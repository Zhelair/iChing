import { BookmarkPlus, Check, ChevronRight, ScrollText, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { DaoCopy } from '../data/daoContent'
import type { Locale } from '../domain/locales'
import type { JournalEntry, StudyNote } from '../domain/types'
import { getReadingProgress, getStudyNotes, saveJournalEntry, saveReadingProgress, saveStudyNote } from '../storage/db'

const WORK_ID = 'dao-water-introduction-v1'

type DaoReaderProps = { copy: DaoCopy; locale: Locale }

export function DaoReader({ copy, locale }: DaoReaderProps) {
  const [passageId, setPassageId] = useState(copy.passages[0].id)
  const [body, setBody] = useState('')
  const [notes, setNotes] = useState<StudyNote[]>([])
  const [saved, setSaved] = useState(false)
  const [mobileNotesVisible, setMobileNotesVisible] = useState(false)
  const readerSection = useRef<HTMLElement>(null)
  const notesDialog = useRef<HTMLDialogElement>(null)
  const passage = useMemo(() => copy.passages.find(({ id }) => id === passageId) ?? copy.passages[0], [copy.passages, passageId])

  useEffect(() => {
    let cancelled = false
    void Promise.all([getStudyNotes(WORK_ID), getReadingProgress(WORK_ID)]).then(([storedNotes, progress]) => {
      if (cancelled) return
      setNotes(storedNotes)
      if (progress && copy.passages.some(({ id }) => id === progress.passageId)) setPassageId(progress.passageId)
    })
    return () => { cancelled = true }
  }, [copy.passages])

  useEffect(() => {
    const element = readerSection.current
    if (!element || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setMobileNotesVisible(entry.isIntersecting), { rootMargin: '-8% 0px -28% 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  function choosePassage(id: string) {
    setPassageId(id)
    setBody('')
    setSaved(false)
    const index = copy.passages.findIndex((item) => item.id === id)
    void saveReadingProgress({ workId: WORK_ID, passageId: id, progress: (index + 1) / copy.passages.length, updatedAt: new Date().toISOString() })
  }

  async function saveNote() {
    const noteBody = body.trim()
    if (!noteBody) return
    const now = new Date().toISOString()
    const note: StudyNote = {
      id: crypto.randomUUID(), schemaVersion: 1, createdAt: now, updatedAt: now, locale,
      anchor: { workId: WORK_ID, passageId: passage.id, startOffset: 0, endOffset: passage.body.length, quote: passage.title },
      body: noteBody, tags: ['dao', 'study'],
    }
    await saveStudyNote(note)
    const entry: JournalEntry = { id: crypto.randomUUID(), schemaVersion: 1, createdAt: now, updatedAt: now, locale, kind: 'study', title: passage.title, body: noteBody, tags: ['dao', 'study'], sourceId: `${WORK_ID}:${passage.id}` }
    await saveJournalEntry(entry)
    setNotes((items) => [note, ...items])
    setBody('')
    setSaved(true)
  }

  return (
    <section ref={readerSection} id="dao-study" className="dao-reader scroll-mt-24" aria-labelledby="dao-reader-title">
      <aside className="dao-reader__toc surface" aria-label={copy.readerTitle}>
        <p className="eyebrow">{copy.study}</p>
        <nav className="mt-4">
          {copy.passages.map((item, index) => (
            <button key={item.id} type="button" className={passage.id === item.id ? 'is-active' : ''} onClick={() => choosePassage(item.id)} aria-current={passage.id === item.id ? 'step' : undefined}>
              <span>{String(index + 1).padStart(2, '0')}</span>{item.title}<ChevronRight size={15} aria-hidden="true" />
            </button>
          ))}
        </nav>
      </aside>

      <article className="dao-reader__page surface">
        <p className="eyebrow">{copy.readerEyebrow}</p>
        <h2 id="dao-reader-title" className="mt-3 text-3xl sm:text-5xl">{copy.readerTitle}</h2>
        <p className="dao-reader__lead">{copy.readerIntro}</p>
        <div className="dao-reader__passage" key={passage.id}>
          <span className="dao-reader__mark" aria-hidden="true"><ScrollText size={18} /></span>
          <h3>{passage.title}</h3>
          <p>{passage.body}</p>
        </div>
        <dl className="dao-scope">
          <div><dt>{copy.scope}</dt><dd>{copy.scopeValue}</dd></div>
          <div><dt>{copy.sourceHeading}</dt><dd>{copy.sourceBody}</dd></div>
        </dl>
      </article>

      <PassageNotes className="dao-reader__notes surface" idSuffix="desktop" copy={copy} passageTitle={passage.title} body={body} notes={notes} saved={saved} onBodyChange={(value) => { setBody(value); setSaved(false) }} onSave={() => void saveNote()} />

      {typeof document !== 'undefined' ? createPortal(<>
        <button type="button" className={`dao-notes-trigger${mobileNotesVisible ? ' is-visible' : ''}`} aria-label={copy.note} onClick={() => notesDialog.current?.showModal()}><BookmarkPlus size={21} /><span>{copy.note}</span>{notes.length ? <strong>{notes.length}</strong> : null}</button>
        <dialog ref={notesDialog} className="dao-notes-sheet" aria-labelledby="dao-note-title-mobile" onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close() }}>
          <div className="dao-notes-sheet__handle" aria-hidden="true" />
          <form method="dialog" className="dao-notes-sheet__close"><button type="submit" aria-label={copy.close}><X size={20} /></button></form>
          <PassageNotes className="dao-notes-sheet__panel" idSuffix="mobile" copy={copy} passageTitle={passage.title} body={body} notes={notes} saved={saved} onBodyChange={(value) => { setBody(value); setSaved(false) }} onSave={() => void saveNote()} />
        </dialog>
      </>, document.body) : null}
    </section>
  )
}

type PassageNotesProps = {
  className: string
  idSuffix: string
  copy: DaoCopy
  passageTitle: string
  body: string
  notes: StudyNote[]
  saved: boolean
  onBodyChange: (value: string) => void
  onSave: () => void
}

function PassageNotes({ className, idSuffix, copy, passageTitle, body, notes, saved, onBodyChange, onSave }: PassageNotesProps) {
  const titleId = `dao-note-title-${idSuffix}`
  const fieldId = `dao-passage-note-${idSuffix}`
  return <aside className={className} aria-labelledby={titleId}>
    <div className="flex items-center gap-3"><span className="dao-note-icon"><BookmarkPlus size={19} /></span><h3 id={titleId} className="text-xl">{copy.note}</h3></div>
    <p className="mt-3 text-xs leading-5 text-[var(--ink-soft)]">{passageTitle}</p>
    <label className="sr-only" htmlFor={fieldId}>{copy.note}</label>
    <textarea id={fieldId} className="field mt-4 min-h-36" value={body} onChange={(event) => onBodyChange(event.target.value)} placeholder={copy.noteHint} />
    <button type="button" className="button-primary mt-3 w-full" disabled={!body.trim()} onClick={onSave}>{saved ? <Check size={17} /> : <BookmarkPlus size={17} />}{saved ? copy.noteSaved : copy.noteSave}</button>
    <div className="mt-7 border-t border-[var(--line)] pt-5"><h4 className="font-bold">{copy.notesHeading}</h4>
      <div className="dao-saved-notes mt-3">{notes.length ? notes.slice(0, 6).map((note) => <article key={note.id}><span>{copy.passages.find(({ id }) => id === note.anchor.passageId)?.title ?? note.anchor.quote}</span><p>{note.body}</p></article>) : <p>{copy.noNotes}</p>}</div>
    </div>
  </aside>
}
