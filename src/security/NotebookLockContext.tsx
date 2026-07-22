import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { clearPlainNotebookData, readPlainNotebookData, restorePlainNotebookData } from '../storage/db'
import { enableNotebookProtection, hasNotebookProtection, lockNotebook, notebookVaultExists, readUnlockedNotebook, removeNotebookProtection, unlockNotebook } from './notebookVault'
import { NotebookLockScreen } from '../components/NotebookLockScreen'

type LockStatus = 'checking' | 'unprotected' | 'unlocked' | 'locked'
type NotebookLockContextValue = {
  status: LockStatus
  isProtected: boolean
  enable: (passphrase: string) => Promise<void>
  unlock: (passphrase: string) => Promise<void>
  lock: () => Promise<void>
  disable: () => Promise<void>
  erase: () => Promise<void>
}

const NotebookLockContext = createContext<NotebookLockContextValue | null>(null)

export function NotebookLockProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<LockStatus>('checking')

  useEffect(() => {
    let active = true
    void (async () => {
      if (!hasNotebookProtection()) { if (active) setStatus('unprotected'); return }
      const exists = await notebookVaultExists()
      if (!active) return
      if (!exists) { await removeNotebookProtection(); if (active) setStatus('unprotected'); return }
      setStatus('locked')
    })()
    return () => { active = false }
  }, [])

  const enable = useCallback(async (passphrase: string) => {
    const data = await readPlainNotebookData()
    await enableNotebookProtection(passphrase, data)
    try { await clearPlainNotebookData() } catch (error) { await removeNotebookProtection(); throw error }
    sessionStorage.removeItem('yi-path:current-reading:v1')
    sessionStorage.removeItem('yi-path:question:v1')
    setStatus('unlocked')
  }, [])

  const unlock = useCallback(async (passphrase: string) => {
    await unlockNotebook(passphrase)
    setStatus('unlocked')
  }, [])

  const lock = useCallback(async () => {
    await lockNotebook()
    sessionStorage.removeItem('yi-path:current-reading:v1')
    sessionStorage.removeItem('yi-path:question:v1')
    setStatus('locked')
  }, [])

  const disable = useCallback(async () => {
    const data = await readUnlockedNotebook()
    await restorePlainNotebookData(data)
    await removeNotebookProtection()
    setStatus('unprotected')
  }, [])

  const erase = useCallback(async () => {
    await clearPlainNotebookData()
    if (hasNotebookProtection()) await removeNotebookProtection()
    setStatus('unprotected')
  }, [])

  const value = useMemo<NotebookLockContextValue>(() => ({ status, isProtected: status === 'unlocked' || status === 'locked', enable, unlock, lock, disable, erase }), [disable, enable, erase, lock, status, unlock])

  if (status === 'checking' || status === 'locked') return <NotebookLockContext.Provider value={value}><NotebookLockScreen /></NotebookLockContext.Provider>
  return <NotebookLockContext.Provider value={value}>{children}</NotebookLockContext.Provider>
}

export function useNotebookLock() {
  const context = useContext(NotebookLockContext)
  if (!context) throw new Error('useNotebookLock must be used within NotebookLockProvider.')
  return context
}
