import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { AmbientVolume, CoinSide } from '../domain/types'
import { useI18n } from '../i18n/I18nContext'
import {
  createMeditationGraph,
  disposeMeditation,
  pauseMeditation,
  resumeMeditation,
  setMeditationVolume,
  type MeditationGraph,
} from './meditation'

type SoundContextValue = {
  ambientStatus: 'off' | 'starting' | 'blocked' | 'playing'
  playCoinToss: (coins: readonly CoinSide[]) => void
  playHistoryCue: (kind: 'bone' | 'stalk' | 'brush' | 'coin') => void
  previewCoinSound: () => Promise<boolean>
  setAmbientVolume: (volume: AmbientVolume) => Promise<boolean>
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
  const ambientWantedRef = useRef(preferences.ambientVolume > 0)
  const ambientVolumeRef = useRef<0.5 | 1>(preferences.ambientVolume || 0.5)
  const ambientOperationRef = useRef(0)
  const [ambientStatus, setAmbientStatus] = useState<SoundContextValue['ambientStatus']>(preferences.ambientVolume > 0 ? 'starting' : 'off')

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
        // A balanced buffer is still responsive for casts, while being much less
        // prone to crackling or falling behind on mobile audio hardware.
        context = new AudioContextClass({ latencyHint: 'balanced' })
        contextRef.current = context
      }
      if (context.state !== 'running') await context.resume()
      if (context.state !== 'running') return null
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
    const graph = createMeditationGraph(context, ambientVolumeRef.current)
    ambientRef.current = graph
    return graph
  }, [])

  const setAmbientVolume = useCallback(async (volume: AmbientVolume) => {
    const operation = ++ambientOperationRef.current
    ambientWantedRef.current = volume > 0
    if (volume > 0) ambientVolumeRef.current = volume === 1 ? 1 : 0.5
    if (volume === 0) {
      stopAmbient()
      setAmbientStatus('off')
      return true
    }

    setAmbientStatus('starting')
    const context = await ensureContext()
    if (!context) {
      if (operation === ambientOperationRef.current) setAmbientStatus('blocked')
      return false
    }
    if (operation !== ambientOperationRef.current || !ambientWantedRef.current) return true

    try {
      const graph = ambientRef.current
      if (graph) {
        setMeditationVolume(context, graph, ambientVolumeRef.current)
        const resumed = await resumeMeditation(context, graph)
        if (operation === ambientOperationRef.current) setAmbientStatus(resumed ? 'playing' : 'blocked')
        return resumed
      }
      startAmbient(context)
      if (operation === ambientOperationRef.current) setAmbientStatus('playing')
      return true
    } catch {
      if (operation === ambientOperationRef.current) {
        stopAmbient(true)
        setAmbientStatus('blocked')
      }
      return false
    }
  }, [ensureContext, startAmbient, stopAmbient])

  useEffect(() => {
    ambientWantedRef.current = preferences.ambientVolume > 0
    if (preferences.ambientVolume > 0) ambientVolumeRef.current = preferences.ambientVolume === 1 ? 1 : 0.5
    if (preferences.ambientVolume === 0) {
      ++ambientOperationRef.current
      stopAmbient()
      setAmbientStatus('off')
      return
    }
    if (ambientRef.current) {
      const context = contextRef.current
      if (context) setMeditationVolume(context, ambientRef.current, ambientVolumeRef.current)
      setAmbientStatus(context?.state === 'running' ? 'playing' : 'blocked')
      return
    }

    let starting = false
    const usesPointerEvents = 'PointerEvent' in window
    function removeUnlockListeners() {
      if (usesPointerEvents) window.removeEventListener('pointerdown', beginAfterInteraction)
      else window.removeEventListener('touchstart', beginAfterInteraction)
      window.removeEventListener('keydown', beginAfterKey)
    }
    function beginAfterInteraction() {
      if (starting) return
      starting = true
      void setAmbientVolume(ambientVolumeRef.current).then((available) => {
        starting = false
        if (available) removeUnlockListeners()
      })
    }
    function beginAfterKey(event: KeyboardEvent) {
      if (event.key !== 'Enter' && event.key !== ' ') return
      beginAfterInteraction()
    }
    if (usesPointerEvents) window.addEventListener('pointerdown', beginAfterInteraction)
    else window.addEventListener('touchstart', beginAfterInteraction, { passive: true })
    window.addEventListener('keydown', beginAfterKey)
    void setAmbientVolume(ambientVolumeRef.current).then((available) => {
      if (available) removeUnlockListeners()
    })
    return removeUnlockListeners
  }, [preferences.ambientVolume, setAmbientVolume, stopAmbient])

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
        void resumeMeditation(context, graph).then((resumed) => {
          setAmbientStatus(resumed ? 'playing' : 'blocked')
        }).catch(() => setAmbientStatus('blocked'))
      } else {
        void context.resume().then(() => {
          if (ambientWantedRef.current) {
            startAmbient(context)
            setAmbientStatus('playing')
          }
        }).catch(() => setAmbientStatus('blocked'))
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
    whooshGain.gain.exponentialRampToValueAtTime(.09, now + .045)
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
      gain.gain.exponentialRampToValueAtTime(.12, impactAt + .008)
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
    ambientStatus,
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
        const peak = kind === 'coin' ? .11 : kind === 'stalk' ? .095 : .065
        gain.gain.exponentialRampToValueAtTime(peak, now + .02)
        gain.gain.exponentialRampToValueAtTime(.0001, now + .42)
        oscillator.connect(gain).connect(context.destination)
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect() }
        oscillator.start(now); oscillator.stop(now + .44)
      })
    },
    previewCoinSound: () => renderCoinToss(['heads', 'tails', 'heads'], true),
    setAmbientVolume,
  }), [ambientStatus, ensureContext, renderCoinToss, setAmbientVolume])

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSound() {
  const context = useContext(SoundContext)
  if (!context) throw new Error('useSound must be used within SoundProvider.')
  return context
}
