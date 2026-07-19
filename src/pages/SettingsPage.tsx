import { ArrowRight, Download, FileDown, HardDrive, HeartHandshake, ShieldCheck, Trash2, Upload, Volume2 } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { useSound } from '../audio/SoundContext'
import { PageIntro } from '../components/PageIntro'
import type { AmbientVolume, Locale, Theme } from '../domain/types'
import { localeNames, useI18n } from '../i18n/I18nContext'
import { clearReadings, importReadings } from '../storage/db'
import { createExport, downloadExport, MAX_EXPORT_FILE_BYTES, parseExport } from '../storage/export'

function Toggle({ checked, onChange, label, body }: { checked: boolean; onChange: (value: boolean) => void; label: string; body?: string }) {
  return (
    <label className="flex min-h-20 cursor-pointer items-center justify-between gap-5 border-b border-[var(--line)] py-4 last:border-0">
      <span><span className="block font-bold">{label}</span>{body ? <span className="mt-1 block text-xs leading-5 text-[var(--ink-soft)]">{body}</span> : null}</span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? 'bg-[var(--jade)]' : 'bg-[#c8c0b1]'}`}>
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} />
        <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </span>
    </label>
  )
}

function AmbientVolumeControl({ value, onChange, label, levels }: { value: AmbientVolume; onChange: (value: AmbientVolume) => void; label: string; levels: [string, string, string] }) {
  const index = value === 0 ? 0 : value === 0.5 ? 1 : 2
  return <div className="ambient-volume border-b border-[var(--line)] py-4">
    <div className="flex items-center gap-3"><Volume2 className="shrink-0 text-[var(--jade)]" size={19} aria-hidden="true" /><label htmlFor="ambient-volume" className="block font-bold">{label}</label></div>
    <div className="ambient-volume__control mt-3">
      <input id="ambient-volume" type="range" min="0" max="2" step="1" value={index} onChange={(event) => onChange(([0, 0.5, 1] as AmbientVolume[])[Number(event.target.value)])} aria-valuetext={levels[index]} />
      <div className="ambient-volume__labels" aria-hidden="true">{levels.map((level, levelIndex) => <span key={level} className={levelIndex === index ? 'is-active' : ''}>{level}</span>)}</div>
    </div>
  </div>
}

const privacyCopy: Record<Locale, { eyebrow: string; title: string; intro: string; local: string; access: string; exports: string; largeFile: string }> = {
  en: {
    eyebrow: 'Local-first by design',
    title: 'Privacy & security',
    intro: 'Yi Path has no accounts, analytics, or cloud sync. Readings and journal notes remain in this browser.',
    local: 'Readings, questions, and notes are never sent to the feedback service. Only feedback you explicitly submit is sent through Resend using a server-side API key.',
    access: 'Other websites cannot read this data, but someone with access to this device or a powerful browser extension may be able to.',
    exports: 'JSON, PNG, and PDF exports are not encrypted. Keep them as private documents; clearing the app does not delete copies you exported.',
    largeFile: 'That backup is larger than the 5 MB import limit.',
  },
  bg: {
    eyebrow: 'Локално по замисъл',
    title: 'Поверителност и сигурност',
    intro: 'Yi Path няма акаунти, анализи или облачно синхронизиране. Прочитите и бележките остават в този браузър.',
    local: 'Прочитите, въпросите и бележките никога не се изпращат към услугата за обратна връзка. Само обратната връзка, която изпратите изрично, минава през Resend със сървърен API ключ.',
    access: 'Други сайтове не могат да четат тези данни, но човек с достъп до устройството или разширение с широки права в браузъра би могъл.',
    exports: 'JSON, PNG и PDF файловете не са криптирани. Пазете ги като лични документи; изчистването на приложението не изтрива вече експортираните копия.',
    largeFile: 'Този архив е по-голям от ограничението за импорт от 5 MB.',
  },
  ru: {
    eyebrow: 'Локально по замыслу',
    title: 'Конфиденциальность и безопасность',
    intro: 'В Yi Path нет аккаунтов, аналитики или облачной синхронизации. Чтения и заметки остаются в этом браузере.',
    local: 'Чтения, вопросы и заметки никогда не отправляются в сервис обратной связи. Через Resend с серверным API-ключом передаётся только отзыв, который вы явно отправили.',
    access: 'Другие сайты не могут прочитать эти данные, но доступ возможен для человека с доступом к устройству или расширения браузера с широкими правами.',
    exports: 'Экспорты JSON, PNG и PDF не зашифрованы. Храните их как личные документы; очистка приложения не удаляет уже экспортированные копии.',
    largeFile: 'Размер этой резервной копии превышает лимит импорта 5 МБ.',
  },
}

const supportCopy: Record<Locale, { title: string; body: string; action: string }> = {
  en: { title: 'Feedback & support', body: 'Share a thought, report a problem, or find the optional support link.', action: 'Open' },
  bg: { title: 'Обратна връзка и подкрепа', body: 'Споделете мисъл, сигнализирайте за проблем или намерете линка за подкрепа по желание.', action: 'Отвори' },
  ru: { title: 'Обратная связь и поддержка', body: 'Поделитесь мыслью, сообщите о проблеме или найдите необязательную ссылку для поддержки.', action: 'Открыть' },
}

export function SettingsPage() {
  const { preferences, setPreferences, updatePreference, t } = useI18n()
  const { previewCoinSound, setAmbientVolume } = useSound()
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
    if (file.size > MAX_EXPORT_FILE_BYTES) {
      setMessage(privacyCopy[preferences.locale].largeFile)
      event.target.value = ''
      return
    }
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
    setPreferences({ locale: 'en', theme: 'bamboo-mist', sound: true, music: true, ambientVolume: 1, reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches })
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
          }} label={t('settings.sound')} />
          <AmbientVolumeControl value={preferences.ambientVolume} onChange={async (volume) => {
            const available = await setAmbientVolume(volume)
            const nextVolume = available ? volume : 0
            setPreferences({ ...preferences, ambientVolume: nextVolume, music: nextVolume > 0 })
            setAudioMessage(volume > 0 && !available ? t('settings.audioUnavailable') : '')
          }} label={t('settings.ambient')} levels={preferences.locale === 'ru' ? ['Выкл.', '50%', '100%'] : preferences.locale === 'bg' ? ['Изкл.', '50%', '100%'] : ['Off', '50%', '100%']} />
          <Toggle checked={preferences.reduceMotion} onChange={(value) => updatePreference('reduceMotion', value)} label={t('settings.motion')} body={t('settings.motionBody')} />
          {audioMessage ? <p className="mb-4 rounded-2xl bg-[var(--jade-light)] px-4 py-3 text-sm font-semibold text-[var(--jade)]" role="status">{audioMessage}</p> : null}
        </section>

        <section className="surface mt-5 p-5 sm:p-7" aria-labelledby="privacy-security-title">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--jade-light)] text-[var(--jade)]"><ShieldCheck size={22} aria-hidden="true" /></span>
            <div><p className="eyebrow">{privacyCopy[preferences.locale].eyebrow}</p><h2 id="privacy-security-title" className="mt-2 text-2xl">{privacyCopy[preferences.locale].title}</h2></div>
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--ink-soft)]">{privacyCopy[preferences.locale].intro}</p>
          <div className="mt-5 grid gap-3">
            <p className="flex gap-3 rounded-2xl bg-[var(--jade-light)]/60 p-4 text-sm leading-6"><HardDrive className="mt-0.5 shrink-0 text-[var(--jade)]" size={18} aria-hidden="true" /><span>{privacyCopy[preferences.locale].local}</span></p>
            <p className="flex gap-3 px-4 text-sm leading-6 text-[var(--ink-soft)]"><ShieldCheck className="mt-0.5 shrink-0 text-[var(--jade)]" size={18} aria-hidden="true" /><span>{privacyCopy[preferences.locale].access}</span></p>
            <p className="flex gap-3 rounded-2xl border border-[var(--brass)]/25 bg-[var(--brass)]/8 p-4 text-sm leading-6 text-[var(--ink-soft)]"><FileDown className="mt-0.5 shrink-0 text-[var(--brass)]" size={18} aria-hidden="true" /><span>{privacyCopy[preferences.locale].exports}</span></p>
          </div>
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

        <Link to="/support" className="surface group mt-5 flex min-h-24 items-center gap-4 p-5 sm:p-7">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--jade-light)] text-[var(--jade)]"><HeartHandshake size={22} aria-hidden="true" /></span>
          <span className="min-w-0 flex-1"><span className="block font-editorial text-xl text-[var(--ink)]">{supportCopy[preferences.locale].title}</span><span className="mt-1 block text-xs leading-5 text-[var(--ink-soft)]">{supportCopy[preferences.locale].body}</span></span>
          <span className="hidden items-center gap-1 text-xs font-bold text-[var(--jade)] sm:flex">{supportCopy[preferences.locale].action} <ArrowRight className="transition-transform group-hover:translate-x-1" size={16} aria-hidden="true" /></span>
        </Link>
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
