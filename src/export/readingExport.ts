import { getHexagram } from '../data/hexagrams'
import type { Locale, Polarity, Reading } from '../domain/types'

const labels = {
  en: { primary: 'Primary hexagram', resulting: 'Resulting hexagram', changing: 'Changing lines', reflection: 'First reflection', when: 'When it appears', question: 'Question', method: 'Method', line: 'Line', note: 'Journal note', stored: 'A reflective record · stored locally', methods: { digital: 'Digital coins', physical: 'Physical coins', yarrow: 'Yarrow stalks', direct: 'Direct entry' }, values: { 6: 'Old yin - becomes yang', 7: 'Young yang - remains yang', 8: 'Young yin - remains yin', 9: 'Old yang - becomes yin' } },
  bg: { primary: 'Основна хексаграма', resulting: 'Резултатна хексаграма', changing: 'Променящи се линии', reflection: 'Първи размисъл', when: 'Когато се появява', question: 'Въпрос', method: 'Метод', line: 'Линия', note: 'Бележка в дневника', stored: 'Личен запис · съхранен локално', methods: { digital: 'Дигитални монети', physical: 'Физически монети', yarrow: 'Бял равнец', direct: 'Директно въвеждане' }, values: { 6: 'Стар ин - преминава в ян', 7: 'Млад ян - остава ян', 8: 'Млад ин - остава ин', 9: 'Стар ян - преминава в ин' } },
  ru: { primary: 'Основная гексаграмма', resulting: 'Итоговая гексаграмма', changing: 'Изменяющиеся линии', reflection: 'Первое размышление', when: 'Когда она появляется', question: 'Вопрос', method: 'Метод', line: 'Линия', note: 'Заметка в дневнике', stored: 'Личная запись · хранится локально', methods: { digital: 'Цифровые монеты', physical: 'Физические монеты', yarrow: 'Тысячелистник', direct: 'Прямой ввод' }, values: { 6: 'Старый инь - становится ян', 7: 'Молодой ян - остаётся ян', 8: 'Молодой инь - остаётся инь', 9: 'Старый ян - становится инь' } },
} as const

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath()
  context.roundRect(x, y, width, height, radius)
}

function drawWrappedText(context: CanvasRenderingContext2D, value: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines = 20) {
  const words = value.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (context.measureText(candidate).width <= maxWidth || !line) line = candidate
    else { lines.push(line); line = word }
  }
  if (line) lines.push(line)
  lines.slice(0, maxLines).forEach((text, index) => context.fillText(text, x, y + index * lineHeight))
  return y + Math.min(lines.length, maxLines) * lineHeight
}

function drawHexagram(context: CanvasRenderingContext2D, lines: readonly { polarity: Polarity }[], x: number, y: number, width: number) {
  const gap = 16
  const height = 14
  ;[...lines].reverse().forEach((line, index) => {
    const lineY = y + index * 30
    if (line.polarity === 'yang') context.fillRect(x, lineY, width, height)
    else {
      context.fillRect(x, lineY, (width - gap) / 2, height)
      context.fillRect(x + (width + gap) / 2, lineY, (width - gap) / 2, height)
    }
  })
}

