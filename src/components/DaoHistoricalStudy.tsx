import { ArrowRight, BookOpenCheck, ExternalLink, Layers3, ScrollText } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { DaoLearningCopy } from '../data/daoLearningContent'

const ITEMS = [
  { key: 'heartMind' as const, body: 'heartMindBody' as const, action: 'readSource' as const, href: 'https://ctext.org/zhuangzi/man-in-the-world-associated-with/ens' },
  { key: 'sittingForgetting' as const, body: 'sittingForgettingBody' as const, action: 'readSource' as const, href: 'https://ctext.org/zhuangzi/great-and-most-honoured-master/ens' },
  { key: 'laterTraditions' as const, body: 'laterTraditionsBody' as const, action: 'readBackground' as const, href: 'https://plato.stanford.edu/entries/daoism-religion/' },
]

export function DaoHistoricalStudy({ copy }: { copy: DaoLearningCopy }) {
  return <section className="dao-study-extensions" aria-labelledby="dao-study-extensions-title">
    <div className="dao-study-extensions__heading">
      <span className="dao-section-icon"><BookOpenCheck size={22} aria-hidden="true" /></span>
      <div><p className="eyebrow">{copy.learnNotGuided}</p><h2 id="dao-study-extensions-title">{copy.historicalStudy}</h2><p>{copy.historicalStudyBody}</p></div>
    </div>
    <div className="dao-study-extensions__grid">
      <div className="dao-historical-accordion">
        {ITEMS.map((item, index) => <details key={item.key} className="surface" open={index === 0}>
          <summary><span><ScrollText size={19} aria-hidden="true" />{copy[item.key]}</span><span>{String(index + 1).padStart(2, '0')}</span></summary>
          <div><p>{copy[item.body]}</p><a href={item.href} target="_blank" rel="noreferrer">{copy[item.action]}<ExternalLink size={14} aria-hidden="true" /></a></div>
        </details>)}
      </div>
      <Link to="/dao/study/themes" className="surface dao-themes-continue">
        <Layers3 size={24} aria-hidden="true" /><p className="eyebrow">{copy.availableNow}</p><h3>{copy.themes}</h3><p>{copy.themesBody}</p><strong>{copy.availableNow}<ArrowRight size={16} aria-hidden="true" /></strong>
      </Link>
    </div>
  </section>
}
