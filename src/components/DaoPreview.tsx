import { CircleDashed } from 'lucide-react'
import type { DaoShellCopy } from '../data/daoShellContent'

export function DaoPreview({ shell }: { shell: DaoShellCopy }) {
  return <aside className="page-shell dao-preview" aria-label={shell.previewLabel}>
    <CircleDashed size={19} aria-hidden="true" />
    <div><strong>{shell.previewLabel}</strong><p>{shell.previewBody}</p></div>
  </aside>
}
