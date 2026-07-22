import { ArrowRight, BookmarkPlus, ChevronRight, ExternalLink, ScrollText } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { DaoCopy } from '../data/daoContent'
import type { DaoShellCopy } from '../data/daoShellContent'
import type { Locale } from '../domain/locales'
import { getReadingProgress, saveReadingProgress } from '../storage/db'

const WORK_ID = 'dao-water-introduction-v1'

type DaoReaderProps = { copy: DaoCopy; locale: Locale; themeLabel: string }

const PASSAGE_SOURCES: Record<string, string> = {
  water: 'Daodejing · 1',
  softness: 'Daodejing · 8, 22, 78',
  daily: 'Daodejing · 37',
}

const PUBLIC_DOMAIN_TEXT = 'https://www.gutenberg.org/ebooks/216'

export function DaoReader({ copy, shell, themeLabel }: DaoReaderProps & { shell: DaoShellCopy }) {
  const [passageId, setPassageId] = useState(copy.passages[0].id)
  const passage = useMemo(() => copy.passages.find(({ id }) => id === passageId) ?? copy.passages[0], [copy.passages, passageId])

  useEffect(() => {
    let cancelled = false
    void getReadingProgress(WORK_ID).then((progress) => {
      if (cancelled) return
      if (progress && copy.passages.some(({ id }) => id === progress.passageId)) setPassageId(progress.passageId)
    })
    return () => { cancelled = true }
  }, [copy.passages])

  function choosePassage(id: string) {
    setPassageId(id)
    const index = copy.passages.findIndex((item) => item.id === id)
    void saveReadingProgress({ workId: WORK_ID, passageId: id, progress: (index + 1) / copy.passages.length, updatedAt: new Date().toISOString() })
  }

  return (
    <section id="dao-study" className="dao-reader scroll-mt-24" aria-labelledby="dao-reader-title">
      <aside className="dao-reader__toc surface" aria-label={themeLabel}>
        <p className="eyebrow">{themeLabel}</p>
        <nav className="mt-4">
          {copy.passages.map((item, index) => (
            <button key={item.id} type="button" className={passage.id === item.id ? 'is-active' : ''} onClick={() => choosePassage(item.id)} aria-current={passage.id === item.id ? 'step' : undefined}>
              <span>{String(index + 1).padStart(2, '0')}</span>{item.title}<ChevronRight size={15} aria-hidden="true" />
            </button>
          ))}
        </nav>
      </aside>

      <article className="dao-reader__page surface" aria-live="polite">
        <div className="dao-reader__passage" key={passage.id}>
          <span className="dao-reader__mark" aria-hidden="true"><ScrollText size={18} /></span>
          <p className="eyebrow">{themeLabel} · {String(copy.passages.findIndex(({ id }) => id === passage.id) + 1).padStart(2, '0')}</p>
          <h2 id="dao-reader-title">{passage.title}</h2>
          <p className="dao-reader__lead">{passage.body}</p>
        </div>
        <dl className="dao-scope">
          <div><dt>{copy.scope}</dt><dd>{copy.scopeValue}</dd></div>
          <div><dt>{copy.sourceHeading}</dt><dd className="dao-source-trail">
            <strong>{PASSAGE_SOURCES[passage.id] ?? 'Daodejing'}</strong>
            <a href={PUBLIC_DOMAIN_TEXT} target="_blank" rel="noreferrer">{shell.sourceLink}<ExternalLink size={13} aria-hidden="true" /></a>
            <small>{shell.sourceNote}</small>
          </dd></div>
        </dl>
        <Link className="dao-reader__note-link" to={`/journal/study?work=${encodeURIComponent(WORK_ID)}&passage=${encodeURIComponent(passage.id)}`}><BookmarkPlus size={18} aria-hidden="true" /><span><strong>{copy.note}</strong><small>{passage.title}</small></span><ArrowRight size={17} aria-hidden="true" /></Link>
      </article>
    </section>
  )
}
