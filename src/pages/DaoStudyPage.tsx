import { BookOpenText } from 'lucide-react'
import { DaoNavigation } from '../components/DaoNavigation'
import { DaoReader } from '../components/DaoReader'
import { DaoRouteHeading } from '../components/DaoRouteHeading'
import { DAO_COPY } from '../data/daoContent'
import { DAO_SHELL_COPY } from '../data/daoShellContent'
import { useI18n } from '../i18n/I18nContext'

export function DaoStudyPage() {
  const { preferences } = useI18n()
  const copy = DAO_COPY[preferences.locale]
  const shell = DAO_SHELL_COPY[preferences.locale]

  return <div className="dao-page dao-route-page">
    <DaoNavigation copy={copy} shell={shell} />
    <DaoRouteHeading icon={BookOpenText} eyebrow={copy.readerEyebrow} title={copy.study} body={copy.studyBody} shell={shell} />
    <div className="page-shell dao-sections">
      <DaoReader copy={copy} shell={shell} locale={preferences.locale} />
    </div>
  </div>
}
