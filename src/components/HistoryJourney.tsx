import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { useSound } from '../audio/SoundContext'
import { isBuiltInContentLocale } from '../domain/locales'
import { useI18n } from '../i18n/I18nContext'
import { getUiLocalePack } from '../i18n/uiLocalePacks'

type Scene = 'bone' | 'scroll' | 'stalk' | 'numbers' | 'wings' | 'coins' | 'compass'
type Chapter = { id: string; era: string; title: string; body: string; note?: string; scene: Scene }

const content: Record<'en' | 'bg' | 'ru', { eyebrow: string; title: string; contents: string; replay: string; oracleSource: string; yarrowSource: string; chapters: Chapter[] }> = {
  en: {
    eyebrow: 'A short illustrated history', title: 'From fire-marked bone to a living book.', contents: 'On this journey', replay: 'Replay illustration', oracleSource: 'Smarthistory / Smithsonian introduction ↗', yarrowSource: 'Stanford Encyclopedia of Philosophy ↗',
    chapters: [
      { id: 'oracle-bones', era: 'Shang dynasty · before the Yijing', title: 'Questions met heat and bone.', body: 'Diviners inscribed questions on ox scapulae or tortoise plastrons, applied heat, and read the resulting cracks. This is crucial historical context—not an early coin method.', scene: 'bone' },
      { id: 'zhouyi', era: 'Western Zhou · a layered text emerges', title: 'Sixty-four figures become a book of change.', body: 'Hexagram figures, judgments, and line statements formed the early Zhouyi. The received text grew through transmission and editorial layers rather than appearing as one finished object.', scene: 'scroll' },
      { id: 'yarrow', era: 'Classical consultation', title: 'Fifty stalks; forty-nine put into motion.', body: 'The Xici describes a slow yarrow-stalk procedure. One stalk is set aside and forty-nine are repeatedly divided and counted, producing the values 6, 7, 8, and 9.', scene: 'stalk' },
      { id: 'line-values-story', era: 'The mathematics of a line', title: 'Four values, two kinds of change.', body: 'Six is old yin and becomes yang; nine is old yang and becomes yin. Seven and eight remain stable.', scene: 'numbers' },
      { id: 'ten-wings', era: 'Warring States to Han thought', title: 'Commentary opened a philosophical sky.', body: 'The “Ten Wings” connected the classic with cosmology, ethics, and interpretation. Tradition attributes them to Confucius.', scene: 'wings' },
      { id: 'coins', era: 'A later, simpler practice', title: 'Coins made consultation more portable.', body: 'The three-coin method became a practical alternative to yarrow. It preserves 6, 7, 8, and 9, though its probabilities are not identical to the traditional stalk method.', scene: 'coins' },
      { id: 'yi-path', era: 'Yi Path today', title: 'Faithful structure, modest claims.', body: 'Yi Path builds from the bottom line upward, shows changing lines transparently, separates source from editorial reflection, and treats the resulting hexagram as a direction—not a promised future.', note: 'The slow yarrow-stalk workshop is now available from Read.', scene: 'compass' },
    ],
  },
  bg: {
    eyebrow: 'Кратка история в образи', title: 'От гадателните кости до живата книга.', contents: 'Етапи по пътя', replay: 'Повтори илюстрацията', oracleSource: 'Въведение от Smarthistory / Smithsonian ↗', yarrowSource: 'Станфордска енциклопедия по философия ↗',
    chapters: [
      { id: 'oracle-bones', era: 'Династия Шан · преди И Дзин', title: 'Отговорите били търсени в огъня и костите.', body: 'Гадатели изписвали въпроси върху волски лопатки или коруби на костенурки, нагрявали ги и тълкували пукнатините. Това е важен исторически контекст, а не ранна форма на метода с монети.', scene: 'bone' },
      { id: 'zhouyi', era: 'Западна Джоу · възниква многопластов текст', title: 'Шестдесет и четири фигури се превръщат в книга на промените.', body: 'Хексаграмите, съжденията и текстовете на линиите оформят ранния „Джоу И“. Достигналият до нас текст се развива чрез предаване и редакционни пластове.', scene: 'scroll' },
      { id: 'yarrow', era: 'Класически метод за допитване', title: 'Петдесет стъбла, четиридесет и девет в движение.', body: '„Сици“ описва бавна процедура със стъбла от бял равнец. Едно стъбло се отделя, а останалите 49 многократно се разделят и преброяват, за да дадат 6, 7, 8 или 9.', scene: 'stalk' },
      { id: 'line-values-story', era: 'Математиката на линията', title: 'Четири стойности, два вида промяна.', body: 'Шест е стар ин и става ян; девет е стар ян и става ин. Седем и осем остават стабилни.', scene: 'numbers' },
      { id: 'ten-wings', era: 'От Воюващите царства до Хан', title: 'Коментарите разширяват философския хоризонт.', body: '„Десетте крила“ свързват класиката с космологията, етиката и тълкуването. Традицията ги приписва на Конфуций.', scene: 'wings' },
      { id: 'coins', era: 'По-късна и по-проста практика', title: 'Монетите опростяват допитването до И Дзин.', body: 'Методът с три монети става практична алтернатива на белия равнец. Той запазва стойностите 6, 7, 8 и 9, макар вероятностите при двата метода да не съвпадат напълно.', scene: 'coins' },
      { id: 'yi-path', era: 'Yi Path днес', title: 'Точна структура, сдържани твърдения.', body: 'Yi Path изгражда линиите отдолу нагоре, показва променящите се линии, отделя източника от редакционния размисъл и представя трансформационната хексаграма като посока, а не като обещано бъдеще.', note: 'Бавната практика с бял равнец е достъпна от „Прочит“.', scene: 'compass' },
    ],
  },
  ru: {
    eyebrow: 'Краткая история в образах', title: 'От гадательных костей до живой книги.', contents: 'Этапы пути', replay: 'Повторить иллюстрацию', oracleSource: 'Введение Smarthistory / Smithsonian ↗', yarrowSource: 'Стэнфордская философская энциклопедия ↗',
    chapters: [
      { id: 'oracle-bones', era: 'Династия Шан · до Ицзина', title: 'Ответы искали в огне и костях.', body: 'Прорицатели вырезали вопросы на бычьих лопатках и панцирях черепах, нагревали их и истолковывали трещины. Это важный исторический контекст, а не ранний монетный метод.', scene: 'bone' },
      { id: 'zhouyi', era: 'Западная Чжоу · возникает многослойный текст', title: 'Шестьдесят четыре фигуры становятся книгой перемен.', body: 'Гексаграммы, суждения и тексты линий составили ранний «Чжоу И». Дошедший до нас текст складывался по мере передачи и редактирования.', scene: 'scroll' },
      { id: 'yarrow', era: 'Классический способ обращения к Ицзину', title: 'Пятьдесят стеблей, сорок девять — в движении.', body: '«Си цы» описывает медленную процедуру с тысячелистником. Один стебель откладывают, а 49 многократно делят и пересчитывают, получая 6, 7, 8 или 9.', scene: 'stalk' },
      { id: 'line-values-story', era: 'Математика линии', title: 'Четыре значения, два вида перемен.', body: 'Шесть — старый инь и становится ян; девять — старый ян и становится инь. Семь и восемь устойчивы.', scene: 'numbers' },
      { id: 'ten-wings', era: 'От Сражающихся царств до Хань', title: 'Комментарии расширили философский горизонт.', body: '«Десять крыльев» связали классику с космологией, этикой и толкованием. Традиция приписывает их Конфуцию.', scene: 'wings' },
      { id: 'coins', era: 'Более поздняя и простая практика', title: 'Монеты упростили обращение к Ицзину.', body: 'Метод трёх монет стал практичной альтернативой тысячелистнику. Он сохраняет 6, 7, 8 и 9, хотя вероятности двух методов не полностью совпадают.', scene: 'coins' },
      { id: 'yi-path', era: 'Yi Path сегодня', title: 'Точная структура без громких обещаний.', body: 'Yi Path строит линии снизу вверх, ясно показывает изменяющиеся линии, отделяет источник от редакционного комментария и представляет результирующую гексаграмму как направление, а не обещанное будущее.', note: 'Медленная практика с тысячелистником доступна в разделе «Чтение».', scene: 'compass' },
    ],
  },
}

