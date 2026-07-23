import { KeyRound, Lock, ShieldAlert, Trash2, Unlock } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useAi } from '../ai/AiContext'
import { AI_PROVIDERS } from '../ai/providers'
import type { AiModel, AiProviderId } from '../ai/types'
import { aiCopyFor } from '../i18n/aiCopy'
import { useI18n } from '../i18n/I18nContext'
import { aiProviderCopyFor } from '../i18n/aiProviderCopy'

export function AiSettings() {
  const { preferences, updatePreference } = useI18n()
  const ai = useAi()
  const copy = aiCopyFor(preferences.locale)
  const providerCopy = aiProviderCopyFor(preferences.locale)
  const [keyInput, setKeyInput] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const provider = AI_PROVIDERS[ai.provider]

  const handleError = (reason: unknown, unlocking = false) => {
    const code = reason instanceof Error ? reason.message : ''
    setError(unlocking ? code === 'legacy-passphrase-envelope' ? copy.errorLegacy : copy.errorUnlock : copy.errorKey)
  }

  const useSession = (event: FormEvent) => {
    event.preventDefault(); setError(''); setMessage('')
    try { ai.useSessionKey(keyInput); setKeyInput(''); setMessage(copy.unlocked) } catch (reason) { handleError(reason) }
  }

  const save = async () => {
    setBusy(true); setError(''); setMessage('')
    try {
      const key = keyInput || ai.apiKey || ''
      await ai.saveEncrypted(key)
      setKeyInput(''); setMessage(copy.saved)
    } catch (reason) { handleError(reason) } finally { setBusy(false) }
  }

  const unlock = async () => {
    setBusy(true); setError(''); setMessage('')
    try { await ai.unlock(); setMessage(copy.unlocked) } catch (reason) { handleError(reason, true) } finally { setBusy(false) }
  }

  return <section id="ai-key-settings" tabIndex={-1} className="surface ai-settings mt-5" aria-labelledby="ai-settings-title">
    <header><span><KeyRound size={22} aria-hidden="true" /></span><div><p className="eyebrow">{copy.settingsEyebrow}</p><h2 id="ai-settings-title">{providerCopy.title}</h2><p>{providerCopy.body}</p></div><strong>{copy.byokOnly}</strong></header>
    <label className="ai-settings__enabled">
      <span><strong>{providerCopy.enable}</strong><small>{providerCopy.enableBody}</small></span>
      <input type="checkbox" role="switch" className="sr-only" checked={preferences.aiEnabled} onChange={(event) => updatePreference('aiEnabled', event.target.checked)} />
      <i className={preferences.aiEnabled ? 'is-on' : ''} aria-hidden="true"><span /></i>
    </label>
    <div className="ai-settings__layout">
      <form className="ai-settings__form" onSubmit={(event) => { event.preventDefault(); void save() }}>
        <fieldset className="ai-settings__providers">
          <legend>{providerCopy.provider}</legend>
          <small>{providerCopy.providerBody}</small>
          <div>{(Object.keys(AI_PROVIDERS) as AiProviderId[]).map((id) => <button key={id} type="button" className={ai.provider === id ? 'is-selected' : ''} onClick={() => { ai.setProvider(id); setKeyInput(''); setMessage(''); setError('') }}>{AI_PROVIDERS[id].name}</button>)}</div>
        </fieldset>
        <p className={`ai-key-status ${ai.apiKey ? 'is-unlocked' : ''}`}>{ai.apiKey ? <Unlock size={17} /> : <Lock size={17} />}{ai.apiKey ? copy.unlocked : copy.locked}</p>
        <label><span>{provider.name} {providerCopy.key}</span><input className="field" type="password" autoComplete="off" value={keyInput} onChange={(event) => setKeyInput(event.target.value)} placeholder={copy.keyPlaceholder} /></label>
        <div className="ai-settings__buttons">
          <button type="submit" className="button-primary" disabled={!keyInput || busy}>Save and use on this device</button>
          {keyInput ? <button type="button" className="button-secondary" disabled={busy} onClick={(event) => useSession(event)}>Use for this tab only</button> : null}
          {ai.hasEncryptedKey && !ai.apiKey ? <button type="button" className="button-secondary" disabled={busy} onClick={() => void unlock()}><Unlock size={16} />{copy.unlock}</button> : null}
          {ai.apiKey ? <button type="button" className="button-text" onClick={() => { ai.lock(); setMessage('') }}><Lock size={16} />{copy.lock}</button> : null}
          {ai.hasEncryptedKey ? <button type="button" className="button-text danger-action" onClick={() => ai.forgetEncrypted()}><Trash2 size={16} />{copy.forget}</button> : null}
        </div>
        {message ? <p className="ai-settings__message" role="status">{message}</p> : null}
        {error ? <p className="ai-settings__error" role="alert">{error}</p> : null}
        <label><span>{copy.model}</span><select className="field" value={ai.model} onChange={(event) => ai.setModel(event.target.value as AiModel)}>{provider.models.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
      </form>
      <aside className="ai-settings__warning"><ShieldAlert size={23} aria-hidden="true" /><div><h3>Your key and your data</h3><ul>{[copy.warningSession, copy.warningLocal, copy.warningRisk].map((item) => <li key={item}>{item}</li>)}</ul></div></aside>
    </div>
  </section>
}
