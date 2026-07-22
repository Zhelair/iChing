import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { decryptApiKey, encryptApiKey, readEncryptedKey, removeEncryptedKey, storeEncryptedKey } from './keyVault'
import type { DeepSeekModel } from './types'

const MODEL_STORAGE = 'yi-path:deepseek-model:v1'

type AiContextValue = {
  apiKey: string | null
  model: DeepSeekModel
  hasEncryptedKey: boolean
  setModel: (model: DeepSeekModel) => void
  useSessionKey: (apiKey: string) => void
  saveEncrypted: (apiKey: string, passphrase: string) => Promise<void>
  unlock: (passphrase: string) => Promise<void>
  lock: () => void
  forgetEncrypted: () => void
}

const AiContext = createContext<AiContextValue | null>(null)

function initialModel(): DeepSeekModel {
  return localStorage.getItem(MODEL_STORAGE) === 'deepseek-v4-pro' ? 'deepseek-v4-pro' : 'deepseek-v4-flash'
}

export function AiProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [model, setModelState] = useState<DeepSeekModel>(initialModel)
  const [hasEncryptedKey, setHasEncryptedKey] = useState(() => Boolean(readEncryptedKey()))

  const setModel = useCallback((next: DeepSeekModel) => {
    setModelState(next)
    localStorage.setItem(MODEL_STORAGE, next)
  }, [])

  const value = useMemo<AiContextValue>(() => ({
    apiKey,
    model,
    hasEncryptedKey,
    setModel,
    useSessionKey: (next) => {
      const normalized = next.trim()
      if (normalized.length < 10) throw new Error('invalid-key')
      setApiKey(normalized)
    },
    saveEncrypted: async (next, passphrase) => {
      const normalized = next.trim()
      const envelope = await encryptApiKey(normalized, passphrase)
      storeEncryptedKey(envelope)
      setHasEncryptedKey(true)
      setApiKey(normalized)
    },
    unlock: async (passphrase) => {
      const envelope = readEncryptedKey()
      if (!envelope) throw new Error('missing-envelope')
      setApiKey(await decryptApiKey(envelope, passphrase))
    },
    lock: () => setApiKey(null),
    forgetEncrypted: () => { removeEncryptedKey(); setHasEncryptedKey(false) },
  }), [apiKey, hasEncryptedKey, model, setModel])

  return <AiContext.Provider value={value}>{children}</AiContext.Provider>
}

export function useAi() {
  const context = useContext(AiContext)
  if (!context) throw new Error('useAi must be used within AiProvider.')
  return context
}
