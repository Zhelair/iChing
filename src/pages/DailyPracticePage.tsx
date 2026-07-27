import { ArrowLeft, ArrowRight, CircleHelp, Coins, HeartHandshake } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HistoryJourney } from '../components/HistoryJourney'
import { PageIntro } from '../components/PageIntro'
import { dailyPracticeCopy } from '../i18n/dailyPracticeCopy'
import { useI18n } from '../i18n/I18nContext'

export function DailyPracticePage() {
  const { preferences } = useI18n()
  const copy = dailyPracticeCopy[preferences.locale]
  const steps = [
    { icon: CircleHelp, title: copy.steps[0], body: copy.stepBodies[0] },
    { icon: Coins, title: copy.steps[1], body: copy.stepBodies[1] },
    { icon: HeartHandshake, title: copy.steps[2], body: copy.stepBodies[2] },
  ]

  return <div className="page-shell py-10 sm:py-16">
    <div className="daily-practice-page">
      <Link to="/iching" className="button-text"><ArrowLeft size={17} />{copy.back}</Link>
      <PageIntro eyebrow={copy.eyebrow} title={copy.title} body={copy.intro} />

      <section className="surface daily-practice-hero mt-8" aria-label={copy.coinEyebrow}>
        <div className="daily-practice-hero__coins" aria-hidden="true">{[0, 1, 2].map((coin) => <span key={coin} className={`stotinka stotinka--${coin}`}>{Array.from({ length: 12 }, (_, star) => <em key={star} style={{ transform: `rotate(${star * 30}deg) translateY(-3.05rem)` }}>✦</em>)}<i>1</i><small>СТОТИНКА</small><b>2000</b></span>)}</div>
        <div><p className="eyebrow">{copy.coinEyebrow}</p><h2>{copy.coinTitle}</h2><p>{copy.coinBody}</p></div>
      </section>

      <section className="daily-practice-steps mt-5" aria-label={copy.coinEyebrow}>
        {steps.map(({ icon: Icon, title, body }, index) => <article key={title} className="surface"><span>{String(index + 1).padStart(2, '0')}</span><Icon size={22} aria-hidden="true" /><h2>{title}</h2><p>{body}</p></article>)}
      </section>

      <aside className="surface daily-practice-note mt-5"><p>{copy.note}</p></aside>
      <div className="mt-8 flex flex-wrap gap-3"><Link to="/iching/reading" className="button-primary">{copy.method} <ArrowRight size={17} /></Link></div>
      <div id="history" className="scroll-mt-28"><HistoryJourney /></div>
    </div>
  </div>
}