function Illustration({ scene }: { scene: Scene }) {
  return <svg className={`history-art history-art--${scene}`} viewBox="0 0 420 250" aria-hidden="true">
    <circle className="history-moon" cx="335" cy="55" r="31" />
    {scene === 'bone' ? <><path className="history-bone" d="M110 45C69 87 69 173 112 207C157 242 296 203 306 133C315 66 246 37 195 62C161 78 144 28 110 45Z" /><path className="history-crack" d="M201 80l-17 34 28 18-31 44m31-44 31-21m-59 4-24-18" /><path className="history-heat" d="M160 222c-14-27 19-29 5-55m41 56c-16-29 20-35 4-63m42 58c-11-23 13-28 2-49" /></> : null}
    {scene === 'scroll' ? <><path className="history-scroll" d="M82 54h246v144H82z" /><path className="history-scroll-edge" d="M82 54c-27 0-27 27 0 27m246-27c27 0 27 27 0 27M82 171c-27 0-27 27 0 27m246-27c27 0 27 27 0 27" /><path className="history-script" d="M132 92h64m-64 24h116m-116 24h89m-89 24h133" /></> : null}
    {scene === 'stalk' ? <>{Array.from({ length: 11 }, (_, index) => <path key={index} className="history-stalk" style={{ '--stalk': index } as CSSProperties} d={`M${112 + index * 18} 213Q${103 + index * 19} 120 ${130 + index * 15} 39`} />)}<circle className="history-count" cx="96" cy="205" r="23" /><text x="96" y="212">49</text></> : null}
    {scene === 'numbers' ? <>{[6, 7, 8, 9].map((number, index) => <g key={number} className={`history-number history-number--${number}`} transform={`translate(${77 + index * 88} 126)`}><circle r="35" /><text y="9">{number}</text></g>)}</> : null}
    {scene === 'wings' ? <><path className="history-wing history-wing--left" d="M202 196C114 182 82 119 63 54C129 72 179 109 202 196Z" /><path className="history-wing history-wing--right" d="M218 196C306 182 338 119 357 54C291 72 241 109 218 196Z" /><path className="history-brush" d="M210 35v173" /></> : null}
    {scene === 'coins' ? <>{[0, 1, 2].map((index) => <g className="history-coin" style={{ '--coin': index } as CSSProperties} key={index} transform={`translate(${125 + index * 86} 132)`}><circle r="39" /><rect x="-11" y="-11" width="22" height="22" rx="3" /></g>)}</> : null}
    {scene === 'compass' ? <><circle className="history-compass" cx="210" cy="130" r="82" /><path className="history-needle" d="M210 56l17 64-17 84-17-84Z" /><circle cx="210" cy="130" r="7" /><path className="history-path" d="M30 215C114 173 155 232 229 201C301 171 332 189 395 151" /></> : null}
  </svg>
}

