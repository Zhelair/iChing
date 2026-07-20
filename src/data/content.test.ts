import { describe, expect, it } from 'vitest'
import { CONTENT_VERSION, HEXAGRAMS } from './hexagrams'
import type { BuiltInContentLocale } from '../domain/locales'

describe('generated Yi Canon content', () => {
  it('contains a complete versioned 64-card release', () => {
    expect(CONTENT_VERSION).toMatch(/^\d{4}\.\d{2}\.\d{2}/)
    expect(HEXAGRAMS.map((card) => card.id)).toEqual(Array.from({ length: 64 }, (_, index) => index + 1))
  })

  it.each(['en', 'bg', 'ru'] as BuiltInContentLocale[])('has complete %s editorial content for every card', (locale) => {
    for (const card of HEXAGRAMS) {
      const editorial = card.editorial[locale]
      expect(editorial.title.length).toBeGreaterThan(2)
      expect(editorial.coreThread.length).toBeGreaterThan(40)
      expect(editorial.whenItAppears.length).toBeGreaterThan(40)
      expect(editorial.reflectionQuestions.length).toBeGreaterThanOrEqual(3)
      for (const line of ['1', '2', '3', '4', '5', '6']) {
        expect(editorial.lineReflections[line]?.length).toBeGreaterThan(20)
      }
    }
  })

  it('keeps classical and provenance layers on every card', () => {
    for (const card of HEXAGRAMS) {
      expect(card.classical.judgment.length).toBeGreaterThan(3)
      expect(card.classical.lines.length).toBeGreaterThanOrEqual(6)
      expect(card.provenance.classicalSource).toContain('Zhouyi')
      expect(card.provenance.contentType.length).toBeGreaterThan(10)
    }
  })

  it('preserves the reviewed canonical names and tone-marked pinyin', () => {
    const expected = [
      [18, '蠱', 'Gǔ'],
      [21, '噬嗑', 'Shì Kè'],
      [22, '賁', 'Bì'],
      [23, '剝', 'Bō'],
      [27, '頤', 'Yí'],
      [48, '井', 'Jǐng'],
      [50, '鼎', 'Dǐng'],
      [59, '渙', 'Huàn'],
    ] as const

    for (const [id, chinese, pinyin] of expected) {
      expect(HEXAGRAMS[id - 1]).toMatchObject({ id, chinese, pinyin })
    }
  })

  it('preserves the reviewed Russian hexagram titles', () => {
    const expected = [
      'Цянь — Творческая сила',
      'Кунь — Восприимчивая земля',
      'Чжунь — Трудность в начале',
      'Мэн — Обучение в неизвестности',
      'Сюй — Ожидание с доверием',
      'Сун — Конфликт и его границы',
      'Ши — Общее усилие и дисциплина',
      'Би — Единение',
      'Сяо Чу — Малое укрощение',
      'Люй — Осторожная поступь',
      'Тай — Свободное течение',
      'Пи — Застой',
      'Тун Жэнь — Содружество под открытым небом',
      'Да Ю — Великое обладание',
      'Цянь — Скромность',
      'Юй — Воодушевление',
      'Суй — Следование',
      'Гу — Исправление давнего ущерба',
      'Линь — Приближение',
      'Гуань — Созерцание',
      'Ши Кэ — Прогрызание преграды',
      'Би — Изящество',
      'Бо — Сбрасывание слоёв',
      'Фу — Возвращение',
      'У Ван — Невинность',
      'Да Чу — Великое укрощение',
      'И — Питание',
      'Да Го — Великое преобладание',
      'Кань — Бездна',
      'Ли — Сияющее пламя',
      'Сянь — Взаимное влияние',
      'Хэн — Постоянство',
      'Дунь — Отступление',
      'Да Чжуан — Великая мощь',
      'Цзинь — Продвижение',
      'Мин И — Помрачение света',
      'Цзя Жэнь — Семья',
      'Куй — Противостояние',
      'Цзянь — Препятствие',
      'Се — Освобождение',
      'Сунь — Уменьшение',
      'И — Увеличение',
      'Гуай — Прорыв',
      'Гоу — Встреча',
      'Цуй — Воссоединение',
      'Шэн — Подъём',
      'Кунь — Истощение',
      'Цзин — Колодец',
      'Гэ — Преобразование',
      'Дин — Котёл',
      'Чжэнь — Пробуждающий гром',
      'Гэнь — Неподвижность',
      'Цзянь — Постепенное развитие',
      'Гуй Мэй — Невеста',
      'Фэн — Изобилие',
      'Люй — Странник',
      'Сюнь — Мягкое проникновение',
      'Дуй — Радость общения',
      'Хуань — Рассеивание',
      'Цзе — Ограничение',
      'Чжун Фу — Внутренняя искренность',
      'Сяо Го — Малое преобладание',
      'Цзи Цзи — Уже завершено',
      'Вэй Цзи — Ещё не завершено',
    ]

    expect(HEXAGRAMS.map((card) => card.editorial.ru.title)).toEqual(expected)
  })

  it('preserves the reviewed received-text corrections', () => {
    expect(HEXAGRAMS[2].classical.lines[2]).toBe('六三：即鹿無虞，惟入于林中，君子幾不如舍，往吝。')
    expect(HEXAGRAMS[17].classical.lines[2]).toBe('九三：幹父之蠱，小有悔，無大咎。')
    expect(HEXAGRAMS[23].classical.lines[0]).toBe('初九：不遠復，無祗悔，元吉。')
    expect(HEXAGRAMS[42].classical.lines[0]).toBe('初九：壯于前趾，往不勝為咎。')
    expect(HEXAGRAMS[47].classical.lines[2]).toBe('九三：井渫不食，為我心惻，可用汲，王明，並受其福。')
    expect(HEXAGRAMS[47].classical.lines[5]).toBe('上六：井收勿幕，有孚元吉。')
  })

  it('preserves the Qian and Kun all-lines-changing reflections in every built-in locale', () => {
    const expected = {
      1: {
        en: 'Strength is shared, not owned by one dominant figure. Let capable people act without needing a single hero.',
        bg: 'Силата се споделя, а не е собственост на една доминираща фигура. Позволете на способните хора да действат, без да се нуждаят от един-единствен герой.',
        ru: 'Сила принадлежит всем, а не одной доминирующей фигуре. Позвольте способным людям действовать без опоры на единственного героя.',
      },
      2: {
        en: 'Stay true to the path over time. Receptivity becomes powerful when it is paired with enduring principles.',
        bg: 'Останете верни на пътя с течение на времето. Възприемчивостта става силна, когато е съчетана с трайни принципи.',
        ru: 'Оставайтесь верны пути с течением времени. Восприимчивость становится силой, когда опирается на устойчивые принципы.',
      },
    } as const

    for (const id of [1, 2] as const) {
      const card = HEXAGRAMS[id - 1]
      for (const locale of ['en', 'bg', 'ru'] as const) {
        expect(card.editorial[locale].lineReflections.all).toBe(expected[id][locale])
      }
    }
  })
})
