import { Resend } from 'resend'
import { isLocale, type Locale } from '../src/domain/locales'

const MAX_BODY_CHARACTERS = 10_000
const MAX_MESSAGE_CHARACTERS = 4_000
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000
const RATE_LIMIT_MAX_REQUESTS = 3
const MIN_COMPLETION_MS = 1_200
const MAX_FORM_AGE_MS = 2 * 60 * 60 * 1_000
const rateWindows = new Map<string, number[]>()

type FeedbackPayload = {
  name: string
  email: string
  message: string
  locale: Locale
  website: string
  startedAt: number
}

type ValidationResult =
  | { ok: true; value: FeedbackPayload }
  | { ok: false; code: 'invalid' | 'spam'; message: string }

function response(body: Record<string, unknown>, status = 200, headers?: Record<string, string>) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
  })
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isValidEmail(value: string) {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function validateFeedbackPayload(input: unknown, now = Date.now()): ValidationResult {
  if (!input || typeof input !== 'object') {
    return { ok: false, code: 'invalid', message: 'Invalid feedback request.' }
  }

  const candidate = input as Record<string, unknown>
  if (
    !isString(candidate.name)
    || !isString(candidate.email)
    || !isString(candidate.message)
    || !isString(candidate.locale)
    || !isString(candidate.website)
    || typeof candidate.startedAt !== 'number'
  ) {
    return { ok: false, code: 'invalid', message: 'Invalid feedback fields.' }
  }

  if (candidate.website.trim()) {
    return { ok: false, code: 'spam', message: 'Feedback could not be sent.' }
  }

  const elapsed = now - candidate.startedAt
  if (!Number.isFinite(candidate.startedAt) || elapsed < MIN_COMPLETION_MS || elapsed > MAX_FORM_AGE_MS) {
    return { ok: false, code: 'spam', message: 'Please refresh the page and try again.' }
  }

  const name = candidate.name.trim()
  const email = candidate.email.trim()
  const message = candidate.message.trim()
  const locale = isLocale(candidate.locale) ? candidate.locale : 'en'

  if (!message || message.length > MAX_MESSAGE_CHARACTERS || name.length > 80 || email.length > 120 || !isValidEmail(email)) {
    return { ok: false, code: 'invalid', message: 'Please check the feedback fields.' }
  }

  return {
    ok: true,
    value: { name, email, message, locale, website: '', startedAt: candidate.startedAt },
  }
}

function requestOriginIsAllowed(request: Request) {
  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite === 'cross-site') return false
  const origin = request.headers.get('origin')
  if (!origin) return true
  try {
    return origin === new URL(request.url).origin
  } catch {
    return false
  }
}

function clientKey(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
}

function rateLimitExceeded(key: string, now: number) {
  const active = (rateWindows.get(key) ?? []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)
  if (active.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateWindows.set(key, active)
    return true
  }

  active.push(now)
  rateWindows.set(key, active)

  if (rateWindows.size > 500) {
    for (const [storedKey, timestamps] of rateWindows) {
      if (!timestamps.some((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)) rateWindows.delete(storedKey)
    }
  }
  return false
}

function feedbackText(payload: FeedbackPayload) {
  return [
    'Yi Path feedback',
    `Language: ${payload.locale.toUpperCase()}`,
    payload.name ? `Name: ${payload.name}` : 'Name: Not provided',
    payload.email ? `Reply email: ${payload.email}` : 'Reply email: Not provided',
    '',
    payload.message,
  ].join('\n')
}

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') {
      return response({ ok: false, code: 'method_not_allowed' }, 405, { Allow: 'POST' })
    }

    if (!requestOriginIsAllowed(request)) {
      return response({ ok: false, code: 'forbidden' }, 403)
    }

    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
      return response({ ok: false, code: 'invalid_content_type' }, 415)
    }

    const contentLength = Number(request.headers.get('content-length') ?? 0)
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_CHARACTERS) {
      return response({ ok: false, code: 'too_large' }, 413)
    }

    let rawBody: string
    let parsedBody: unknown
    try {
      rawBody = await request.text()
      if (rawBody.length > MAX_BODY_CHARACTERS) return response({ ok: false, code: 'too_large' }, 413)
      parsedBody = JSON.parse(rawBody)
    } catch {
      return response({ ok: false, code: 'invalid_json' }, 400)
    }

    const validation = validateFeedbackPayload(parsedBody)
    if (!validation.ok) {
      return response({ ok: false, code: validation.code, message: validation.message }, validation.code === 'spam' ? 400 : 422)
    }

    const apiKey = process.env.RESEND_API_KEY
    const to = process.env.FEEDBACK_TO_EMAIL
    const from = process.env.FEEDBACK_FROM_EMAIL || 'Yi Path <onboarding@resend.dev>'
    if (!apiKey || !to) {
      return response({ ok: false, code: 'not_configured' }, 503)
    }

    const now = Date.now()
    if (rateLimitExceeded(clientKey(request), now)) {
      return response({ ok: false, code: 'rate_limited' }, 429, { 'Retry-After': '600' })
    }

    try {
      const resend = new Resend(apiKey)
      const { error } = await resend.emails.send({
        from,
        to,
        subject: `Yi Path feedback (${validation.value.locale.toUpperCase()})`,
        text: feedbackText(validation.value),
        replyTo: validation.value.email || undefined,
      })

      if (error) {
        console.error('Resend rejected a Yi Path feedback email:', error.name, error.message)
        return response({ ok: false, code: 'delivery_failed' }, 502)
      }

      return response({ ok: true })
    } catch (error) {
      console.error('Yi Path feedback delivery failed:', error instanceof Error ? error.message : 'Unknown error')
      return response({ ok: false, code: 'delivery_failed' }, 502)
    }
  },
}
