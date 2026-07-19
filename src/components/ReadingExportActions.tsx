import { Download, FileDown } from 'lucide-react'
import { useState } from 'react'
import type { Reading } from '../domain/types'
import { downloadReadingImage, downloadReadingPdf } from '../export/readingExport'
import { useI18n } from '../i18n/I18nContext'

const copy = {
  en: { image: 'Save image', pdf: 'Download PDF', saved: 'Image saved', pdfWorking: 'Creating PDF…', pdfSaved: 'PDF downloaded', pdfError: 'PDF unavailable' },
  bg: { image: 'Запази изображение', pdf: 'Изтегли PDF', saved: 'Изображението е запазено', pdfWorking: 'Създаване на PDF…', pdfSaved: 'PDF е изтеглен', pdfError: 'PDF не е достъпен' },
  ru: { image: 'Сохранить изображение', pdf: 'Скачать PDF', saved: 'Изображение сохранено', pdfWorking: 'Создание PDF…', pdfSaved: 'PDF скачан', pdfError: 'PDF недоступен' },
} as const

export function ReadingExportActions({ reading, compact = false }: { reading: Reading; compact?: boolean }) {
  const { preferences } = useI18n()
  const [saved, setSaved] = useState(false)
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'working' | 'saved' | 'error'>('idle')
  const c = copy[preferences.locale]
  async function saveImage() {
    await downloadReadingImage(reading, preferences.locale)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }
  async function savePdf() {
    setPdfStatus('working')
    try {
      await downloadReadingPdf(reading, preferences.locale)
      setPdfStatus('saved')
      window.setTimeout(() => setPdfStatus('idle'), 2200)
    } catch {
      setPdfStatus('error')
    }
  }
  const pdfLabel = pdfStatus === 'working' ? c.pdfWorking : pdfStatus === 'saved' ? c.pdfSaved : pdfStatus === 'error' ? c.pdfError : c.pdf
  return <div className={`reading-export-actions ${compact ? 'is-compact' : ''}`}>
    <button type="button" className="button-secondary" onClick={() => void saveImage()}><Download size={16} aria-hidden="true" />{saved ? c.saved : c.image}</button>
    <button type="button" className="button-secondary" disabled={pdfStatus === 'working'} onClick={() => void savePdf()}><FileDown size={16} aria-hidden="true" />{pdfLabel}</button>
  </div>
}
