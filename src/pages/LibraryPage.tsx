import { ArrowUpRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageIntro } from '../components/PageIntro'
import { HEXAGRAMS } from '../data/hexagrams'
import { useI18n } from '../i18n/I18nContext'

export function LibraryPage() {
  const { preferences, t } = useI18n()
  const [query, setQuery] = useState('')
  const normalized = query.trim().toLocaleLowerCase(preferences.locale)
  const results = useMemo(() => HEXAGRAMS.filter((hexagram) => {
    const editorial = hexagram.editorial[preferences.locale]
    return !normalized || [String(hexagram.id), hexagram.chinese, hexagram.pinyin, editorial.title].some((value) => value.toLocaleLowerCase(preferences.locale).includes(normalized))
  }), [normalized, preferences.locale])

  return (
    <div className="page-shell py-10 sm:py-16">
      <PageIntro eyebrow={t('library.eyebrow')} title={t('library.title')} body={t('library.body')} />
      <div className="relative mt-8 max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]" size={19} aria-hidden="true" />
        <input type="search" className="field !pl-12" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('library.search')} />
      </div>

      <p className="mt-5 text-sm font-semibold text-[var(--ink-soft)]" aria-live="polite">{results.length} / 64</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.map((hexagram) => {
          const editorial = hexagram.editorial[preferences.locale]
          return (
            <Link to={`/hexagrams/${hexagram.id}`} key={hexagram.id} className="group surface depth-card flex min-h-52 flex-col justify-between p-5">
              <div className="flex items-start justify-between">
                <span className="text-xs font-extrabold tracking-[.12em] text-[var(--jade)]">{String(hexagram.id).padStart(2, '0')}</span>
                <span className="font-editorial text-4xl text-[var(--obsidian)]" aria-hidden="true">{hexagram.symbol}</span>
              </div>
              <div className="mt-8">
                <p className="font-editorial text-xl font-semibold leading-tight">{editorial.title}</p>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">{hexagram.chinese} · {hexagram.pinyin}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[var(--jade)]">{t('library.open')} <ArrowUpRight size={14} aria-hidden="true" /></span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
