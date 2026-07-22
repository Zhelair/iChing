import { CircleDashed, Wind } from 'lucide-react'
import { BreathPractice } from '../components/BreathPractice'
import { DaoNavigation } from '../components/DaoNavigation'
import { DaoRouteHeading } from '../components/DaoRouteHeading'
import { DAO_COPY } from '../data/daoContent'
import { DAO_SHELL_COPY } from '../data/daoShellContent'
import { useI18n } from '../i18n/I18nContext'

export function DaoSettlingPage() {
  const { preferences } = useI18n()
  const copy = DAO_COPY[preferences.locale]
  const shell = DAO_SHELL_COPY[preferences.locale]

  return <div className="dao-page dao-route-page">
    <DaoNavigation copy={copy} shell={shell} />
    <DaoRouteHeading icon={Wind} eyebrow={shell.modernLabel} title={copy.practiceTitle} body={copy.practiceIntro} shell={shell} />
    <div className="page-shell dao-practice-provenance surface">
      <span className="dao-section-icon"><CircleDashed size={20} aria-hidden="true" /></span>
      <div><strong>{shell.modernLabel}</strong><p>{shell.modernBody}</p></div>
    </div>
    <div className="page-shell dao-sections">
      <BreathPractice copy={copy} locale={preferences.locale} />
    </div>
  </div>
}
