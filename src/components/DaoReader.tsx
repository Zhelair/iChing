import { BookmarkPlus, Check, ChevronRight, ScrollText } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
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
    <section id="dao-study" className="dao-reader scroll-mt-24" aria-labelledby="dao-reader-title">
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

      <aside className="dao-reader__notes surface" aria-labelledby="dao-note-title">
        <div className="flex items-center gap-3"><span className="dao-note-icon"><BookmarkPlus size={19} /></span><h3 id="dao-note-title" className="text-xl">{copy.note}</h3></div>
        <p className="mt-3 text-xs leading-5 text-[var(--ink-soft)]">{passage.title}</p>
        <label className="sr-only" htmlFor="dao-passage-note">{copy.note}</label>
        <textarea id="dao-passage-note" className="field mt-4 min-h-36" value={body} onChange={(event) => { setBody(event.target.value); setSaved(false) }} placeholder={copy.noteHint} />
        <button type="button" className="button-primary mt-3 w-full" disabled={!body.trim()} onClick={() => void saveNote()}>{saved ? <Check size={17} /> : <BookmarkPlus size={17} />}{saved ? copy.noteSaved : copy.noteSave}</button>
        <div className="mt-7 border-t border-[var(--line)] pt-5"><h4 className="font-bold">{copy.notesHeading}</h4>
          <div className="dao-saved-notes mt-3">{notes.length ? notes.slice(0, 6).map((note) => <article key={note.id}><span>{copy.passages.find(({ id }) => id === note.anchor.passageId)?.title ?? note.anchor.quote}</span><p>{note.body}</p></article>) : <p>{copy.noNotes}</p>}</div>
        </div>
      </aside>
    </section>
  )
}
