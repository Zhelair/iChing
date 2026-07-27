import { ArrowRight, BookOpen, Library, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageIntro } from '../components/PageIntro'
import { DAO_COPY } from '../data/daoContent'
import { useI18n } from '../i18n/I18nContext'

export function IChingPage() {
  const { preferences, t } = useI18n()
  const copy = DAO_COPY[preferences.locale]
  return <div className="page-shell py-10 sm:py-16">
    <PageIntro title={copy.navIChing} body={t('learn.body')} />
    <div className="iching-hub mt-8 sm:mt-10">
      <Link to="/iching/reading" className="surface iching-hub__card iching-hub__card--accent"><span><Sparkles size={24} /></span><h2>{t('method.title')}</h2><p>{t('method.body')}</p><strong>{t('home.start')} <ArrowRight size={16} /></strong></Link>
      <Link to="/iching/guide" className="surface iching-hub__card"><span><BookOpen size={24} /></span><h2>{t('learn.title')}</h2><p>{t('learn.body')}</p><strong>{t('learn.begin')} <ArrowRight size={16} /></strong></Link>
      <Link to="/iching/library" className="surface iching-hub__card"><span><Library size={24} /></span><h2>{t('library.title')}</h2><p>{t('library.body')}</p><strong>{t('library.open')} <ArrowRight size={16} /></strong></Link>
    </div>
  </div>
}
