import { ArrowLeft, Check, CircleDot, RotateCcw, Sparkles, Wind } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useSound } from '../audio/SoundContext'
import { HexagramFigure } from '../components/HexagramFigure'
import { HEXAGRAMS } from '../data/hexagrams'
import { BEAD_TOKENS, castCoins, castYarrowProcedure, createCastLine, drawBead, type BeadToken, type YarrowProcedure } from '../domain/casting'
import { isBuiltInContentLocale } from '../domain/locales'
import { createReading, linesFromKnownHexagram } from '../domain/reading'
import type { CastLine, CoinSide, LineValue, ReadingMethod } from '../domain/types'
import { useI18n } from '../i18n/I18nContext'
import { beadCopyFor, type BeadCopy } from '../i18n/featureCopy'
import type { TranslationKey } from '../i18n/translations'
import { getUiLocalePack } from '../i18n/uiLocalePacks'
import { saveReading } from '../storage/db'
import { getDraftQuestion, setCurrentReading } from '../storage/session'

const lineMeta: Record<LineValue, { nameKey: TranslationKey; effectKey: TranslationKey }> = {
  6: { nameKey: 'line.6.name', effectKey: 'line.6.effect' },
  7: { nameKey: 'line.7.name', effectKey: 'line.7.effect' },
  8: { nameKey: 'line.8.name', effectKey: 'line.8.effect' },
  9: { nameKey: 'line.9.name', effectKey: 'line.9.effect' },
}

const yarrowCopy = {
  en: { eyebrow: 'Yarrow-stalk workshop', title: 'Count one line through three changes', body: 'One of fifty stalks rests aside. Divide the active forty-nine, set one from the right aside, then count both heaps by fours. Repeat three times.', begin: 'Make the first change', next: 'Make the next change', nextLine: 'Begin the next line', complete: 'The line is complete', divided: 'Divided', removed: 'set aside', remain: 'remain', mixing: 'Mixing the stalks', dividing: 'Dividing into two heaps', counting: 'Counting by fours', source: 'The Xici describes fifty stalks, of which forty-nine are used. This digital model preserves the standardized 1:5:7:3 line odds and displays a valid three-change path.' },
  bg: { eyebrow: 'Практика с бял равнец', title: 'Съставете една линия чрез три промени', body: 'Едно от 50-те стъбла остава настрана. Разделете останалите 49, отделете едно от дясната купчина и пребройте двете купчини по четири. Повторете три пъти.', begin: 'Направете първата промяна', next: 'Направете следващата промяна', nextLine: 'Започнете следващата линия', complete: 'Линията е завършена', divided: 'Разделено', removed: 'отделено', remain: 'остават', mixing: 'Смесване на стъблата', dividing: 'Разделяне на две купчини', counting: 'Броене по четири', source: '„Сици“ описва 50 стъбла, от които се използват 49. Този дигитален модел запазва традиционните вероятности 1:5:7:3 и показва валидна последователност от три промени.' },
  ru: { eyebrow: 'Практика с тысячелистником', title: 'Составьте линию за три изменения', body: 'Один из 50 стеблей остаётся в стороне. Разделите оставшиеся 49, отложите один справа и пересчитайте оба пучка по четыре. Повторите трижды.', begin: 'Выполнить первое изменение', next: 'Выполнить следующее изменение', nextLine: 'Начать следующую линию', complete: 'Линия завершена', divided: 'Разделено', removed: 'отложено', remain: 'осталось', mixing: 'Перемешиваем стебли', dividing: 'Делим на два пучка', counting: 'Считаем по четыре', source: '«Си цы» описывает 50 стеблей, из которых используются 49. Эта цифровая модель сохраняет традиционные вероятности 1:5:7:3 и показывает корректную последовательность трёх изменений.' },
} as const

type Translator = (key: TranslationKey) => string

