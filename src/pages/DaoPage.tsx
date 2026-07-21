import { BookOpenText, Feather, NotebookPen, Sprout, Wind } from 'lucide-react'
import { BreathPractice } from '../components/BreathPractice'
import { DaoLivingPractice } from '../components/DaoLivingPractice'
import { DaoNotebook } from '../components/DaoNotebook'
import { DaoReader } from '../components/DaoReader'
import { DaoWaterArt } from '../components/DaoWaterArt'
import { DAO_COPY } from '../data/daoContent'
import { useI18n } from '../i18n/I18nContext'

export function DaoPage() {
  const { preferences } = useI18n()
  const copy = DAO_COPY[preferences.locale]
  const paths = [
    { href: '#dao-study', icon: BookOpenText, title: copy.study, body: copy.studyBody },
    { href: '#dao-notebook', icon: NotebookPen, title: copy.notebook, body: copy.notebookBody },
    { href: '#dao-practice', icon: Wind, title: copy.practice, body: copy.practiceBody },
    { href: '#dao-living', icon: Sprout, title: copy.living, body: copy.livingBody },
  ]

  return <div className="dao-page">
    <section className="page-shell dao-hero">
      <div className="dao-hero__copy"><p className="eyebrow">{copy.eyebrow}</p><h1>{copy.title}</h1><p>{copy.intro}</p><div className="dao-hero__actions"><a className="button-primary" href="#dao-study"><Feather size={18} />{copy.beginStudy}</a><a className="button-secondary" href="#dao-practice"><Wind size={18} />{copy.beginPractice}</a></div></div>
      <div className="dao-hero__art"><DaoWaterArt /><span aria-hidden="true">道</span></div>
    </section>

    <nav className="page-shell dao-paths" aria-label={copy.title}>{paths.map(({ href, icon: Icon, title, body }, index) => <a key={href} className="surface dao-path-card" href={href}><span className="dao-path-card__index">{String(index + 1).padStart(2, '0')}</span><span className="dao-path-card__icon"><Icon size={21} /></span><strong>{title}</strong><small>{body}</small></a>)}</nav>

    <div className="page-shell dao-sections">
      <DaoReader copy={copy} locale={preferences.locale} />
      <DaoNotebook copy={copy} locale={preferences.locale} />
      <BreathPractice copy={copy} locale={preferences.locale} />
      <DaoLivingPractice copy={copy} locale={preferences.locale} />
    </div>
  </div>
}
