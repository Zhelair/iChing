import { Check, Coffee, Copy, HeartHandshake, LoaderCircle, MessageSquareText, Send } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { PageIntro } from '../components/PageIntro'
import { BMAC_URL } from '../config/contact'
import { isBuiltInContentLocale, type BuiltInContentLocale } from '../domain/locales'
import { useI18n } from '../i18n/I18nContext'
import { getUiLocalePack } from '../i18n/uiLocalePacks'

const copy: Record<BuiltInContentLocale, {
  eyebrow: string
  title: string
  intro: string
  feedbackTitle: string
  feedbackBody: string
  name: string
  email: string
  message: string
  placeholder: string
  copyFeedback: string
  copied: string
  sendFeedback: string
  sending: string
  sent: string
  sendFailed: string
  tryLater: string
  writeFirst: string
  copyFailed: string
  supportTitle: string
  supportBody: string
  bmac: string
  bmacComing: string
  feedbackHeading: string
  feedbackName: string
  feedbackEmail: string
}> = {
  en: {
    eyebrow: 'Optional, always',
    title: 'Feedback & support',
    intro: 'Yi Path is free and local-first. Share what worked, report a rough edge, or support its continued care. None of these choices changes what the app unlocks.',
    feedbackTitle: 'Share feedback',
    feedbackBody: 'When you press Send feedback, your message and optional contact details are sent securely through Resend to the Yi Path developer.',
    name: 'Name (optional)',
    email: 'Your email for a reply (optional)',
    message: 'What would you like to share?',
    placeholder: 'A thought, bug, confusing moment, or idea…',
    copyFeedback: 'Copy feedback',
    copied: 'Copied',
    sendFeedback: 'Send feedback',
    sending: 'Sending…',
    sent: 'Thank you—your feedback was sent.',
    sendFailed: 'Feedback could not be sent. Please try again or copy it instead.',
    tryLater: 'Please wait a moment before sending another message.',
    writeFirst: 'Write a message to enable the feedback actions.',
    copyFailed: 'The browser could not copy this message. Please select and copy it manually.',
    supportTitle: 'Support Yi Path',
    supportBody: 'If Yi Path feels useful, you can buy me a coffee and help me keep improving it. Completely optional.',
    bmac: 'Buy Me a Coffee',
    bmacComing: 'Coffee link coming soon',
    feedbackHeading: 'Yi Path feedback',
    feedbackName: 'Name',
    feedbackEmail: 'Reply email',
  },
  bg: {
    eyebrow: 'Винаги по желание',
    title: 'Обратна връзка и подкрепа',
    intro: 'Yi Path е безплатно и пази данните локално. Споделете какво ви е било полезно, сигнализирайте за проблем или подкрепете грижата за проекта. Нито един избор не отключва допълнителни функции.',
    feedbackTitle: 'Споделете обратна връзка',
    feedbackBody: 'Когато натиснете „Изпрати обратна връзка“, съобщението и незадължителните данни за контакт се изпращат защитено чрез Resend до разработчика на Yi Path.',
    name: 'Име (по желание)',
    email: 'Вашият имейл за отговор (по желание)',
    message: 'Какво искате да споделите?',
    placeholder: 'Мисъл, грешка, неясен момент или идея…',
    copyFeedback: 'Копирай обратната връзка',
    copied: 'Копирано',
    sendFeedback: 'Изпрати обратна връзка',
    sending: 'Изпращане…',
    sent: 'Благодаря — обратната ви връзка беше изпратена.',
    sendFailed: 'Обратната връзка не беше изпратена. Опитайте отново или я копирайте.',
    tryLater: 'Изчакайте малко, преди да изпратите друго съобщение.',
    writeFirst: 'Напишете съобщение, за да активирате действията.',
    copyFailed: 'Браузърът не успя да копира съобщението. Маркирайте го и го копирайте ръчно.',
    supportTitle: 'Подкрепете Yi Path',
    supportBody: 'Ако Yi Path ви е полезно, можете да ме почерпите с кафе и да помогнете да го развивам. Напълно по желание.',
    bmac: 'Buy Me a Coffee',
    bmacComing: 'Линкът за кафе идва скоро',
    feedbackHeading: 'Обратна връзка за Yi Path',
    feedbackName: 'Име',
    feedbackEmail: 'Имейл за отговор',
  },
  ru: {
    eyebrow: 'Всегда по желанию',
    title: 'Обратная связь и поддержка',
    intro: 'Yi Path — бесплатное приложение, которое хранит данные локально. Расскажите, что оказалось полезным, сообщите о проблеме или поддержите дальнейшую работу. Ни один из этих вариантов не открывает дополнительные функции.',
    feedbackTitle: 'Поделиться отзывом',
    feedbackBody: 'Когда вы нажимаете «Отправить отзыв», сообщение и необязательные контактные данные безопасно отправляются разработчику Yi Path с помощью сервиса Resend.',
    name: 'Имя (необязательно)',
    email: 'Ваш email для ответа (необязательно)',
    message: 'Чем вы хотите поделиться?',
    placeholder: 'Мыслью, ошибкой, непонятным моментом или идеей…',
    copyFeedback: 'Скопировать отзыв',
    copied: 'Скопировано',
    sendFeedback: 'Отправить отзыв',
    sending: 'Отправка…',
    sent: 'Спасибо — ваш отзыв отправлен.',
    sendFailed: 'Не удалось отправить отзыв. Попробуйте снова или скопируйте его.',
    tryLater: 'Подождите немного перед отправкой следующего сообщения.',
    writeFirst: 'Напишите сообщение, чтобы активировать кнопки.',
    copyFailed: 'Браузеру не удалось скопировать сообщение. Выделите и скопируйте его вручную.',
    supportTitle: 'Поддержать Yi Path',
    supportBody: 'Если Yi Path оказался полезным, можете угостить меня кофе и помочь развивать его дальше. Это совершенно добровольно.',
    bmac: 'Buy Me a Coffee',
    bmacComing: 'Ссылка на кофе скоро появится',
    feedbackHeading: 'Отзыв о Yi Path',
    feedbackName: 'Имя',
    feedbackEmail: 'Email для ответа',
  },
}

