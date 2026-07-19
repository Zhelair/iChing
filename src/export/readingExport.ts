import { getHexagram } from '../data/hexagrams'
import type { Locale, Polarity, Reading } from '../domain/types'

const labels = {
  en: { primary: 'Primary hexagram', resulting: 'Resulting hexagram', changing: 'Changing lines', reflection: 'First reflection', note: 'Journal note' },
  bg: { primary: 'Основна хексаграма', resulting: 'Резултатна хексаграма', changing: 'Променящи се линии', reflection: 'Първи размисъл', note: 'Бележка в дневника' },
  ru: { primary: 'Основная гексаграмма', resulting: 'Итоговая гексаграмма', changing: 'Изменяющиеся линии', reflection: 'Первое размышление', note: 'Заметка в дневнике' },
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
  canvas.height = 1750
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas export is unavailable.')

  context.fillStyle = '#f4f0e7'
  context.fillRect(0, 0, canvas.width, canvas.height)
  const glow = context.createRadialGradient(1080, 180, 20, 1080, 180, 720)
  glow.addColorStop(0, 'rgba(216,231,219,.92)')
  glow.addColorStop(1, 'rgba(216,231,219,0)')
  context.fillStyle = glow
  context.fillRect(0, 0, canvas.width, 980)
  context.strokeStyle = 'rgba(49,95,80,.12)'
  context.lineWidth = 2
  for (let index = 0; index < 5; index += 1) {
    context.beginPath(); context.moveTo(-80, 1180 + index * 70); context.bezierCurveTo(320, 960 + index * 40, 880, 1320 + index * 20, 1500, 990 + index * 55); context.stroke()
  }

  context.fillStyle = '#315f50'
  context.font = '800 24px "Manrope Variable", sans-serif'
  context.letterSpacing = '5px'
  context.fillText('YI PATH · 易', 100, 100)
  context.letterSpacing = '0px'
  context.fillStyle = '#211f1a'
  context.font = '600 62px "Lora Variable", Georgia, serif'
  drawWrappedText(context, editorial.title, 100, 205, 1200, 74, 2)
  if (reading.question) {
    context.fillStyle = '#676154'; context.font = 'italic 28px "Lora Variable", Georgia, serif'
    drawWrappedText(context, `“${reading.question}”`, 100, 350, 1200, 42, 3)
  }

  const cardY = reading.question ? 490 : 365
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

  let cursor = cardY + 450
  context.fillStyle = '#315f50'; context.font = '800 19px "Manrope Variable", sans-serif'; context.fillText(c.reflection.toUpperCase(), 100, cursor)
  cursor += 62
  context.fillStyle = '#211f1a'; context.font = '600 37px "Lora Variable", Georgia, serif'; cursor = drawWrappedText(context, editorial.coreThread, 100, cursor, 1200, 53, 7) + 36
  if (moving.length) {
    context.fillStyle = '#9a6e2f'; context.font = '800 19px "Manrope Variable", sans-serif'; context.fillText(`${c.changing.toUpperCase()}: ${moving.map((line) => line.position).join(', ')}`, 100, cursor); cursor += 54
  }
  if (reading.note && cursor < 1480) {
    context.fillStyle = '#315f50'; context.font = '800 19px "Manrope Variable", sans-serif'; context.fillText(c.note.toUpperCase(), 100, cursor); cursor += 48
    context.fillStyle = '#676154'; context.font = '400 27px "Manrope Variable", sans-serif'; drawWrappedText(context, reading.note, 100, cursor, 1200, 40, 5)
  }
  context.fillStyle = '#676154'; context.font = '600 19px "Manrope Variable", sans-serif'
  context.fillText(new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(reading.createdAt)), 100, 1655)
  context.textAlign = 'right'; context.fillText('A reflective record · stored locally', 1300, 1655); context.textAlign = 'left'

  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error('Image export failed.')), 'image/png'))
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `yi-path-reading-${reading.createdAt.slice(0, 10)}.png`
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
