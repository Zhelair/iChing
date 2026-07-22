import { describe, expect, it } from 'vitest'
import { companionRoutineForPath, welcomeAnimation } from './behavior'

describe('local companion routine', () => {
  it('stays asleep during casting and journal reflection', () => {
    expect(companionRoutineForPath('/cast/yarrow').restingPose).toBe('sleep')
    expect(companionRoutineForPath('/journal/patterns').restingPose).toBe('sleep')
  })

  it('stays present and calm in settings', () => {
    expect(companionRoutineForPath('/settings')).toEqual({ scene: 'settings', restingPose: 'idle', welcomeDelayMs: null })
  })

  it('uses species-specific, silent welcome motion', () => {
    expect(welcomeAnimation('cat')).toBe('cat-purr')
    expect(welcomeAnimation('dog')).toBe('dog-greet')
  })
})
