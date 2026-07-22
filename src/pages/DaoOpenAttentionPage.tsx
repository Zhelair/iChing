import { CircleDashed, Scan } from 'lucide-react'
import { DaoNavigation } from '../components/DaoNavigation'
import { DaoRouteHeading } from '../components/DaoRouteHeading'
import { OpenAttentionPractice } from '../components/OpenAttentionPractice'
import { DAO_COPY } from '../data/daoContent'
import { DAO_PRACTICE_DETAIL_COPY } from '../data/daoPracticeContent'
import { DAO_SHELL_COPY } from '../data/daoShellContent'
import { useI18n } from '../i18n/I18nContext'

export function DaoOpenAttentionPage() {
  const { preferences } = useI18n()
  const copy = DAO_COPY[preferences.locale]
  const detail = DAO_PRACTICE_DETAIL_COPY[preferences.locale]
  const shell = DAO_SHELL_COPY[preferences.locale]

  return <div className="dao-page dao-route-page">
    <DaoNavigation copy={copy} shell={shell} />
    <DaoRouteHeading icon={Scan} eyebrow={shell.modernLabel} title={detail.openTitle} body={detail.openIntro} shell={shell} />
    <div className="page-shell dao-practice-provenance surface"><span className="dao-section-icon"><CircleDashed size={20} aria-hidden="true" /></span><div><strong>{shell.modernLabel}</strong><p>{detail.openWhy}</p></div></div>
    <div className="page-shell dao-sections"><OpenAttentionPractice copy={copy} detail={detail} locale={preferences.locale} /></div>
    <aside className="page-shell dao-practice-why surface"><strong>{detail.whyHere}</strong><p>{detail.openWhy}</p></aside>
  </div>
}
