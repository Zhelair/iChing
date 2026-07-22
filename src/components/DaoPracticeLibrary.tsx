import { ArrowRight, BookOpenCheck, CircleDashed, Feather, ScrollText, Wind } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { DaoCopy } from '../data/daoContent'
import type { DaoLearningCopy } from '../data/daoLearningContent'
import type { DaoShellCopy } from '../data/daoShellContent'

const ZHUANGZI_HEART_MIND = 'https://ctext.org/zhuangzi/man-in-the-world-associated-with/ens'
const ZHUANGZI_FORGETTING = 'https://ctext.org/zhuangzi/great-and-most-honoured-master/ens'
const DAOISM_BACKGROUND = 'https://plato.stanford.edu/entries/daoism-religion/'

export function DaoPracticeLibrary({ copy, learning, shell }: { copy: DaoCopy; learning: DaoLearningCopy; shell: DaoShellCopy }) {
  return <div className="dao-practice-library">
    <section className="dao-practice-library__available" aria-labelledby="dao-practices-now">
      <div className="dao-library-heading">
        <p className="eyebrow">{learning.availableNow}</p>
        <h2 id="dao-practices-now">{learning.practiceLibrary}</h2>
        <p>{learning.practiceLibraryBody}</p>
      </div>
      <div className="dao-practice-library__grid">
        <Link to="/dao/practice/settling" className="dao-practice-card surface">
          <span className="dao-section-icon"><Wind size={22} aria-hidden="true" /></span>
          <span className="dao-provenance-chip"><CircleDashed size={14} aria-hidden="true" />{shell.modernLabel}</span>
          <h3>{copy.practiceTitle}</h3>
          <p>{learning.settlingBody}</p>
          <strong>{learning.useNow}<ArrowRight size={16} aria-hidden="true" /></strong>
        </Link>
        <Link to="/dao/living" className="dao-practice-card surface">
          <span className="dao-section-icon"><Feather size={22} aria-hidden="true" /></span>
          <span className="dao-provenance-chip"><CircleDashed size={14} aria-hidden="true" />{shell.modernLabel}</span>
          <h3>{learning.ordinaryPractice}</h3>
          <p>{learning.ordinaryPracticeBody}</p>
          <strong>{learning.useNow}<ArrowRight size={16} aria-hidden="true" /></strong>
        </Link>
      </div>
    </section>

    <section className="dao-historical-shelf surface" aria-labelledby="dao-historical-practices">
      <div className="dao-historical-shelf__intro">
        <span className="dao-section-icon"><BookOpenCheck size={22} aria-hidden="true" /></span>
        <p className="eyebrow">{learning.learnNotGuided}</p>
        <h2 id="dao-historical-practices">{learning.historicalStudy}</h2>
        <p>{learning.historicalStudyBody}</p>
      </div>
      <div className="dao-historical-shelf__items">
        <HistoricalItem title={learning.heartMind} body={learning.heartMindBody} href={ZHUANGZI_HEART_MIND} action={learning.readSource} />
        <HistoricalItem title={learning.sittingForgetting} body={learning.sittingForgettingBody} href={ZHUANGZI_FORGETTING} action={learning.readSource} />
        <HistoricalItem title={learning.laterTraditions} body={learning.laterTraditionsBody} href={DAOISM_BACKGROUND} action={learning.readBackground} />
      </div>
    </section>
  </div>
}

function HistoricalItem({ title, body, href, action }: { title: string; body: string; href: string; action: string }) {
  return <article>
    <ScrollText size={19} aria-hidden="true" />
    <h3>{title}</h3>
    <p>{body}</p>
    <a href={href} target="_blank" rel="noreferrer">{action}<ArrowRight size={14} aria-hidden="true" /></a>
  </article>
}
