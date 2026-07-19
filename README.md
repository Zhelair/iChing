# Yi Path

Yi Path is a private, multilingual I Ching / Yijing reflection and learning web app. It is designed as a quiet ritual and a trustworthy study companion—not a gambling game or a machine that promises the future.

The current MVP is a local-first Vite + React + TypeScript application with:

- English, Bulgarian, Russian, German, Italian, French, Spanish, European Portuguese, and Polish interface copy.
- Digital coin casting, physical-coin entry, and direct hexagram entry.
- Clear treatment of 6 and 9 as changing lines, while 7 and 8 remain stable.
- A complete 64-hexagram study library and changing-line reflections.
- An optional locally generated meditation soundscape and coin feedback.
- IndexedDB readings and journal notes, plus JSON import/export.
- No account, analytics, payment system, or browser-side API key.
- An optional, explicit feedback form relayed by a small Vercel Function through Resend; readings and journal data are never included.

## Local development

Requirements: a current Node.js LTS release and npm.

```powershell
npm ci
npm run dev
```

Open `http://localhost:3000`. Keep the terminal running while using the app; pressing `Ctrl+C` stops Vite and makes localhost unavailable.

Run the complete local checks with:

```powershell
npm test
npm run lint
npm run build
```

## Editorial content

The editable source cards live in [`content/final`](content/final). The browser consumes generated, versioned artifacts in `src/data` so the app stays fast and deterministic.

After changing a source card, rebuild and validate the content:

```powershell
npm run content:build
npm test
```

Classical source text, translations, editorial reflections, and any future AI output must remain visibly separate. The current editorial material is reflective guidance, not professional advice or certain prediction.

The received text and casting mechanics were cross-checked in July 2026. See the [canonical review](docs/05-canonical-review-2026-07-19.md) for sources, corrections, methodology, and the remaining native/editorial review boundary.

## Deploying to Vercel

Import this repository into Vercel with the Vite framework preset. The expected build command is `npm run build` and the output directory is `dist`.

The optional feedback function uses these server-only environment variables:

```text
RESEND_API_KEY
FEEDBACK_TO_EMAIL
FEEDBACK_FROM_EMAIL
```

For Resend test mode, set `FEEDBACK_FROM_EMAIL` to `Yi Path <onboarding@resend.dev>` and use the email associated with the Resend account as `FEEDBACK_TO_EMAIL`. For production sending, replace the sender with an address on a verified domain or subdomain. Never prefix these values with `VITE_`, because Vite-prefixed variables are exposed to the browser bundle.

Use `vercel dev` rather than the plain Vite server when testing `/api/feedback` locally. The committed `.env.example` lists the required names without real secrets.

`vercel.json` routes direct visits such as `/library` and `/hexagrams/24` back through the React application.

## Product documentation

- [Full product research](docs/00-product-research.md)
- [Product and UX brief](docs/01-product-brief.md)
- [Local-first architecture](docs/02-architecture-local-first.md)
- [Hexagram and content contract](docs/03-content-contract.md)
- [Original coding-chat handoff](docs/04-coding-chat-handoff.md)
- [Canonical review and methodology](docs/05-canonical-review-2026-07-19.md)

## Product guardrails

1. All nine interface languages are first-class; classical passages are never silently machine-translated at runtime.
2. A visitor can cast, read, journal, export, and erase data without an account.
3. Virtual and physical casting produce the same transparent six-line record.
4. The app uses reflection language, not promises, diagnoses, or financial, legal, or medical advice.
5. AI, accounts, sync, subscriptions, and payments remain later server-side additions.
