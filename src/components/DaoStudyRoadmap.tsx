import { ArrowRight, BookMarked, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { DaoLearningCopy } from '../data/daoLearningContent'

export function DaoStudyRoadmap({ copy }: { copy: DaoLearningCopy }) {
  return <section className="dao-study-map" aria-labelledby="dao-orientation-title">
    <Link to="/dao/study/start" className="dao-study-map__orientation surface">
      <div className="dao-study-map__heading">
        <span className="dao-section-icon"><BookMarked size={21} aria-hidden="true" /></span>
        <div>
          <p className="eyebrow">{copy.startHere}</p>
          <h2 id="dao-orientation-title">{copy.orientationTitle}</h2>
          <p>{copy.orientationBody}</p>
        </div>
      </div>
      <ol>
        {copy.orientationTopics.map((topic, index) => <li key={topic}><span>{String(index + 1).padStart(2, '0')}</span>{topic}</li>)}
      </ol>
      <strong className="dao-study-map__action">{copy.availableNow}<ArrowRight size={16} aria-hidden="true" /></strong>
    </Link>

    <Link to="/dao/study/themes" className="dao-study-map__themes surface">
      <span className="dao-section-icon"><Layers3 size={21} aria-hidden="true" /></span>
      <p className="eyebrow">{copy.availableNow}</p>
      <h2>{copy.themes}</h2>
      <p>{copy.themesBody}</p>
      <strong className="dao-study-map__action">{copy.availableNow}<ArrowRight size={16} aria-hidden="true" /></strong>
      <span className="dao-study-map__count">03</span>
    </Link>
  </section>
}
