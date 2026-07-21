import { Download, FileDown } from 'lucide-react'
import { useState } from 'react'
import type { Locale } from '../domain/locales'
import type { JournalEntry } from '../domain/types'
import { downloadJournalEntryImage, downloadJournalEntryPdf } from '../export/journalEntryExport'
import { getExportActionCopy } from './ReadingExportActions'

export function JournalEntryExportActions({ entry, locale }: { entry: JournalEntry; locale: Locale }) {
  const [imageStatus, setImageStatus] = useState<'idle' | 'working' | 'saved' | 'error'>('idle')
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'working' | 'saved' | 'error'>('idle')
  const copy = getExportActionCopy(locale)

  async function saveImage() {
    setImageStatus('working')
    try { await downloadJournalEntryImage(entry, locale); setImageStatus('saved'); window.setTimeout(() => setImageStatus('idle'), 1800) }
    catch { setImageStatus('error') }
  }
  async function savePdf() {
    setPdfStatus('working')
    try { await downloadJournalEntryPdf(entry, locale); setPdfStatus('saved'); window.setTimeout(() => setPdfStatus('idle'), 2200) }
    catch { setPdfStatus('error') }
  }

  const imageLabel = imageStatus === 'working' ? copy.imageWorking : imageStatus === 'saved' ? copy.saved : imageStatus === 'error' ? copy.imageError : copy.image
  const pdfLabel = pdfStatus === 'working' ? copy.pdfWorking : pdfStatus === 'saved' ? copy.pdfSaved : pdfStatus === 'error' ? copy.pdfError : copy.pdf
  return <div className="reading-export-actions is-compact">
    <button type="button" className="button-secondary" disabled={imageStatus === 'working'} onClick={() => void saveImage()}><Download size={16} />{imageLabel}</button>
    <button type="button" className="button-secondary" disabled={pdfStatus === 'working'} onClick={() => void savePdf()}><FileDown size={16} />{pdfLabel}</button>
  </div>
}
