import { PDFDocument } from 'pdf-lib'
import type { Locale } from '../domain/locales'
import type { JournalEntry } from '../domain/types'

function textLines(context: CanvasRenderingContext2D, value: string, maxWidth: number) {
  const lines: string[] = []
  for (const paragraph of value.split(/\r?\n/)) {
    if (!paragraph.trim()) { lines.push(''); continue }
    let line = ''
    for (const word of paragraph.split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word
      if (!line || context.measureText(candidate).width <= maxWidth) line = candidate
      else { lines.push(line); line = word }
    }
    if (line) lines.push(line)
  }
  return lines
}

async function createJournalCanvas(entry: JournalEntry, locale: Locale) {
  await document.fonts?.ready
  const width = 1400
  const padding = 110
  const measure = document.createElement('canvas').getContext('2d')
  if (!measure) throw new Error('Canvas export is unavailable.')
  measure.font = '600 58px "Lora Variable", Georgia, serif'
  const titleLines = textLines(measure, entry.title, width - padding * 2)
  measure.font = '400 29px "Manrope Variable", Arial, sans-serif'
  const bodyLines = textLines(measure, entry.body, width - padding * 2)
  const height = Math.max(1700, 440 + titleLines.length * 72 + bodyLines.length * 48)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = Math.min(height, 30000)
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas export is unavailable.')

  context.fillStyle = '#f4f0e7'
  context.fillRect(0, 0, canvas.width, canvas.height)
  const glow = context.createRadialGradient(1120, 120, 20, 1120, 120, 760)
  glow.addColorStop(0, 'rgba(216,231,219,.92)')
  glow.addColorStop(1, 'rgba(216,231,219,0)')
  context.fillStyle = glow
  context.fillRect(0, 0, canvas.width, 1050)
  context.strokeStyle = 'rgba(49,95,80,.12)'
  context.lineWidth = 2
  for (let index = 0; index < 6; index += 1) {
    const y = canvas.height - 500 + index * 56
    context.beginPath(); context.moveTo(-100, y); context.bezierCurveTo(360, y - 190, 840, y + 110, 1500, y - 130); context.stroke()
  }

  context.fillStyle = '#315f50'
  context.font = '800 23px "Manrope Variable", Arial, sans-serif'
  context.letterSpacing = '5px'
  context.fillText('YI PATH · 道', padding, 105)
  context.letterSpacing = '0px'
  const formattedDate = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeStyle: 'short' }).format(new Date(entry.createdAt))
  context.fillStyle = '#676154'
  context.font = '650 19px "Manrope Variable", Arial, sans-serif'
  context.fillText(formattedDate, padding, 165)
  context.textAlign = 'right'
  context.fillText(entry.kind.toLocaleUpperCase(locale), width - padding, 165)
  context.textAlign = 'left'
  context.strokeStyle = 'rgba(49,95,80,.22)'
  context.beginPath(); context.moveTo(padding, 205); context.lineTo(width - padding, 205); context.stroke()

  let cursor = 310
  context.fillStyle = '#211f1a'
  context.font = '600 58px "Lora Variable", Georgia, serif'
  for (const line of titleLines) { context.fillText(line, padding, cursor); cursor += 72 }
  cursor += 40
  context.fillStyle = '#676154'
  context.font = '400 29px "Manrope Variable", Arial, sans-serif'
  for (const line of bodyLines) {
    if (cursor > canvas.height - 150) break
    context.fillText(line, padding, cursor)
    cursor += 48
  }
  context.fillStyle = '#315f50'
  context.font = '700 18px "Manrope Variable", Arial, sans-serif'
  context.fillText('A PRIVATE REFLECTION · STORED LOCALLY', padding, canvas.height - 80)
  return canvas
}

function canvasBlob(canvas: HTMLCanvasElement, type: 'image/png' | 'image/jpeg', quality?: number) {
  return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Export failed.')), type, quality))
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function downloadJournalEntryImage(entry: JournalEntry, locale: Locale) {
  const canvas = await createJournalCanvas(entry, locale)
  downloadBlob(await canvasBlob(canvas, 'image/png'), `yi-path-journal-${entry.createdAt.slice(0, 10)}.png`)
}

export async function downloadJournalEntryPdf(entry: JournalEntry, locale: Locale) {
  const source = await createJournalCanvas(entry, locale)
  const pdf = await PDFDocument.create()
  const sliceHeight = 1980
  for (let y = 0; y < source.height; y += sliceHeight) {
    const slice = document.createElement('canvas')
    slice.width = source.width
    slice.height = sliceHeight
    const context = slice.getContext('2d')
    if (!context) throw new Error('Canvas export is unavailable.')
    context.fillStyle = '#f4f0e7'; context.fillRect(0, 0, slice.width, slice.height)
    context.drawImage(source, 0, y, source.width, Math.min(sliceHeight, source.height - y), 0, 0, source.width, Math.min(sliceHeight, source.height - y))
    const image = await pdf.embedJpg(await (await canvasBlob(slice, 'image/jpeg', .94)).arrayBuffer())
    const page = pdf.addPage([595, 842])
    page.drawImage(image, { x: 0, y: 0, width: 595, height: 842 })
  }
  pdf.setTitle(entry.title)
  pdf.setAuthor('Yi Path')
  pdf.setSubject('Private journal reflection')
  pdf.setCreator('Yi Path')
  pdf.setCreationDate(new Date(entry.createdAt))
  downloadBlob(new Blob([Uint8Array.from(await pdf.save())], { type: 'application/pdf' }), `yi-path-journal-${entry.createdAt.slice(0, 10)}.pdf`)
}
