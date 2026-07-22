import { describe, expect, it } from 'vitest'
import { shouldBeginAtHome } from './entry'

describe('first entry routing', () => {
  it('starts restored workflow pages at home in a fresh tab', () => {
    expect(shouldBeginAtHome(true, '/reading')).toBe(true)
    expect(shouldBeginAtHome(true, '/iching/reading/')).toBe(true)
    expect(shouldBeginAtHome(true, '/journal')).toBe(true)
  })

  it('preserves intentional content deep links and active sessions', () => {
    expect(shouldBeginAtHome(true, '/dao/study')).toBe(false)
    expect(shouldBeginAtHome(true, '/iching/library')).toBe(false)
    expect(shouldBeginAtHome(false, '/iching/reading')).toBe(false)
  })
})
