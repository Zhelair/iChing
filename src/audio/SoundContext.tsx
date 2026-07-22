import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import type { AmbientVolume, CoinSide, CompanionPet } from '../domain/types'
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
  playCoinToss: (coins: readonly CoinSide[]) => void
  playHistoryCue: (kind: 'bone' | 'stalk' | 'brush' | 'coin') => void
  previewCoinSound: () => Promise<boolean>
  setAmbientVolume: (volume: AmbientVolume) => Promise<boolean>
  playPracticeCue: (kind: 'begin' | 'pause' | 'complete') => Promise<boolean>
  playPetSound: (pet: CompanionPet, action: 0 | 1 | 2) => Promise<boolean>
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
  const petSoundEnabledRef = useRef(preferences.petSound)
  const ambientWantedRef = useRef(preferences.ambientVolume > 0)
  const ambientVolumeRef = useRef<0.5 | 1>(preferences.ambientVolume || 0.5)
  const ambientOperationRef = useRef(0)

  useEffect(() => {
    soundEnabledRef.current = preferences.sound
  }, [preferences.sound])

  useEffect(() => {
    petSoundEnabledRef.current = preferences.petSound
  }, [preferences.petSound])

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
      return true
    }

    const context = await ensureContext()
    if (!context) return false
    if (operation !== ambientOperationRef.current || !ambientWantedRef.current) return true

    try {
      const graph = ambientRef.current
      if (graph) {
        setMeditationVolume(context, graph, ambientVolumeRef.current)
        return await resumeMeditation(context, graph)
      }
      startAmbient(context)
      return true
    } catch {
      if (operation === ambientOperationRef.current) stopAmbient(true)
      return false
    }
  }, [ensureContext, startAmbient, stopAmbient])

  useEffect(() => {
    ambientWantedRef.current = preferences.ambientVolume > 0
    if (preferences.ambientVolume > 0) ambientVolumeRef.current = preferences.ambientVolume === 1 ? 1 : 0.5
    if (preferences.ambientVolume === 0) {
      ++ambientOperationRef.current
      stopAmbient()
      return
    }
    if (ambientRef.current) {
      const context = contextRef.current
      if (context) setMeditationVolume(context, ambientRef.current, ambientVolumeRef.current)
      return
    }

    let starting = false
    const usesPointerEvents = 'PointerEvent' in window
    function removeUnlockListeners() {
      if (usesPointerEvents) window.removeEventListener('pointerup', beginAfterInteraction)
      else window.removeEventListener('touchend', beginAfterInteraction)
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
    if (usesPointerEvents) window.addEventListener('pointerup', beginAfterInteraction)
    else window.addEventListener('touchend', beginAfterInteraction, { passive: true })
    window.addEventListener('keydown', beginAfterKey)
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

  const playPetSound = useCallback(async (pet: CompanionPet, action: 0 | 1 | 2) => {
    if (!petSoundEnabledRef.current) return false
    const context = await ensureContext()
    if (!context) return false
    const now = context.currentTime + .015

    const tone = (frequency: number, endFrequency: number, at: number, duration: number, peak: number, type: OscillatorType = 'sine') => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      const filter = context.createBiquadFilter()
      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, at)
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, endFrequency), at + duration)
      filter.type = 'lowpass'
      filter.frequency.value = pet === 'cat' ? 2300 : 1500
      gain.gain.setValueAtTime(.0001, at)
      gain.gain.exponentialRampToValueAtTime(peak, at + .025)
      gain.gain.exponentialRampToValueAtTime(.0001, at + duration)
      oscillator.connect(filter).connect(gain).connect(context.destination)
      oscillator.onended = () => { oscillator.disconnect(); filter.disconnect(); gain.disconnect() }
      oscillator.start(at)
      oscillator.stop(at + duration + .02)
    }

    const breath = (at: number, duration: number, peak: number, frequency: number) => {
      const source = context.createBufferSource()
      const filter = context.createBiquadFilter()
      const gain = context.createGain()
      source.buffer = noiseBuffer(context, duration)
      filter.type = 'bandpass'
      filter.frequency.value = frequency
      filter.Q.value = .7
      gain.gain.setValueAtTime(.0001, at)
      gain.gain.exponentialRampToValueAtTime(peak, at + .03)
      gain.gain.exponentialRampToValueAtTime(.0001, at + duration)
      source.connect(filter).connect(gain).connect(context.destination)
      source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect() }
      source.start(at)
      source.stop(at + duration)
    }

    if (pet === 'cat' && action === 0) {
      for (let index = 0; index < 5; index += 1) tone(52, 58, now + index * .14, .18, .025, 'triangle')
    } else if (pet === 'cat' && action === 1) {
      tone(520, 920, now, .17, .07, 'sine'); tone(850, 610, now + .16, .22, .055, 'triangle')
    } else if (pet === 'cat') {
      breath(now, .34, .055, 3100)
    } else if (action === 0) {
      tone(190, 105, now, .18, .085, 'sawtooth'); tone(240, 135, now + .22, .15, .065, 'sawtooth')
    } else if (action === 1) {
      tone(360, 210, now, .13, .06, 'triangle'); tone(430, 250, now + .18, .12, .055, 'triangle'); breath(now + .38, .22, .025, 1500)
    } else {
      breath(now, .16, .028, 1300); breath(now + .22, .16, .028, 1300); tone(330, 190, now + .43, .18, .055, 'triangle')
    }
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
    playPracticeCue: async (kind) => {
      const context = await ensureContext()
      if (!context) return false
      const now = context.currentTime + .02
      const frequencies = kind === 'begin' ? [220, 330, 440] : kind === 'complete' ? [196, 293.66, 392] : [174.61]
      frequencies.forEach((frequency, index) => {
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        const filter = context.createBiquadFilter()
        const at = now + index * .09
        oscillator.type = 'sine'
        oscillator.frequency.value = frequency
        filter.type = 'lowpass'
        filter.frequency.value = 1300
        gain.gain.setValueAtTime(.0001, at)
        gain.gain.exponentialRampToValueAtTime(kind === 'pause' ? .035 : .05, at + .035)
        gain.gain.exponentialRampToValueAtTime(.0001, at + 1.8)
        oscillator.connect(filter).connect(gain).connect(context.destination)
        oscillator.onended = () => { oscillator.disconnect(); filter.disconnect(); gain.disconnect() }
        oscillator.start(at)
        oscillator.stop(at + 1.85)
      })
      return true
    },
    playPetSound,
  }), [ensureContext, playPetSound, renderCoinToss, setAmbientVolume])

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSound() {
  const context = useContext(SoundContext)
  if (!context) throw new Error('useSound must be used within SoundProvider.')
  return context
}
