import { BookOpenText, History, Layers3 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import type { DaoLearningCopy } from '../data/daoLearningContent'

export function DaoStudyNavigation({ copy }: { copy: DaoLearningCopy }) {
  return <nav className="page-shell dao-study-navigation" aria-label={copy.orientationTitle}>
    <NavLink to="/dao/study/start"><BookOpenText size={17} aria-hidden="true" />{copy.startHere}</NavLink>
    <NavLink to="/dao/study/themes"><Layers3 size={17} aria-hidden="true" />{copy.themes}</NavLink>
    <a href="/dao/study/start#dao-historical-study"><History size={17} aria-hidden="true" />{copy.historicalStudy}</a>
  </nav>
}
