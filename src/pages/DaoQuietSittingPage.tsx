import { CircleDotDashed } from 'lucide-react'
import { DaoNavigation } from '../components/DaoNavigation'
import { DaoRouteHeading } from '../components/DaoRouteHeading'
import { GuidedQuietSitting } from '../components/GuidedQuietSitting'
import { DAO_COPY } from '../data/daoContent'
import { DAO_PRACTICE_DETAIL_COPY } from '../data/daoPracticeContent'
import { DAO_SHELL_COPY } from '../data/daoShellContent'
import { useI18n } from '../i18n/I18nContext'
import { QUIET_SITTING_COPY } from '../data/quietSittingContent'

export function DaoQuietSittingPage() {
  const { preferences } = useI18n()
  const copy = DAO_COPY[preferences.locale]
  const detail = DAO_PRACTICE_DETAIL_COPY[preferences.locale]
  const shell = DAO_SHELL_COPY[preferences.locale]
  const quiet = QUIET_SITTING_COPY[preferences.locale]
  return <div className="dao-page dao-route-page">
    <DaoNavigation copy={copy} shell={shell} />
    <DaoRouteHeading icon={CircleDotDashed} eyebrow={quiet.label} title={quiet.title} body={quiet.intro} shell={shell} />
    <div className="page-shell dao-sections"><GuidedQuietSitting copy={copy} quiet={quiet} locale={preferences.locale} /></div>
    <aside className="page-shell dao-practice-why surface"><strong>{detail.whyHere}</strong><p>{quiet.why}</p></aside>
  </div>
}
