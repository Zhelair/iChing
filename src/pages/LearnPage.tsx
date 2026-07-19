import { ArrowRight, Coins, Layers3, MessageCircleQuestion, MoveRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageIntro } from '../components/PageIntro'
import { HistoryJourney } from '../components/HistoryJourney'
import type { LineValue, Polarity } from '../domain/types'
import { useI18n } from '../i18n/I18nContext'
import type { TranslationKey } from '../i18n/translations'

type LineKey = {
  value: LineValue
  before: Polarity
  after: Polarity
  moving: boolean
  nameKey: TranslationKey
  effectKey: TranslationKey
}

const lineKeys: LineKey[] = [
  { value: 6, before: 'yin', after: 'yang', moving: true, nameKey: 'line.6.name', effectKey: 'line.6.effect' },
  { value: 7, before: 'yang', after: 'yang', moving: false, nameKey: 'line.7.name', effectKey: 'line.7.effect' },
  { value: 8, before: 'yin', after: 'yin', moving: false, nameKey: 'line.8.name', effectKey: 'line.8.effect' },
  { value: 9, before: 'yang', after: 'yin', moving: true, nameKey: 'line.9.name', effectKey: 'line.9.effect' },
]

function LineGlyph({ polarity }: { polarity: Polarity }) {
  return (
    <span className={`line-glyph line-glyph--${polarity}`} aria-hidden="true">
      <span />
      {polarity === 'yin' ? <span /> : null}
    </span>
  )
}

export function LearnPage() {
  const { t } = useI18n()
  const lessons = [
    { title: t('learn.questions.title'), body: t('learn.questions.body'), icon: MessageCircleQuestion, index: '01' },
    { title: t('learn.coins.title'), body: t('learn.coins.body'), icon: Coins, index: '02' },
    { title: t('learn.lines.title'), body: t('learn.lines.body'), icon: Layers3, index: '03' },
  ]
  const readingFlow = [
    { title: t('learn.flow.primary.title'), body: t('learn.flow.primary.body') },
    { title: t('learn.flow.lines.title'), body: t('learn.flow.lines.body') },
    { title: t('learn.flow.result.title'), body: t('learn.flow.result.body') },
  ]

  return (
    <div className="page-shell py-10 sm:py-16">
      <PageIntro eyebrow={t('learn.pathEyebrow')} title={t('learn.title')} body={t('learn.body')} />

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {lessons.map(({ title, body, icon: Icon, index }) => (
          <article key={index} className="surface lesson-card flex min-h-72 flex-col justify-between p-6 sm:p-7">
            <div className="flex items-center justify-between"><span className="eyebrow">{index}</span><span className="grid size-12 place-items-center rounded-full bg-[var(--jade-light)] text-[var(--jade)]"><Icon size={22} aria-hidden="true" /></span></div>
            <div className="mt-10"><h2 className="text-2xl">{title}</h2><p className="mt-3 leading-7 text-[var(--ink-soft)]">{body}</p></div>
          </article>
        ))}
      </div>

      <HistoryJourney />

      <section id="line-lab" className="surface change-explainer mt-16 scroll-mt-28 overflow-hidden p-6 sm:p-9" aria-labelledby="line-values-title">
        <div className="grid gap-7 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
          <div>
            <p className="eyebrow">{t('learn.change.eyebrow')}</p>
            <h2 id="line-values-title" className="mt-3 text-3xl sm:text-4xl">{t('learn.change.title')}</h2>
          </div>
          <div>
            <p className="leading-7 text-[var(--ink-soft)]">{t('learn.change.body')}</p>
            <p className="change-rule mt-4"><Sparkles size={17} aria-hidden="true" /> {t('learn.change.only')}</p>
          </div>
        </div>

        <div className="line-key-grid mt-8">
          {lineKeys.map((line) => (
            <article key={line.value} className={`line-value-card ${line.moving ? 'line-value-card--moving' : 'line-value-card--stable'}`}>
              <div className="flex items-start justify-between gap-4">
                <div><span className="line-value-card__number">{line.value}</span><h3 className="mt-1 text-xl">{t(line.nameKey)}</h3></div>
                <span className="line-value-card__badge">{t(line.moving ? 'line.changing' : 'line.stable')}</span>
              </div>
              <div className="line-transition" aria-hidden="true">
                <LineGlyph polarity={line.before} />
                <span className="line-transition__operator">{line.moving ? '→' : '='}</span>
                <LineGlyph polarity={line.after} />
              </div>
              <p className="mt-5 text-sm leading-6 text-[var(--ink-soft)]">{t(line.effectKey)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="surface reading-flow-section mt-5 p-6 sm:p-9" aria-labelledby="reading-order-title">
        <div className="max-w-2xl">
          <p className="eyebrow">{t('learn.reading.eyebrow')}</p>
          <h2 id="reading-order-title" className="mt-3 text-3xl sm:text-4xl">{t('learn.reading.title')}</h2>
          <p className="mt-4 leading-7 text-[var(--ink-soft)]">{t('learn.reading.body')}</p>
        </div>

        <div className="reading-flow mt-8">
          {readingFlow.map((item, index) => (
            <div className="contents" key={item.title}>
              <article className="reading-flow__step">
                <span className="reading-flow__watermark" aria-hidden="true">{index + 1}</span>
                <h3 className="relative text-xl">{item.title}</h3>
                <p className="relative mt-3 text-sm leading-6 text-[var(--ink-soft)]">{item.body}</p>
              </article>
              {index < readingFlow.length - 1 ? <MoveRight className="reading-flow__arrow" aria-hidden="true" /> : null}
            </div>
          ))}
        </div>

        <aside className="no-change-note mt-7">
          <div className="no-change-note__symbol" aria-hidden="true"><LineGlyph polarity="yang" /></div>
          <div><h3 className="text-xl">{t('learn.noChange.title')}</h3><p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{t('learn.noChange.body')}</p></div>
        </aside>
      </section>

      <div className="mt-8"><Link to="/reading" className="button-primary">{t('learn.begin')} <ArrowRight size={17} aria-hidden="true" /></Link></div>
    </div>
  )
}