function buildFeedback(c: { feedbackHeading: string; feedbackName: string; feedbackEmail: string }, name: string, email: string, message: string) {
  return [
    c.feedbackHeading,
    name.trim() ? `${c.feedbackName}: ${name.trim()}` : '',
    email.trim() ? `${c.feedbackEmail}: ${email.trim()}` : '',
    '',
    message.trim(),
  ].filter((line, index, lines) => line || (index > 0 && index < lines.length - 1)).join('\n')
}

export function SupportPage() {
  const { preferences } = useI18n()
  const c = isBuiltInContentLocale(preferences.locale)
    ? copy[preferences.locale]
    : getUiLocalePack(preferences.locale).features.support
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const [cooldownUntil, setCooldownUntil] = useState(0)
  const [status, setStatus] = useState<'idle' | 'copied' | 'sending' | 'sent' | 'copyError' | 'sendError' | 'rateLimited'>('idle')
  const canSend = Boolean(message.trim())
  const coolingDown = cooldownUntil > Date.now()

  useEffect(() => {
    if (!cooldownUntil) return
    const timeout = window.setTimeout(() => setCooldownUntil(0), Math.max(0, cooldownUntil - Date.now()))
    return () => window.clearTimeout(timeout)
  }, [cooldownUntil])

  async function copyMessage() {
    if (!canSend) return
    try {
      await navigator.clipboard.writeText(buildFeedback(c, name, email, message))
      setStatus('copied')
      window.setTimeout(() => setStatus((current) => current === 'copied' ? 'idle' : current), 2400)
    } catch {
      setStatus('copyError')
    }
  }

  async function sendFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSend || coolingDown || status === 'sending') return

    setStatus('sending')
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 12_000)
    try {
      const result = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, locale: preferences.locale, website, startedAt }),
        signal: controller.signal,
      })

      if (!result.ok) {
        setStatus(result.status === 429 ? 'rateLimited' : 'sendError')
        return
      }

      setName('')
      setEmail('')
      setMessage('')
      setWebsite('')
      setStartedAt(Date.now())
      setCooldownUntil(Date.now() + 60_000)
      setStatus('sent')
    } catch {
      setStatus('sendError')
    } finally {
      window.clearTimeout(timeout)
    }
  }

  const statusIsError = status === 'copyError' || status === 'sendError' || status === 'rateLimited'
  const statusText = status === 'sent' ? c.sent
    : status === 'copied' ? c.copied
      : status === 'copyError' ? c.copyFailed
        : status === 'sendError' ? c.sendFailed
          : status === 'rateLimited' || coolingDown ? c.tryLater
            : !canSend ? c.writeFirst : ''

  return (
    <div className="page-shell py-10 sm:py-16">
      <div className="reading-column">
        <PageIntro eyebrow={c.eyebrow} title={c.title} body={c.intro} />

        <section className="surface mt-8 p-5 sm:p-7" aria-labelledby="feedback-title">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--jade-light)] text-[var(--jade)]"><MessageSquareText size={22} aria-hidden="true" /></span>
            <div><h2 id="feedback-title" className="text-2xl">{c.feedbackTitle}</h2><p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{c.feedbackBody}</p></div>
          </div>

          <form className="mt-6 grid gap-5" onSubmit={sendFeedback} aria-busy={status === 'sending'}>
            <label className="feedback-honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">{c.name}<input className="field" autoComplete="name" maxLength={80} disabled={status === 'sending'} value={name} onChange={(event) => { setName(event.target.value); setStatus('idle') }} /></label>
              <label className="grid gap-2 text-sm font-bold">{c.email}<input className="field" type="email" autoComplete="email" maxLength={120} disabled={status === 'sending'} value={email} onChange={(event) => { setEmail(event.target.value); setStatus('idle') }} /></label>
            </div>
            <label className="grid gap-2 text-sm font-bold">{c.message}<textarea className="field min-h-40 resize-y" maxLength={4000} required disabled={status === 'sending'} placeholder={c.placeholder} value={message} onChange={(event) => { setMessage(event.target.value); setStatus('idle') }} /></label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="button-primary" type="submit" disabled={!canSend || coolingDown || status === 'sending'}>
                {status === 'sending' ? <LoaderCircle className="animate-spin" size={18} aria-hidden="true" /> : status === 'sent' ? <Check size={18} aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
                {status === 'sending' ? c.sending : c.sendFeedback}
              </button>
              <button className="button-secondary" type="button" disabled={!canSend || status === 'sending'} onClick={() => void copyMessage()}>
                {status === 'copied' ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
                {status === 'copied' ? c.copied : c.copyFeedback}
              </button>
            </div>
            <p className={`text-xs leading-5 ${statusIsError ? 'font-semibold text-red-800' : status === 'sent' ? 'font-semibold text-[var(--jade)]' : 'text-[var(--ink-soft)]'}`} role="status" aria-live="polite">{statusText}</p>
          </form>
        </section>

        <section className="surface mt-5 p-5 sm:p-7" aria-labelledby="support-title">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--brass)]/12 text-[var(--brass)]"><HeartHandshake size={23} aria-hidden="true" /></span>
            <div><h2 id="support-title" className="text-2xl">{c.supportTitle}</h2><p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{c.supportBody}</p></div>
          </div>
          <div className="mt-6">
            {BMAC_URL ? <a className="button-secondary" href={BMAC_URL} target="_blank" rel="noreferrer"><Coffee size={18} aria-hidden="true" /> {c.bmac}</a> : <button className="button-secondary" type="button" disabled><Coffee size={18} aria-hidden="true" /> {c.bmacComing}</button>}
          </div>
        </section>
      </div>
    </div>
  )
}
