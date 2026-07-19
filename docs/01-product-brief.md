# Yi Path — locked product brief

## Product promise

> Take a quiet moment. Ask an honest question. Receive the symbols faithfully. Make your own meaning.

Yi Path is a web-based I Ching / Yijing reflection and learning companion. It supports English, Bulgarian, Russian, German, Italian, French, Spanish, European Portuguese, and Polish. The product is designed for any device, with mobile as the primary experience.

## V1: local-first consultation

The first build runs entirely at `localhost:3000`, without registration, cloud storage, payments or an AI provider.

### Primary user flow

1. Choose a method: **Digital coins**, **Physical coins**, or **I already have a hexagram**.
2. Optionally write a private open-ended question. The user can skip this.
3. Create six lines from bottom to top.
4. Reveal the primary hexagram, the moving lines and the resulting hexagram.
5. Read the result in layers: short orientation → selected moving lines → resulting hexagram → explore the full study card.
6. Save a private reflection locally, export it, or delete it.

### Digital coins

- One deliberate press/hold/release action per throw, repeated six times.
- The browser creates the result before animation using `crypto.getRandomValues()`.
- Three visual coins then animate the already-committed outcome; animation never decides it.
- Display the three coin values and total: 6, 7, 8 or 9.
- Build the hexagram visibly from the bottom upward.

### Physical coins

- The user tosses three real coins, then enters heads/tails or the line total.
- The app builds exactly the same line record and result screen as digital mode.
- Include a tiny visual instruction: heads/yang = 3, tails/yin = 2; 6/9 move, 7/8 are stable.

## Reading information hierarchy

The default result page is intentionally calm and compact. It reveals depth progressively:

1. **What appeared** — primary/resulting hexagram symbols, names and moving-line markers.
2. **A first reflection** — original Yi Path editorial summary, never a certainty or prediction.
3. **Your moving lines** — only the selected line cards first.
4. **What is changing** — resulting hexagram, described as a direction/tendency, not a guaranteed future.
5. **Explore deeper** — Chinese source, study context, trigrams, all six lines and sources.
6. **Journal** — private note, tags and revisit date.

Users may collapse or reorder these reading sections after the result is shown. Include `Reset layout`. Do not put drag/reorder complexity into the casting ritual itself.

## Education area

- `/start` — a 90-second beginner guide: good questions, the three-coin method and how to read a result.
- `/learn` — short visual lessons: Yin and Yang, eight trigrams, six lines, changing lines, source/history and respectful use.
- `/library` — searchable grid/list of all 64 hexagrams.
- `/hexagrams/:number` — individual deep-study page.

Every hexagram card should eventually include the classical text/source, a clearly separate Yi Path interpretation, trigram/sequence context, six detailed line reflections, reflection questions and a source drawer.

## Visual and interaction direction

Quiet ritual, not casino and not pseudo-ancient ornament.

- Warm paper / obsidian surfaces, ink text, muted jade and restrained brass accent.
- Generous whitespace, one primary action per screen, 44px+ controls.
- Lora-like editorial headings with a highly readable sans-serif body. Final font choice must support Cyrillic well.
- Optional coin sound and optional ambient audio, both off by default and remembered as preferences.
- Short meaningful motion only; respect `prefers-reduced-motion` and never block input.
- Full keyboard operation, visible focus, text contrast of at least 4.5:1, and no meaning conveyed by colour alone.

## Explicitly out of scope for V1

- Accounts, cloud sync, community, notifications, payments, AI calls and BaZi.
- Social feeds, streaks, forced daily use or “lucky day” predictions.
- Any claim of guaranteed fortune telling, supernatural certainty or professional advice.

