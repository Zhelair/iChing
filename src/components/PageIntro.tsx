export function PageIntro({ eyebrow, title, body }: { eyebrow?: string; title: string; body?: string }) {
  return (
    <header className="space-y-4">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="max-w-3xl text-4xl font-medium leading-[1.08] tracking-[-.03em] text-[var(--ink)] sm:text-5xl">{title}</h1>
      {body ? <p className="max-w-2xl text-base leading-7 text-[var(--ink-soft)] sm:text-lg">{body}</p> : null}
    </header>
  )
}
