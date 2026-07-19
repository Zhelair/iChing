import { describe, expect, it } from 'vitest'
import feedbackHandler, { validateFeedbackPayload } from '../api/feedback'

const now = 2_000_000

function payload(overrides: Record<string, unknown> = {}) {
  return {
    name: 'Nik',
    email: 'visitor@example.com',
    message: 'A thoughtful piece of feedback.',
    locale: 'en',
    website: '',
    startedAt: now - 5_000,
    ...overrides,
  }
}

describe('feedback validation', () => {
  it('accepts and trims a valid submission', () => {
    const result = validateFeedbackPayload(payload({ name: '  Nik  ' }), now)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.name).toBe('Nik')
  })

  it('rejects an invalid reply address', () => {
    expect(validateFeedbackPayload(payload({ email: 'not-an-email' }), now)).toMatchObject({ ok: false, code: 'invalid' })
  })

  it('quietly rejects the honeypot and implausibly fast forms', () => {
    expect(validateFeedbackPayload(payload({ website: 'spam.example' }), now)).toMatchObject({ ok: false, code: 'spam' })
    expect(validateFeedbackPayload(payload({ startedAt: now - 100 }), now)).toMatchObject({ ok: false, code: 'spam' })
  })

  it('rejects oversized messages', () => {
    expect(validateFeedbackPayload(payload({ message: 'x'.repeat(4_001) }), now)).toMatchObject({ ok: false, code: 'invalid' })
  })
})

describe('feedback endpoint boundaries', () => {
  it('allows only POST requests', async () => {
    const result = await feedbackHandler.fetch(new Request('https://yi.example/api/feedback'))
    expect(result.status).toBe(405)
  })

  it('rejects cross-site browser requests', async () => {
    const result = await feedbackHandler.fetch(new Request('https://yi.example/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://attacker.example',
      },
      body: JSON.stringify(payload()),
    }))
    expect(result.status).toBe(403)
  })
})