function CastProgress({ lines, t, animateNewest = true }: { lines: CastLine[]; t: Translator; animateNewest?: boolean }) {
  const newestPosition = animateNewest ? lines.at(-1)?.position : undefined

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

type YarrowCopy = {
  eyebrow: string
  title: string
  body: string
  begin: string
  next: string
  nextLine: string
  complete: string
  divided: string
  removed: string
  remain: string
  mixing: string
  dividing: string
  counting: string
  source: string
}

type YarrowPhase = 'idle' | 'mixing' | 'dividing' | 'counting'

function yarrowPhaseTimings(copy: YarrowCopy, reduceMotion: boolean): [number, number, number] {
  if (reduceMotion) return [20, 40, 70]
  const mixing = Math.min(2100, Math.max(1600, 900 + copy.mixing.length * 36))
  const dividing = Math.min(2600, Math.max(1900, 1050 + copy.dividing.length * 38))
  const counting = Math.min(2500, Math.max(1800, 1000 + copy.counting.length * 38))
  return [mixing, mixing + dividing, mixing + dividing + counting]
}

function YarrowWorkshop({ procedure, step, animatingStep, phase, ritualDuration, lineNumber, onAdvance, actionRef, copy: c }: { procedure: YarrowProcedure | null; step: number; animatingStep: number | null; phase: YarrowPhase; ritualDuration: number; lineNumber: number; onAdvance: () => void; actionRef: RefObject<HTMLButtonElement | null>; copy: YarrowCopy }) {
  const remaining = procedure && step > 0 ? procedure.changes[Math.min(step, 3) - 1].remaining : 49
  const ritualChange = procedure && animatingStep ? procedure.changes[animatingStep - 1] : null
  const phaseLabel = phase === 'mixing' ? c.mixing : phase === 'dividing' ? c.dividing : phase === 'counting' ? c.counting : ''

  return <div className={`yarrow-workshop ${phase !== 'idle' ? 'is-ritual-active' : ''}`} aria-busy={phase !== 'idle'}>
    <div className={`yarrow-stalk-field ${ritualChange ? 'is-ritual' : ''}`} style={{ '--yarrow-duration': `${Math.max(70, ritualDuration - 100)}ms` } as CSSProperties} aria-hidden="true">{Array.from({ length: 49 }, (_, index) => {
      const wasAlreadyRemoved = ritualChange ? index >= ritualChange.before : index >= remaining
      const willBeRemoved = ritualChange ? index >= ritualChange.remaining && index < ritualChange.before : false
      const side = ritualChange && index < ritualChange.left ? 'is-left' : 'is-right'
      const className = wasAlreadyRemoved ? 'is-removed' : ritualChange ? `${willBeRemoved ? 'is-counted-removed' : 'is-counted-kept'} ${side}` : 'is-active'
      return <i key={index} className={className} style={{ '--stalk-index': index, '--stalk-wave': index % 7, '--stalk-shift': side === 'is-left' ? '-15px' : '15px' } as CSSProperties} />
    })}<span className="yarrow-resting-stalk" /></div>
    <div className="yarrow-count"><strong>{remaining}</strong><span>{c.remain}</span></div>
    {procedure && step > 0 ? <ol className="yarrow-changes">{procedure.changes.slice(0, step).map((change, index) => <li key={index} className={index === step - 1 ? 'is-current' : ''}><span>{index + 1}</span><div className="yarrow-change__copy"><p><span>{c.divided}</span><strong>{change.left} + {change.right}</strong></p><small>− {change.removed} {c.removed} · {change.remaining} {c.remain}</small></div></li>)}</ol> : ritualChange ? null : <p className="text-sm leading-6 text-[var(--ink-soft)]">{c.source}</p>}
    {ritualChange ? <div className={`yarrow-ritual-status is-${phase}`} role="status" aria-live="polite" aria-atomic="true"><span className="yarrow-ritual-status__pulse" aria-hidden="true" /><div><p>{phaseLabel}</p>{phase === 'dividing' ? <strong>{ritualChange.left} + {ritualChange.right}</strong> : phase === 'counting' ? <strong>− {ritualChange.removed} {c.removed} · {ritualChange.remaining} {c.remain}</strong> : null}</div></div> : null}
    {step === 3 && procedure ? <div className="yarrow-result" role="status"><span>{c.complete}</span><strong>{procedure.value}</strong></div> : null}
    {!(step === 3 && lineNumber === 6) ? <button ref={actionRef} type="button" className="button-primary ritual-next-action w-full" onClick={onAdvance} disabled={phase !== 'idle'}>{phase !== 'idle' ? phaseLabel : step === 0 ? c.begin : step < 3 ? c.next : c.nextLine}</button> : null}
  </div>
}

type BeadPhase = 'idle' | 'mixing' | 'selected' | 'returning'

function BeadWorkshop({ draw, lastDraw, phase, timings, lineNumber, onDraw, actionRef, copy: c, t }: { draw: BeadToken | null; lastDraw: BeadToken | null; phase: BeadPhase; timings: [number, number, number]; lineNumber: number; onDraw: () => void; actionRef: RefObject<HTMLButtonElement | null>; copy: BeadCopy; t: Translator }) {
  const visibleSelection = phase === 'selected' || phase === 'returning' ? draw : null
  const displayed = visibleSelection ?? lastDraw
  const phaseLabel = phase === 'mixing' ? c.mixing : phase === 'selected' ? c.selected : phase === 'returning' ? c.returning : ''
  const phaseDurations = [timings[0], timings[1] - timings[0], timings[2] - timings[1]]

  return <div className={`bead-workshop is-${phase}`} aria-busy={phase !== 'idle'} style={{ '--bead-mix-duration': `${phaseDurations[0]}ms`, '--bead-select-duration': `${phaseDurations[1]}ms`, '--bead-return-duration': `${phaseDurations[2]}ms` } as CSSProperties}>
    <div className="bead-vessel" aria-hidden="true">
      <div className="bead-vessel__glow" />
      <div className="bead-field">
        {BEAD_TOKENS.map((token) => <i
          key={token.id}
          className={`bead-token bead-token--${token.tone} ${visibleSelection?.id === token.id ? 'is-selected' : ''} ${visibleSelection && visibleSelection.id !== token.id ? 'is-quiet' : ''}`}
          style={{ '--bead-index': token.bucket, '--bead-column': token.bucket % 5, '--bead-row': Math.floor(token.bucket / 5) } as CSSProperties}
        ><span>{token.value}</span></i>)}
      </div>
      <span className="bead-vessel__rim" />
    </div>

    <div className="bead-distribution" aria-label={c.methodBody}>
      {([6, 9, 7, 8] as LineValue[]).map((value) => {
        const token = BEAD_TOKENS.find((item) => item.value === value)!
        const count = BEAD_TOKENS.filter((item) => item.value === value).length
        return <div key={value} className={visibleSelection?.value === value ? 'is-current' : ''}>
          <span className={`bead-swatch bead-swatch--${token.tone}`} aria-hidden="true" />
          <strong>{count} × {value}</strong>
          <small>{t(lineMeta[value].nameKey)} · {count}/16</small>
        </div>
      })}
    </div>

    {phase !== 'idle' ? <div className={`bead-ritual-status is-${phase}`} role="status" aria-live="polite" aria-atomic="true"><span aria-hidden="true" /><p>{phaseLabel}</p></div> : null}
    {phase === 'idle' && displayed ? <div className={`bead-result ${displayed.value === 6 || displayed.value === 9 ? 'is-changing' : ''}`} role="status">
      <span className={`bead-result__token bead-result__token--${displayed.tone}`} aria-hidden="true">{displayed.value}</span>
      <div><p>{c.colors[displayed.tone]} · {displayed.value} · {t(lineMeta[displayed.value].nameKey)}</p><small>{t(lineMeta[displayed.value].effectKey)}</small></div>
    </div> : null}
    {phase === 'idle' && lastDraw ? <p className="bead-complete-set"><Check size={15} aria-hidden="true" /> {c.completeSet}</p> : null}
    {lineNumber <= 6 ? <button ref={actionRef} type="button" className="button-primary ritual-next-action w-full" onClick={onDraw} disabled={phase !== 'idle'}>{phase !== 'idle' ? phaseLabel : lineNumber === 1 ? c.drawFirst : c.drawNext}</button> : null}
  </div>
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

function RitualCue({ emphasizeThird, question, lineCount, t }: { emphasizeThird: boolean; question: string; lineCount: number; t: Translator }) {
  const isThirdLine = emphasizeThird && lineCount === 2
  return (
    <section className={`ritual-cue ${isThirdLine ? 'ritual-cue--third' : ''}`} aria-labelledby="ritual-question">
      <div className="ritual-cue__progress" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((position) => <span key={position} className={position < lineCount ? 'is-complete' : position === lineCount ? 'is-current' : ''} />)}
      </div>
      <div className="ritual-cue__copy">
        <p className="eyebrow">{isThirdLine ? t('cast.cue.third') : lineCount === 0 ? t('cast.cue.first') : t('cast.cue.next')}</p>
        <p id="ritual-question" className="mt-2 font-editorial text-xl italic">“{question || t('cast.prepare.empty')}”</p>
        <span className="mt-2 block text-xs text-[var(--ink-soft)]">{t('cast.cue.question')}</span>
      </div>
      {isThirdLine ? <div className="third-line-focus" role="status"><Sparkles size={18} aria-hidden="true" /><span>{t('cast.cue.thirdFocus')}</span></div> : null}
    </section>
  )
}

export function CastPage() {
  const { method } = useParams()
  if (!['digital', 'physical', 'yarrow', 'beads', 'direct'].includes(method ?? '')) return <Navigate to="/iching/reading" replace />

  return <CastFlow method={method as ReadingMethod} />
}

function CastFlow({ method }: { method: ReadingMethod }) {
  const { editorialFor, preferences, t } = useI18n()
  const yarrow = isBuiltInContentLocale(preferences.locale)
    ? yarrowCopy[preferences.locale]
    : getUiLocalePack(preferences.locale).features.castYarrow
  const beads = beadCopyFor(preferences.locale)
  const { playCoinToss, playHistoryCue } = useSound()
  const navigate = useNavigate()
  const [question] = useState(getDraftQuestion)
  const [prepared, setPrepared] = useState(method === 'direct')
  const [lines, setLines] = useState<CastLine[]>([])
  const [pending, setPending] = useState<CastLine | null>(null)
  const [knownId, setKnownId] = useState(1)
  const [movingPositions, setMovingPositions] = useState<number[]>([])
  const [isFinishing, setIsFinishing] = useState(false)
  const [yarrowProcedure, setYarrowProcedure] = useState<YarrowProcedure | null>(null)
  const [yarrowStep, setYarrowStep] = useState(0)
  const [yarrowAnimatingStep, setYarrowAnimatingStep] = useState<number | null>(null)
  const [yarrowPhase, setYarrowPhase] = useState<YarrowPhase>('idle')
  const [beadDraw, setBeadDraw] = useState<BeadToken | null>(null)
  const [lastBead, setLastBead] = useState<BeadToken | null>(null)
  const [beadPhase, setBeadPhase] = useState<BeadPhase>('idle')
  const [autoFocusStep, setAutoFocusStep] = useState(0)
  const revealTimerRef = useRef<number | null>(null)
  const yarrowTimersRef = useRef<number[]>([])
  const beadTimersRef = useRef<number[]>([])
  const castLockRef = useRef(false)
  const yarrowLockRef = useRef(false)
  const ritualCueRef = useRef<HTMLDivElement>(null)
  const ritualActionRef = useRef<HTMLButtonElement>(null)
  const completeActionRef = useRef<HTMLButtonElement>(null)

  useEffect(() => () => {
    if (revealTimerRef.current !== null) window.clearTimeout(revealTimerRef.current)
    yarrowTimersRef.current.forEach((timer) => window.clearTimeout(timer))
    beadTimersRef.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  useEffect(() => {
    if (!autoFocusStep) return

    const emphasizeThird = (method === 'digital' || method === 'beads') && lines.length === 2
    const target = emphasizeThird
      ? ritualCueRef.current
      : lines.length === 6
        ? completeActionRef.current
        : ritualActionRef.current
    if (!target) return

    const frame = window.requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: preferences.reduceMotion ? 'auto' : 'smooth',
        block: emphasizeThird ? 'start' : 'center',
      })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [autoFocusStep, lines.length, method, preferences.reduceMotion])

  const titles = {
    digital: [t('cast.digital.title'), t('cast.digitalBodyRitual')],
    physical: [t('cast.physical.title'), t('cast.physical.body')],
    yarrow: [yarrow.title, yarrow.body],
    beads: [beads.title, beads.body],
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
      setAutoFocusStep((current) => current + 1)
    }, preferences.reduceMotion ? 20 : 840)
  }

  function addManualLine(value: LineValue) {
    if (lines.length >= 6) return
    setLines((current) => [...current, createCastLine((current.length + 1) as CastLine['position'], value)])
  }

  function advanceYarrow() {
    if (yarrowLockRef.current || (lines.length >= 6 && yarrowStep === 3)) return
    yarrowLockRef.current = true
    playHistoryCue('stalk')
    let activeProcedure = yarrowProcedure
    let targetStep = yarrowStep + 1
    if (!yarrowProcedure || yarrowStep === 3) {
      activeProcedure = castYarrowProcedure()
      targetStep = 1
      setYarrowProcedure(activeProcedure)
      setYarrowStep(0)
    }
    if (!activeProcedure) return

    const phaseTimes = yarrowPhaseTimings(yarrow, preferences.reduceMotion)
    setYarrowAnimatingStep(targetStep)
    setYarrowPhase('mixing')
    yarrowTimersRef.current = [
      window.setTimeout(() => setYarrowPhase('dividing'), phaseTimes[0]),
      window.setTimeout(() => setYarrowPhase('counting'), phaseTimes[1]),
      window.setTimeout(() => {
        setYarrowStep(targetStep)
        setYarrowAnimatingStep(null)
        setYarrowPhase('idle')
        yarrowLockRef.current = false
        yarrowTimersRef.current = []
        if (targetStep === 3) {
          setLines((current) => [...current, createCastLine((current.length + 1) as CastLine['position'], activeProcedure.value)])
        }
        setAutoFocusStep((current) => current + 1)
      }, phaseTimes[2]),
    ]
  }

  function addBeadLine() {
    if (castLockRef.current || beadPhase !== 'idle' || lines.length >= 6) return
    castLockRef.current = true
    const selected = drawBead()
    const committed = createCastLine((lines.length + 1) as CastLine['position'], selected.value)
    const times: [number, number, number] = preferences.reduceMotion ? [20, 40, 70] : [2400, 5200, 7600]
    setLastBead(null)
    setBeadDraw(selected)
    setBeadPhase('mixing')
    playHistoryCue('coin')
    beadTimersRef.current = [
      window.setTimeout(() => setBeadPhase('selected'), times[0]),
      window.setTimeout(() => setBeadPhase('returning'), times[1]),
      window.setTimeout(() => {
        setLines((current) => [...current, committed])
        setLastBead(selected)
        setBeadDraw(null)
        setBeadPhase('idle')
        castLockRef.current = false
        beadTimersRef.current = []
        setAutoFocusStep((current) => current + 1)
      }, times[2]),
    ]
  }

  function toggleMoving(position: number) {
    setMovingPositions((current) => current.includes(position) ? current.filter((item) => item !== position) : [...current, position])
  }

  const knownLines = linesFromKnownHexagram(knownId, movingPositions)
  const yarrowTimings = yarrowPhaseTimings(yarrow, preferences.reduceMotion)
  const beadTimings: [number, number, number] = preferences.reduceMotion ? [20, 40, 70] : [2400, 5200, 7600]
  const displayedLine = pending ?? lines.at(-1)
  const lastSettledLine = pending ? null : lines.at(-1)
  const coinSummary = lastSettledLine?.coins?.map((side) => t(side === 'heads' ? 'cast.heads' : 'cast.tails')).join(', ')
  const resultStatus = lastSettledLine
    ? `${coinSummary ? `${coinSummary}. ` : ''}${t('cast.total')} ${lastSettledLine.value}. ${t(lineMeta[lastSettledLine.value].nameKey)}. ${t(lineMeta[lastSettledLine.value].effectKey)}`
    : ''

  return (
    <div className={`page-shell cast-page py-8 sm:py-14 ${(method === 'digital' || method === 'beads') && lines.length === 2 ? 'cast-page--third-focus' : ''}`}>
      <div className="reading-column">
        <Link to="/iching/reading" className="button-quiet -ml-3 mb-5"><ArrowLeft size={18} aria-hidden="true" /> {t('common.back')}</Link>
        <p className="eyebrow">{method === 'digital' ? t('method.digital.title') : method === 'physical' ? t('method.physical.title') : method === 'yarrow' ? yarrow.eyebrow : method === 'beads' ? beads.eyebrow : t('method.direct.title')}</p>
        <h1 className="mt-3 text-4xl font-medium leading-tight tracking-[-.03em]">{titles[method][0]}</h1>
        <p className="mt-3 max-w-2xl leading-7 text-[var(--ink-soft)]">{titles[method][1]}</p>
        {method === 'physical' ? <aside className="physical-coin-note mt-5"><CircleDot size={20} aria-hidden="true" /><p>{t('cast.physical.setAside')}</p></aside> : null}

        {!prepared ? <Preparation question={question} t={t} onReady={() => setPrepared(true)} /> : null}

        {prepared && method !== 'direct' ? (
          <>
            {lines.length < 6 ? <div ref={ritualCueRef} className="ritual-cue-anchor"><RitualCue emphasizeThird={method === 'digital' || method === 'physical' || method === 'beads'} question={question} lineCount={lines.length} t={t} /></div> : null}
            <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr] sm:items-stretch sm:gap-5">
              <CastProgress lines={lines} t={t} />
              <div className={`surface ritual-card ${pending || beadPhase !== 'idle' ? 'is-casting' : ''}`} aria-busy={Boolean(pending) || beadPhase !== 'idle'}>
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
                      <button ref={ritualActionRef} type="button" className="button-primary ritual-next-action w-full select-none active:scale-[.98]" onClick={addDigitalLine}>{lines.length ? t('cast.next') : t('cast.castLine')}</button>
                    ) : null}
                  </>
                ) : method === 'yarrow' ? (
                  <YarrowWorkshop procedure={yarrowProcedure} step={yarrowStep} animatingStep={yarrowAnimatingStep} phase={yarrowPhase} ritualDuration={yarrowTimings[2]} lineNumber={Math.max(1, lines.length + (yarrowStep === 3 ? 0 : 1))} onAdvance={advanceYarrow} actionRef={ritualActionRef} copy={yarrow} />
                ) : method === 'beads' ? (
                  <BeadWorkshop draw={beadDraw} lastDraw={lastBead} phase={beadPhase} timings={beadTimings} lineNumber={lines.length + 1} onDraw={addBeadLine} actionRef={ritualActionRef} copy={beads} t={t} />
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
              {HEXAGRAMS.map((hexagram) => <option value={hexagram.id} key={hexagram.id}>{hexagram.id}. {hexagram.chinese} · {editorialFor(hexagram).title}</option>)}
            </select>
            <div className="mt-7 grid gap-6 sm:grid-cols-[minmax(16rem,.9fr)_1.1fr] sm:items-center">
              <CastProgress lines={knownLines} t={t} animateNewest={false} />
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
            {method !== 'direct' && lines.length > 0 ? <button type="button" className="button-quiet" onClick={() => { setLines((current) => current.slice(0, -1)); if (method === 'yarrow') { setYarrowProcedure(null); setYarrowStep(0) } if (method === 'beads') setLastBead(null) }} disabled={Boolean(pending) || yarrowPhase !== 'idle' || beadPhase !== 'idle'}><RotateCcw size={17} aria-hidden="true" /> {t('cast.undo')}</button> : <span />}
            {method === 'direct' ? (
              <button type="button" className="button-primary" onClick={() => finish(linesFromKnownHexagram(knownId, movingPositions))} disabled={isFinishing}>{t('cast.complete')}</button>
            ) : lines.length === 6 && !pending && beadPhase === 'idle' ? (
              <button ref={completeActionRef} type="button" className="button-primary ritual-next-action" onClick={() => finish(lines)} disabled={isFinishing}>{t('cast.complete')}</button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
