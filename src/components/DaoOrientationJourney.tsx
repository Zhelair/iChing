import { ExternalLink } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useSound } from '../audio/SoundContext'
import type { DaoOrientationCopy, DaoOrientationScene } from '../data/daoOrientationContent'
import { useI18n } from '../i18n/I18nContext'

function OrientationArt({ scene }: { scene: DaoOrientationScene }) {
  return <svg className={`dao-orientation-art is-${scene}`} viewBox="0 0 420 260" aria-hidden="true">
    {scene === 'paths' ? <><circle className="dao-orientation-art__moon" cx="78" cy="130" r="19" /><path d="M98 130h65c49 0 42-55 89-55h77" /><path d="M163 130c49 0 42 55 89 55h77" /><path className="dao-orientation-art__soft" d="M163 130h166" /><circle cx="344" cy="75" r="13" /><circle cx="344" cy="130" r="13" /><circle cx="344" cy="185" r="13" /></> : null}
    {scene === 'vessel' ? <><circle className="dao-orientation-art__moon" cx="210" cy="45" r="18" /><path className="dao-orientation-art__soft" d="M210 64v47" /><path d="M118 104c22 0 27 23 46 23s26-23 46-23s27 23 46 23s26-23 46-23" /><path d="M119 104l20 103h142l20-103" /><path d="M157 159c25-20 40 19 65 0s40 19 65 0" /><circle cx="210" cy="188" r="10" /></> : null}
    {scene === 'names' ? <><path className="dao-orientation-art__soft" d="M45 202c66-75 112 8 165-64c50-68 93-12 165-81" /><rect x="70" y="54" width="96" height="38" rx="9" /><rect x="184" y="103" width="111" height="38" rx="9" /><rect x="256" y="166" width="92" height="38" rx="9" /><path d="M118 92v35m121 14v35" /></> : null}
    {scene === 'current' ? <><circle className="dao-orientation-art__moon" cx="151" cy="140" r="32" /><circle className="dao-orientation-art__moon" cx="278" cy="108" r="24" /><path d="M31 116c64-68 83 79 155 32c52-34 55-91 111-63c45 22 45 70 91 28" /><path className="dao-orientation-art__soft" d="M31 174c62-52 106 45 172 2c68-44 112 4 185-32" /></> : null}
    {scene === 'voices' ? <><path d="M59 65h128v139H59zM233 65h128v139H233z" /><path d="M87 96h72m-72 29h86m-86 29h58M261 96c24-18 48 18 72 0m-72 36c24-18 48 18 72 0m-72 36c24-18 48 18 72 0" /><path className="dao-orientation-art__soft" d="M187 135c19-17 28-17 46 0" /></> : null}
    {scene === 'temple' ? <><path d="M37 209h346" /><path d="M65 209v-60h74v60m-63-60l26-25l26 25M174 209V87h94v122m-78-122l31-36l31 36M304 209v-77h57v77m-48-77l19-22l20 22" /><circle className="dao-orientation-art__moon" cx="102" cy="180" r="8" /><circle className="dao-orientation-art__moon" cx="221" cy="163" r="8" /><circle className="dao-orientation-art__moon" cx="332" cy="176" r="8" /><path className="dao-orientation-art__soft" d="M45 229c80-26 138 18 212-5c48-15 87-8 120 1" /></> : null}
  </svg>
}

export function DaoOrientationJourney({ copy }: { copy: DaoOrientationCopy }) {
  const { preferences } = useI18n()
  const { playHistoryCue } = useSound()
  const rootRef = useRef<HTMLElement>(null)
  const [activeId, setActiveId] = useState(copy.lessons[0]?.id ?? '')
  const [awakeId, setAwakeId] = useState<string | null>(null)

  useEffect(() => {
    const chapters = rootRef.current?.querySelectorAll<HTMLElement>('.dao-orientation-chapter')
    if (!chapters) return
    if (preferences.reduceMotion || !('IntersectionObserver' in window)) {
      chapters.forEach((chapter) => chapter.classList.add('is-in-view'))
      return
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      entry.target.classList.toggle('is-in-view', entry.isIntersecting)
      if (entry.isIntersecting) setActiveId(entry.target.id.replace('dao-', ''))
    }), { threshold: .32, rootMargin: '-12% 0px -42%' })
    chapters.forEach((chapter) => observer.observe(chapter))
    return () => observer.disconnect()
  }, [preferences.reduceMotion])

  const links = <nav className="dao-orientation-toc" aria-label={copy.contents}>{copy.lessons.map((lesson, index) => <a key={lesson.id} href={`#dao-${lesson.id}`} className={activeId === lesson.id ? 'is-active' : ''} aria-current={activeId === lesson.id ? 'step' : undefined}><span>{String(index + 1).padStart(2, '0')}</span>{lesson.title}</a>)}</nav>

  return <section ref={rootRef} className="dao-orientation" aria-label={copy.contents}>
    <details className="surface dao-orientation__mobile-toc"><summary>{copy.contents}</summary>{links}</details>
    <div className="dao-orientation__layout">
      <aside><div className="surface"><p className="eyebrow">{copy.contents}</p>{links}</div></aside>
      <div className="dao-orientation__chapters">
        {copy.lessons.map((lesson, index) => <article key={lesson.id} id={`dao-${lesson.id}`} className="surface dao-orientation-chapter scroll-mt-28" style={{ '--chapter-index': index } as CSSProperties}>
          <button type="button" className={`dao-orientation-chapter__visual${awakeId === lesson.id ? ' is-awake' : ''}`} aria-label={lesson.title} aria-pressed={awakeId === lesson.id} onClick={() => {
            setAwakeId((current) => current === lesson.id ? null : lesson.id)
            const cues = ['brush', 'coin', 'brush', 'stalk', 'brush', 'bone'] as const
            playHistoryCue(cues[index])
          }}><OrientationArt scene={lesson.scene} /><span className="dao-orientation-chapter__pulse" aria-hidden="true" /></button>
          <div className="dao-orientation-chapter__copy">
            <p className="eyebrow">{lesson.kicker}</p><h2>{lesson.title}</h2><p className="dao-orientation-chapter__body">{lesson.body}</p>
            <details className="dao-orientation-chapter__details"><summary>{copy.keepDistinct} · {copy.consider}</summary><div className="dao-orientation-chapter__notes"><aside><strong>{copy.keepDistinct}</strong><p>{lesson.distinction}</p></aside><aside><strong>{copy.consider}</strong><p>{lesson.reflection}</p></aside></div></details>
            <a href={lesson.sourceUrl} target="_blank" rel="noreferrer"><span>{copy.sourceTrail}</span>{lesson.source}<ExternalLink size={14} aria-hidden="true" /></a>
          </div>
        </article>)}
      </div>
    </div>
  </section>
}
