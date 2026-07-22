import { KeyRound, LockKeyhole, ShieldAlert, ShieldCheck, Unlock } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { notebookLockCopyFor } from '../i18n/notebookLockCopy'
import { useI18n } from '../i18n/I18nContext'
import { useNotebookLock } from '../security/NotebookLockContext'

export function NotebookLockSettings() {
  const { preferences } = useI18n()
  const notebook = useNotebookLock()
  const copy = notebookLockCopyFor(preferences.locale)
  const [dialog, setDialog] = useState<'create' | 'remove' | null>(null)
  const [passphrase, setPassphrase] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const close = () => { setDialog(null); setPassphrase(''); setConfirm(''); setError('') }

  useEffect(() => {
    if (!dialog) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    window.setTimeout(() => (firstInputRef.current ?? dialogRef.current?.querySelector<HTMLElement>('button'))?.focus(), 0)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { close(); return }
      if (event.key !== 'Tab') return
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled])') ?? [])
      if (!focusable.length) return
      const first = focusable[0]; const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); window.setTimeout(() => (previouslyFocused ?? triggerRef.current)?.focus(), 0) }
  }, [dialog])

  async function create(event: FormEvent) {
    event.preventDefault(); setError('')
    if (passphrase.length < 10) { setError(copy.weak); return }
    if (passphrase !== confirm) { setError(copy.mismatch); return }
    setBusy(true)
    try { await notebook.enable(passphrase); close() } catch { setError(copy.unlockError) } finally { setBusy(false) }
  }

  async function remove() {
    setBusy(true)
    try { await notebook.disable(); close() } catch { setError(copy.unlockError) } finally { setBusy(false) }
  }

  return <>
    <section id="notebook-lock-settings" className="surface notebook-protection mt-5 p-5 sm:p-7" aria-labelledby="notebook-protection-title">
      <div className="notebook-protection__intro">
        <span><LockKeyhole size={22} aria-hidden="true" /></span>
        <div><p className="eyebrow">{copy.eyebrow}</p><h2 id="notebook-protection-title">{copy.title}</h2><p>{copy.body}</p></div>
      </div>
      {!notebook.isProtected ? <div className="notebook-protection__action">
        <p><ShieldAlert size={18} aria-hidden="true" />{copy.warning}</p>
        <button ref={triggerRef} type="button" className="button-primary" onClick={() => setDialog('create')}><KeyRound size={17} />{copy.use}</button>
      </div> : <div className="notebook-protection__active">
        <p><ShieldCheck size={18} aria-hidden="true" /><span><strong>{copy.protected}</strong><small>{copy.protectedBody}</small></span></p>
        <div><button type="button" className="button-primary" onClick={() => void notebook.lock()}><LockKeyhole size={17} />{copy.lockNow}</button><button ref={triggerRef} type="button" className="button-secondary" onClick={() => setDialog('remove')}><Unlock size={17} />{copy.remove}</button></div>
      </div>}
      <p className="notebook-protection__scope">{copy.scope}</p>
    </section>

    {dialog ? <div className="notebook-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) close() }}>
      <div ref={dialogRef} className="surface notebook-dialog" role="dialog" aria-modal="true" aria-labelledby="notebook-dialog-title">
        <span className="notebook-dialog__icon"><LockKeyhole size={23} aria-hidden="true" /></span>
        <h2 id="notebook-dialog-title">{dialog === 'create' ? copy.createTitle : copy.removeTitle}</h2>
        <p>{dialog === 'create' ? copy.createBody : copy.removeBody}</p>
        {dialog === 'create' ? <form onSubmit={create}>
          <label htmlFor="notebook-passphrase">{copy.passphrase}</label><input ref={firstInputRef} id="notebook-passphrase" className="field" type="password" autoComplete="new-password" value={passphrase} onChange={(event) => setPassphrase(event.target.value)} />
          <label htmlFor="notebook-passphrase-confirm">{copy.confirm}</label><input id="notebook-passphrase-confirm" className="field" type="password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
          {error ? <p role="alert" className="notebook-dialog__error">{error}</p> : null}
          <div><button type="button" className="button-secondary" onClick={close}>{copy.cancel}</button><button type="submit" className="button-primary" disabled={busy}>{busy ? copy.busy : copy.enable}</button></div>
        </form> : <div className="notebook-dialog__remove">
          {error ? <p role="alert" className="notebook-dialog__error">{error}</p> : null}
          <div><button type="button" className="button-secondary" onClick={close}>{copy.cancel}</button><button type="button" className="button-primary" disabled={busy} onClick={() => void remove()}>{copy.removeConfirm}</button></div>
        </div>}
      </div>
    </div> : null}
  </>
}

