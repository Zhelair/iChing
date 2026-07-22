import { Sprout } from 'lucide-react'
import { DaoLivingPractice } from '../components/DaoLivingPractice'
import { DaoNavigation } from '../components/DaoNavigation'
import { DaoRouteHeading } from '../components/DaoRouteHeading'
import { DAO_COPY } from '../data/daoContent'
import { DAO_SHELL_COPY } from '../data/daoShellContent'
import { useI18n } from '../i18n/I18nContext'

export function DaoLivingPage() {
  const { preferences } = useI18n()
  const copy = DAO_COPY[preferences.locale]
  const shell = DAO_SHELL_COPY[preferences.locale]

  return <div className="dao-page dao-route-page">
    <DaoNavigation copy={copy} shell={shell} />
    <DaoRouteHeading icon={Sprout} eyebrow={copy.eyebrow} title={copy.living} body={copy.livingBody} shell={shell} />
    <div className="page-shell dao-sections">
      <DaoLivingPractice copy={copy} locale={preferences.locale} />
    </div>
  </div>
}
