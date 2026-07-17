import { Binary, ChevronRight, Coins, HandCoins } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageIntro } from '../components/PageIntro'
import { useI18n } from '../i18n/I18nContext'
import { getDraftQuestion, setDraftQuestion } from '../storage/session'

const methods = [
  { id: 'digital', title: 'method.digital.title', body: 'method.digital.body', icon: Coins },
  { id: 'physical', title: 'method.physical.title', body: 'method.physical.body', icon: HandCoins },
  { id: 'direct', title: 'method.direct.title', body: 'method.direct.body', icon: Binary },
] as const

export function MethodPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [question, setQuestion] = useState(getDraftQuestion)

  function choose(method: string) {
    setDraftQuestion(question)
    navigate(`/cast/${method}`)
  }

  return (
    <div className="page-shell py-10 sm:py-16">
      <div className="reading-column">
        <PageIntro eyebrow={t('method.eyebrow')} title={t('method.title')} body={t('method.body')} />

        <div className="surface mt-9 p-5 sm:p-7">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <label htmlFor="question" className="font-bold">{t('method.question')}</label>
            <span className="text-xs text-[var(--ink-soft)]">{t('method.optional')}</span>
          </div>
          <textarea id="question" value={question} onChange={(event) => setQuestion(event.target.value)} className="field !min-h-28 resize-y" placeholder={t('method.placeholder')} maxLength={500} />
          <p className="mt-3 text-xs leading-5 text-[var(--ink-soft)]">{t('method.hint')}</p>
        </div>

        <div className="mt-5 grid gap-3">
          {methods.map(({ id, title, body, icon: Icon }) => (
            <button key={id} type="button" onClick={() => choose(id)} className="group surface depth-card flex min-h-28 w-full items-center gap-4 p-5 text-left sm:p-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--jade-light)] text-[var(--jade)]"><Icon size={22} aria-hidden="true" /></span>
              <span className="min-w-0 flex-1">
                <span className="block font-editorial text-xl font-semibold">{t(title)}</span>
                <span className="mt-1 block text-sm leading-6 text-[var(--ink-soft)]">{t(body)}</span>
              </span>
              <ChevronRight className="shrink-0 text-[var(--brass)] transition-transform group-hover:translate-x-1" size={21} aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
