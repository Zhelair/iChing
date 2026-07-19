# Architecture and release path

## Phase 0 — local-only (build this first)

**Recommended stack:** Vite + React + TypeScript + Tailwind. Keep the first app a client-side PWA-capable site; it must run with `npm run dev` at `localhost:3000`.

### Browser-only data

| Data | Local storage approach | Why |
| --- | --- | --- |
| UI language, sound, music, reduced-motion preference | `localStorage` | Small preference values. |
| Reading journal, notes, tags, layout order | IndexedDB | Durable structured local data. |
| Hexagram content and casting rules | Versioned files in the repository | Public, deterministic product content. |
| AI entitlement, user identity, payments | None in Phase 0 | No backend yet. |

Implement JSON export/import and `Clear all data` in Phase 0. Export must include an app/schema version, content version and casting record so it can be migrated later.

### Explicit feedback exception

The optional feedback form is the only Phase 0 server interaction. It sends only the name, reply email, message, and interface language that a visitor deliberately submits. It never reads or includes questions, readings, journal notes, preferences, or exports. A Vercel Function validates and rate-limits the request, then calls Resend with a server-only key. Copying the feedback locally remains available as a fallback.

### Casting engine requirements

- `heads = 3`, `tails = 2`; sum each three-coin toss.
- `6 = old yin` (broken and moving), `7 = young yang` (solid/stable), `8 = young yin` (broken/stable), `9 = old yang` (solid and moving).
- Lines are stored/displayed in bottom-to-top order, 1 through 6.
- Changing 6 flips to yang and changing 9 flips to yin to produce the resulting hexagram.
- Use `crypto.getRandomValues`; never `Math.random` for casts.
- Unit-test all 64 primary patterns, all line flips and a fixed deterministic test path.

## Phase 1 — GitHub and Vercel

When the local MVP is stable:

1. Create a private GitHub repository and push the code. Do not commit `.env` files or exports containing personal journal data.
2. Deploy the same static frontend to Vercel.
3. Keep reading data local. A deployed version does not require Supabase merely to work.
4. Add a privacy page that explains local storage, export and deletion before introducing analytics.

## Phase 2 — accounts and optional sync

Use **Supabase** only when an actual user benefit needs a server: cross-device sync, account recovery, Pro entitlement or paid AI.

Suggested services:

- Supabase Auth for optional email/OAuth sign-in.
- Supabase Postgres for user profile, subscription status and encrypted/synchronised readings only after explicit opt-in.
- Supabase Storage only if users deliberately attach media to a journal entry.
- Row Level Security from day one: users can only read/write their own records.

Do not silently migrate local journals to the cloud. Offer `Keep data only on this device` and `Sync encrypted readings` as explicit choices. The original local export remains available.

## Phase 3 — Pro and AI Companion

Use Stripe for subscriptions and a Vercel server route/function for checkout webhooks and AI calls. The browser must never hold a DeepSeek, OpenAI or other model-provider key.

Suggested data boundaries:

| Stored locally | Stored in Supabase after opt-in | Sent to AI only per request |
| --- | --- | --- |
| Full journal, unless user enables sync | Auth ID, entitlement, synced encrypted reading payload | Current optional question, selected hexagram/line IDs, selected approved passages, language |

AI returns an explicitly labelled **AI-assisted reflection** with passages used and reflection questions. It does not rewrite the canonical content. Log minimal billing/usage metadata, not the user’s full journal question, unless they knowingly choose history/sync.

## Suggested database shape for later

```text
profiles(id, locale, created_at)
subscriptions(user_id, provider_customer_id, status, plan, period_end)
ai_usage(user_id, month_key, reflection_count)
synced_readings(id, user_id, encrypted_payload, schema_version, content_version, created_at, updated_at)
```

Keep the `Yi Canon` content itself in versioned repository files at first. It is finite, reviewable and deployable without a database. Move it to a CMS/database only if non-developers need a publishing workflow.
