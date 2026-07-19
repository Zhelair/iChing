import { ArrowRight, BookOpen, Check, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HexagramFigure } from '../components/HexagramFigure'
import { ReadingExportActions } from '../components/ReadingExportActions'
import { getHexagram } from '../data/hexagrams'
import type { LineValue, Reading } from '../domain/types'
import { useI18n } from '../i18n/I18nContext'
import type { TranslationKey } from '../i18n/translations'
import { saveReading } from '../storage/db'
import { getCurrentReading, setCurrentReading } from '../storage/session'

const lineMeta: Record<LineValue, { nameKey: TranslationKey; effectKey: TranslationKey }> = {
  6: { nameKey: 'line.6.name', effectKey: 'line.6.effect' },
  7: { nameKey: 'line.7.name', effectKey: 'line.7.effect' },
  8: { nameKey: 'line.8.name', effectKey: 'line.8.effect' },
  9: { nameKey: 'line.9.name', effectKey: 'line.9.effect' },
}

function ReadingHexagram({ reading, type }: { reading: Reading; type: 'primary' | 'resulting' }) {
  const { editorialFor, t } = useI18n()
  const hexagram = getHexagram(type === 'primary' ? reading.primaryHexagramId : reading.resultingHexagramId)
  const editorial = editorialFor(hexagram)
  const pattern = type === 'primary' ? reading.lines : reading.lines.map((line) => ({ polarity: line.transformedPolarity }))

  return (
    <div className="flex min-w-0 flex-1 items-center gap-5 rounded-3xl bg-white/45 p-5">
      <HexagramFigure linesBottomUp={pattern} label={`${t(type === 'primary' ? 'result.primary' : 'result.resulting')} ${hexagram.id}`} className="!w-20 shrink-0 text-[var(--obsidian)]" />
      <div className="min-w-0">
        <p className="text-xs font-extrabold uppercase tracking-[.13em] text-[var(--jade)]">{t(type === 'primary' ? 'result.primary' : 'result.resulting')} · {hexagram.id}</p>
        <p className="mt-1 truncate font-editorial text-xl font-semibold">{hexagram.chinese} · {editorial.title}</p>
      </div>
    </div>
  )
}

