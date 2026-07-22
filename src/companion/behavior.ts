import type { CompanionPet } from '../domain/types'
import type { CompanionAnimation } from '../components/CompanionPet'

export type CompanionScene = 'home' | 'ritual' | 'result' | 'journal' | 'settings' | 'study' | 'quiet'

export type CompanionRoutine = {
  scene: CompanionScene
  restingPose: CompanionAnimation
  welcomeDelayMs: number | null
}

export function companionRoutineForPath(pathname: string): CompanionRoutine {
  if (pathname.startsWith('/cast/') || pathname === '/iching/reading') {
    return { scene: 'ritual', restingPose: 'sleep', welcomeDelayMs: null }
  }
  if (pathname === '/result') return { scene: 'result', restingPose: 'idle', welcomeDelayMs: 900 }
  if (pathname.startsWith('/journal')) return { scene: 'journal', restingPose: 'sleep', welcomeDelayMs: null }
  if (pathname === '/settings') return { scene: 'settings', restingPose: 'idle', welcomeDelayMs: null }
  if (pathname === '/') return { scene: 'home', restingPose: 'idle', welcomeDelayMs: 1400 }
  if (pathname.startsWith('/iching') || pathname.startsWith('/dao') || pathname.startsWith('/hexagrams/')) {
    return { scene: 'study', restingPose: 'idle', welcomeDelayMs: null }
  }
  return { scene: 'quiet', restingPose: 'idle', welcomeDelayMs: null }
}

export function welcomeAnimation(pet: CompanionPet): CompanionAnimation {
  return pet === 'cat' ? 'cat-purr' : 'dog-greet'
}

