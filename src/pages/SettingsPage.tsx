import { ArrowRight, Bot, Check, Download, FileDown, HardDrive, HeartHandshake, KeyRound, LoaderCircle, Palette, Settings2, ShieldCheck, Trash2, Upload, Volume2 } from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSound } from '../audio/SoundContext'
import { PageIntro } from '../components/PageIntro'
import { CompanionSettings } from '../components/CompanionSettings'
import { AiSettings } from '../components/AiSettings'
import { NotebookLockSettings } from '../components/NotebookLockSettings'
import { isBuiltInContentLocale, LOCALE_NAMES, SUPPORTED_LOCALES } from '../domain/locales'
import type { AmbientVolume, Locale, Theme } from '../domain/types'
import { useI18n } from '../i18n/I18nContext'
import { getUiLocalePack } from '../i18n/uiLocalePacks'
import { clearAllLocalData, importReadings } from '../storage/db'
import { createExport, downloadExport, MAX_EXPORT_FILE_BYTES, parseExport } from '../storage/export'
import { useAi } from '../ai/AiContext'
import { useNotebookLock } from '../security/NotebookLockContext'
import { settingsSectionsCopyFor } from '../i18n/settingsSectionsCopy'

function Toggle({ checked, onChange, label, body }: { checked: boolean; onChange: (value: boolean) => void; label: string; body?: string }) {
  return (
    <label className="flex min-h-20 cursor-pointer items-center justify-between gap-5 border-b border-[var(--line)] py-4 last:border-0">
      <span className="min-w-0"><span className="block font-bold">{label}</span>{body ? <span className="mt-1 block text-xs leading-5 text-[var(--ink-soft)]">{body}</span> : null}</span>
      <input type="checkbox" role="switch" className="toggle-input sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className={`toggle-track relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? 'bg-[var(--jade)]' : 'bg-[var(--line)]'}`} aria-hidden="true">
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

type PrivacyCopy = { eyebrow: string; title: string; intro: string; local: string; access: string; exports: string; largeFile: string }

const privacyCopy: Partial<Record<Locale, PrivacyCopy>> = {
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
    intro: 'Yi Path няма профили, анализи или облачно синхронизиране. Прочитите и бележките остават в този браузър.',
    local: 'Прочитите, въпросите и бележките никога не се изпращат към услугата за обратна връзка. Само обратната връзка, която изпратите изрично, минава през Resend със сървърен API ключ.',
    access: 'Други сайтове не могат да четат тези данни, но човек с достъп до устройството или разширение с широки права в браузъра би могъл.',
    exports: 'JSON, PNG и PDF файловете не са криптирани. Пазете ги като лични документи; изчистването на приложението не изтрива вече експортираните копия.',
    largeFile: 'Размерът на това резервно копие надхвърля ограничението за импорт от 5 MB.',
  },
  ru: {
    eyebrow: 'Локальное хранение по замыслу',
    title: 'Конфиденциальность и безопасность',
    intro: 'В Yi Path нет аккаунтов, аналитики или облачной синхронизации. Чтения и заметки остаются в этом браузере.',
    local: 'Чтения, вопросы и заметки никогда не отправляются в сервис обратной связи. Через Resend с серверным API-ключом передаётся только отзыв, который вы явно отправили.',
    access: 'Другие сайты не могут прочитать эти данные, но их может увидеть человек, имеющий доступ к устройству, или расширение браузера с широкими правами.',
    exports: 'Экспорты JSON, PNG и PDF не зашифрованы. Храните их как личные документы; очистка приложения не удаляет уже экспортированные копии.',
    largeFile: 'Размер этой резервной копии превышает лимит импорта 5 МБ.',
  },
}

type SupportCopy = { title: string; body: string; action: string }

const supportCopy: Partial<Record<Locale, SupportCopy>> = {
  en: { title: 'Feedback & support', body: 'Share a thought, report a problem, or find the optional support link.', action: 'Open' },
  bg: { title: 'Обратна връзка и подкрепа', body: 'Споделете мнение, сигнализирайте за проблем или отворете връзката за доброволна подкрепа.', action: 'Отвори' },
  ru: { title: 'Обратная связь и поддержка', body: 'Поделитесь мыслью, сообщите о проблеме или найдите ссылку для добровольной поддержки.', action: 'Открыть' },
}

export function SettingsPage() {
  const { hash } = useLocation()
  const navigate = useNavigate()
  const { preferences, setPreferences, updatePreference, setLocale, pendingLocale, localeError, t } = useI18n()
  const { previewCoinSound, setAmbientVolume } = useSound()
  const ai = useAi()
  const notebook = useNotebookLock()
  const sections = settingsSectionsCopyFor(preferences.locale)
  const [activeSpace, setActiveSpace] = useState<'settings' | 'companion'>(() => hash === '#ai-key-settings' || hash === '#companion-settings' ? 'companion' : 'settings')
  const chooseSpace = (space: 'settings' | 'companion') => {
    if (hash) navigate('/settings', { replace: true })
    setActiveSpace(space)
  }
  const [mode, setMode] = useState<'merge' | 'replace'>('merge')
  const [message, setMessage] = useState('')
  const [audioMessage, setAudioMessage] = useState('')

  useEffect(() => {
    if (!hash) return
    const targetId = decodeURIComponent(hash.slice(1))
    const requiredSpace = targetId === 'ai-key-settings' || targetId === 'companion-settings' ? 'companion' : 'settings'
    if (activeSpace !== requiredSpace) { setActiveSpace(requiredSpace); return }
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(targetId)
      target?.scrollIntoView({ behavior: preferences.reduceMotion ? 'auto' : 'smooth', block: 'start' })
      target?.focus({ preventScroll: true })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [activeSpace, hash, preferences.reduceMotion])
  const [clearOpen, setClearOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const clearTriggerRef = useRef<HTMLButtonElement>(null)
  const clearDialogRef = useRef<HTMLDivElement>(null)
  const clearCancelRef = useRef<HTMLButtonElement>(null)
  const themes: { id: Theme; label: 'settings.theme.daylight' | 'settings.theme.night' | 'settings.theme.bamboo' }[] = [
    { id: 'daylight', label: 'settings.theme.daylight' },
    { id: 'ink-night', label: 'settings.theme.night' },
    { id: 'bamboo-mist', label: 'settings.theme.bamboo' },
  ]
  const extendedFeatures = isBuiltInContentLocale(preferences.locale)
    ? null
    : getUiLocalePack(preferences.locale).features
  const privacy = extendedFeatures?.settingsPrivacy ?? privacyCopy[preferences.locale] ?? privacyCopy.en!
  const support = extendedFeatures?.settingsSupport ?? supportCopy[preferences.locale] ?? supportCopy.en!
  const ambientLevels: [string, string, string] = extendedFeatures?.ambientLevels
    ?? (preferences.locale === 'ru' ? ['Выкл.', '50%', '100%'] : preferences.locale === 'bg' ? ['Изкл.', '50%', '100%'] : ['Off', '50%', '100%'])

  useEffect(() => {
    if (!clearOpen) return
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    clearCancelRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setClearOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const focusable = clearDialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.setTimeout(() => (previouslyFocused ?? clearTriggerRef.current)?.focus(), 0)
    }
  }, [clearOpen])

  async function exportData() {
    downloadExport(await createExport(preferences))
  }

  async function importData(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > MAX_EXPORT_FILE_BYTES) {
      setMessage(privacy.largeFile)
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
    await clearAllLocalData()
    sessionStorage.removeItem('yi-path:current-reading:v1')
    sessionStorage.removeItem('yi-path:question:v1')
    ai.lock()
    ai.forgetEncrypted()
    await notebook.erase()
    setPreferences({ locale: 'en', theme: 'bamboo-mist', sound: true, music: true, ambientVolume: 1, reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches, aiEnabled: false, companionEnabled: false, companionPet: 'cat', companionSize: 'normal', petSound: true, petMotion: true })
    setMessage(t('settings.cleared'))
    setClearOpen(false)
  }

  return (
    <div className="page-shell py-10 sm:py-16">
      <div className="reading-column">
        <PageIntro eyebrow={t('settings.eyebrow')} title={t('settings.title')} />

        <div className="settings-space-switcher" role="tablist" aria-label={t('settings.title')}>
          <button id="settings-space-tab" type="button" role="tab" aria-controls="settings-space-panel" aria-selected={activeSpace === 'settings'} className={activeSpace === 'settings' ? 'is-active' : ''} onClick={() => chooseSpace('settings')}>
            <Settings2 size={20} aria-hidden="true" /><span><strong>{sections.settings}</strong><small>{sections.settingsBody}</small></span>
          </button>
          <button id="companion-space-tab" type="button" role="tab" aria-controls="companion-space-panel" aria-selected={activeSpace === 'companion'} className={activeSpace === 'companion' ? 'is-active' : ''} onClick={() => chooseSpace('companion')}>
            <Bot size={20} aria-hidden="true" /><span><strong>{sections.companion}</strong><small>{sections.companionBody}</small></span>
          </button>
        </div>

        {activeSpace === 'settings' ? <div id="settings-space-panel" role="tabpanel" aria-labelledby="settings-space-tab">
        <nav className="settings-section-pills" aria-label={sections.settings}>
          <a href="#settings-language">{sections.language}</a><a href="#settings-atmosphere"><Palette size={15} aria-hidden="true" />{sections.atmosphere}</a><a href="#settings-sound"><Volume2 size={15} aria-hidden="true" />{sections.sound}</a><a href="#settings-privacy"><ShieldCheck size={15} aria-hidden="true" />{sections.privacy}</a><a href="#settings-data">{sections.data}</a>
        </nav>

        <section id="settings-language" className="surface settings-anchor mt-5 p-5 sm:p-7">
          <fieldset className="min-w-0" aria-busy={pendingLocale !== null}>
            <legend className="font-editorial text-2xl">{t('settings.language')}</legend>
            <div className="language-grid mt-5">
              {SUPPORTED_LOCALES.map((locale) => {
                const selected = preferences.locale === locale
                const pending = pendingLocale === locale
                return (
                  <label key={locale} className={`language-choice ${pending ? 'is-pending' : ''}`}>
                    <input
                      type="radio"
                      name="locale"
                      value={locale}
                      className="sr-only"
                      checked={selected}
                      disabled={pendingLocale !== null}
                      onChange={() => { void setLocale(locale) }}
                    />
                    <span className="language-choice__surface" lang={locale}>
                      <span className="language-choice__label">{LOCALE_NAMES[locale]}</span>
                      {pending
                        ? <LoaderCircle className="language-choice__status language-choice__spinner" size={15} aria-hidden="true" />
                        : selected
                          ? <Check className="language-choice__status" size={15} strokeWidth={2.5} aria-hidden="true" />
                          : null}
                    </span>
                  </label>
                )
              })}
            </div>
            {localeError ? <p className="mt-4 text-sm font-semibold text-red-800" role="alert">{t('settings.languageError')}</p> : null}
          </fieldset>
        </section>

        <section id="settings-atmosphere" className="surface settings-anchor mt-5 p-5 sm:p-7">
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

        <section id="settings-sound" className="surface settings-anchor mt-5 px-5 py-2 sm:px-7">
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
          }} label={t('settings.ambient')} levels={ambientLevels} />
          <Toggle checked={preferences.reduceMotion} onChange={(value) => updatePreference('reduceMotion', value)} label={t('settings.motion')} body={t('settings.motionBody')} />
          {audioMessage ? <p className="mb-4 rounded-2xl bg-[var(--jade-light)] px-4 py-3 text-sm font-semibold text-[var(--jade)]" role="status">{audioMessage}</p> : null}
        </section>

        <section id="settings-privacy" className="surface settings-anchor mt-5 p-5 sm:p-7" aria-labelledby="privacy-security-title">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--jade-light)] text-[var(--jade)]"><ShieldCheck size={22} aria-hidden="true" /></span>
            <div><p className="eyebrow">{privacy.eyebrow}</p><h2 id="privacy-security-title" className="mt-2 text-2xl">{privacy.title}</h2></div>
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--ink-soft)]">{privacy.intro}</p>
          <div className="mt-5 grid gap-3">
            <p className="flex gap-3 rounded-2xl bg-[var(--jade-light)]/60 p-4 text-sm leading-6"><HardDrive className="mt-0.5 shrink-0 text-[var(--jade)]" size={18} aria-hidden="true" /><span>{privacy.local}</span></p>
            <p className="flex gap-3 px-4 text-sm leading-6 text-[var(--ink-soft)]"><ShieldCheck className="mt-0.5 shrink-0 text-[var(--jade)]" size={18} aria-hidden="true" /><span>{privacy.access}</span></p>
            <p className="flex gap-3 rounded-2xl border border-[var(--brass)]/25 bg-[var(--brass)]/8 p-4 text-sm leading-6 text-[var(--ink-soft)]"><FileDown className="mt-0.5 shrink-0 text-[var(--brass)]" size={18} aria-hidden="true" /><span>{privacy.exports}</span></p>
          </div>
        </section>

        <NotebookLockSettings />

        <section id="settings-data" className="surface settings-anchor mt-5 p-5 sm:p-7">
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
            <button ref={clearTriggerRef} type="button" className="button-secondary border-red-900/25 text-red-900" onClick={() => setClearOpen(true)}><Trash2 size={17} aria-hidden="true" /> {t('settings.clear')}</button>
          </div>
        </section>

        <Link to="/support" className="surface group mt-5 flex min-h-24 items-center gap-4 p-5 sm:p-7">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--jade-light)] text-[var(--jade)]"><HeartHandshake size={22} aria-hidden="true" /></span>
          <span className="min-w-0 flex-1"><span className="block font-editorial text-xl text-[var(--ink)]">{support.title}</span><span className="mt-1 block text-xs leading-5 text-[var(--ink-soft)]">{support.body}</span></span>
          <span className="hidden items-center gap-1 text-xs font-bold text-[var(--jade)] sm:flex">{support.action} <ArrowRight className="transition-transform group-hover:translate-x-1" size={16} aria-hidden="true" /></span>
        </Link>
        </div> : <div id="companion-space-panel" role="tabpanel" aria-labelledby="companion-space-tab">
          <nav className="settings-section-pills" aria-label={sections.companion}>
            <a href="#companion-settings"><Bot size={15} aria-hidden="true" />{sections.pet}</a><a href="#ai-key-settings"><KeyRound size={15} aria-hidden="true" />{sections.ai}</a>
          </nav>
          <div id="companion-settings" className="settings-anchor"><CompanionSettings /></div>
          <AiSettings />
        </div>}
      </div>

      {clearOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setClearOpen(false) }}>
          <div ref={clearDialogRef} className="surface max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto bg-[var(--paper)] p-6 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="clear-title">
            <h2 id="clear-title" className="text-3xl">{t('settings.clearTitle')}</h2>
            <p className="mt-4 leading-7 text-[var(--ink-soft)]">{t('settings.clearBody')}</p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button ref={clearCancelRef} type="button" className="button-secondary" onClick={() => setClearOpen(false)}>{t('common.cancel')}</button>
              <button type="button" className="button-primary !border-red-950 !bg-red-950" onClick={clearAll}>{t('settings.clearConfirm')}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
