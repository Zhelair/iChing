import { ArrowRight, CalendarDays, RotateCcw, Search, Tag, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HexagramFigure } from '../components/HexagramFigure'
import { JournalTextEntryCard } from '../components/JournalTextEntryCard'
import { JournalModeNav } from '../components/JournalModeNav'
import { PageIntro } from '../components/PageIntro'
import { ReadingExportActions } from '../components/ReadingExportActions'
import { getHexagram } from '../data/hexagrams'
import { DAO_COPY } from '../data/daoContent'
import { STUDY_NOTES_COPY } from '../data/studyNotesContent'
import { isBuiltInContentLocale } from '../domain/locales'
import type { JournalEntry, Reading, ReadingMethod } from '../domain/types'
import { useI18n } from '../i18n/I18nContext'
import { getUiLocalePack } from '../i18n/uiLocalePacks'
import { deleteJournalEntry, deleteReading, getAllJournalEntries, getAllReadings, saveJournalEntry, saveReading } from '../storage/db'
import { setCurrentReading } from '../storage/session'

const copy = {
  en: {
    yarrow: 'Yarrow',
    eyebrow: 'Private practice · local journal', title: 'A record of encounters with change.', body: 'Return to questions, refine your notes, and notice recurring images without turning reflection into a score.',
    search: 'Search questions, notes, tags, or hexagrams', all: 'All methods', digital: 'Digital', physical: 'Physical', direct: 'Entered', readings: 'readings', recurring: 'Recurring images', seen: 'seen', empty: 'Your journal is quiet for now.', emptyBody: 'Complete a reading and it will appear here automatically.', begin: 'Begin a reading', noResults: 'No entries match these filters.', question: 'Question', untitled: 'Untitled reflection', note: 'Reflection', noteHint: 'What became clearer with time?', tags: 'Tags', tagsHint: 'work, family, timing', save: 'Save changes', saved: 'Saved locally', review: 'Review reading', remove: 'Remove entry', removeTitle: 'Remove this entry?', removeBody: 'It will disappear from this browser. You can still undo for a few seconds.', removeCancel: 'Keep entry', removeConfirm: 'Yes, remove it', undo: 'Entry removed.', undoAction: 'Undo', backups: 'JSON backup and restore stay in Settings.', settings: 'Open Settings', contents: 'Journal filters', changed: 'changing lines', stable: 'stable reading', thisMonth: 'This month',
  },
  bg: {
    yarrow: 'Бял равнец',
    eyebrow: 'Лична практика · локален дневник', title: 'История на срещите с промяната.', body: 'Връщайте се към въпросите, допълвайте бележките и забелязвайте повтарящи се образи, без да превръщате размисъла в оценка.',
    search: 'Търсене във въпроси, бележки, етикети и хексаграми', all: 'Всички методи', digital: 'Дигитални монети', physical: 'Обикновени монети', direct: 'Въведено ръчно', readings: 'прочита', recurring: 'Повтарящи се образи', seen: 'срещана', empty: 'Дневникът ви засега е тих.', emptyBody: 'Завършете прочит и той автоматично ще се появи тук.', begin: 'Започнете прочит', noResults: 'Няма записи с тези филтри.', question: 'Въпрос', untitled: 'Размисъл без заглавие', note: 'Размисъл', noteHint: 'Какво стана по-ясно с времето?', tags: 'Етикети', tagsHint: 'работа, семейство, време', save: 'Запази промените', saved: 'Запазено локално', review: 'Отвори прочита', remove: 'Премахни записа', removeTitle: 'Да премахнем ли този запис?', removeBody: 'Той ще изчезне от този браузър. Все още можете да го върнете за няколко секунди.', removeCancel: 'Запази записа', removeConfirm: 'Да, премахни го', undo: 'Записът е премахнат.', undoAction: 'Отмени', backups: 'Резервното копие JSON и възстановяването са в Настройки.', settings: 'Отвори Настройки', contents: 'Филтри на дневника', changed: 'променящи се линии', stable: 'стабилен прочит', thisMonth: 'Този месец',
  },
  ru: {
    yarrow: 'Тысячелистник',
    eyebrow: 'Личная практика · локальный дневник', title: 'История встреч с переменами.', body: 'Возвращайтесь к вопросам, дополняйте заметки и замечайте повторяющиеся образы, не превращая размышление в оценку.',
    search: 'Поиск по вопросам, заметкам, тегам и гексаграммам', all: 'Все методы', digital: 'Цифровые монеты', physical: 'Обычные монеты', direct: 'Введено вручную', readings: 'чтений', recurring: 'Повторяющиеся образы', seen: 'встречалась', empty: 'Ваш дневник пока тих.', emptyBody: 'Завершите чтение, и оно автоматически появится здесь.', begin: 'Начать чтение', noResults: 'Нет записей с такими фильтрами.', question: 'Вопрос', untitled: 'Размышление без заголовка', note: 'Размышление', noteHint: 'Что со временем стало яснее?', tags: 'Теги', tagsHint: 'работа, семья, время', save: 'Сохранить изменения', saved: 'Сохранено локально', review: 'Открыть чтение', remove: 'Удалить запись', removeTitle: 'Удалить эту запись?', removeBody: 'Она исчезнет из этого браузера. В течение нескольких секунд её ещё можно будет вернуть.', removeCancel: 'Оставить запись', removeConfirm: 'Да, удалить', undo: 'Запись удалена.', undoAction: 'Отменить', backups: 'Резервная копия JSON и восстановление находятся в Настройках.', settings: 'Открыть Настройки', contents: 'Фильтры дневника', changed: 'изменяющихся линий', stable: 'стабильное чтение', thisMonth: 'Этот месяц',
  },
} as const

