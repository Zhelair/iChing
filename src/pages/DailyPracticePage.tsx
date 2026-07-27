import { ArrowLeft, ArrowRight, CircleHelp, Coins, HeartHandshake } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageIntro } from '../components/PageIntro'
import { HistoryJourney } from '../components/HistoryJourney'

const steps = [
  { icon: CircleHelp, title: 'Arrive before you ask', body: 'Use a reading when something needs patient attention—not to fill a habit or force certainty. A walk, sport, breath practice, or a few quiet minutes can help you arrive more present.' },
  { icon: Coins, title: 'Three coins make one line', body: 'Choose three matching coins. Heads count 3 and tails count 2; shake and let the coins fall on a clear table or tray. Repeat six times, building from the bottom line upward.' },
  { icon: HeartHandshake, title: 'Carry it into life', body: 'Treat the result as an image for reflection, alongside conversation, action, and trusted advice.' },
]

export function DailyPracticePage() {
  return <div className="page-shell py-10 sm:py-16">
    <div className="daily-practice-page">
      <Link to="/iching" className="button-text"><ArrowLeft size={17} />Back to I Ching</Link>
      <PageIntro eyebrow="A considered practice" title="Make room before you ask." body="A daily ritual for bringing one honest question into focus." />

      <section className="surface daily-practice-hero mt-8" aria-label="Three matching coins make one line">
        <div className="daily-practice-hero__coins" aria-hidden="true">{[0, 1, 2].map((coin) => <span key={coin} className={`stotinka stotinka--${coin}`}>{Array.from({ length: 12 }, (_, star) => <em key={star} style={{ transform: `rotate(${star * 30}deg) translateY(-3.05rem)` }}>✦</em>)}<i>1</i><small>СТОТИНКА</small><b>2000</b></span>)}</div>
        <div><p className="eyebrow">Three coins make one line</p><h2>Let the small ritual slow the mind.</h2><p>Use three matching coins. The coin values do not matter—the shared faces do. Heads count 3 and tails count 2 in this method.</p></div>
      </section>

      <section className="daily-practice-steps mt-5" aria-label="How to use a reading">
        {steps.map(({ icon: Icon, title, body }, index) => <article key={title} className="surface"><span>{String(index + 1).padStart(2, '0')}</span><Icon size={22} aria-hidden="true" /><h2>{title}</h2><p>{body}</p></article>)}
      </section>

      <aside className="surface daily-practice-note mt-5"><p><strong>A reading is not a forecast or professional advice.</strong> Do not use it for medical, legal, financial, safety, or crisis decisions. Repeatedly casting on the same question can make the reflection less clear; live with the first response before asking again.</p></aside>
      <div className="mt-8 flex flex-wrap gap-3"><Link to="/iching/reading" className="button-primary">Choose a casting method <ArrowRight size={17} /></Link></div>
      <div id="history" className="scroll-mt-28"><HistoryJourney /></div>
    </div>
  </div>
}
