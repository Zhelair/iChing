import type { BuiltInContentLocale } from '../domain/locales'
import type { Polarity } from '../domain/types'
import firstContentShard from './hexagrams.v1.01-32.json'
import secondContentShard from './hexagrams.v1.33-64.json'

if (firstContentShard.contentVersion !== secondContentShard.contentVersion) {
  throw new Error('Generated Yi Canon shards use different content versions.')
}

const contentCards = [...firstContentShard.cards, ...secondContentShard.cards]

export const CONTENT_VERSION = firstContentShard.contentVersion

type TrigramId = 'heaven' | 'lake' | 'fire' | 'thunder' | 'wind' | 'water' | 'mountain' | 'earth'

type HexagramSeed = readonly [
  number,
  string,
  string,
  string,
  TrigramId,
  TrigramId,
]

export type LocalizedEditorial = {
  title: string
  coreThread: string
  whenItAppears: string
  reflectionQuestions: string[]
  lineReflections: Record<string, string>
}

export type Hexagram = {
  id: number
  chinese: string
  pinyin: string
  symbol: string
  workingTitle: string
  trigrams: { upper: TrigramId; lower: TrigramId }
  linesBottomUp: Polarity[]
  provenance: {
    status: string
    classicalSource: string
    textReference: string
    contentType: string
    sourceFile: string
  }
  classical: { judgment: string; lines: string[] }
  editorial: Record<BuiltInContentLocale, LocalizedEditorial>
}

export const TRIGRAMS: Record<TrigramId, { lines: Polarity[]; symbol: string }> = {
  heaven: { lines: ['yang', 'yang', 'yang'], symbol: '☰' },
  lake: { lines: ['yang', 'yang', 'yin'], symbol: '☱' },
  fire: { lines: ['yang', 'yin', 'yang'], symbol: '☲' },
  thunder: { lines: ['yang', 'yin', 'yin'], symbol: '☳' },
  wind: { lines: ['yin', 'yang', 'yang'], symbol: '☴' },
  water: { lines: ['yin', 'yang', 'yin'], symbol: '☵' },
  mountain: { lines: ['yin', 'yin', 'yang'], symbol: '☶' },
  earth: { lines: ['yin', 'yin', 'yin'], symbol: '☷' },
}