function cueFor(scene: Scene): 'bone' | 'stalk' | 'brush' | 'coin' {
  if (scene === 'bone') return 'bone'
  if (scene === 'stalk' || scene === 'numbers') return 'stalk'
  if (scene === 'coins') return 'coin'
  return 'brush'
}

export function HistoryJourney() {
  const { preferences } = useI18n()
  const { playHistoryCue } = useSound()
  const [replays, setReplays] = useState<Record<string, number>>({})
  const rootRef = useRef<HTMLElement>(null)
  const c = isBuiltInContentLocale(preferences.locale)
    ? content[preferences.locale]
    : getUiLocalePack(preferences.locale).features.history
  const play = (chapter: Chapter) => { setReplays((values) => ({ ...values, [chapter.id]: (values[chapter.id] ?? 0) + 1 })); playHistoryCue(cueFor(chapter.scene)) }

  useEffect(() => {
    const chapters = rootRef.current?.querySelectorAll<HTMLElement>('.history-chapter')
    if (!chapters) return
    if (preferences.reduceMotion || !('IntersectionObserver' in window)) {
      chapters.forEach((chapter) => chapter.classList.add('is-in-view'))
      return
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle('is-in-view', entry.isIntersecting)), { threshold: .28, rootMargin: '-8% 0px -8%' })
    chapters.forEach((chapter) => observer.observe(chapter))
    return () => observer.disconnect()
  }, [preferences.reduceMotion])

  function moveIllustration(event: ReactPointerEvent<HTMLButtonElement>) {
    if (preferences.reduceMotion || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--history-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 12}px`)
    event.currentTarget.style.setProperty('--history-y', `${((event.clientY - bounds.top) / bounds.height - .5) * 9}px`)
  }
  function resetIllustration(event: ReactPointerEvent<HTMLButtonElement>) {
    event.currentTarget.style.setProperty('--history-x', '0px'); event.currentTarget.style.setProperty('--history-y', '0px')
  }

  const links = <nav className="history-toc" aria-label={c.contents}>{c.chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`}><span>{String(index + 1).padStart(2, '0')}</span>{chapter.title}</a>)}</nav>
  return <section ref={rootRef} className="history-journey mt-16" aria-labelledby="history-title">
    <div className="max-w-3xl"><p className="eyebrow">{c.eyebrow}</p><h2 id="history-title" className="mt-4 text-4xl sm:text-5xl">{c.title}</h2></div>
    <details className="surface history-mobile-toc mt-7 p-4 lg:hidden"><summary>{c.contents}</summary>{links}</details>
    <div className="history-layout mt-9"><aside className="hidden lg:block"><div className="surface sticky top-28 p-4"><p className="eyebrow mb-3">{c.contents}</p>{links}</div></aside>
      <div className="history-chapters">{c.chapters.map((chapter, index) => <article key={chapter.id} id={chapter.id} className="surface history-chapter scroll-mt-28">
        <button type="button" className="history-visual" onClick={() => play(chapter)} onPointerMove={moveIllustration} onPointerLeave={resetIllustration} aria-label={`${c.replay}: ${chapter.title}`} title={c.replay}>
          <span className="history-visual__motion"><span key={replays[chapter.id] ?? 0} className="history-visual__animation"><Illustration scene={chapter.scene} /></span></span>
        </button>
        <div className="history-copy"><p className="eyebrow">{String(index + 1).padStart(2, '0')} · {chapter.era}</p><h3>{chapter.title}</h3><p>{chapter.body}</p>{chapter.note ? <aside>{chapter.note}</aside> : null}
          {chapter.id === 'oracle-bones' ? <a href="https://smarthistory.org/oracle-bone/" target="_blank" rel="noreferrer">{c.oracleSource}</a> : null}
          {chapter.id === 'yarrow' ? <a href="https://plato.stanford.edu/archives/sum2024/entries/chinese-change/" target="_blank" rel="noreferrer">{c.yarrowSource}</a> : null}
        </div>
      </article>)}</div>
    </div>
  </section>
}
