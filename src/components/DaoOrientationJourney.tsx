import { ExternalLink } from 'lucide-react'
import { useEffect, useRef, type CSSProperties } from 'react'
import type { DaoOrientationCopy, DaoOrientationScene } from '../data/daoOrientationContent'
import { useI18n } from '../i18n/I18nContext'

function OrientationArt({ scene }: { scene: DaoOrientationScene }) {
  return <svg className={`dao-orientation-art is-${scene}`} viewBox="0 0 420 260" aria-hidden="true">
    <circle className="dao-orientation-art__moon" cx="335" cy="54" r="31" />
    {scene === 'paths' ? <><path d="M40 216C111 196 116 92 205 131C269 159 292 91 379 69" /><path d="M42 216C135 237 193 201 227 166C268 124 331 159 382 184" /><path d="M205 131c18 17 24 35 22 35" /></> : null}
    {scene === 'vessel' ? <><path d="M117 91h186l-24 107H141Z" /><path d="M153 91V64h114v27M171 139c25-18 51 20 77 0" /><circle cx="210" cy="166" r="11" /></> : null}
    {scene === 'names' ? <><path d="M76 67h126M76 103h181M76 139h94M76 175h223" /><path className="dao-orientation-art__soft" d="M226 46c-31 43 53 60 16 101c-22 25 22 43 78 54" /></> : null}
    {scene === 'current' ? <><path d="M37 163c55-93 116 34 174-30c57-63 104 34 173-34" /><path className="dao-orientation-art__soft" d="M37 190c77-47 129 21 194-20c58-37 96 3 153-31" /><path d="M253 64v52h51" /></> : null}
    {scene === 'voices' ? <><path d="M72 65h113v134H72zM235 65h113v134H235z" /><path d="M101 98h54m-54 28h62m-62 28h39M264 99c17-16 37 16 54 0m-54 37c17-16 37 16 54 0m-54 36c17-16 37 16 54 0" /></> : null}
    {scene === 'temple' ? <><path d="M76 189h268M111 189V98h198v91M86 98h248L210 50Z" /><path d="M151 189v-51h38v51m42 0v-51h38v51" /><path className="dao-orientation-art__soft" d="M47 220c83-29 151 18 224-8c44-15 75-12 111-3" /></> : null}
  </svg>
}

export function DaoOrientationJourney({ copy }: { copy: DaoOrientationCopy }) {
  const { preferences } = useI18n()
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const chapters = rootRef.current?.querySelectorAll<HTMLElement>('.dao-orientation-chapter')
    if (!chapters) return
    if (preferences.reduceMotion || !('IntersectionObserver' in window)) {
      chapters.forEach((chapter) => chapter.classList.add('is-in-view'))
      return
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle('is-in-view', entry.isIntersecting)), { threshold: .2, rootMargin: '-8% 0px -8%' })
    chapters.forEach((chapter) => observer.observe(chapter))
    return () => observer.disconnect()
  }, [preferences.reduceMotion])

  const links = <nav className="dao-orientation-toc" aria-label={copy.contents}>{copy.lessons.map((lesson, index) => <a key={lesson.id} href={`#dao-${lesson.id}`}><span>{String(index + 1).padStart(2, '0')}</span>{lesson.title}</a>)}</nav>

  return <section ref={rootRef} className="dao-orientation" aria-label={copy.contents}>
    <details className="surface dao-orientation__mobile-toc"><summary>{copy.contents}</summary>{links}</details>
    <div className="dao-orientation__layout">
      <aside><div className="surface"><p className="eyebrow">{copy.contents}</p>{links}</div></aside>
      <div className="dao-orientation__chapters">
        {copy.lessons.map((lesson, index) => <article key={lesson.id} id={`dao-${lesson.id}`} className="surface dao-orientation-chapter scroll-mt-28" style={{ '--chapter-index': index } as CSSProperties}>
          <div className="dao-orientation-chapter__visual"><OrientationArt scene={lesson.scene} /></div>
          <div className="dao-orientation-chapter__copy">
            <p className="eyebrow">{lesson.kicker}</p><h2>{lesson.title}</h2><p className="dao-orientation-chapter__body">{lesson.body}</p>
            <div className="dao-orientation-chapter__notes"><aside><strong>{copy.keepDistinct}</strong><p>{lesson.distinction}</p></aside><aside><strong>{copy.consider}</strong><p>{lesson.reflection}</p></aside></div>
            <a href={lesson.sourceUrl} target="_blank" rel="noreferrer"><span>{copy.sourceTrail}</span>{lesson.source}<ExternalLink size={14} aria-hidden="true" /></a>
          </div>
        </article>)}
      </div>
    </div>
  </section>
}
