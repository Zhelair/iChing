# Yi Path — “The Way of Change” experience plan

**Status:** Product and UX plan; no implementation yet  
**Date:** 21 July 2026  
**Recommended route:** `/learn/the-way`

## Decision summary

Build **an interactive visual essay inside Learn**, not a seventh top-level navigation item and not a long encyclopedia page.

The existing `/learn` page already has a strong language: warm paper, editorial type, muted jade and brass, generous spacing, illustrated SVG scenes, pointer depth, in-view animation, replay controls, and small sound cues. “The Way of Change” should extend that language.

The key product decisions are:

1. Keep **Learn** as the navigation label in all nine languages.
2. Let `/learn` remain the practical “how to read” lesson and add a prominent invitation to `/learn/the-way`.
3. Make `/learn/the-way` a guided sequence of short concepts, demonstrations, and practices.
4. Use interaction to reveal relationships: change, polarity, cycles, timing, and attention.
5. Reuse the existing ambient sound system. Add only short semantic cues; do not add a separate autoplay music track.
6. Lock the English meaning and sources before translating the new lesson into all nine languages.
7. Keep the tone reflective and historically careful. Do not present philosophical interpretation as scientific fact or guaranteed metaphysics.

## Why this shape fits the product

Yi Path is strongest when it feels like a **quiet practice**, not a fortune-telling game and not a museum catalogue. The new lesson should help a visitor move through three states:

> I understand the pattern → I can feel it through a small interaction → I can carry it into a reading.

This also protects the mobile navigation. It already contains five primary destinations, the recommended maximum for a bottom bar. “The Way” belongs under Learn rather than competing with Read, Journal, Library, Learn, and Settings.

## Product promise for the lesson

> See change as a living relationship—not a verdict. Explore a few ideas that can help you meet a reading with more patience, balance, and attention.

The lesson is not intended to teach “all of Daoism.” It offers a careful bridge between the practice of consulting the Yijing and several useful ideas from Chinese philosophy.

## Recommended information architecture

### `/learn`

Keep the current beginner lesson, line-value lab, reading order, and illustrated history. Add one feature card after the reading-order section:

- Eyebrow: **Go deeper**
- Title: **Explore the way change moves**
- Body: A calm introduction to polarity, cycles, timing, and action without force.
- CTA: **Enter The Way of Change**
- Estimated time: **5–7 minutes**

### `/learn/the-way`

The page should feel like a journey with six short chapters. Each chapter must still work as plain text with motion, sound, and pointer effects disabled.

#### 1. Threshold — “Change is not a verdict”

- Establish that a hexagram describes a configuration and movement, not a fixed fate.
- Show six quiet lines forming from bottom to top.
- Let one changing line transform and gently reveal the resulting figure.
- Primary action: **See how one line changes the whole**.

This reuses a visual grammar the user already understands from casting.

#### 2. Polarity — “Yin and yang arise together”

- Present yin and yang as relational qualities, not as good/evil, weak/strong, or female/male stereotypes.
- Use a two-state line lab: rest ↔ movement, receiving ↔ initiating, shade ↔ light.
- A visible button cycles examples; pointer or swipe movement may enhance it but must never be the only control.
- The broken and solid line should transform inside a fixed frame so the layout never jumps.

#### 3. Cycles — “Every phase contains movement”

- Use a four-part seasonal ring or flowing path: beginning, growth, fullness, return.
- Selecting a phase changes the short explanation, landscape tint, and one line in a small hexagram figure.
- Avoid claiming that every event follows a simple universal four-step law. Present the cycle as a lens for reflection.
- Reflection prompt: **What may be beginning, ripening, completing, or returning?**

#### 4. Timing — “Act without forcing”

- Introduce **wúwéi (無為)** as responsive, unforced action—not passivity or laziness.
- Offer three small situations with two possible responses: force / attend, rush / wait, control / make room.
- There is no score and no “correct personality.” Each choice reveals a reflective consequence.
- Bridge back to result language such as “do not cross the great river” without turning it into literal instruction.

#### 5. Naturalness and emptiness — “Make room to notice”

- Introduce **zìrán (自然)** carefully as naturalness or “so-of-itself.”
- Use an illustrated empty bowl or open window; tapping removes visual noise rather than adding decoration.
- Optional 60-second breath practice: user starts it explicitly, can pause or exit immediately, and sees a non-animated textual count in reduced-motion mode.
- Do not label the breathing exercise medical treatment, qigong instruction, or a historically exact ritual without appropriate review.

#### 6. Return — “Carry the idea into a reading”

- Summarize the four practical questions:
  1. What is the present pattern?
  2. What is moving?
  3. What timing does the situation ask for?
  4. What becomes possible if I stop forcing an answer?
- Primary CTA: **Begin a reading with this in mind**.
- Secondary CTA: **Return to Learn**.
- Offer a small glossary and sources drawer after the CTA, not before it.

