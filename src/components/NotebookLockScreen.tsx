import { KeyRound, LockKeyhole, ShieldAlert, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { notebookLockCopyFor } from '../i18n/notebookLockCopy'
import { useI18n } from '../i18n/I18nContext'
import { useNotebookLock } from '../security/NotebookLockContext'

export function NotebookLockScreen() {
  const { preferences } = useI18n()
  const notebook = useNotebookLock()
  const copy = notebookLockCopyFor(preferences.locale)
  const [passphrase, setPassphrase] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmErase, setConfirmErase] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [confirmErase, notebook.status])

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('')
    try { await notebook.unlock(passphrase) } catch { setError(copy.unlockError) } finally { setBusy(false) }
  }

  if (notebook.status === 'checking') {
    return <main className="notebook-lock-screen" role="status"><span className="route-loading"><span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" /> {copy.loading}</span></main>
  }

  return <main className="notebook-lock-screen">
    <section className="notebook-lock-card surface" aria-labelledby="notebook-unlock-title">
      <div className="notebook-lock-card__mark" aria-hidden="true"><LockKeyhole size={29} /></div>
      <p className="eyebrow">Yi Path · {copy.eyebrow}</p>
      <h1 id="notebook-unlock-title">{copy.unlockTitle}</h1>
      <p>{copy.unlockBody}</p>
      {!confirmErase ? <>
        <form onSubmit={submit}>
          <label htmlFor="notebook-unlock-passphrase">{copy.passphrase}</label>
          <div className="notebook-lock-card__field"><KeyRound size={18} aria-hidden="true" /><input ref={inputRef} id="notebook-unlock-passphrase" type="password" autoComplete="current-password" value={passphrase} onChange={(event) => setPassphrase(event.target.value)} /></div>
          {error ? <p className="notebook-lock-card__error" role="alert">{error}</p> : null}
          <button className="button-primary" type="submit" disabled={!passphrase || busy}>{copy.unlock}</button>
        </form>
        <button className="button-text notebook-lock-card__forgot" type="button" onClick={() => setConfirmErase(true)}>{copy.forgot}</button>
      </> : <div className="notebook-lock-card__erase" role="alert">
        <ShieldAlert size={22} aria-hidden="true" />
        <p>{copy.eraseWarning}</p>
        <div><button type="button" className="button-secondary" onClick={() => setConfirmErase(false)}>{copy.back}</button><button type="button" className="button-primary danger-button" onClick={() => void notebook.erase()}><Trash2 size={16} />{copy.eraseConfirm}</button></div>
      </div>}
    </section>
  </main>
}

