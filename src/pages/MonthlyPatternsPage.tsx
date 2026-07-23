import { ArrowLeft, CalendarRange, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { buildMonthlyPacket } from '../ai/sourcePackets'
import type { AiReflectionRecord } from '../ai/types'
import { AiReflectionPanel } from '../components/AiReflectionPanel'
import { PageIntro } from '../components/PageIntro'
import { getHexagram } from '../data/hexagrams'
import type { Reading } from '../domain/types'
import { aiCopyFor } from '../i18n/aiCopy'
import { useI18n } from '../i18n/I18nContext'
import { clearAiReflections, getAiReflections, getAllReadings } from '../storage/db'

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
    void getAiReflections('monthly-pattern').then((items) => { if (active) setHistory(items.slice(0, 5)) })
    return () => { active = false }
  }, [])
  const [year, monthNumber] = month.split('-').map(Number)
  const from = useMemo(() => new Date(year, monthNumber - 1, 1), [monthNumber, year])
  const to = useMemo(() => new Date(year, monthNumber, 1, 0, 0, 0, -1), [monthNumber, year])
  const packet = useMemo(() => buildMonthlyPacket(readings, preferences.locale, from, to, (id) => editorialFor(getHexagram(id)).title), [editorialFor, from, preferences.locale, readings, to])

  const clearHistory = async () => { if (!window.confirm('Delete the five saved monthly AI reflections?')) return; await clearAiReflections(); setHistory([]) }

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
      <section className="surface ai-history mt-5"><header><h2>{copy.history}</h2>{history.length ? <button type="button" className="button-text danger-action" onClick={() => void clearHistory()}><Trash2 size={15} />{copy.clearHistory}</button> : null}</header>{history.length ? <div>{history.map((item) => <article key={item.id}><span>{new Intl.DateTimeFormat(preferences.locale, { dateStyle: 'medium' }).format(new Date(item.createdAt))} · {item.model}</span><p>{item.response}</p></article>)}</div> : <p>{copy.noHistory}</p>}</section>
    </div>
  </div>
}
