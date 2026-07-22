import { BookMarked, CircleDashed, Layers3 } from 'lucide-react'
import type { DaoLearningCopy } from '../data/daoLearningContent'

export function DaoStudyRoadmap({ copy }: { copy: DaoLearningCopy }) {
  return <section className="dao-study-map" aria-labelledby="dao-orientation-title">
    <article className="dao-study-map__orientation surface">
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
      <div className="dao-study-map__status"><CircleDashed size={16} aria-hidden="true" />{copy.roadmapStatus}</div>
    </article>

    <article className="dao-study-map__themes surface">
      <span className="dao-section-icon"><Layers3 size={21} aria-hidden="true" /></span>
      <p className="eyebrow">{copy.availableNow}</p>
      <h2>{copy.themes}</h2>
      <p>{copy.themesBody}</p>
      <span className="dao-study-map__count">03</span>
    </article>
  </section>
}