const methodOptions: Array<'all' | ReadingMethod> = ['all', 'digital', 'physical', 'yarrow', 'direct']

export function JournalPage() {
  const { editorialFor, preferences } = useI18n()
  const c = isBuiltInContentLocale(preferences.locale)
    ? copy[preferences.locale]
    : getUiLocalePack(preferences.locale).features.journal
  const navigate = useNavigate()
  const [readings, setReadings] = useState<Reading[]>([])
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [loaded, setLoaded] = useState(false)
  const [query, setQuery] = useState('')
  const [method, setMethod] = useState<'all' | ReadingMethod>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [tags, setTags] = useState('')
  const [saved, setSaved] = useState(false)
  const [deleted, setDeleted] = useState<Reading | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const undoTimer = useRef<number | null>(null)
  const keepEntryRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    void Promise.all([getAllReadings(), getAllJournalEntries()]).then(([items, entries]) => { setReadings(items); setJournalEntries(entries); setLoaded(true) })
    return () => { if (undoTimer.current) window.clearTimeout(undoTimer.current) }
  }, [])

  useEffect(() => {
    if (!confirmingDelete) return
    keepEntryRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setConfirmingDelete(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [confirmingDelete])

  const counts = useMemo(() => readings.reduce<Record<number, number>>((acc, reading) => {
    acc[reading.primaryHexagramId] = (acc[reading.primaryHexagramId] ?? 0) + 1
    return acc
  }, {}), [readings])

  const filtered = useMemo(() => readings.filter((reading) => {
    if (method !== 'all' && reading.method !== method) return false
    const hexagram = getHexagram(reading.primaryHexagramId)
    const haystack = [reading.question, reading.note, reading.tags.join(' '), hexagram.pinyin, hexagram.chinese, editorialFor(hexagram).title, String(hexagram.id)].join(' ').toLocaleLowerCase(preferences.locale)
    return haystack.includes(query.trim().toLocaleLowerCase(preferences.locale))
  }), [editorialFor, method, preferences.locale, query, readings])
  const personalEntries = useMemo(() => journalEntries.filter((entry) => entry.kind !== 'study'), [journalEntries])
  const filteredEntries = useMemo(() => personalEntries.filter((entry) => [entry.title, entry.body, entry.tags.join(' ')].join(' ').toLocaleLowerCase(preferences.locale).includes(query.trim().toLocaleLowerCase(preferences.locale))), [personalEntries, preferences.locale, query])
  const daoCopy = DAO_COPY[preferences.locale]
  const studyNotesCopy = STUDY_NOTES_COPY[preferences.locale]

  const groups = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(preferences.locale, { month: 'long', year: 'numeric' })
    return filtered.reduce<Array<{ label: string; readings: Reading[] }>>((all, reading) => {
      const label = formatter.format(new Date(reading.createdAt))
      const current = all.at(-1)
      if (current?.label === label) current.readings.push(reading)
      else all.push({ label, readings: [reading] })
      return all
    }, [])
  }, [filtered, preferences.locale])

  const selected = readings.find(({ id }) => id === selectedId) ?? null
  function openEditor(reading: Reading) {
    setSelectedId(reading.id); setNote(reading.note); setTags(reading.tags.join(', ')); setSaved(false)
  }
  async function saveEdits() {
    if (!selected) return
    const updated = { ...selected, note: note.trim(), tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean), updatedAt: new Date().toISOString() }
    await saveReading(updated)
    setReadings((items) => items.map((item) => item.id === updated.id ? updated : item))
    setSaved(true)
  }
  async function removeSelected() {
    if (!selected) return
    if (undoTimer.current) window.clearTimeout(undoTimer.current)
    await deleteReading(selected.id)
    setReadings((items) => items.filter(({ id }) => id !== selected.id))
    setDeleted(selected); setSelectedId(null)
    setConfirmingDelete(false)
    undoTimer.current = window.setTimeout(() => setDeleted(null), 6000)
  }
  async function undoDelete() {
    if (!deleted) return
    await saveReading(deleted)
    setReadings((items) => [deleted, ...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
    setDeleted(null)
    if (undoTimer.current) window.clearTimeout(undoTimer.current)
  }
  function review(reading: Reading) { setCurrentReading(reading); navigate('/result') }

  return (
    <div className="page-shell py-10 sm:py-16">
      <PageIntro eyebrow={c.eyebrow} title={c.title} body={c.body} />
      <JournalModeNav copy={studyNotesCopy} />
      <details className="journal-mobile-filters surface mt-7 p-4 lg:hidden"><summary>{c.contents}</summary>{renderFilters()}</details>
      <div className="journal-layout mt-8">
        <aside className="journal-rail hidden lg:block">
          <div className="surface sticky top-28 p-5">{renderFilters()}
            <div className="mt-6 border-t border-[var(--line)] pt-5"><p className="eyebrow">{c.recurring}</p>
              <div className="mt-3 flex flex-wrap gap-2">{Object.entries(counts).filter(([, count]) => count > 1).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([id, count]) => <Link key={id} to={`/hexagrams/${id}`} className="journal-pattern">#{id} · {count}×</Link>)}</div>
            </div>
            <p className="mt-6 text-xs leading-5 text-[var(--ink-soft)]">{c.backups} <Link className="font-bold text-[var(--jade)]" to="/settings">{c.settings}</Link></p>
          </div>
        </aside>

        <section aria-live="polite">
          {!loaded ? <div className="surface p-8">…</div> : <>
          {filteredEntries.length ? <div className="journal-group"><h2 className="journal-month">{daoCopy.notebook} · {filteredEntries.length}</h2><div className="space-y-3">{filteredEntries.map((entry) => <JournalTextEntryCard key={entry.id} entry={entry} locale={preferences.locale} daoCopy={daoCopy} labels={{ save: c.save, saved: c.saved, remove: c.remove }} onSave={async (updated) => { await saveJournalEntry(updated); setJournalEntries((items) => items.map((item) => item.id === updated.id ? updated : item)) }} onDelete={async (id) => { await deleteJournalEntry(id); setJournalEntries((items) => items.filter((item) => item.id !== id)) }} />)}</div></div> : null}
          {readings.length === 0 && personalEntries.length === 0 ? <div className="surface journal-empty p-8 sm:p-12"><CalendarDays size={34} /><h2 className="mt-5 text-3xl">{c.empty}</h2><p className="mt-3 text-[var(--ink-soft)]">{c.emptyBody}</p><div className="mt-7 flex flex-wrap gap-3"><Link to="/iching/reading" className="button-primary">{c.begin}<ArrowRight size={17} /></Link><Link to="/dao" className="button-secondary">{daoCopy.navDao}</Link></div></div> : filtered.length === 0 && filteredEntries.length === 0 ? <div className="surface p-8 text-[var(--ink-soft)]">{c.noResults}</div> : groups.map((group) => (
            <div key={group.label} className="journal-group"><h2 className="journal-month">{group.label}</h2>
              <div className="space-y-3">{group.readings.map((reading) => {
                const hexagram = getHexagram(reading.primaryHexagramId)
                const moving = reading.lines.filter(({ moving }) => moving).length
                return <article key={reading.id} className={`surface journal-entry ${selectedId === reading.id ? 'is-open' : ''}`}>
                  <button type="button" className="journal-entry__summary" onClick={() => selectedId === reading.id ? setSelectedId(null) : openEditor(reading)} aria-expanded={selectedId === reading.id}>
                    <span className="journal-entry__figure"><HexagramFigure linesBottomUp={hexagram.linesBottomUp} label={editorialFor(hexagram).title} /></span>
                    <span className="journal-entry__copy min-w-0 flex-1 text-left"><span className="journal-entry__date">{new Intl.DateTimeFormat(preferences.locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(reading.createdAt))}</span><strong>{reading.question || c.untitled}</strong><small>{String(hexagram.id).padStart(2, '0')} · {editorialFor(hexagram).title} · {moving ? `${moving} ${c.changed}` : c.stable}</small></span>
                    {counts[hexagram.id] > 1 ? <span className="journal-repeat">{counts[hexagram.id]}×</span> : null}<ArrowRight className="journal-entry__arrow" size={18} />
                  </button>
                  {selectedId === reading.id ? <div className="journal-editor">
                    <div><label htmlFor={`note-${reading.id}`}>{c.note}</label><textarea id={`note-${reading.id}`} className="field mt-2 min-h-32" value={note} onChange={(event) => { setNote(event.target.value); setSaved(false) }} placeholder={c.noteHint} /></div>
                    <div><label htmlFor={`tags-${reading.id}`}><Tag size={15} /> {c.tags}</label><input id={`tags-${reading.id}`} className="field mt-2" value={tags} onChange={(event) => { setTags(event.target.value); setSaved(false) }} placeholder={c.tagsHint} /></div>
                    <div className="journal-editor__actions"><button className="button-primary" type="button" onClick={saveEdits}>{saved ? c.saved : c.save}</button><button className="button-secondary" type="button" onClick={() => review(reading)}>{c.review}</button><ReadingExportActions reading={reading} compact /><button className="button-text danger-action" type="button" onClick={() => setConfirmingDelete(true)}><Trash2 size={16} /> {c.remove}</button></div>
                  </div> : null}
                </article>
              })}</div>
            </div>
          ))}</>}
        </section>
      </div>
      {confirmingDelete && selected ? <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setConfirmingDelete(false) }}>
        <div className="surface w-full max-w-md bg-[var(--paper)] p-6 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="remove-entry-title" aria-describedby="remove-entry-body">
          <span className="grid size-11 place-items-center rounded-2xl bg-red-950/10 text-red-900"><Trash2 size={22} aria-hidden="true" /></span>
          <h2 id="remove-entry-title" className="mt-5 text-3xl">{c.removeTitle}</h2>
          <p id="remove-entry-body" className="mt-3 leading-7 text-[var(--ink-soft)]">{c.removeBody}</p>
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button ref={keepEntryRef} type="button" className="button-secondary" onClick={() => setConfirmingDelete(false)}>{c.removeCancel}</button>
            <button type="button" className="button-primary !border-red-950 !bg-red-950" onClick={() => void removeSelected()}>{c.removeConfirm}</button>
          </div>
        </div>
      </div> : null}
      {deleted ? <div className="undo-toast" role="status">{c.undo}<button type="button" onClick={undoDelete}><RotateCcw size={15} />{c.undoAction}</button></div> : null}
    </div>
  )

  function renderFilters() {
    return <><label className="search-field"><Search size={17} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={c.search} /></label><div className="journal-methods">{methodOptions.map((option) => <button key={option} type="button" className={method === option ? 'is-active' : ''} onClick={() => setMethod(option)}>{c[option]}</button>)}</div><p className="mt-4 text-sm text-[var(--ink-soft)]">{filtered.length} {c.readings} · {filteredEntries.length} {daoCopy.notebook.toLocaleLowerCase(preferences.locale)}</p></>
  }
}
