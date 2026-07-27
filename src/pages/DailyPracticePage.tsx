import { ArrowLeft, ArrowRight, CircleHelp, Coins, HeartHandshake } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageIntro } from '../components/PageIntro'

const steps = [
  { icon: CircleHelp, title: 'Wait for a real question', body: 'Use a reading when something needs patient attention—not to fill a habit or force certainty.' },
  { icon: Coins, title: 'Settle, then cast', body: 'Pause, hold one open question, and let each three-coin throw be slow and ordinary.' },
  { icon: HeartHandshake, title: 'Carry it into life', body: 'Treat the result as an image for reflection, alongside conversation, action, and trusted advice.' },
]

export function DailyPracticePage() {
  return <div className="page-shell py-10 sm:py-16">
    <div className="reading-column daily-practice-page">
      <Link to="/iching" className="button-text"><ArrowLeft size={17} />Back to I Ching</Link>
      <PageIntro eyebrow="A considered practice" title="Make room before you ask." body="A small illustrated orientation for meeting the coins with attention rather than urgency." />

      <section className="surface daily-practice-hero mt-8" aria-label="Three Bulgarian one stotinka coins">
        <div className="daily-practice-hero__coins" aria-hidden="true">{[0, 1, 2].map((coin) => <span key={coin} className={`stotinka stotinka--${coin}`}><i>1</i><small>СТОТИНКА</small><b>БЪЛГАРИЯ</b></span>)}</div>
        <div><p className="eyebrow">Three coins · one line</p><h2>Let the small ritual slow the mind.</h2><p>Three ordinary 1-stotinka coins are enough. The value is not in the coins themselves, but in giving the question a quiet, undivided moment.</p></div>
      </section>

      <section className="daily-practice-steps mt-5" aria-label="How to use a reading">
        {steps.map(({ icon: Icon, title, body }, index) => <article key={title} className="surface"><span>{String(index + 1).padStart(2, '0')}</span><Icon size={22} aria-hidden="true" /><h2>{title}</h2><p>{body}</p></article>)}
      </section>

      <aside className="surface daily-practice-note mt-5"><p><strong>A reading is not a forecast or professional advice.</strong> Do not use it for medical, legal, financial, safety, or crisis decisions. Repeatedly casting on the same question can make the reflection less clear; live with the first response before asking again.</p></aside>
      <div className="mt-8 flex flex-wrap gap-3"><Link to="/iching/reading" className="button-primary">Choose a casting method <ArrowRight size={17} /></Link><Link to="/iching/history" className="button-secondary">Explore illustrated history</Link></div>
    </div>
  </div>
}
