# Paste this into the coding chat

I am building **Yi Path**, a local-first multilingual I Ching / Yijing web app in this folder. Before making changes, read these files completely:

- `README.md`
- `docs/01-product-brief.md`
- `docs/02-architecture-local-first.md`
- `docs/03-content-contract.md`
- `docs/00-product-research.md` for the full product research
- `content/final/README.md` and the final hexagram cards only when wiring content

## Build target for this first coding session

Create a polished local-only MVP using **Vite + React + TypeScript + Tailwind**. It must run locally with `npm run dev` at `localhost:3000`. Do not add GitHub, Vercel, Supabase, Stripe, authentication or real AI calls yet.

Implement these routes/screens:

1. Landing / Start reading
2. Choose method: Digital coins, Physical coins, I already have a hexagram
3. Six-step casting ritual, bottom-to-top, with accurate three-coin logic
4. Reading result: primary hexagram, moving lines, resulting hexagram and local journal note
5. Library placeholder and Learn placeholder
6. Settings: EN/BG/RU selector, sound/music toggles, export/import JSON and clear-all-data confirmation

## Important product rules

- This is reflective guidance, never certain prediction or professional advice.
- Use `crypto.getRandomValues()` for virtual casts. Animation may reveal a committed result; it must not decide a result.
- Manual and digital casting must create the same six-line data record.
- Store readings locally in IndexedDB and small preferences in localStorage. No account required.
- Add JSON export/import and data deletion early.
- Source/translation/editorial/AI layers must stay separate. Do not copy translations from websites.
- Make the interface calm, mobile-first, accessible and beautiful: warm paper/obsidian, ink, restrained jade/brass; no casino feel, neon mysticism or fake parchment.
- Audio is opt-in and off by default. Respect `prefers-reduced-motion`, keyboard users and 44px touch targets.

## Engineering expectations

- First inspect the folder and tell me what you will create.
- Use small, testable modules for casting rules and write tests for 6/7/8/9, line order, moving-line transformation and hexagram lookup.
- Keep content as versioned local data files, initially with a tiny sample set if the complete library needs a later import pass.
- Do not overwrite existing user files or invent source/translation claims.
- Verify the dev server visually before handing back.

At the end, report: files created/changed, how to run it, what flow was tested, and the clearest next step.
