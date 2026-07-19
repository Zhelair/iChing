import { Check, Coffee, Copy, HeartHandshake, Mail, MessageSquareText } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { PageIntro } from '../components/PageIntro'
import { BMAC_URL, FEEDBACK_EMAIL } from '../config/contact'
import type { Locale } from '../domain/types'
import { useI18n } from '../i18n/I18nContext'

const copy: Record<Locale, {
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
  openEmail: string
  emailComing: string
  writeFirst: string
  copyFailed: string
  supportTitle: string
  supportBody: string
  bmac: string
  bmacComing: string
}> = {
  en: {
    eyebrow: 'Optional, always',
    title: 'Feedback & support',
    intro: 'Yi Path is free and local-first. Share what worked, report a rough edge, or support its continued care. None of these choices changes what the app unlocks.',
    feedbackTitle: 'Share feedback',
    feedbackBody: 'Your message stays in this browser until you choose an action. Yi Path does not send it to a server.',
    name: 'Name (optional)',
    email: 'Your email (optional)',
    message: 'What would you like to share?',
    placeholder: 'A thought, bug, confusing moment, or idea…',
    copyFeedback: 'Copy feedback',
    copied: 'Copied',
    openEmail: 'Open email',
    emailComing: 'Feedback email coming soon',
    writeFirst: 'Write a message to enable the feedback actions.',
    copyFailed: 'The browser could not copy this message. Please select and copy it manually.',
    supportTitle: 'Support Yi Path',
    supportBody: 'If Yi Path feels useful, you can buy me a coffee and help me keep improving it. Completely optional.',
    bmac: 'Buy Me a Coffee',
    bmacComing: 'Coffee link coming soon',
  },
  bg: {
    eyebrow: 'Винаги по желание',
    title: 'Обратна връзка и подкрепа',
    intro: 'Yi Path е безплатно и пази данните локално. Споделете какво ви е било полезно, сигнализирайте за проблем или подкрепете грижата за проекта. Нито един избор не отключва допълнителни функции.',
    feedbackTitle: 'Споделете обратна връзка',
    feedbackBody: 'Съобщението остава в този браузър, докато не изберете действие. Yi Path не го изпраща към сървър.',
    name: 'Име (по желание)',
    email: 'Вашият имейл (по желание)',
    message: 'Какво искате да споделите?',
    placeholder: 'Мисъл, грешка, неясен момент или идея…',
    copyFeedback: 'Копирай обратната връзка',
    copied: 'Копирано',
    openEmail: 'Отвори имейл',
    emailComing: 'Имейлът за обратна връзка идва скоро',
    writeFirst: 'Напишете съобщение, за да активирате действията.',
    copyFailed: 'Браузърът не успя да копира съобщението. Маркирайте го и го копирайте ръчно.',
    supportTitle: 'Подкрепете Yi Path',
    supportBody: 'Ако Yi Path ви е полезно, можете да ме почерпите с кафе и да помогнете да го развивам. Напълно по желание.',
    bmac: 'Buy Me a Coffee',
    bmacComing: 'Линкът за кафе идва скоро',
  },
  ru: {
    eyebrow: 'Всегда по желанию',
    title: 'Обратная связь и поддержка',
    intro: 'Yi Path — бесплатное локальное приложение. Расскажите, что оказалось полезным, сообщите о проблеме или поддержите дальнейшую работу. Ни один из этих вариантов не открывает дополнительные функции.',
    feedbackTitle: 'Поделиться отзывом',
    feedbackBody: 'Сообщение остаётся в этом браузере, пока вы сами не выберете действие. Yi Path не отправляет его на сервер.',
    name: 'Имя (необязательно)',
    email: 'Ваш email (необязательно)',
    message: 'Чем вы хотите поделиться?',
    placeholder: 'Мыслью, ошибкой, непонятным моментом или идеей…',
    copyFeedback: 'Скопировать отзыв',
    copied: 'Скопировано',
    openEmail: 'Открыть почту',
    emailComing: 'Email для отзывов скоро появится',
    writeFirst: 'Напишите сообщение, чтобы активировать действия.',
    copyFailed: 'Браузеру не удалось скопировать сообщение. Выделите и скопируйте его вручную.',
    supportTitle: 'Поддержать Yi Path',
    supportBody: 'Если Yi Path оказался полезным, можете угостить меня кофе и помочь развивать его дальше. Полностью по желанию.',
    bmac: 'Buy Me a Coffee',
    bmacComing: 'Ссылка на кофе скоро появится',
  },
}

function buildFeedback(name: string, email: string, message: string) {
  return [
    'Yi Path feedback',
    name.trim() ? `Name: ${name.trim()}` : '',
    email.trim() ? `Reply email: ${email.trim()}` : '',
    '',
    message.trim(),
  ].filter((line, index, lines) => line || (index > 0 && index < lines.length - 1)).join('\n')
}

export function SupportPage() {
  const { preferences } = useI18n()
  const c = copy[preferences.locale]
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const canSend = Boolean(message.trim())

  async function copyMessage(event: FormEvent) {
    event.preventDefault()
    if (!canSend) return
    try {
      await navigator.clipboard.writeText(buildFeedback(name, email, message))
      setStatus('copied')
      window.setTimeout(() => setStatus('idle'), 2400)
    } catch {
      setStatus('error')
    }
  }

  function openEmail() {
    if (!FEEDBACK_EMAIL || !canSend) return
    const subject = encodeURIComponent('Yi Path feedback')
    const body = encodeURIComponent(buildFeedback(name, email, message))
    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <div className="page-shell py-10 sm:py-16">
      <div className="reading-column">
        <PageIntro eyebrow={c.eyebrow} title={c.title} body={c.intro} />

        <section className="surface mt-8 p-5 sm:p-7" aria-labelledby="feedback-title">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--jade-light)] text-[var(--jade)]"><MessageSquareText size={22} aria-hidden="true" /></span>
            <div><h2 id="feedback-title" className="text-2xl">{c.feedbackTitle}</h2><p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{c.feedbackBody}</p></div>
          </div>

          <form className="mt-6 grid gap-5" onSubmit={copyMessage}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">{c.name}<input className="field" autoComplete="name" maxLength={80} value={name} onChange={(event) => setName(event.target.value)} /></label>
              <label className="grid gap-2 text-sm font-bold">{c.email}<input className="field" type="email" autoComplete="email" maxLength={120} value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            </div>
            <label className="grid gap-2 text-sm font-bold">{c.message}<textarea className="field min-h-40 resize-y" maxLength={4000} required placeholder={c.placeholder} value={message} onChange={(event) => { setMessage(event.target.value); setStatus('idle') }} /></label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="button-primary" type="submit" disabled={!canSend}>
                {status === 'copied' ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
                {status === 'copied' ? c.copied : c.copyFeedback}
              </button>
              <button className="button-secondary" type="button" disabled={!FEEDBACK_EMAIL || !canSend} onClick={openEmail}>
                <Mail size={18} aria-hidden="true" /> {FEEDBACK_EMAIL ? c.openEmail : c.emailComing}
              </button>
            </div>
            <p className={`text-xs leading-5 ${status === 'error' ? 'font-semibold text-red-800' : 'text-[var(--ink-soft)]'}`} role="status" aria-live="polite">{status === 'error' ? c.copyFailed : !canSend ? c.writeFirst : status === 'copied' ? c.copied : ''}</p>
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
