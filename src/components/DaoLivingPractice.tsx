import { Check, Sprout } from 'lucide-react'
import { useState } from 'react'
import type { DaoCopy } from '../data/daoContent'
import type { Locale } from '../domain/locales'
import type { JournalEntry } from '../domain/types'
import { saveJournalEntry } from '../storage/db'

const fields = ['notice', 'allow', 'respond', 'reflect'] as const
const hintKeys = { notice: 'noticeHint', allow: 'allowHint', respond: 'respondHint', reflect: 'reflectHint' } as const

export function DaoLivingPractice({ copy, locale }: { copy: DaoCopy; locale: Locale }) {
  const [answers, setAnswers] = useState<Record<(typeof fields)[number], string>>({ notice: '', allow: '', respond: '', reflect: '' })
  const [saved, setSaved] = useState(false)
  const hasContent = fields.some((field) => answers[field].trim())

  async function save() {
    if (!hasContent) return
    const now = new Date().toISOString()
    const body = fields.map((field) => `${copy[field]}\n${answers[field].trim()}`).filter((_, index) => answers[fields[index]].trim()).join('\n\n')
    const entry: JournalEntry = { id: crypto.randomUUID(), schemaVersion: 1, createdAt: now, updatedAt: now, locale, kind: 'practice', title: copy.livingTitle, body, tags: ['dao', 'daily-practice'], sourceId: 'notice-allow-respond-reflect' }
    await saveJournalEntry(entry)
    setSaved(true)
  }

  return <section id="dao-living" className="surface dao-living scroll-mt-24" aria-labelledby="dao-living-title">
    <div className="dao-living__intro"><span className="dao-section-icon"><Sprout size={22} /></span><p className="eyebrow mt-5">{copy.living}</p><h2 id="dao-living-title" className="mt-3 text-3xl sm:text-4xl">{copy.livingTitle}</h2><p className="mt-3 leading-7 text-[var(--ink-soft)]">{copy.livingBody}</p></div>
    <div className="dao-living__fields">{fields.map((field, index) => <div key={field} className="dao-living__field"><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><label htmlFor={`dao-${field}`}>{copy[field]}</label><textarea id={`dao-${field}`} value={answers[field]} onChange={(event) => { setAnswers((current) => ({ ...current, [field]: event.target.value })); setSaved(false) }} placeholder={copy[hintKeys[field]]} /></div>)}</div>
    <button type="button" className="button-primary mt-6" disabled={!hasContent} onClick={() => void save()}>{saved ? <Check size={17} /> : <NotebookPenIcon />}{saved ? copy.journalSaved : copy.saveLiving}</button>
  </section>
}

function NotebookPenIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg> }