export function ResultPage() {
  const { editorialFor, editorialMetaFor, t } = useI18n()
  const [reading, setReading] = useState(getCurrentReading)
  const [note, setNote] = useState(reading?.note ?? '')
  const [saved, setSaved] = useState(false)

  if (!reading) {
    return (
      <div className="reading-column px-4 py-20 text-center">
        <h1 className="text-4xl">{t('result.empty.title')}</h1>
        <p className="mt-4 text-[var(--ink-soft)]">{t('result.empty.body')}</p>
        <Link to="/reading" className="button-primary mt-8">{t('home.start')}</Link>
      </div>
    )
  }

  const primary = getHexagram(reading.primaryHexagramId)
  const resulting = getHexagram(reading.resultingHexagramId)
  const primaryEditorial = editorialFor(primary)
  const resultingEditorial = editorialFor(resulting)
  const primaryEditorialMeta = editorialMetaFor(primary)
  const movingLines = reading.lines.filter((line) => line.moving)
  const specialStatement = movingLines.length === 6 && (primary.id === 1 || primary.id === 2)
    ? primary.classical.lines[6]
    : undefined
  const specialReflection = specialStatement ? primaryEditorial.lineReflections.all : undefined

  async function saveNote() {
    if (!reading) return
    const next = { ...reading, note: note.trim(), updatedAt: new Date().toISOString() }
    await saveReading(next)
    setCurrentReading(next)
    setReading(next)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="result-page page-shell py-10 sm:py-16">
      <div className="reading-column space-y-5">
        <header className="result-heading">
          <div><p className="eyebrow">{t('result.whatAppeared')}</p><h1 className="mt-3 text-4xl font-medium sm:text-5xl">{primaryEditorial.title}</h1>{reading.question ? <p className="mt-4 max-w-xl font-editorial text-lg italic leading-7 text-[var(--ink-soft)]">“{reading.question}”</p> : null}</div>
          <ReadingExportActions reading={reading} />
        </header>

        <section className="surface p-4 sm:p-6" aria-labelledby="appeared-title">
          <h2 id="appeared-title" className="sr-only">{t('result.whatAppeared')}</h2>
          <div className={`grid gap-3 ${movingLines.length ? 'sm:grid-cols-[1fr_auto_1fr] sm:items-center' : 'mx-auto max-w-md'}`}>
            <ReadingHexagram reading={reading} type="primary" />
            {movingLines.length ? <><ArrowRight className="mx-auto rotate-90 text-[var(--brass)] sm:rotate-0" aria-hidden="true" /><ReadingHexagram reading={reading} type="resulting" /></> : null}
          </div>
          <p className="mt-4 text-center text-sm leading-6 text-[var(--ink-soft)]">{movingLines.length ? t('result.resultingHint') : t('result.noChangeDetailed')}</p>
        </section>

        <section className="surface p-6 sm:p-8">
          <p className="eyebrow">01 · {t('result.firstReflection')}</p>
          <h2 className="mt-3 text-3xl">{primaryEditorial.title}</h2>
          <p className="mt-4 text-base leading-8 text-[var(--ink-soft)]">{primaryEditorial.coreThread}</p>
          <h3 className="mt-7 text-lg font-semibold">{t('result.whenAppears')}</h3>
          <p className="mt-2 leading-7 text-[var(--ink-soft)]">{primaryEditorial.whenItAppears}</p>
        </section>

        {movingLines.length ? (
          <section className="surface p-6 sm:p-8">
            <p className="eyebrow">02 · {t('result.movingLines')}</p>
            <div className="mt-5 space-y-5">
              {movingLines.map((line) => (
                <article key={line.position} className="grid grid-cols-[2.7rem_1fr] gap-4 border-t border-[var(--line)] pt-5 first:border-0 first:pt-0">
                  <span className="grid size-11 place-items-center rounded-full bg-[var(--jade-light)] font-extrabold text-[var(--jade)]">{line.position}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{t('common.line')} {line.position} · {line.value} · {t(lineMeta[line.value].nameKey)}</h3>
                    <p className="mt-1 text-sm font-semibold text-[var(--brass)]">{t(lineMeta[line.value].effectKey)}</p>
                    <div className="mt-4 grid gap-3">
                      <div className="rounded-2xl bg-[var(--paper-deep)] px-4 py-3">
                        <p className="text-xs font-extrabold uppercase tracking-[.12em] text-[var(--jade)]">{t('result.receivedLine')}</p>
                        <p lang="zh-Hant" className="mt-2 font-editorial text-lg leading-8 text-[var(--ink)]">{primary.classical.lines[line.position - 1]}</p>
                      </div>
                      <div className="px-1">
                        <p className="text-xs font-extrabold uppercase tracking-[.12em] text-[var(--brass)]">{t('result.modernReflection')}</p>
                        <p className="mt-2 leading-7 text-[var(--ink-soft)]">{primaryEditorial.lineReflections[String(line.position)]}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
              {specialStatement ? (
                <article className="rounded-3xl border border-[var(--line)] bg-[var(--paper-deep)] p-5 sm:p-6">
                  <p className="text-xs font-extrabold uppercase tracking-[.12em] text-[var(--jade)]">{t('result.specialStatement')}</p>
                  <p lang="zh-Hant" className="mt-3 font-editorial text-xl leading-8">{specialStatement}</p>
                  {specialReflection ? <><p className="mt-5 text-xs font-extrabold uppercase tracking-[.12em] text-[var(--brass)]">{t('result.specialReflection')}</p><p className="mt-2 leading-7 text-[var(--ink-soft)]">{specialReflection}</p></> : null}
                </article>
              ) : null}
            </div>
          </section>
        ) : null}

        {movingLines.length ? (
          <section className="surface p-6 sm:p-8">
            <p className="eyebrow">03 · {t('result.whatChanging')}</p>
            <h2 className="mt-3 text-3xl">{resultingEditorial.title}</h2>
            <p className="mt-4 leading-8 text-[var(--ink-soft)]">{resultingEditorial.coreThread}</p>
          </section>
        ) : null}

        <section className="surface p-6 sm:p-8">
          <h2 className="text-2xl">{t('result.questions')}</h2>
          <ul className="mt-5 space-y-3">
            {primaryEditorial.reflectionQuestions.map((question) => <li key={question} className="flex gap-3 leading-7 text-[var(--ink-soft)]"><ChevronRight className="mt-1 shrink-0 text-[var(--brass)]" size={18} aria-hidden="true" />{question}</li>)}
          </ul>
          <Link to={`/hexagrams/${primary.id}`} className="button-secondary mt-7"><BookOpen size={17} aria-hidden="true" /> {t('result.explore')}</Link>
        </section>

        <section className={`result-journal surface p-6 sm:p-8 ${note.trim() ? 'has-note' : 'is-empty'}`}>
          <p className="eyebrow">{t('result.journal')}</p>
          <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">{t('result.journalBody')}</p>
          <textarea className="field mt-5 !min-h-36 resize-y" value={note} onChange={(event) => setNote(event.target.value)} placeholder={t('result.notePlaceholder')} maxLength={4000} />
          <p className="print-journal-note mt-4 leading-7 text-[var(--ink-soft)]">{note}</p>
          <button type="button" onClick={saveNote} className="button-primary mt-4">{saved ? <Check size={17} aria-hidden="true" /> : null}{saved ? t('common.saved') : t('result.saveNote')}</button>
        </section>

        <details className="surface p-6 text-sm">
          <summary className="cursor-pointer font-bold text-[var(--jade)]">{t('result.source')}</summary>
          <div className="mt-5 space-y-4 leading-6 text-[var(--ink-soft)]">
            <p>{t('result.sourceScope')}</p>
            <div><strong className="text-[var(--ink)]">{t('result.classical')}:</strong> <span lang="zh-Hant">{primary.classical.judgment}</span></div>
            <div><strong className="text-[var(--ink)]">{t('detail.sourceLabel')}:</strong> {primary.provenance.classicalSource} · {primary.provenance.textReference}</div>
            <div><strong className="text-[var(--ink)]">{t('result.interpretation')}:</strong> {primary.provenance.contentType} · {reading.contentVersion}</div>
            <div><strong className="text-[var(--ink)]">{t('detail.status')}:</strong> {t('detail.draftStatus')} · {primaryEditorialMeta.variant}</div>
            <p>{t('result.disclaimer')}</p>
          </div>
        </details>

        <div className="flex justify-center pt-3"><Link to="/reading" className="button-primary">{t('result.newReading')} <ArrowRight size={17} aria-hidden="true" /></Link></div>
      </div>
    </div>
  )
}
