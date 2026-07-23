import { ArrowLeft, ExternalLink, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { AiReflectionRecord } from '../ai/types'
import { PageIntro } from '../components/PageIntro'
import { aiCopyFor } from '../i18n/aiCopy'
import { useI18n } from '../i18n/I18nContext'
import { clearAiReflections, deleteAiReflection, getAiReflections } from '../storage/db'

export function AiReflectionsPage() {
  const { preferences } = useI18n()
  const copy = aiCopyFor(preferences.locale)
  const navigate = useNavigate()
  const { id } = useParams()
  const [items, setItems] = useState<AiReflectionRecord[]>([])
  const [deleteTarget, setDeleteTarget] = useState<AiReflectionRecord | 'all' | null>(null)

  useEffect(() => { void getAiReflections().then(setItems) }, [])

  const selected = useMemo(() => id ? items.find((item) => item.id === id) ?? null : null, [id, items])
  const formatDate = (value: string) => new Intl.DateTimeFormat(preferences.locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
  const remove = async () => {
    if (deleteTarget === 'all') { await clearAiReflections(); setItems([]); setDeleteTarget(null); return }
    if (!deleteTarget) return
    await deleteAiReflection(deleteTarget.id)
    setItems((current) => current.filter((item) => item.id !== deleteTarget.id))
    setDeleteTarget(null)
    if (id) navigate('/journal/reflections')
  }

  return <div className="page-shell py-10 sm:py-16">
    <div className="reading-column ai-reflections-page">
      <Link to={selected ? '/journal/reflections' : '/journal'} className="button-text"><ArrowLeft size={17} />{selected ? 'All saved reflections' : copy.backJournal}</Link>
      <PageIntro eyebrow="Private AI journal" title={selected ? 'Saved AI reflection' : copy.history} body="Open, revisit, or remove each reflection separately. These reflections stay on this device." />
      {selected ? <article className="surface ai-reflections-page__detail">
        <header><span><Sparkles size={17} aria-hidden="true" />{selected.kind === 'monthly-pattern' ? 'Monthly pattern' : 'Reading reflection'}</span><button type="button" className="button-text danger-action" onClick={() => setDeleteTarget(selected)}><Trash2 size={15} />Delete reflection</button></header>
        <p className="ai-reflections-page__meta">{formatDate(selected.createdAt)} · {selected.provider} · {selected.model}</p>
        <p>{selected.response}</p>
      </article> : <>
        {items.length ? <div className="ai-reflections-page__toolbar"><span>{items.length} saved reflection{items.length === 1 ? '' : 's'}</span><button type="button" className="button-text danger-action" onClick={() => setDeleteTarget('all')}><Trash2 size={15} />{copy.clearHistory}</button></div> : null}
        {items.length ? <div className="ai-reflections-page__list">{items.map((item) => <article className="surface" key={item.id}>
          <div><span className="eyebrow">{item.kind === 'monthly-pattern' ? 'Monthly pattern' : 'Reading reflection'} · {formatDate(item.createdAt)}</span><strong>{item.provider} · {item.model}</strong></div>
          <p>{item.response}</p>
          <footer><Link to={`/journal/reflections/${item.id}`} className="button-secondary"><ExternalLink size={15} />Open reflection</Link><button type="button" className="button-text danger-action" onClick={() => setDeleteTarget(item)}><Trash2 size={15} />Delete reflection</button></footer>
        </article>)}</div> : <section className="surface ai-reflections-page__empty"><Sparkles size={30} /><h2>No saved AI reflections yet.</h2><p>When you save a reflection, it will appear here.</p><Link to="/journal" className="button-secondary">Back to journal</Link></section>}
      </>}
      {deleteTarget ? <div className="ai-reflections-page__dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setDeleteTarget(null) }}><section className="surface ai-reflections-page__dialog" role="dialog" aria-modal="true" aria-labelledby="delete-ai-title"><Trash2 size={22} /><h2 id="delete-ai-title">Delete {deleteTarget === 'all' ? 'all saved reflections' : 'this reflection'}?</h2><p>This cannot be undone from the app.</p><footer><button type="button" className="button-secondary" onClick={() => setDeleteTarget(null)}>Keep reflection</button><button type="button" className="button-primary danger-action" onClick={() => void remove()}>Delete</button></footer></section></div> : null}
    </div>
  </div>
}
