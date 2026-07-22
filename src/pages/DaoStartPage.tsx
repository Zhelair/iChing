import { Map } from 'lucide-react'
import { DaoNavigation } from '../components/DaoNavigation'
import { DaoOrientationJourney } from '../components/DaoOrientationJourney'
import { DaoHistoricalStudy } from '../components/DaoHistoricalStudy'
import { DaoRouteHeading } from '../components/DaoRouteHeading'
import { DAO_COPY } from '../data/daoContent'
import { DAO_ORIENTATION_COPY } from '../data/daoOrientationContent'
import { DAO_LEARNING_COPY } from '../data/daoLearningContent'
import { DAO_SHELL_COPY } from '../data/daoShellContent'
import { useI18n } from '../i18n/I18nContext'

export function DaoStartPage() {
  const { preferences } = useI18n()
  const copy = DAO_COPY[preferences.locale]
  const orientation = DAO_ORIENTATION_COPY[preferences.locale]
  const shell = DAO_SHELL_COPY[preferences.locale]
  const learning = DAO_LEARNING_COPY[preferences.locale]

  return <div className="dao-page dao-route-page">
    <DaoNavigation copy={copy} shell={shell} />
    <DaoRouteHeading icon={Map} eyebrow={orientation.eyebrow} title={orientation.title} body={orientation.intro} shell={shell} />
    <div className="page-shell dao-sections"><DaoOrientationJourney copy={orientation} /><DaoHistoricalStudy copy={learning} /></div>
  </div>
}
