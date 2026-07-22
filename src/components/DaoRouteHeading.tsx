import { CircleDashed, type LucideIcon } from 'lucide-react'
import type { DaoShellCopy } from '../data/daoShellContent'

export function DaoRouteHeading({ icon: Icon, eyebrow, title, body, shell }: { icon: LucideIcon; eyebrow: string; title: string; body: string; shell: DaoShellCopy }) {
  return <header className="page-shell dao-route-heading">
    <div className="dao-route-heading__title">
      <span className="dao-section-icon"><Icon size={21} aria-hidden="true" /></span>
      <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>
    </div>
    <div className="dao-route-heading__context">
      <p>{body}</p>
      <span><CircleDashed size={15} aria-hidden="true" />{shell.previewLabel}</span>
    </div>
  </header>
}
