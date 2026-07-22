import { Check, ChevronLeft, ChevronRight, MessageCircle, Shield, Sprout } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { DaoLivingCopy } from '../data/daoLivingContent'
import type { Locale } from '../domain/locales'
import type { JournalEntry } from '../domain/types'
import { saveJournalEntry } from '../storage/db'

const emptyAnswers = () => ['', '', '', ''] as [string, string, string, string]

export function DaoLivingPractice({ copy, locale }: { copy: DaoLivingCopy; locale: Locale }) {
  const [contextId, setContextId] = useState(copy.contexts[0].id)
  const [answersByContext, setAnswersByContext] = useState<Record<string, [string, string, string, string]>>({})
  const [activeIndex, setActiveIndex] = useState(0)
  const [saved, setSaved] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previousIndexRef = useRef(activeIndex)
  const context = copy.contexts.find((item) => item.id === contextId) ?? copy.contexts[0]
  const answers = answersByContext[context.id] ?? emptyAnswers()
  const hasContent = answers.some((answer) => answer.trim())
  const isLast = activeIndex === copy.steps.length - 1

  useEffect(() => {
    if (previousIndexRef.current === activeIndex) return
    previousIndexRef.current = activeIndex
    textareaRef.current?.focus({ preventScroll: true })
  }, [activeIndex])

  function selectContext(id: string) {
    setContextId(id)
    setActiveIndex(0)
    setSaved(false)
  }

  function updateAnswer(value: string) {
    setAnswersByContext((current) => {
      const next = [...(current[context.id] ?? emptyAnswers())] as [string, string, string, string]
      next[activeIndex] = value
      return { ...current, [context.id]: next }
    })
    setSaved(false)
  }

  async function save() {
    if (!hasContent) return
    const now = new Date().toISOString()
    const body = [`${copy.choose}: ${context.title}`, ...copy.steps.flatMap((step, index) => answers[index].trim() ? [`${step}\n${answers[index].trim()}`] : [])].join('\n\n')
    const entry: JournalEntry = { id: crypto.randomUUID(), schemaVersion: 1, createdAt: now, updatedAt: now, locale, kind: 'practice', title: `${copy.title}: ${context.title}`, body, tags: ['dao', 'daily-practice', context.id], sourceId: `ordinary-life-lab-${context.id}` }
    await saveJournalEntry(entry)
    setSaved(true)
  }

  return <section id="dao-living" className="dao-living-lab scroll-mt-24" aria-labelledby="dao-living-title">
    <div className="surface dao-living-lab__intro"><span className="dao-section-icon"><Sprout size={22} aria-hidden="true" /></span><div><p className="eyebrow">{copy.title}</p><h2 id="dao-living-title">{copy.choose}</h2></div></div>
    <div className="dao-living-lab__contexts" role="tablist" aria-label={copy.choose}>{copy.contexts.map((item, index) => <button key={item.id} type="button" role="tab" aria-selected={item.id === context.id} className={item.id === context.id ? 'is-active' : ''} onClick={() => selectContext(item.id)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong></button>)}</div>
    <article className="surface dao-living-lab__workspace">
      <div className="dao-living-lab__context"><span className="dao-section-icon"><MessageCircle size={21} aria-hidden="true" /></span><div><p className="eyebrow">{copy.experiment}</p><h3>{context.title}</h3><p>{context.body}</p></div></div>
      <aside className="dao-living-lab__safety"><Shield size={18} aria-hidden="true" /><p>{copy.safety}</p></aside>
      <div className="dao-living-lab__journey">
        <div className="dao-living__current" aria-hidden="true" style={{ '--living-progress': activeIndex / (copy.steps.length - 1) } as CSSProperties}><span className="dao-living__current-line" />{copy.steps.map((step, index) => <i key={step} className={index === activeIndex ? 'is-current' : index < activeIndex || answers[index].trim() ? 'is-complete' : ''}>{index < activeIndex || answers[index].trim() ? <Check size={13} /> : index + 1}</i>)}</div>
        <div className="dao-living__steps" role="tablist" aria-label={copy.title}>{copy.steps.map((step, index) => <button key={step} type="button" role="tab" aria-selected={index === activeIndex} className={index === activeIndex ? 'is-active' : answers[index].trim() ? 'is-complete' : ''} onClick={() => setActiveIndex(index)}>{step}</button>)}</div>
        <div className="dao-living__field" role="tabpanel"><label htmlFor={`dao-living-${context.id}-${activeIndex}`}>{copy.steps[activeIndex]}</label><textarea ref={textareaRef} id={`dao-living-${context.id}-${activeIndex}`} value={answers[activeIndex]} onChange={(event) => updateAnswer(event.target.value)} placeholder={context.prompts[activeIndex]} /></div>
        <div className="dao-living__navigation">{activeIndex > 0 ? <button type="button" className="button-secondary" onClick={() => setActiveIndex((value) => value - 1)}><ChevronLeft size={17} />{copy.steps[activeIndex - 1]}</button> : <span />}{!isLast ? <button type="button" className="button-primary" disabled={!answers[activeIndex].trim()} onClick={() => setActiveIndex((value) => value + 1)}>{copy.steps[activeIndex + 1]}<ChevronRight size={17} /></button> : <button type="button" className="button-primary" disabled={!hasContent} onClick={() => void save()}>{saved ? <Check size={17} /> : null}{saved ? copy.saved : copy.save}</button>}</div>
      </div>
    </article>
  </section>
}