const seeds: HexagramSeed[] = [
  [1, '乾', 'Qián', 'Creative Force', 'heaven', 'heaven'],
  [2, '坤', 'Kūn', 'Receptive Ground', 'earth', 'earth'],
  [3, '屯', 'Zhūn', 'Difficulty at the Beginning', 'water', 'thunder'],
  [4, '蒙', 'Méng', 'Youthful Learning', 'mountain', 'water'],
  [5, '需', 'Xū', 'Waiting', 'water', 'heaven'],
  [6, '訟', 'Sòng', 'Conflict', 'heaven', 'water'],
  [7, '師', 'Shī', 'The Army', 'earth', 'water'],
  [8, '比', 'Bǐ', 'Holding Together', 'water', 'earth'],
  [9, '小畜', 'Xiǎo Chù', 'Small Taming', 'wind', 'heaven'],
  [10, '履', 'Lǚ', 'Treading Carefully', 'heaven', 'lake'],
  [11, '泰', 'Tài', 'Flow', 'earth', 'heaven'],
  [12, '否', 'Pǐ', 'Stagnation', 'heaven', 'earth'],
  [13, '同人', 'Tóng Rén', 'Fellowship', 'heaven', 'fire'],
  [14, '大有', 'Dà Yǒu', 'Great Possession', 'fire', 'heaven'],
  [15, '謙', 'Qiān', 'Modesty', 'earth', 'mountain'],
  [16, '豫', 'Yù', 'Enthusiasm', 'thunder', 'earth'],
  [17, '隨', 'Suí', 'Following', 'lake', 'thunder'],
  [18, '蠱', 'Gǔ', 'Repairing What Is Spoiled', 'mountain', 'wind'],
  [19, '臨', 'Lín', 'Approach', 'earth', 'lake'],
  [20, '觀', 'Guān', 'Contemplation', 'wind', 'earth'],
  [21, '噬嗑', 'Shì Kè', 'Biting Through', 'fire', 'thunder'],
  [22, '賁', 'Bì', 'Grace', 'mountain', 'fire'],
  [23, '剝', 'Bō', 'Stripping Away', 'mountain', 'earth'],
  [24, '復', 'Fù', 'Return', 'earth', 'thunder'],
  [25, '無妄', 'Wú Wàng', 'Innocence', 'heaven', 'thunder'],
  [26, '大畜', 'Dà Chù', 'Great Taming', 'mountain', 'heaven'],
  [27, '頤', 'Yí', 'Nourishment', 'mountain', 'thunder'],
  [28, '大過', 'Dà Guò', 'Great Preponderance', 'lake', 'wind'],
  [29, '坎', 'Kǎn', 'The Abyss', 'water', 'water'],
  [30, '離', 'Lí', 'The Clinging Flame', 'fire', 'fire'],
  [31, '咸', 'Xián', 'Mutual Influence', 'lake', 'mountain'],
  [32, '恆', 'Héng', 'Duration', 'thunder', 'wind'],
  [33, '遯', 'Dùn', 'Retreat', 'heaven', 'mountain'],
  [34, '大壯', 'Dà Zhuàng', 'Great Power', 'thunder', 'heaven'],
  [35, '晉', 'Jìn', 'Progress', 'fire', 'earth'],
  [36, '明夷', 'Míng Yí', 'Darkening of the Light', 'earth', 'fire'],
  [37, '家人', 'Jiā Rén', 'The Family', 'wind', 'fire'],
  [38, '睽', 'Kuí', 'Opposition', 'fire', 'lake'],
  [39, '蹇', 'Jiǎn', 'Obstruction', 'water', 'mountain'],
  [40, '解', 'Xiè', 'Release', 'thunder', 'water'],
  [41, '損', 'Sǔn', 'Decrease', 'mountain', 'lake'],
  [42, '益', 'Yì', 'Increase', 'wind', 'thunder'],
  [43, '夬', 'Guài', 'Breakthrough', 'lake', 'heaven'],
  [44, '姤', 'Gòu', 'Encounter', 'heaven', 'wind'],
  [45, '萃', 'Cuì', 'Gathering Together', 'lake', 'earth'],
  [46, '升', 'Shēng', 'Pushing Upward', 'earth', 'wind'],
  [47, '困', 'Kùn', 'Oppression', 'lake', 'water'],
  [48, '井', 'Jǐng', 'The Well', 'water', 'wind'],
  [49, '革', 'Gé', 'Revolution', 'lake', 'fire'],
  [50, '鼎', 'Dǐng', 'The Cauldron', 'fire', 'wind'],
  [51, '震', 'Zhèn', 'The Arousing', 'thunder', 'thunder'],
  [52, '艮', 'Gèn', 'Keeping Still', 'mountain', 'mountain'],
  [53, '漸', 'Jiàn', 'Gradual Development', 'wind', 'mountain'],
  [54, '歸妹', 'Guī Mèi', 'The Marrying Maiden', 'thunder', 'lake'],
  [55, '豐', 'Fēng', 'Abundance', 'thunder', 'fire'],
  [56, '旅', 'Lǚ', 'The Wanderer', 'fire', 'mountain'],
  [57, '巽', 'Xùn', 'Gentle Penetration', 'wind', 'wind'],
  [58, '兌', 'Duì', 'Joyous Exchange', 'lake', 'lake'],
  [59, '渙', 'Huàn', 'Dispersion', 'wind', 'water'],
  [60, '節', 'Jié', 'Limitation', 'water', 'lake'],
  [61, '中孚', 'Zhōng Fú', 'Inner Truth', 'wind', 'lake'],
  [62, '小過', 'Xiǎo Guò', 'Small Exceeding', 'thunder', 'mountain'],
  [63, '既濟', 'Jì Jì', 'Already Complete', 'water', 'fire'],
  [64, '未濟', 'Wèi Jì', 'Before Completion', 'fire', 'water'],
]

export const HEXAGRAMS: Hexagram[] = seeds.map(
  ([id, chinese, pinyin, workingTitle, upper, lower]) => ({
    ...(() => {
      const card = contentCards.find((item) => item.id === id)
      if (!card) throw new Error(`Missing generated content for hexagram ${id}.`)
      if (card.chinese !== chinese || card.pinyin !== pinyin || card.trigrams.upper !== upper || card.trigrams.lower !== lower) {
        throw new Error(`Generated content does not match structural seed for hexagram ${id}.`)
      }

      return {
        id,
        chinese,
        pinyin,
        symbol: card.symbol,
        workingTitle: card.locales.en.title || workingTitle,
        trigrams: { upper, lower },
        linesBottomUp: [...TRIGRAMS[lower].lines, ...TRIGRAMS[upper].lines],
        provenance: card.provenance,
        classical: card.classical,
        editorial: card.locales as unknown as Record<BuiltInContentLocale, LocalizedEditorial>,
      }
    })(),
  }),
)

const patternKey = (lines: readonly Polarity[]) => lines.map((line) => (line === 'yang' ? '1' : '0')).join('')
const byPattern = new Map(HEXAGRAMS.map((hexagram) => [patternKey(hexagram.linesBottomUp), hexagram]))

export function getHexagram(id: number): Hexagram {
  const hexagram = HEXAGRAMS.find((item) => item.id === id)
  if (!hexagram) throw new Error(`Unknown hexagram ${id}.`)
  return hexagram
}

export function findHexagramByPattern(linesBottomUp: readonly Polarity[]): Hexagram {
  const match = byPattern.get(patternKey(linesBottomUp))
  if (!match) throw new Error('No King Wen hexagram matches this line pattern.')
  return match
}
