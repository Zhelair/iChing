import { ArrowRight, CircleDashed, Feather, Wind } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { DaoCopy } from '../data/daoContent'
import type { DaoLearningCopy } from '../data/daoLearningContent'
import type { DaoShellCopy } from '../data/daoShellContent'

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
        <Link to="/dao/practice/quiet-sitting" className="dao-practice-card surface">
          <span className="dao-section-icon"><Feather size={22} aria-hidden="true" /></span>
          <span className="dao-provenance-chip"><CircleDashed size={14} aria-hidden="true" />{shell.modernLabel}</span>
          <h3>{learning.ordinaryPractice}</h3>
          <p>{learning.ordinaryPracticeBody}</p>
          <strong>{learning.useNow}<ArrowRight size={16} aria-hidden="true" /></strong>
        </Link>
      </div>
    </section>

  </div>
}