## Storyboard and visual direction

### Art direction

Keep the current blend of:

- paper/e-ink calm;
- editorial reading layout;
- organic botanical atmosphere;
- restrained symbolic SVG illustration;
- jade for active/reflective states and brass for change or attention;
- soft surfaces with clear borders rather than heavy glass effects.

Do not shift to neon cyan, generic wellness gradients, fantasy temples, dragons, stock Buddha imagery, or dense pseudo-ancient ornament. The visual identity should remain recognisably Yi Path.

### Page rhythm

- Desktop: alternating text-and-illustration chapters, maximum text measure about 65–72 characters.
- Tablet: two-column chapters where comfortable; no sticky content that hides the section heading.
- Mobile: one vertical narrative with the illustration before its related explanation.
- Each chapter has one dominant visual event. Secondary details remain still.
- Maintain the existing 4/8px spacing rhythm and large section pauses.

### Reusable interaction shell

Generalise the strongest parts of `HistoryJourney` into a reusable illustrated-lesson pattern:

- in-view activation with `IntersectionObserver`;
- one replay button with a descriptive accessible name;
- optional pointer depth on fine pointers only;
- explicit reduced-motion behaviour;
- a semantic sound cue triggered only after user interaction;
- static HTML copy independent from the SVG;
- a stable illustration frame with reserved dimensions.

This avoids building six unrelated animation systems.

## Motion system

Motion should explain causality and continuity. It should never delay reading or hijack scrolling.

| Moment | Recommended motion | Timing | Reduced-motion equivalent |
| --- | --- | --- | --- |
| Page entrance | Opacity + 8–12px upward translation | 320–420ms | Immediate render or short crossfade |
| Chapter arrival | One illustration reveal when 25–30% visible | 320–480ms | Static final frame |
| Line transformation | Two line halves join/separate with opacity | 240–320ms | Instant state change with text update |
| Cycle selection | Ring rotates to selected phase; copy crossfades | ≤400ms | Selection outline + immediate copy |
| Choice reveal | Press feedback, then panel crossfade | 150–260ms | Immediate expanded text |
| Breath practice | User-started scale/opacity cycle | 4–6s per phase | Text count and progress bar without pulsing |
| Replay | Re-run only the active illustration | ≤1.2s story beat | No animation; announce reset state |

Rules:

- Animate `transform` and `opacity`, not layout dimensions or positions.
- Keep UI micro-interactions between 150 and 300ms.
- Never require a complete animation before the user can continue.
- No scroll-jacking, forced pinning, auto-advancing carousel, or endless decorative motion.
- Pause observer-driven animation when the scene leaves the viewport.
- Respect both `prefers-reduced-motion` and the in-app Reduce motion preference.

## Sound and music direction

The project already has a strong Web Audio foundation: ambient meditation, bowls, pentatonic motifs, coin sounds, and history cues. The new page should use that system instead of shipping a large music file.

### Recommended sound layers

1. **Ambient layer:** existing optional atmosphere, controlled globally in Settings.
2. **Semantic cues:** short, quiet cues for a completed line change, selected phase, opened practice, or completed breath.
3. **Silence:** the default state of every individual interaction unless the user has enabled sound.

Suggested cue language:

- line change: soft wood/brush click;
- cycle phase: short airy tonal shift;
- bowl clearing: one low, dry bowl tone;
- practice completion: a single restrained bell, never applause or a success jingle.

Guardrails:

- Never start new music when entering the page.
- Never change the user’s saved volume or sound preference.
- Every audio event must have an equivalent visual state change.
- The 60-second practice needs Start, Pause, Resume, and Exit controls.
- Stop or suspend audio when the tab is hidden.
- Keep cues under the ambient layer and avoid rapid repeated triggers.
- Resolve the existing product discrepancy before launch: the product brief says ambient audio is off by default, while current preferences initialise it on. The lesson must not decide this implicitly.

## Content and historical guardrails

The pasted brainstorm contains valuable themes, but several claims should not be published as written.

| Draft idea | Safer editorial direction |
| --- | --- |
| “Western thought is linear; Chinese thought is cyclical and dual” | Present cyclic and correlative thinking as influential lenses in Chinese traditions without reducing either “West” or “China” to one logic. |
| “There is no absolute good or evil” | Explain that yin and yang are complementary relational categories, not moral labels. Do not generalise this into a complete account of Chinese ethics. |
| “Coins work because mind and universe are connected” | If synchronicity appears, identify it as Jung’s interpretive framework, not a demonstrated mechanism or Yi Path’s factual claim. |
| “Laozi took the principles of the Book of Changes” | Describe the historical relationship between the Yijing, later commentarial traditions, and Daoist thought as layered and contested. |
| “Trigrams began with shamanic observation of nature” | Do not state a direct origin unless a scholarly source supports the exact claim. Keep oracle-bone history distinct from the later received Yijing, as the current Learn page already does. |
| “Zuo wang is the meditation before divination” | Present sitting-in-forgetfulness only within its proper textual/history context; do not imply it was a standard prerequisite for coin consultation. |