export async function downloadReadingImage(reading: Reading, locale: Locale) {
  await document.fonts?.ready
  const primary = getHexagram(reading.primaryHexagramId)
  const resulting = getHexagram(reading.resultingHexagramId)
  const editorial = primary.editorial[locale]
  const c = labels[locale]
  const moving = reading.lines.filter((line) => line.moving)
  const canvas = document.createElement('canvas')
  canvas.width = 1400
  canvas.height = 2200 + (reading.question ? 130 : 0) + moving.length * 170 + (reading.note ? 230 : 0)
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas export is unavailable.')

  context.fillStyle = '#f4f0e7'
  context.fillRect(0, 0, canvas.width, canvas.height)
  const glow = context.createRadialGradient(1080, 180, 20, 1080, 180, 720)
  glow.addColorStop(0, 'rgba(216,231,219,.92)')
  glow.addColorStop(1, 'rgba(216,231,219,0)')
  context.fillStyle = glow
  context.fillRect(0, 0, canvas.width, 1040)
  context.strokeStyle = 'rgba(49,95,80,.12)'
  context.lineWidth = 2
  for (let index = 0; index < 5; index += 1) {
    const waveY = canvas.height - 720 + index * 70
    context.beginPath(); context.moveTo(-80, waveY); context.bezierCurveTo(320, waveY - 220 + index * 10, 880, waveY + 140, 1500, waveY - 170 + index * 14); context.stroke()
  }

  context.fillStyle = '#315f50'
  context.font = '800 24px "Manrope Variable", sans-serif'
  context.letterSpacing = '5px'
  context.fillText('YI PATH · 易', 100, 100)
  context.letterSpacing = '0px'
  context.fillStyle = '#211f1a'
  context.font = '600 62px "Lora Variable", Georgia, serif'
  let cursor = drawWrappedText(context, editorial.title, 100, 205, 1200, 74, 2) + 16

  context.fillStyle = '#676154'
  context.font = '600 20px "Manrope Variable", Arial, sans-serif'
  const formattedDate = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeStyle: 'short' }).format(new Date(reading.createdAt))
  context.fillText(formattedDate, 100, cursor)
  context.textAlign = 'right'
  context.fillText(`${c.method}: ${c.methods[reading.method]}`, 1300, cursor)
  context.textAlign = 'left'
  cursor += 48

  if (reading.question) {
    context.fillStyle = '#315f50'; context.font = '800 18px "Manrope Variable", Arial, sans-serif'; context.fillText(c.question.toUpperCase(), 100, cursor)
    cursor += 42
    context.fillStyle = '#676154'; context.font = 'italic 28px "Lora Variable", Georgia, serif'
    cursor = drawWrappedText(context, `“${reading.question}”`, 100, cursor, 1200, 42, 3) + 12
  }

  const cardY = cursor + 32
  const cardWidth = moving.length ? 570 : 760
  const cardX = moving.length ? 100 : 320
  const drawCard = (x: number, type: 'primary' | 'resulting') => {
    const hexagram = type === 'primary' ? primary : resulting
    const pattern = type === 'primary' ? reading.lines : reading.lines.map((line) => ({ polarity: line.transformedPolarity }))
    context.fillStyle = 'rgba(255,253,248,.9)'; roundedRect(context, x, cardY, cardWidth, 360, 34); context.fill()
    context.strokeStyle = 'rgba(80,99,82,.2)'; context.stroke()
    context.fillStyle = '#1d2420'; drawHexagram(context, pattern, x + 52, cardY + 68, 170)
    context.fillStyle = '#315f50'; context.font = '800 20px "Manrope Variable", sans-serif'; context.fillText(type === 'primary' ? c.primary : c.resulting, x + 270, cardY + 86)
    context.fillStyle = '#211f1a'; context.font = '600 34px "Lora Variable", Georgia, serif'; drawWrappedText(context, `${hexagram.id}. ${hexagram.editorial[locale].title}`, x + 270, cardY + 145, cardWidth - 315, 44, 4)
  }
  drawCard(cardX, 'primary')
  if (moving.length) drawCard(730, 'resulting')

  cursor = cardY + 450
  context.fillStyle = '#315f50'; context.font = '800 19px "Manrope Variable", sans-serif'; context.fillText(c.reflection.toUpperCase(), 100, cursor)
  cursor += 62
  context.fillStyle = '#211f1a'; context.font = '600 37px "Lora Variable", Georgia, serif'; cursor = drawWrappedText(context, editorial.coreThread, 100, cursor, 1200, 53, 7) + 36

  context.fillStyle = '#315f50'; context.font = '800 19px "Manrope Variable", sans-serif'; context.fillText(c.when.toUpperCase(), 100, cursor)
  cursor += 54
  context.fillStyle = '#676154'; context.font = '400 27px "Manrope Variable", Arial, sans-serif'; cursor = drawWrappedText(context, editorial.whenItAppears, 100, cursor, 1200, 43, 7) + 38

  if (moving.length) {
    context.fillStyle = '#9a6e2f'; context.font = '800 19px "Manrope Variable", sans-serif'; context.fillText(c.changing.toUpperCase(), 100, cursor); cursor += 42
    for (const line of moving) {
      context.strokeStyle = 'rgba(49,95,80,.18)'; context.beginPath(); context.moveTo(100, cursor); context.lineTo(1300, cursor); context.stroke(); cursor += 42
      context.fillStyle = '#211f1a'; context.font = '700 27px "Lora Variable", Georgia, serif'; context.fillText(`${c.line} ${line.position} · ${line.value}`, 100, cursor)
      context.fillStyle = '#9a6e2f'; context.font = '700 18px "Manrope Variable", Arial, sans-serif'; context.fillText(c.values[line.value], 390, cursor)
      cursor += 42
      context.fillStyle = '#676154'; context.font = '400 24px "Manrope Variable", Arial, sans-serif'; cursor = drawWrappedText(context, editorial.lineReflections[String(line.position)], 100, cursor, 1200, 38, 2) + 20
    }
  }
  if (reading.note) {
    context.fillStyle = '#315f50'; context.font = '800 19px "Manrope Variable", sans-serif'; context.fillText(c.note.toUpperCase(), 100, cursor); cursor += 48
    context.fillStyle = '#676154'; context.font = '400 27px "Manrope Variable", sans-serif'; drawWrappedText(context, reading.note, 100, cursor, 1200, 40, 5)
  }
  context.fillStyle = '#676154'; context.font = '600 19px "Manrope Variable", sans-serif'
  context.fillText(formattedDate, 100, canvas.height - 92)
  context.textAlign = 'right'; context.fillText(c.stored, 1300, canvas.height - 92); context.textAlign = 'left'

  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error('Image export failed.')), 'image/png'))
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `yi-path-reading-${reading.createdAt.slice(0, 10)}.png`
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
