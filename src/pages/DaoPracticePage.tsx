import { Wind } from 'lucide-react'
import { DaoNavigation } from '../components/DaoNavigation'
import { DaoPracticeLibrary } from '../components/DaoPracticeLibrary'
import { DaoRouteHeading } from '../components/DaoRouteHeading'
import { DAO_COPY } from '../data/daoContent'
import { DAO_LEARNING_COPY } from '../data/daoLearningContent'
import { DAO_SHELL_COPY } from '../data/daoShellContent'
import { useI18n } from '../i18n/I18nContext'

export function DaoPracticePage() {
  const { preferences } = useI18n()
  const copy = DAO_COPY[preferences.locale]
  const learning = DAO_LEARNING_COPY[preferences.locale]
  const shell = DAO_SHELL_COPY[preferences.locale]

  return <div className="dao-page dao-route-page">
    <DaoNavigation copy={copy} shell={shell} />
    <DaoRouteHeading icon={Wind} eyebrow={copy.eyebrow} title={copy.practice} body={learning.practiceLibraryBody} shell={shell} />
    <div className="page-shell dao-sections">
      <DaoPracticeLibrary copy={copy} learning={learning} shell={shell} />
    </div>
  </div>
}
