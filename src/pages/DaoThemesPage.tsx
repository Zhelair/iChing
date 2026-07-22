import { Layers3 } from 'lucide-react'
import { DaoNavigation } from '../components/DaoNavigation'
import { DaoReader } from '../components/DaoReader'
import { DaoRouteHeading } from '../components/DaoRouteHeading'
import { DaoStudyNavigation } from '../components/DaoStudyNavigation'
import { DAO_COPY } from '../data/daoContent'
import { DAO_LEARNING_COPY } from '../data/daoLearningContent'
import { DAO_SHELL_COPY } from '../data/daoShellContent'
import { useI18n } from '../i18n/I18nContext'

export function DaoThemesPage() {
  const { preferences } = useI18n()
  const copy = DAO_COPY[preferences.locale]
  const learning = DAO_LEARNING_COPY[preferences.locale]
  const shell = DAO_SHELL_COPY[preferences.locale]

  return <div className="dao-page dao-route-page">
    <DaoNavigation copy={copy} shell={shell} />
    <DaoRouteHeading icon={Layers3} eyebrow={learning.availableNow} title={learning.themes} body={learning.themesBody} shell={shell} />
    <DaoStudyNavigation copy={learning} />
    <div className="page-shell dao-sections">
      <DaoReader copy={copy} shell={shell} locale={preferences.locale} themeLabel={learning.themes} />
    </div>
  </div>
}
