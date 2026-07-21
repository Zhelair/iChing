import { Check, ChevronLeft, ChevronRight, Sprout } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { DaoCopy } from '../data/daoContent'
import type { Locale } from '../domain/locales'
import type { JournalEntry } from '../domain/types'
import { saveJournalEntry } from '../storage/db'

const fields = ['notice', 'allow', 'respond', 'reflect'] as const
const hintKeys = { notice: 'noticeHint', allow: 'allowHint', respond: 'respondHint', reflect: 'reflectHint' } as const

export function DaoLivingPractice({ copy, locale }: { copy: DaoCopy; locale: Locale }) {
  const [answers, setAnswers] = useState<Record<(typeof fields)[number], string>>({ notice: '', allow: '', respond: '', reflect: '' })
  const [activeIndex, setActiveIndex] = useState(0)
  const [saved, setSaved] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previousIndexRef = useRef(activeIndex)
  const field = fields[activeIndex]
  const isLast = activeIndex === fields.length - 1
  const hasContent = fields.some((item) => answers[item].trim())

  useEffect(() => {
    if (previousIndexRef.current === activeIndex) return
    previousIndexRef.current = activeIndex
    textareaRef.current?.focus({ preventScroll: true })
  }, [activeIndex])

  async function save() {
    if (!hasContent) return
    const now = new Date().toISOString()
    const body = fields.map((item) => `${copy[item]}\n${answers[item].trim()}`).filter((_, index) => answers[fields[index]].trim()).join('\n\n')
    const entry: JournalEntry = { id: crypto.randomUUID(), schemaVersion: 1, createdAt: now, updatedAt: now, locale, kind: 'practice', title: copy.livingTitle, body, tags: ['dao', 'daily-practice'], sourceId: 'notice-allow-respond-reflect' }
    await saveJournalEntry(entry)
    setSaved(true)
  }

  return <section id="dao-living" className="surface dao-living scroll-mt-24" aria-labelledby="dao-living-title">
    <div className="dao-living__intro"><span className="dao-section-icon"><Sprout size={22} /></span><p className="eyebrow mt-5">{copy.living}</p><h2 id="dao-living-title" className="mt-3 text-3xl sm:text-4xl">{copy.livingTitle}</h2><p className="mt-3 leading-7 text-[var(--ink-soft)]">{copy.livingBody}</p></div>
    <div className="dao-living__journey">
      <div className="dao-living__steps" role="tablist" aria-label={copy.livingTitle}>
        {fields.map((item, index) => <button key={item} type="button" role="tab" aria-selected={index === activeIndex} className={index === activeIndex ? 'is-active' : answers[item].trim() ? 'is-complete' : ''} onClick={() => setActiveIndex(index)}><span aria-hidden="true">{answers[item].trim() ? <Check size={14} /> : null}</span>{copy[item]}</button>)}
      </div>
      <div className="dao-living__field" role="tabpanel">
        <label htmlFor={`dao-${field}`}>{copy[field]}</label>
        <textarea ref={textareaRef} id={`dao-${field}`} value={answers[field]} onChange={(event) => { setAnswers((current) => ({ ...current, [field]: event.target.value })); setSaved(false) }} placeholder={copy[hintKeys[field]]} />
      </div>
      <div className="dao-living__navigation">
        {activeIndex > 0 ? <button type="button" className="button-secondary" onClick={() => setActiveIndex((value) => value - 1)}><ChevronLeft size={17} />{copy[fields[activeIndex - 1]]}</button> : <span />}
        {!isLast ? <button type="button" className="button-primary" disabled={!answers[field].trim()} onClick={() => setActiveIndex((value) => value + 1)}>{copy[fields[activeIndex + 1]]}<ChevronRight size={17} /></button> : <button type="button" className="button-primary" disabled={!hasContent} onClick={() => void save()}>{saved ? <Check size={17} /> : <NotebookPenIcon />}{saved ? copy.journalSaved : copy.saveLiving}</button>}
      </div>
      <p className="sr-only" role="status">{copy[field]}</p>
    </div>
  </section>
}

function NotebookPenIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg> }
