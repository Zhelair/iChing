import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { HexagramFigure } from '../components/HexagramFigure'
import { getHexagram } from '../data/hexagrams'
import { useI18n } from '../i18n/I18nContext'

export function HexagramPage() {
  const { number } = useParams()
  const id = Number(number)
  if (!Number.isInteger(id) || id < 1 || id > 64) return <Navigate to="/library" replace />

  return <HexagramStudy id={id} />
}

function HexagramStudy({ id }: { id: number }) {
  const { preferences, t } = useI18n()
  const hexagram = getHexagram(id)
  const editorial = hexagram.editorial[preferences.locale]

  return (
    <div className="page-shell py-8 sm:py-14">
      <div className="reading-column">
        <Link to="/library" className="button-quiet -ml-3 mb-5"><ArrowLeft size={18} aria-hidden="true" /> {t('common.back')}</Link>
        <header className="surface overflow-hidden">
          <div className="grid min-h-80 gap-8 p-7 sm:grid-cols-[1fr_11rem] sm:items-center sm:p-10">
            <div>
              <p className="eyebrow">{String(id).padStart(2, '0')} · {hexagram.chinese} · {hexagram.pinyin}</p>
              <h1 className="mt-4 text-4xl font-medium leading-tight sm:text-5xl">{editorial.title}</h1>
              <p className="mt-5 leading-8 text-[var(--ink-soft)]">{editorial.coreThread}</p>
            </div>
            <div className="grid min-h-52 place-items-center rounded-[1.7rem] bg-[var(--paper-deep)]">
              <HexagramFigure linesBottomUp={hexagram.linesBottomUp} label={`Hexagram ${id}, ${editorial.title}`} className="text-[var(--obsidian)]" />
            </div>
          </div>
          <div className="grid grid-cols-2 border-t border-[var(--line)] text-center text-xs font-bold uppercase tracking-[.12em] text-[var(--ink-soft)]">
            <div className="border-r border-[var(--line)] px-3 py-4">↑ {hexagram.trigrams.upper}</div>
            <div className="px-3 py-4">↓ {hexagram.trigrams.lower}</div>
          </div>
        </header>

        <section className="surface mt-5 p-6 sm:p-8">
          <h2 className="text-2xl">{t('result.whenAppears')}</h2>
          <p className="mt-4 leading-8 text-[var(--ink-soft)]">{editorial.whenItAppears}</p>
        </section>

        <section className="surface mt-5 p-6 sm:p-8">
          <h2 className="text-2xl">{t('result.questions')}</h2>
          <ol className="mt-5 space-y-4">
            {editorial.reflectionQuestions.map((question, index) => <li key={question} className="flex gap-4 leading-7 text-[var(--ink-soft)]"><span className="font-editorial text-xl text-[var(--brass)]">{index + 1}</span>{question}</li>)}
          </ol>
        </section>

        <section className="surface mt-5 p-6 sm:p-8">
          <h2 className="text-2xl">{t('result.movingLines')}</h2>
          <div className="mt-5 divide-y divide-[var(--line)]">
            {[1, 2, 3, 4, 5, 6].map((position) => (
              <article key={position} className="grid grid-cols-[2.8rem_1fr] gap-4 py-5 first:pt-0 last:pb-0">
                <span className="grid size-10 place-items-center rounded-full bg-[var(--jade-light)] font-bold text-[var(--jade)]">{position}</span>
                <p className="leading-7 text-[var(--ink-soft)]">{editorial.lineReflections[String(position)]}</p>
              </article>
            ))}
          </div>
        </section>

        <details className="surface mt-5 p-6 sm:p-8">
          <summary className="cursor-pointer text-xl font-bold text-[var(--jade)]">{t('result.source')}</summary>
          <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">{t('detail.sourceNote')}</p>
          <div className="mt-6 rounded-2xl bg-[var(--paper-deep)] p-5">
            <h3 className="text-lg">{t('result.classical')}</h3>
            <p className="mt-3 font-editorial text-lg leading-8">{hexagram.classical.judgment}</p>
            <ol className="mt-4 space-y-2 text-sm leading-6 text-[var(--ink-soft)]">
              {hexagram.classical.lines.map((line, index) => <li key={line}><span className="mr-2 font-bold text-[var(--ink)]">{index + 1}.</span>{line}</li>)}
            </ol>
          </div>
          <dl className="mt-5 grid gap-3 text-sm leading-6 text-[var(--ink-soft)]">
            <div><dt className="inline font-bold text-[var(--ink)]">{t('detail.status')}: </dt><dd className="inline">{hexagram.provenance.status}</dd></div>
            <div><dt className="inline font-bold text-[var(--ink)]">{t('detail.sourceLabel')}: </dt><dd className="inline">{hexagram.provenance.classicalSource}</dd></div>
          </dl>
        </details>
      </div>
    </div>
  )
}