Before English copy is locked, create a claim/source sheet with one row per historical or philosophical assertion. Prefer scholarly reference works and primary text translations over Reddit, general search summaries, or unsourced wellness sites.

## Accessibility requirements

- All primary controls at least 44×44px; 8px minimum between adjacent touch targets.
- Full keyboard operation with visible focus.
- Illustrative SVGs marked decorative when the same idea is expressed in text; meaningful diagrams receive concise accessible descriptions.
- No information communicated by colour, animation, or sound alone.
- Active chapter, selected phase, expanded answer, paused practice, and completion state announced semantically.
- No gesture-only interaction.
- Body text at least 16px on mobile with 1.5–1.75 line height.
- Text contrast at least 4.5:1 in every theme.
- Test at 200% browser zoom and with long German/Portuguese strings.
- Focus moves to the page heading on route entry without trapping the user.

## Proposed implementation map

This is a planning map, not an instruction to implement everything at once.

### Routes and pages

- `src/pages/LearnPage.tsx` — add the feature invitation.
- `src/pages/TheWayPage.tsx` — new route-level page.
- `src/App.tsx` — add `/learn/the-way`.
- `src/components/AppLayout.tsx` — treat the route as the existing `study` atmosphere; keep Learn active for nested routes.

### Components

- `WayChapter` — semantic chapter shell.
- `WayIllustration` — SVG scene switcher.
- `PolarityLab` — accessible two-state line demonstration.
- `CycleLab` — four selectable phases with buttons, not a custom drag-only dial.
- `TimingChoices` — unscored reflective scenarios.
- `BreathPractice` — explicit-start, pausable 60-second practice.
- `LessonGlossary` — terms and sources disclosure.

### Content

Do not add the long lesson to `translations.ts`. Create a content-oriented schema, for example:

```ts
type WayLesson = {
  locale: Locale
  variant: string
  status: 'draft' | 'reviewed' | 'native-approved'
  meta: { title: string; intro: string; duration: string }
  chapters: Array<{
    id: string
    eyebrow: string
    title: string
    body: string[]
    reflection?: string
    interaction: 'lines' | 'cycle' | 'choices' | 'breath' | 'summary'
    sourceIds: string[]
  }>
  glossary: Array<{ id: string; term: string; characters?: string; pinyin?: string; explanation: string }>
}
```

Store the nine lesson files together under a dedicated content directory and validate their IDs and chapter order in tests. Keep short navigation and control labels in the existing UI translation system.

## Delivery phases

### Phase 0 — content truth and prototype

- Lock page promise, chapter order, and terminology.
- Create claim/source sheet.
- Write English copy in plain text.
- Prototype the six chapters as static responsive sections.
- Test whether the lesson is understandable with no animation.

### Phase 1 — accessible interactive MVP

- Add route and Learn invitation.
- Build the line, cycle, choice, and practice interactions.
- Ship static SVG final frames first.
- Add keyboard, screen-reader, touch, and reduced-motion behaviour.

### Phase 2 — motion and sound polish

- Generalise the history illustration/replay system.
- Add one meaningful animation per chapter.
- Add semantic cues through the existing sound context.
- Profile on a low-power mobile device and keep frame work within budget.

### Phase 3 — all nine languages

- Translate from the locked English lesson and glossary.
- Perform meaning, naturalness, UI-context, and mobile review per locale.
- Do not mark a locale complete merely because every key exists.

### Phase 4 — full-story verification

- Verify `/learn` → `/learn/the-way` → practice → `/reading`.
- Test all themes, sound levels, reduced motion, keyboard, mobile landscape, slow loading, and every locale.
- Confirm history/source language remains modest and accurate.

## Recommended first build slice

The smallest valuable version is:

1. the Learn invitation;
2. the new page with chapters 1–3 and 6;
3. one line transformation and one four-phase cycle interaction;
4. no new audio engine—only one existing brush/bowl cue;
5. English plus the full nine-locale content schema;
6. translation only after English meaning and sources are approved.

This slice proves the concept without committing to the more sensitive wúwéi, zìrán, and meditation copy before it receives proper editorial review.

## Definition of done

- The page teaches a coherent idea even with JavaScript motion and sound disabled.
- A visitor can finish it comfortably on a 375px phone.
- Learn remains the only new navigation concept; no overloaded bottom bar.
- Motion is meaningful, interruptible, and reduced-motion safe.
- Audio is optional, user-initiated, and never the sole feedback channel.
- Every philosophical/historical claim has a recorded source or is clearly labelled as reflection.
- All nine locales use the same validated content structure.
- Every locale has passed in-context naturalness review, not only automated completeness checks.

