import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { decryptApiKeyForDevice, encryptApiKeyForDevice, isDeviceEncryptedKey, readEncryptedKey, removeEncryptedKey, storeEncryptedKey } from './keyVault'
import { AI_PROVIDERS, DEFAULT_AI_MODELS } from './providers'
import type { AiModel, AiProviderId } from './types'

const PROVIDER_STORAGE = 'yi-path:ai-provider:v1'
const MODEL_STORAGE = 'yi-path:ai-models:v1'

type AiContextValue = {
  apiKey: string | null
  provider: AiProviderId
  model: AiModel
  hasEncryptedKey: boolean
  setProvider: (provider: AiProviderId) => void
  setModel: (model: AiModel) => void
  useSessionKey: (apiKey: string) => void
  saveEncrypted: (apiKey: string) => Promise<void>
  unlock: () => Promise<void>
  lock: () => void
  forgetEncrypted: () => void
}

const AiContext = createContext<AiContextValue | null>(null)

function initialProvider(): AiProviderId {
  const saved = localStorage.getItem(PROVIDER_STORAGE)
  return saved === 'openai' || saved === 'anthropic' ? saved : 'deepseek'
}

function initialModels(): Record<AiProviderId, AiModel> {
  try {
    const parsed = JSON.parse(localStorage.getItem(MODEL_STORAGE) ?? '{}') as Partial<Record<AiProviderId, AiModel>>
    return { ...DEFAULT_AI_MODELS, ...parsed }
  } catch {
    return { ...DEFAULT_AI_MODELS }
  }
}

export function AiProvider({ children }: { children: ReactNode }) {
  const [provider, setProviderState] = useState<AiProviderId>(initialProvider)
  const [apiKeys, setApiKeys] = useState<Partial<Record<AiProviderId, string>>>({})
  const [models, setModels] = useState<Record<AiProviderId, AiModel>>(initialModels)
  const [encryptedProviders, setEncryptedProviders] = useState<Record<AiProviderId, boolean>>(() => ({
    deepseek: Boolean(readEncryptedKey('deepseek')),
    openai: Boolean(readEncryptedKey('openai')),
    anthropic: Boolean(readEncryptedKey('anthropic')),
  }))

  const setProvider = useCallback((next: AiProviderId) => {
    setProviderState(next)
    localStorage.setItem(PROVIDER_STORAGE, next)
  }, [])

  const setModel = useCallback((next: AiModel) => {
    if (!AI_PROVIDERS[provider].models.some((option) => option.id === next)) return
    setModels((current) => {
      const updated = { ...current, [provider]: next }
      localStorage.setItem(MODEL_STORAGE, JSON.stringify(updated))
      return updated
    })
  }, [provider])

  const value = useMemo<AiContextValue>(() => ({
    apiKey: apiKeys[provider] ?? null,
    provider,
    model: models[provider],
    hasEncryptedKey: encryptedProviders[provider],
    setProvider,
    setModel,
    useSessionKey: (next) => {
      const normalized = next.trim()
      if (normalized.length < 10) throw new Error('invalid-key')
      setApiKeys((current) => ({ ...current, [provider]: normalized }))
    },
    saveEncrypted: async (next) => {
      const normalized = next.trim()
      const envelope = await encryptApiKeyForDevice(normalized, provider)
      storeEncryptedKey(envelope, provider)
      setEncryptedProviders((current) => ({ ...current, [provider]: true }))
      setApiKeys((current) => ({ ...current, [provider]: normalized }))
    },
    unlock: async () => {
      const envelope = readEncryptedKey(provider)
      if (!envelope) throw new Error('missing-envelope')
      if (!isDeviceEncryptedKey(envelope)) throw new Error('legacy-passphrase-envelope')
      const key = await decryptApiKeyForDevice(envelope, provider)
      setApiKeys((current) => ({ ...current, [provider]: key }))
    },
    lock: () => setApiKeys((current) => { const updated = { ...current }; delete updated[provider]; return updated }),
    forgetEncrypted: () => {
      void removeEncryptedKey(provider)
      setEncryptedProviders((current) => ({ ...current, [provider]: false }))
    },
  }), [apiKeys, encryptedProviders, models, provider, setModel, setProvider])

  return <AiContext.Provider value={value}>{children}</AiContext.Provider>
}

export function useAi() {
  const context = useContext(AiContext)
  if (!context) throw new Error('useAi must be used within AiProvider.')
  return context
}
