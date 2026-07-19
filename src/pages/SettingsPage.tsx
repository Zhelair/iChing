import { Download, Trash2, Upload } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { useSound } from '../audio/SoundContext'
import { PageIntro } from '../components/PageIntro'
import type { Locale, Theme } from '../domain/types'
import { localeNames, useI18n } from '../i18n/I18nContext'
import { clearReadings, importReadings } from '../storage/db'
import { createExport, downloadExport, parseExport } from '../storage/export'

function Toggle({ checked, onChange, label, body }: { checked: boolean; onChange: (value: boolean) => void; label: string; body: string }) {
  return (
    <label className="flex min-h-20 cursor-pointer items-center justify-between gap-5 border-b border-[var(--line)] py-4 last:border-0">
      <span><span className="block font-bold">{label}</span><span className="mt-1 block text-xs leading-5 text-[var(--ink-soft)]">{body}</span></span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? 'bg-[var(--jade)]' : 'bg-[#c8c0b1]'}`}>
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} />
        <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </span>
    </label>
  )
}

export function SettingsPage() {
  const { preferences, setPreferences, updatePreference, t } = useI18n()
  const { previewCoinSound, setAmbientPlayback } = useSound()
  const [mode, setMode] = useState<'merge' | 'replace'>('merge')
  const [message, setMessage] = useState('')
  const [audioMessage, setAudioMessage] = useState('')
  const [clearOpen, setClearOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const themes: { id: Theme; label: 'settings.theme.daylight' | 'settings.theme.night' | 'settings.theme.bamboo' }[] = [
    { id: 'daylight', label: 'settings.theme.daylight' },
    { id: 'ink-night', label: 'settings.theme.night' },
    { id: 'bamboo-mist', label: 'settings.theme.bamboo' },
  ]

  async function exportData() {
    downloadExport(await createExport(preferences))
  }

  async function importData(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const backup = parseExport(JSON.parse(await file.text()))
      await importReadings(backup, mode)
      setPreferences(backup.preferences)
      setMessage(t('settings.importSuccess'))
    } catch {
      setMessage(t('settings.importError'))
    } finally {
      event.target.value = ''
    }
  }

  async function clearAll() {
    await clearReadings()
    sessionStorage.removeItem('yi-path:current-reading:v1')
    sessionStorage.removeItem('yi-path:question:v1')
    setPreferences({ locale: 'en', theme: 'daylight', sound: false, music: false, reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches })
    setMessage(t('settings.cleared'))
    setClearOpen(false)
  }

  return (
    <div className="page-shell py-10 sm:py-16">
      <div className="reading-column">
        <PageIntro eyebrow={t('settings.eyebrow')} title={t('settings.title')} />

        <section className="surface mt-8 p-5 sm:p-7">
          <h2 className="text-2xl">{t('settings.language')}</h2>
          <div className="mt-5 grid grid-cols-3 gap-2" role="group" aria-label={t('settings.language')}>
            {(Object.keys(localeNames) as Locale[]).map((locale) => <button key={locale} type="button" onClick={() => updatePreference('locale', locale)} aria-pressed={preferences.locale === locale} className={`min-h-12 rounded-2xl border px-2 text-sm font-bold ${preferences.locale === locale ? 'border-[var(--jade)] bg-[var(--jade)] text-white' : 'border-[var(--line)] bg-white/45'}`}>{localeNames[locale]}</button>)}
          </div>
        </section>

        <section className="surface mt-5 p-5 sm:p-7">
          <h2 className="text-2xl">{t('settings.appearance')}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{t('settings.appearanceBody')}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3" role="group" aria-label={t('settings.appearance')}>
            {themes.map(({ id, label }) => (
              <button key={id} type="button" onClick={() => updatePreference('theme', id)} aria-pressed={preferences.theme === id} className={`theme-choice theme-choice--${id} ${preferences.theme === id ? 'is-selected' : ''}`}>
                <span className="theme-choice__scene" aria-hidden="true"><i /><i /><i /></span>
                <span>{t(label)}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="surface mt-5 px-5 py-2 sm:px-7">
          <Toggle checked={preferences.sound} onChange={async (value) => {
            if (!value) {
              updatePreference('sound', false)
              setAudioMessage('')
              return
            }
            const available = await previewCoinSound()
            updatePreference('sound', available)
            setAudioMessage(available ? '' : t('settings.audioUnavailable'))
          }} label={t('settings.sound')} body={t('settings.soundBody')} />
          <Toggle checked={preferences.music} onChange={async (value) => {
            const available = await setAmbientPlayback(value)
            updatePreference('music', value && available)
            setAudioMessage(value && !available ? t('settings.audioUnavailable') : '')
          }} label={t('settings.ambient')} body={t('settings.ambientBody')} />
          <Toggle checked={preferences.reduceMotion} onChange={(value) => updatePreference('reduceMotion', value)} label={t('settings.motion')} body={t('settings.motionBody')} />
          {audioMessage ? <p className="mb-4 rounded-2xl bg-[var(--jade-light)] px-4 py-3 text-sm font-semibold text-[var(--jade)]" role="status">{audioMessage}</p> : null}
        </section>

        <section className="surface mt-5 p-5 sm:p-7">
          <h2 className="text-2xl">{t('settings.data')}</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">{t('settings.dataBody')}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="button-secondary" onClick={exportData}><Download size={17} aria-hidden="true" /> {t('settings.export')}</button>
            <button type="button" className="button-secondary" onClick={() => inputRef.current?.click()}><Upload size={17} aria-hidden="true" /> {t('settings.import')}</button>
            <input ref={inputRef} type="file" accept="application/json,.json" className="sr-only" onChange={importData} />
          </div>

          <fieldset className="mt-6">
            <legend className="text-sm font-bold">{t('settings.importMode')}</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {(['merge', 'replace'] as const).map((option) => <label key={option} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border px-4 text-sm ${mode === option ? 'border-[var(--jade)] bg-[var(--jade-light)]' : 'border-[var(--line)]'}`}><input type="radio" name="import-mode" value={option} checked={mode === option} onChange={() => setMode(option)} /> {t(option === 'merge' ? 'settings.merge' : 'settings.replace')}</label>)}
            </div>
          </fieldset>

          {message ? <p className="mt-5 rounded-2xl bg-[var(--jade-light)] px-4 py-3 text-sm font-semibold text-[var(--jade)]" role="status">{message}</p> : null}

          <div className="mt-7 border-t border-[var(--line)] pt-6">
            <button type="button" className="button-secondary border-red-900/25 text-red-900" onClick={() => setClearOpen(true)}><Trash2 size={17} aria-hidden="true" /> {t('settings.clear')}</button>
          </div>
        </section>
      </div>

      {clearOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setClearOpen(false) }}>
          <div className="surface max-w-md bg-[var(--paper)] p-6 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="clear-title">
            <h2 id="clear-title" className="text-3xl">{t('settings.clearTitle')}</h2>
            <p className="mt-4 leading-7 text-[var(--ink-soft)]">{t('settings.clearBody')}</p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" className="button-secondary" onClick={() => setClearOpen(false)}>{t('common.cancel')}</button>
              <button type="button" className="button-primary !border-red-950 !bg-red-950" onClick={clearAll}>{t('settings.clearConfirm')}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
