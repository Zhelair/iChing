import { Download, FileDown } from 'lucide-react'
import { useState } from 'react'
import { isBuiltInContentLocale } from '../domain/locales'
import type { Reading } from '../domain/types'
import { downloadReadingImage, downloadReadingPdf } from '../export/readingExport'
import { useI18n } from '../i18n/I18nContext'
import { getUiLocalePack } from '../i18n/uiLocalePacks'

const copy = {
  en: { image: 'Save image', pdf: 'Download PDF', saved: 'Image saved', imageWorking: 'Creating image…', imageError: 'Image unavailable', pdfWorking: 'Creating PDF…', pdfSaved: 'PDF downloaded', pdfError: 'PDF unavailable' },
  bg: { image: 'Запази изображение', pdf: 'Изтегли PDF', saved: 'Изображението е запазено', imageWorking: 'Създаване на изображение…', imageError: 'Изображението не е достъпно', pdfWorking: 'Създаване на PDF…', pdfSaved: 'PDF е изтеглен', pdfError: 'PDF не е достъпен' },
  ru: { image: 'Сохранить изображение', pdf: 'Скачать PDF', saved: 'Изображение сохранено', imageWorking: 'Создание изображения…', imageError: 'Изображение недоступно', pdfWorking: 'Создание PDF…', pdfSaved: 'PDF скачан', pdfError: 'PDF недоступен' },
} as const

export function ReadingExportActions({ reading, compact = false }: { reading: Reading; compact?: boolean }) {
  const { preferences } = useI18n()
  const [imageStatus, setImageStatus] = useState<'idle' | 'working' | 'saved' | 'error'>('idle')
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'working' | 'saved' | 'error'>('idle')
  const c = isBuiltInContentLocale(preferences.locale)
    ? copy[preferences.locale]
    : getUiLocalePack(preferences.locale).features.exportActions
  async function saveImage() {
    setImageStatus('working')
    try {
      await downloadReadingImage(reading, preferences.locale)
      setImageStatus('saved')
      window.setTimeout(() => setImageStatus('idle'), 1800)
    } catch {
      setImageStatus('error')
    }
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
  const imageLabel = imageStatus === 'working' ? c.imageWorking : imageStatus === 'saved' ? c.saved : imageStatus === 'error' ? c.imageError : c.image
  const pdfLabel = pdfStatus === 'working' ? c.pdfWorking : pdfStatus === 'saved' ? c.pdfSaved : pdfStatus === 'error' ? c.pdfError : c.pdf
  return <div className={`reading-export-actions ${compact ? 'is-compact' : ''}`}>
    <button type="button" className="button-secondary" disabled={imageStatus === 'working'} onClick={() => void saveImage()}><Download size={16} aria-hidden="true" />{imageLabel}</button>
    <button type="button" className="button-secondary" disabled={pdfStatus === 'working'} onClick={() => void savePdf()}><FileDown size={16} aria-hidden="true" />{pdfLabel}</button>
  </div>
}
