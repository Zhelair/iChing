import { ArrowLeft, CalendarRange, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { buildMonthlyPacket } from '../ai/sourcePackets'
import { AiReflectionPanel } from '../components/AiReflectionPanel'
import { PageIntro } from '../components/PageIntro'
import { getHexagram } from '../data/hexagrams'
import type { Reading } from '../domain/types'
import { aiCopyFor } from '../i18n/aiCopy'
import { useI18n } from '../i18n/I18nContext'
import { getAllReadings } from '../storage/db'
import { deleteAiReflection, getAiReflections } from '../storage/db'
import type { AiReflectionRecord } from '../ai/types'
import { CopyReflectionButton } from '../components/CopyReflectionButton'

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function MonthlyPatternsPage() {
  const { editorialFor, preferences } = useI18n()
  const copy = aiCopyFor(preferences.locale)
  const [month, setMonth] = useState(currentMonth)
  const [readings, setReadings] = useState<Reading[]>([])
  const [history, setHistory] = useState<AiReflectionRecord[]>([])

  useEffect(() => {
    let active = true
    void getAllReadings().then((items) => { if (active) setReadings(items) })
    void getAiReflections('monthly-pattern').then((items) => { if (active) setHistory(items) })
    return () => { active = false }
  }, [])

  const [year, monthNumber] = month.split('-').map(Number)
  const from = useMemo(() => new Date(year, monthNumber - 1, 1), [monthNumber, year])
  const to = useMemo(() => new Date(year, monthNumber, 1, 0, 0, 0, -1), [monthNumber, year])
  const packet = useMemo(() => buildMonthlyPacket(readings, preferences.locale, from, to, (id) => editorialFor(getHexagram(id)).title), [editorialFor, from, preferences.locale, readings, to])
  const removeReflection = async (id: string) => { if (!window.confirm('Delete this saved monthly reflection?')) return; await deleteAiReflection(id); setHistory((items) => items.filter((item) => item.id !== id)) }

  return <div className="page-shell py-10 sm:py-16">
    <div className="reading-column">
      <Link to="/journal" className="button-text"><ArrowLeft size={17} />{copy.backJournal}</Link>
      <PageIntro eyebrow={copy.monthlyEyebrow} title={copy.monthlyTitle} body={copy.monthlyBody} />
      <section className="surface monthly-patterns mt-7">
        <header><CalendarRange size={23} aria-hidden="true" /><label><span>{copy.chooseMonth}</span><input type="month" value={month} onChange={(event) => setMonth(event.target.value || currentMonth())} /></label><strong>{packet.readingCount} {packet.readingCount === 1 ? copy.reading : copy.readings}</strong></header>
        {packet.readingCount ? <div className="monthly-patterns__grid">
          <article><h2>{copy.recurring}</h2><div>{packet.recurringHexagrams.map((item) => <span key={item.id}><b>{item.id}</b>{item.chinese} · {item.title}<strong>{item.count}×</strong></span>)}</div></article>
          <article><h2>{copy.positions}</h2><div className="monthly-patterns__positions">{[1, 2, 3, 4, 5, 6].map((position) => { const count = packet.changingLinePositions.find((item) => item.position === position)?.count ?? 0; return <span key={position}><b>{position}</b><i style={{ '--line-count': count } as React.CSSProperties} /><strong>{count}</strong></span> })}</div></article>
          <article><h2>{copy.methods}</h2><div>{packet.methods.map((item) => <span key={item.method}>{item.method}<strong>{item.count}</strong></span>)}</div></article>
        </div> : <p className="monthly-patterns__empty">{copy.noReadings}</p>}
        <footer><Sparkles size={16} aria-hidden="true" />{copy.journalExcluded}</footer>
      </section>
      {packet.readingCount ? <div className="mt-5"><AiReflectionPanel packet={packet} /></div> : null}
      {history.length ? <section className="ai-reflections-page__list mt-5" aria-label="Saved monthly reflections">{history.map((item) => <article className="surface" key={item.id}><div><span className="eyebrow">Monthly reflection · {new Intl.DateTimeFormat(preferences.locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.createdAt))}</span><strong>{item.provider} · {item.model}</strong></div><p className="ai-reflections-page__preview">{item.response}</p><footer><details><summary>Open reflection</summary><p>{item.response}</p></details><div className="flex flex-wrap gap-2"><CopyReflectionButton text={item.response} /><button type="button" className="button-text danger-action" onClick={() => void removeReflection(item.id)}><Trash2 size={15} />Delete reflection</button></div></footer></article>)}</section> : null}
    </div>
  </div>
}
