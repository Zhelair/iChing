import { Download, Printer } from 'lucide-react'
import { useState } from 'react'
import type { Reading } from '../domain/types'
import { downloadReadingImage } from '../export/readingExport'
import { useI18n } from '../i18n/I18nContext'

const copy = {
  en: { image: 'Save image', pdf: 'Print / PDF', saved: 'Image saved' },
  bg: { image: 'Запази изображение', pdf: 'Печат / PDF', saved: 'Изображението е запазено' },
  ru: { image: 'Сохранить изображение', pdf: 'Печать / PDF', saved: 'Изображение сохранено' },
} as const

export function ReadingExportActions({ reading, onPrint, compact = false }: { reading: Reading; onPrint?: () => void; compact?: boolean }) {
  const { preferences } = useI18n()
  const [saved, setSaved] = useState(false)
  const c = copy[preferences.locale]
  async function saveImage() {
    await downloadReadingImage(reading, preferences.locale)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }
  return <div className={`reading-export-actions ${compact ? 'is-compact' : ''}`}>
    <button type="button" className="button-secondary" onClick={() => void saveImage()}><Download size={16} aria-hidden="true" />{saved ? c.saved : c.image}</button>
    <button type="button" className="button-secondary" onClick={onPrint ?? (() => window.print())}><Printer size={16} aria-hidden="true" />{c.pdf}</button>
  </div>
}
