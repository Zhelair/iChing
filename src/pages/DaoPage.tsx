import { BookOpenText, NotebookPen, Sprout, Wind } from 'lucide-react'
import { DaoHubCard } from '../components/DaoHubCard'
import { DaoNavigation } from '../components/DaoNavigation'
import { DaoPreview } from '../components/DaoPreview'
import { DaoWaterArt } from '../components/DaoWaterArt'
import { DAO_COPY } from '../data/daoContent'
import { DAO_SHELL_COPY } from '../data/daoShellContent'
import { useI18n } from '../i18n/I18nContext'

export function DaoPage() {
  const { preferences } = useI18n()
  const copy = DAO_COPY[preferences.locale]
  const shell = DAO_SHELL_COPY[preferences.locale]

  return <div className="dao-page">
    <DaoPreview shell={shell} />
    <section className="page-shell dao-hero">
      <div className="dao-hero__copy">
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
      </div>
      <div className="dao-hero__art"><DaoWaterArt /><span aria-hidden="true">道</span></div>
    </section>

    <DaoNavigation copy={copy} shell={shell} />

    <section className="page-shell dao-hub" aria-label={copy.navDao}>
      <DaoHubCard className="dao-hub-card--featured" to="/dao/study/start" icon={BookOpenText} title={copy.study} body={copy.studyBody} action={shell.open} />
      <DaoHubCard to="/dao/practice" icon={Wind} title={copy.practice} body={copy.practiceBody} action={shell.open} />
      <DaoHubCard to="/dao/living" icon={Sprout} title={copy.living} body={copy.livingBody} action={shell.open} />
      <DaoHubCard to="/journal/study" icon={NotebookPen} title={copy.notebook} body={copy.notebookBody} action={copy.notebook} />
    </section>
  </div>
}
