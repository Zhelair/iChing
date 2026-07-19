import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import type { CoinSide } from '../domain/types'
import { useI18n } from '../i18n/I18nContext'
import {
  createMeditationGraph,
  disposeMeditation,
  pauseMeditation,
  resumeMeditation,
  type MeditationGraph,
} from './meditation'

type SoundContextValue = {
  playCoinToss: (coins: readonly CoinSide[]) => void
  playHistoryCue: (kind: 'bone' | 'stalk' | 'brush' | 'coin') => void
  previewCoinSound: () => Promise<boolean>
  setAmbientPlayback: (enabled: boolean) => Promise<boolean>
}

const SoundContext = createContext<SoundContextValue | null>(null)

function noiseBuffer(context: AudioContext, seconds: number) {
  const buffer = context.createBuffer(1, Math.floor(context.sampleRate * seconds), context.sampleRate)
  const data = buffer.getChannelData(0)
  for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1
  return buffer
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const { preferences } = useI18n()
  const contextRef = useRef<AudioContext | null>(null)
  const ambientRef = useRef<MeditationGraph | null>(null)
  const soundEnabledRef = useRef(preferences.sound)
  const ambientWantedRef = useRef(preferences.music)
  const ambientOperationRef = useRef(0)

  useEffect(() => {
    soundEnabledRef.current = preferences.sound
  }, [preferences.sound])

  const ensureContext = useCallback(async () => {
    try {
      let context = contextRef.current
      if (!context || context.state === 'closed') {
        const AudioContextClass = globalThis.AudioContext
          ?? (globalThis as typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        if (!AudioContextClass) return null
        context = new AudioContextClass({ latencyHint: 'interactive' })
        contextRef.current = context
      }
      if (context.state !== 'running') await context.resume()
      return context
    } catch {
      return null
    }
  }, [])

  const stopAmbient = useCallback((immediate = false) => {
    const graph = ambientRef.current
    const context = contextRef.current
    ambientRef.current = null
    if (!graph || !context || context.state === 'closed') return
    disposeMeditation(context, graph, immediate)
  }, [])

  const startAmbient = useCallback((context: AudioContext) => {
    if (ambientRef.current || !ambientWantedRef.current) return ambientRef.current
    const graph = createMeditationGraph(context)
    ambientRef.current = graph
    return graph
  }, [])

  const setAmbientPlayback = useCallback(async (enabled: boolean) => {
    const operation = ++ambientOperationRef.current
    ambientWantedRef.current = enabled
    if (!enabled) {
      stopAmbient()
      return true
    }

    const context = await ensureContext()
    if (!context) return false
    if (operation !== ambientOperationRef.current || !ambientWantedRef.current) return true

    try {
      const graph = ambientRef.current
      if (graph) return await resumeMeditation(context, graph)
      startAmbient(context)
      return true
    } catch {
      if (operation === ambientOperationRef.current) stopAmbient(true)
      return false
    }
  }, [ensureContext, startAmbient, stopAmbient])

  useEffect(() => {
    ambientWantedRef.current = preferences.music
    if (!preferences.music) {
      ++ambientOperationRef.current
      stopAmbient()
      return
    }
    if (ambientRef.current) return

    const beginAfterPointer = () => void setAmbientPlayback(true)
    const beginAfterKey = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      window.removeEventListener('keydown', beginAfterKey)
      void setAmbientPlayback(true)
    }
    window.addEventListener('pointerdown', beginAfterPointer, { once: true })
    window.addEventListener('keydown', beginAfterKey)
    return () => {
      window.removeEventListener('pointerdown', beginAfterPointer)
      window.removeEventListener('keydown', beginAfterKey)
    }
  }, [preferences.music, setAmbientPlayback, stopAmbient])

  useEffect(() => {
    const handleVisibility = () => {
      const context = contextRef.current
      if (!context || context.state === 'closed') return
      const graph = ambientRef.current

      if (document.hidden) {
        if (graph) pauseMeditation(context, graph)
        else if (context.state === 'running') void context.suspend().catch(() => undefined)
        return
      }

      if (!ambientWantedRef.current) return
      if (graph) {
        void resumeMeditation(context, graph).catch(() => undefined)
      } else {
        void context.resume().then(() => {
          if (ambientWantedRef.current) startAmbient(context)
        }).catch(() => undefined)
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [startAmbient])

  useEffect(() => () => {
    ++ambientOperationRef.current
    ambientWantedRef.current = false
    const context = contextRef.current
    const graph = ambientRef.current
    ambientRef.current = null
    contextRef.current = null
    if (context && graph && context.state !== 'closed') disposeMeditation(context, graph, true)
    if (context && context.state !== 'closed') void context.close().catch(() => undefined)
  }, [])

  const renderCoinToss = useCallback(async (coins: readonly CoinSide[], force = false) => {
    if (!force && !soundEnabledRef.current) return false
    const context = await ensureContext()
    if (!context) return false

    const now = context.currentTime
    const whoosh = context.createBufferSource()
    const whooshFilter = context.createBiquadFilter()
    const whooshGain = context.createGain()
    whoosh.buffer = noiseBuffer(context, .42)
    whooshFilter.type = 'bandpass'
    whooshFilter.frequency.setValueAtTime(700, now)
    whooshFilter.frequency.exponentialRampToValueAtTime(1800, now + .24)
    whooshFilter.Q.value = .7
    whooshGain.gain.setValueAtTime(.0001, now)
    whooshGain.gain.exponentialRampToValueAtTime(.038, now + .045)
    whooshGain.gain.exponentialRampToValueAtTime(.0001, now + .4)
    whoosh.connect(whooshFilter).connect(whooshGain).connect(context.destination)
    whoosh.onended = () => {
      whoosh.disconnect()
      whooshFilter.disconnect()
      whooshGain.disconnect()
    }
    whoosh.start(now)
    whoosh.stop(now + .42)

    coins.forEach((side, index) => {
      const impactAt = now + .25 + index * .065
      const oscillator = context.createOscillator()
      const overtone = context.createOscillator()
      const gain = context.createGain()
      const frequency = side === 'heads' ? 1760 : 1320
      oscillator.type = 'triangle'
      overtone.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency + index * 34, impactAt)
      overtone.frequency.setValueAtTime(frequency * 1.72 + index * 40, impactAt)
      gain.gain.setValueAtTime(.0001, impactAt)
      gain.gain.exponentialRampToValueAtTime(.055, impactAt + .008)
      gain.gain.exponentialRampToValueAtTime(.0001, impactAt + .32)
      oscillator.connect(gain)
      overtone.connect(gain)
      gain.connect(context.destination)
      oscillator.onended = () => {
        oscillator.disconnect()
        overtone.disconnect()
        gain.disconnect()
      }
      oscillator.start(impactAt)
      overtone.start(impactAt)
      oscillator.stop(impactAt + .34)
      overtone.stop(impactAt + .34)
    })
    return true
  }, [ensureContext])

  const value = useMemo<SoundContextValue>(() => ({
    playCoinToss: (coins) => { void renderCoinToss(coins) },
    playHistoryCue: (kind) => {
      if (!soundEnabledRef.current) return
      void ensureContext().then((context) => {
        if (!context) return
        const now = context.currentTime
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        oscillator.type = kind === 'bone' ? 'triangle' : kind === 'coin' ? 'sine' : 'sine'
        const frequencies = { bone: 170, stalk: 420, brush: 280, coin: 1180 }
        oscillator.frequency.setValueAtTime(frequencies[kind], now)
        oscillator.frequency.exponentialRampToValueAtTime(frequencies[kind] * (kind === 'bone' ? .65 : 1.25), now + .32)
        gain.gain.setValueAtTime(.0001, now)
        gain.gain.exponentialRampToValueAtTime(kind === 'coin' ? .045 : .025, now + .02)
        gain.gain.exponentialRampToValueAtTime(.0001, now + .42)
        oscillator.connect(gain).connect(context.destination)
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect() }
        oscillator.start(now); oscillator.stop(now + .44)
      })
    },
    previewCoinSound: () => renderCoinToss(['heads', 'tails', 'heads'], true),
    setAmbientPlayback,
  }), [ensureContext, renderCoinToss, setAmbientPlayback])

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSound() {
  const context = useContext(SoundContext)
  if (!context) throw new Error('useSound must be used within SoundProvider.')
  return context
}
