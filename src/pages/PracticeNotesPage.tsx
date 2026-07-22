import { ArrowRight, Search, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { JournalModeNav } from '../components/JournalModeNav'
import { JournalTextEntryCard } from '../components/JournalTextEntryCard'
import { PageIntro } from '../components/PageIntro'
import { DAO_COPY } from '../data/daoContent'
import { STUDY_NOTES_COPY } from '../data/studyNotesContent'
import type { JournalEntry } from '../domain/types'
import { useI18n } from '../i18n/I18nContext'
import { deleteJournalEntry, getAllJournalEntries, saveJournalEntry } from '../storage/db'

export function PracticeNotesPage() {
  const { preferences } = useI18n()
  const locale = preferences.locale
  const copy = STUDY_NOTES_COPY[locale]
  const dao = DAO_COPY[locale]
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loaded, setLoaded] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    void getAllJournalEntries().then((items) => {
      setEntries(items.filter((entry) => entry.kind !== 'study'))
      setLoaded(true)
    })
  }, [])

  const filtered = useMemo(() => entries.filter((entry) => (
    [entry.title, entry.body, entry.tags.join(' ')].join(' ').toLocaleLowerCase(locale)
      .includes(query.trim().toLocaleLowerCase(locale))
  )), [entries, locale, query])

  return <div className="page-shell py-10 sm:py-16">
    <PageIntro eyebrow={copy.practiceEyebrow} title={copy.practiceTitle} body={copy.practiceIntro} />
    <JournalModeNav copy={copy} />
    <div className="practice-notes-layout mt-8">
      <aside className="surface practice-notes-rail">
        <label className="search-field"><Search size={17} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.practiceSearch} /></label>
        <p className="eyebrow mt-6">{copy.practiceNotes} · {filtered.length}</p>
        <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">{copy.practiceIntro}</p>
      </aside>
      <section aria-live="polite">
        {!loaded ? <div className="surface p-8">…</div> : entries.length === 0 ? <div className="surface journal-empty p-8 sm:p-12">
          <Sparkles size={34} aria-hidden="true" /><h2 className="mt-5 text-3xl">{copy.practiceEmpty}</h2><p className="mt-3 text-[var(--ink-soft)]">{copy.practiceEmptyBody}</p>
          <Link to="/dao/practice" className="button-primary mt-7">{dao.practice}<ArrowRight size={17} /></Link>
        </div> : filtered.length === 0 ? <div className="surface p-8 text-[var(--ink-soft)]">{copy.noResults}</div> : <div className="space-y-3">
          {filtered.map((entry) => <JournalTextEntryCard key={entry.id} entry={entry} locale={locale} daoCopy={dao} labels={{ save: copy.save, saved: copy.saved, remove: copy.remove }} onSave={async (updated) => {
            await saveJournalEntry(updated)
            setEntries((items) => items.map((item) => item.id === updated.id ? updated : item))
          }} onDelete={async (id) => {
            await deleteJournalEntry(id)
            setEntries((items) => items.filter((item) => item.id !== id))
          }} />)}
        </div>}
      </section>
    </div>
  </div>
}
