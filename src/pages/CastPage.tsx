import { ArrowLeft, Check, CircleDot, RotateCcw, Wind } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useSound } from '../audio/SoundContext'
import { HexagramFigure } from '../components/HexagramFigure'
import { HEXAGRAMS, getHexagram } from '../data/hexagrams'
import { castCoins, createCastLine } from '../domain/casting'
import { createReading, linesFromKnownHexagram } from '../domain/reading'
import type { CastLine, CoinSide, LineValue, ReadingMethod } from '../domain/types'
import { useI18n } from '../i18n/I18nContext'
import type { TranslationKey } from '../i18n/translations'
import { saveReading } from '../storage/db'
import { getDraftQuestion, setCurrentReading } from '../storage/session'

const lineMeta: Record<LineValue, { nameKey: TranslationKey; effectKey: TranslationKey }> = {
  6: { nameKey: 'line.6.name', effectKey: 'line.6.effect' },
  7: { nameKey: 'line.7.name', effectKey: 'line.7.effect' },
  8: { nameKey: 'line.8.name', effectKey: 'line.8.effect' },
  9: { nameKey: 'line.9.name', effectKey: 'line.9.effect' },
}

type Translator = (key: TranslationKey) => string

function CastProgress({ lines, t }: { lines: CastLine[]; t: Translator }) {
  const newestPosition = lines.at(-1)?.position

  return (
    <div className="cast-progress" aria-label={`${lines.length} / 6`}>
      {[6, 5, 4, 3, 2, 1].map((position) => {
        const line = lines.find((item) => item.position === position)
        return (
          <div key={position} className={`cast-progress__row ${newestPosition === position ? 'cast-progress__row--new' : ''}`}>
            <span className="cast-progress__position">{position}</span>
            {line ? (
              <HexagramFigure
                linesBottomUp={[line]}
                label={`${t('common.line')} ${position}: ${t(line.polarity === 'yin' ? 'cast.yin' : 'cast.yang')}${line.moving ? `, ${t('cast.moving')}` : ''}`}
                className="!w-32 text-[var(--obsidian)]"
              />
            ) : (
              <span className="cast-progress__empty" />
            )}
            {line ? (
              <span className={`cast-progress__value ${line.moving ? 'cast-progress__value--moving' : ''}`}>
                {line.value}<span className="hidden sm:inline"> · {t(line.moving ? 'line.changing' : 'line.stable')}</span>
              </span>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function CoinReveal({ coins, linePosition, tossing }: { coins: [CoinSide, CoinSide, CoinSide]; linePosition: number; tossing: boolean }) {
  return (
    <div className={`coin-well ${tossing ? 'is-tossing' : ''}`} aria-hidden="true">
      <span className="coin-ripple" />
      <div className="coin-toss-row">
        {coins.map((coin, index) => (
          <span
            key={`${linePosition}-${index}`}
            className="coin-flight"
            style={{ '--coin-index': index, '--coin-tilt': `${index % 2 ? 7 : -7}deg` } as CSSProperties}
          >
            <span className="coin-spinner">
              <span className={`coin-face coin-face--${coin}`}>{coin === 'heads' ? '3' : '2'}</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

function Preparation({ question, t, onReady }: { question: string; t: Translator; onReady: () => void }) {
  return (
    <section className="surface preparation-card mt-8 overflow-hidden p-6 sm:p-9" aria-labelledby="preparation-title">
      <div className="preparation-card__breath" aria-hidden="true"><span /><Wind size={24} /></div>
      <div className="relative">
        <p className="eyebrow">{t('cast.prepare.eyebrow')}</p>
        <h2 id="preparation-title" className="mt-3 text-3xl sm:text-4xl">{t('cast.prepare.title')}</h2>
        <p className="mt-4 max-w-2xl leading-7 text-[var(--ink-soft)]">{t('cast.prepare.body')}</p>

        <div className="preparation-steps mt-7">
          {[t('cast.prepare.step1'), t('cast.prepare.step2'), t('cast.prepare.step3')].map((step, index) => (
            <div key={step} className="preparation-step"><span>{index + 1}</span><p>{step}</p></div>
          ))}
        </div>

        <blockquote className="question-vessel mt-7">
          <span>{t('cast.prepare.question')}</span>
          <p>“{question || t('cast.prepare.empty')}”</p>
        </blockquote>

        <button type="button" className="button-primary mt-7" onClick={onReady}>{t('cast.prepare.ready')}</button>
      </div>
    </section>
  )
}

function RitualCue({ question, lineCount, t }: { question: string; lineCount: number; t: Translator }) {
  return (
    <section className="ritual-cue" aria-labelledby="ritual-question">
      <div className="ritual-cue__progress" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((position) => <span key={position} className={position < lineCount ? 'is-complete' : position === lineCount ? 'is-current' : ''} />)}
      </div>
      <div className="ritual-cue__copy">
        <p className="eyebrow">{lineCount === 0 ? t('cast.cue.first') : t('cast.cue.next')}</p>
        <p id="ritual-question" className="mt-2 font-editorial text-xl italic">“{question || t('cast.prepare.empty')}”</p>
        <span className="mt-2 block text-xs text-[var(--ink-soft)]">{t('cast.cue.question')}</span>
      </div>
    </section>
  )
}

export function CastPage() {
  const { method } = useParams()
  if (!['digital', 'physical', 'direct'].includes(method ?? '')) return <Navigate to="/reading" replace />

  return <CastFlow method={method as ReadingMethod} />
}

function CastFlow({ method }: { method: ReadingMethod }) {
  const { preferences, t } = useI18n()
  const { playCoinToss } = useSound()
  const navigate = useNavigate()
  const [question] = useState(getDraftQuestion)
  const [prepared, setPrepared] = useState(method === 'direct')
  const [lines, setLines] = useState<CastLine[]>([])
  const [pending, setPending] = useState<CastLine | null>(null)
  const [knownId, setKnownId] = useState(1)
  const [movingPositions, setMovingPositions] = useState<number[]>([])
  const [isFinishing, setIsFinishing] = useState(false)
  const revealTimerRef = useRef<number | null>(null)
  const castLockRef = useRef(false)

  useEffect(() => () => {
    if (revealTimerRef.current !== null) window.clearTimeout(revealTimerRef.current)
  }, [])

  const titles = {
    digital: [t('cast.digital.title'), t('cast.digitalBodyRitual')],
    physical: [t('cast.physical.title'), t('cast.physical.body')],
    direct: [t('cast.direct.title'), t('cast.direct.body')],
  } as const

  async function finish(finalLines: CastLine[]) {
    setIsFinishing(true)
    const reading = createReading({ method, locale: preferences.locale, question, lines: finalLines })
    setCurrentReading(reading)
    await saveReading(reading)
    navigate('/result')
  }

  function addDigitalLine() {
    if (castLockRef.current || pending || lines.length >= 6) return
    castLockRef.current = true
    const result = castCoins()
    const committed = createCastLine((lines.length + 1) as CastLine['position'], result.value, result.coins)

    setPending(committed)
    playCoinToss(result.coins)
    revealTimerRef.current = window.setTimeout(() => {
      setLines((current) => [...current, committed])
      setPending(null)
      castLockRef.current = false
      revealTimerRef.current = null
    }, preferences.reduceMotion ? 20 : 840)
  }

  function addManualLine(value: LineValue) {
    if (lines.length >= 6) return
    setLines((current) => [...current, createCastLine((current.length + 1) as CastLine['position'], value)])
  }

  function toggleMoving(position: number) {
    setMovingPositions((current) => current.includes(position) ? current.filter((item) => item !== position) : [...current, position])
  }

  const knownHexagram = getHexagram(knownId)
  const displayedLine = pending ?? lines.at(-1)
  const lastSettledLine = pending ? null : lines.at(-1)
  const coinSummary = lastSettledLine?.coins?.map((side) => t(side === 'heads' ? 'cast.heads' : 'cast.tails')).join(', ')
  const resultStatus = lastSettledLine
    ? `${coinSummary ? `${coinSummary}. ` : ''}${t('cast.total')} ${lastSettledLine.value}. ${t(lineMeta[lastSettledLine.value].nameKey)}. ${t(lineMeta[lastSettledLine.value].effectKey)}`
    : ''

  return (
    <div className="page-shell py-8 sm:py-14">
      <div className="reading-column">
        <Link to="/reading" className="button-quiet -ml-3 mb-5"><ArrowLeft size={18} aria-hidden="true" /> {t('common.back')}</Link>
        <p className="eyebrow">{method === 'digital' ? t('method.digital.title') : method === 'physical' ? t('method.physical.title') : t('method.direct.title')}</p>
        <h1 className="mt-3 text-4xl font-medium leading-tight tracking-[-.03em]">{titles[method][0]}</h1>
        <p className="mt-3 max-w-2xl leading-7 text-[var(--ink-soft)]">{titles[method][1]}</p>

        {!prepared ? <Preparation question={question} t={t} onReady={() => setPrepared(true)} /> : null}

        {prepared && method !== 'direct' ? (
          <>
            {lines.length < 6 ? <RitualCue question={question} lineCount={lines.length} t={t} /> : null}
            <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr] sm:items-stretch sm:gap-5">
              <CastProgress lines={lines} t={t} />
              <div className={`surface ritual-card ${pending ? 'is-casting' : ''}`} aria-busy={Boolean(pending)}>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[var(--jade)]">{t('common.line')} {Math.min(lines.length + 1, 6)} {t('common.of')} 6</p>
                  <p className="mt-2 text-sm text-[var(--ink-soft)]">{lines.length ? `${lines.length} / 6` : '—'}</p>
                </div>

                {method === 'digital' ? (
                  <>
                    {displayedLine?.coins ? <CoinReveal key={`coins-${displayedLine.position}`} coins={displayedLine.coins} linePosition={displayedLine.position} tossing={Boolean(pending)} /> : <div className="coin-well" aria-hidden="true"><CircleDot className="text-[var(--line)]" size={38} /></div>}
                    {pending ? <p className="font-editorial text-lg text-[var(--jade)]" aria-hidden="true">{t('cast.revealing')}</p> : null}
                    {lastSettledLine ? (
                      <div className={`line-result ${lastSettledLine.moving ? 'line-result--moving' : ''}`}>
                        <p><strong>{lastSettledLine.value} · {t(lineMeta[lastSettledLine.value].nameKey)}</strong><span>{t(lastSettledLine.moving ? 'line.changing' : 'line.stable')}</span></p>
                        <small>{t(lineMeta[lastSettledLine.value].effectKey)}</small>
                      </div>
                    ) : null}
                    {lastSettledLine ? <p key={`status-${lastSettledLine.position}`} className="sr-only" role="status" aria-atomic="true">{resultStatus}</p> : null}
                    {!pending && lines.length < 6 ? (
                      <button type="button" className="button-primary w-full select-none active:scale-[.98]" onClick={addDigitalLine}>{lines.length ? t('cast.next') : t('cast.castLine')}</button>
                    ) : null}
                  </>
                ) : (
                  <fieldset className="w-full">
                    <legend className="mb-4 text-sm font-semibold">{t('cast.chooseTotal')} {lines.length + 1}</legend>
                    <div className="grid grid-cols-2 gap-2">
                      {([6, 7, 8, 9] as LineValue[]).map((value) => (
                        <button key={value} type="button" onClick={() => addManualLine(value)} disabled={lines.length >= 6} className={`line-choice ${value === 6 || value === 9 ? 'line-choice--moving' : ''}`}>
                          <span className="block text-lg font-extrabold">{value} · {t(lineMeta[value].nameKey)}</span>
                          <span className="mt-1 block text-xs text-[var(--ink-soft)]">{t(lineMeta[value].effectKey)}</span>
                        </button>
                      ))}
                    </div>
                    <p className="mt-4 text-xs leading-5 text-[var(--ink-soft)]">{t('cast.valueGuide')}</p>
                  </fieldset>
                )}
              </div>
            </div>
          </>
        ) : null}

        {method === 'direct' ? (
          <div className="surface mt-8 p-5 sm:p-7">
            <label htmlFor="known-hexagram" className="mb-2 block text-sm font-bold">{t('cast.selectHexagram')}</label>
            <select id="known-hexagram" className="field" value={knownId} onChange={(event) => setKnownId(Number(event.target.value))}>
              {HEXAGRAMS.map((hexagram) => <option value={hexagram.id} key={hexagram.id}>{hexagram.id}. {hexagram.chinese} · {hexagram.editorial[preferences.locale].title}</option>)}
            </select>
            <div className="mt-7 grid gap-6 sm:grid-cols-[10rem_1fr] sm:items-center">
              <div className="rounded-3xl bg-[var(--paper-deep)] p-6">
                <HexagramFigure linesBottomUp={knownHexagram.linesBottomUp} label={`Hexagram ${knownId}`} className="mx-auto text-[var(--obsidian)]" />
              </div>
              <fieldset>
                <legend className="mb-3 text-sm font-bold">{t('cast.changingLines')}</legend>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {[1, 2, 3, 4, 5, 6].map((position) => {
                    const selected = movingPositions.includes(position)
                    return <button key={position} type="button" aria-pressed={selected} onClick={() => toggleMoving(position)} className={`changing-line-choice ${selected ? 'is-selected' : ''}`}><span>{position}</span>{selected ? <Check size={14} aria-hidden="true" /> : null}</button>
                  })}
                </div>
                <p className="mt-3 text-xs text-[var(--ink-soft)]">{movingPositions.length ? [...movingPositions].sort((a, b) => a - b).join(', ') : t('cast.noneSelected')}</p>
              </fieldset>
            </div>
          </div>
        ) : null}

        {prepared ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            {method !== 'direct' && lines.length > 0 ? <button type="button" className="button-quiet" onClick={() => setLines((current) => current.slice(0, -1))} disabled={Boolean(pending)}><RotateCcw size={17} aria-hidden="true" /> {t('cast.undo')}</button> : <span />}
            {method === 'direct' ? (
              <button type="button" className="button-primary" onClick={() => finish(linesFromKnownHexagram(knownId, movingPositions))} disabled={isFinishing}>{t('cast.complete')}</button>
            ) : lines.length === 6 && !pending ? (
              <button type="button" className="button-primary" onClick={() => finish(lines)} disabled={isFinishing}>{t('cast.complete')}</button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
