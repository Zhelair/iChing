import { Feather, Wind } from 'lucide-react'
import { BreathPractice } from '../components/BreathPractice'
import { DaoLivingPractice } from '../components/DaoLivingPractice'
import { DaoReader } from '../components/DaoReader'
import { DaoWaterArt } from '../components/DaoWaterArt'
import { DAO_COPY } from '../data/daoContent'
import { useI18n } from '../i18n/I18nContext'

export function DaoPage() {
  const { preferences } = useI18n()
  const copy = DAO_COPY[preferences.locale]

  return <div className="dao-page">
    <section className="page-shell dao-hero">
      <div className="dao-hero__copy">
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
        <div className="dao-hero__actions">
          <a className="button-primary" href="#dao-study"><Feather size={18} />{copy.beginStudy}</a>
          <a className="button-secondary" href="#dao-practice"><Wind size={18} />{copy.beginPractice}</a>
        </div>
      </div>
      <div className="dao-hero__art"><DaoWaterArt /><span aria-hidden="true">道</span></div>
    </section>

    <div className="page-shell dao-sections">
      <DaoReader copy={copy} locale={preferences.locale} />
      <BreathPractice copy={copy} locale={preferences.locale} />
      <DaoLivingPractice copy={copy} locale={preferences.locale} />
    </div>
  </div>
}
