import { KeyRound, Lock, ShieldAlert, Trash2, Unlock } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useAi } from '../ai/AiContext'
import type { DeepSeekModel } from '../ai/types'
import { aiCopyFor } from '../i18n/aiCopy'
import { useI18n } from '../i18n/I18nContext'

export function AiSettings() {
  const { preferences } = useI18n()
  const ai = useAi()
  const copy = aiCopyFor(preferences.locale)
  const [keyInput, setKeyInput] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleError = (reason: unknown, unlocking = false) => {
    const code = reason instanceof Error ? reason.message : ''
    setError(unlocking ? copy.errorUnlock : code === 'weak-passphrase' ? copy.errorPassphrase : copy.errorKey)
  }

  const useSession = (event: FormEvent) => {
    event.preventDefault(); setError(''); setMessage('')
    try { ai.useSessionKey(keyInput); setKeyInput(''); setMessage(copy.unlocked) } catch (reason) { handleError(reason) }
  }

  const save = async () => {
    setBusy(true); setError(''); setMessage('')
    try {
      const key = keyInput || ai.apiKey || ''
      await ai.saveEncrypted(key, passphrase)
      setKeyInput(''); setPassphrase(''); setMessage(copy.saved)
    } catch (reason) { handleError(reason) } finally { setBusy(false) }
  }

  const unlock = async () => {
    setBusy(true); setError(''); setMessage('')
    try { await ai.unlock(passphrase); setPassphrase(''); setMessage(copy.unlocked) } catch (reason) { handleError(reason, true) } finally { setBusy(false) }
  }

  if (!preferences.aiEnabled) return null

  return <section id="ai-key-settings" className="surface ai-settings mt-5" aria-labelledby="ai-settings-title">
    <header><span><KeyRound size={22} aria-hidden="true" /></span><div><p className="eyebrow">{copy.settingsEyebrow}</p><h2 id="ai-settings-title">{copy.settingsTitle}</h2><p>{copy.settingsBody}</p></div><strong>{copy.byokOnly}</strong></header>
    <div className="ai-settings__layout">
      <form className="ai-settings__form" onSubmit={useSession}>
        <p className={`ai-key-status ${ai.apiKey ? 'is-unlocked' : ''}`}>{ai.apiKey ? <Unlock size={17} /> : <Lock size={17} />}{ai.apiKey ? copy.unlocked : copy.locked}</p>
        <label><span>{copy.keyLabel}</span><input className="field" type="password" autoComplete="off" value={keyInput} onChange={(event) => setKeyInput(event.target.value)} placeholder={copy.keyPlaceholder} /></label>
        <label><span>{copy.passphraseLabel}</span><input className="field" type="password" autoComplete="new-password" value={passphrase} onChange={(event) => setPassphrase(event.target.value)} /><small>{copy.passphraseHint}</small></label>
        <div className="ai-settings__buttons">
          <button type="submit" className="button-primary" disabled={!keyInput || busy}>{copy.useSession}</button>
          <button type="button" className="button-secondary" disabled={(!keyInput && !ai.apiKey) || !passphrase || busy} onClick={() => void save()}>{copy.saveEncrypted}</button>
          {ai.hasEncryptedKey && !ai.apiKey ? <button type="button" className="button-secondary" disabled={!passphrase || busy} onClick={() => void unlock()}><Unlock size={16} />{copy.unlock}</button> : null}
          {ai.apiKey ? <button type="button" className="button-text" onClick={() => { ai.lock(); setMessage('') }}><Lock size={16} />{copy.lock}</button> : null}
          {ai.hasEncryptedKey ? <button type="button" className="button-text danger-action" onClick={() => ai.forgetEncrypted()}><Trash2 size={16} />{copy.forget}</button> : null}
        </div>
        {message ? <p className="ai-settings__message" role="status">{message}</p> : null}
        {error ? <p className="ai-settings__error" role="alert">{error}</p> : null}
        <label><span>{copy.model}</span><select className="field" value={ai.model} onChange={(event) => ai.setModel(event.target.value as DeepSeekModel)}><option value="deepseek-v4-flash">{copy.flash}</option><option value="deepseek-v4-pro">{copy.pro}</option></select></label>
      </form>
      <aside className="ai-settings__warning"><ShieldAlert size={23} aria-hidden="true" /><div><h3>{copy.warningTitle}</h3><ul><li>{copy.warningSession}</li><li>{copy.warningLocal}</li><li>{copy.warningProvider}</li><li>{copy.warningData}</li><li>{copy.warningRisk}</li></ul></div></aside>
    </div>
  </section>
}
