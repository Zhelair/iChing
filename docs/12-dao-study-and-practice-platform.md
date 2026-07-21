# Yi Path — Dao study and practice platform

**Status:** Active implementation; navigation, study reader, local notes, Journal integration, settling-breath practice, and daily-life reflection are implemented
**Date:** 21 July 2026  
**Primary route:** `/dao`  
**Related plans:** `docs/10-the-way-experience-plan.md` and `docs/11-the-way-localization-blueprint.md`

## Source-grounding update — 21 July 2026

The Stanford Encyclopedia of Philosophy entry [Chinese Philosophy of Change](https://plato.stanford.edu/archives/sum2024/entries/chinese-change/) is now part of the editorial source trail. It is a scholarly secondary source about the *Yijing*, not a primary Daoist practice manual. Yi Path therefore uses it in a deliberately bounded way:

- **Historical procedure:** the fifty/forty-nine-stalk sequence in the `Xici` can support the existing yarrow-casting experience. Present it as a documented divination procedure, with its textual and historical layer named.
- **Interpretive study:** finitude, uncertainty, symbolism, decision-making, human agency, and competing cosmological, humanistic, and divinatory approaches can become sourced study chapters.
- **Modern study ritual:** an interactive exercise may ask the reader to observe a situation, identify what remains unknown, attend to a symbol, and consider an adequate response. It must be labelled as a modern Yi Path exercise informed by scholarship—not an ancient ritual.
- **Dao meditation:** settling breath and future embodied practices cannot be authenticated from this article. They remain conservative modern introductory exercises until a relevant primary text, historical study, lineage context, and qualified review support a stronger label.

### Required provenance record

Every future ritual, meditation, or procedure should store:

```ts
type PracticeProvenance = {
  classification: 'historical-procedure' | 'textual-theme' | 'later-lineage' | 'modern-guided-practice'
  tradition: 'yijing' | 'early-daoist-text' | 'historical-daoism' | 'modern-editorial'
  primarySources: string[]
  scholarship: string[]
  editorialAdaptation: string
  reviewer?: string
  safetyReview?: string
}
```

The visible interface should expose the classification and a short source trail. No practice should be called “ancient,” “traditional,” or “Daoist” merely because its visual language uses water, bamboo, breathing, or Chinese characters.

### Current sound decision

Dao practices do not use a separate ambient soundtrack. Only brief, optional interaction cues mark meaningful state changes such as arriving, beginning, pausing, and completing. The cues never carry instructions and never replace visible state.

## Product decision

Dao should be a separate, first-class place for serious study and actual practice—not only one illustrated article.

The product model is:

> Study what the traditions say → annotate and question it → try a careful practice → reflect on ordinary life → return over time.

The page must support both a curious beginner who wants a five-minute orientation and a committed reader who wants to study texts, maintain notebooks, and revisit months of reflections.

It should feel like a personal study sanctuary, not a course dashboard, productivity tracker, social feed, or gamified meditation app.

## Navigation correction

Support is already omitted from the phone’s five-item bar and remains available from Settings. The revised primary navigation should be:

### Desktop

> Read · Journal · I Ching · Dao · Settings · Support

### Phone

> Read · Journal · I Ching · Dao · Settings

This replaces the current Library/Learn pair with I Ching/Dao. It does not add another mobile destination.

Use the same semantic destinations in every language and at every breakpoint. The layout may adapt, but a user should not need a different mental model on phone and desktop.

## Four connected spaces inside Dao

### 1. Study

Read trustworthy, structured material at several depths:

- a short interactive “Start here” path;
- concepts and glossary entries;
- texts and passage-by-passage commentary;
- history and traditions;
- connections and boundaries with the Yijing and neighbouring practices;
- source notes and translation comparisons.

### 2. Notebook

Create notes anchored to a paragraph, passage, concept, or whole work:

- highlight a passage and attach a note;
- add a note without selecting text;
- write a chapter-level or whole-book note;
- tag and search notes;
- link one note to another;
- promote a short annotation into a full journal entry;
- navigate back from a note to its exact source location.

### 3. Practice

Use explicit, interactive sessions with visuals, animation, audio, controls, and a safe exit:

- settling breath;
- quiet sitting;
- observation exercises;
- concept-based contemplations;
- carefully reviewed historical practices where appropriate;
- post-practice reflection.

### 4. Living the Way

Connect study to ordinary situations without telling the user how a “real Daoist” must behave:

- small scenario reflections about effort, timing, conflict, simplicity, attention, and uncertainty;
- a repeatable **Notice → Allow → Respond → Reflect** pattern;
- optional prompts linked to a source passage;
- free-form life entries in the Journal;
- no scores, virtue ratings, streaks, or claims that one response is universally Daoist.

## `/dao` home experience

The Dao home should be calm, personal, and immediately useful.

### Hero

- Eyebrow: **Study · practice · reflection**
- Title direction: **A place to study the Way—and notice it in life.**
- One slow, responsive illustration such as water finding a path through an ink landscape.
- Primary CTA: **Start with the Way**.
- Secondary action: **Continue where you left off**, shown only when progress exists.

### Main entrances

1. **Start here** — the interactive visual essay.
2. **Study the texts** — books, chapters, concepts, and sources.
3. **Begin a practice** — a safe, explicit-start practice selector.
4. **Open your notebook** — annotations and long-form study notes.
5. **Reflect on daily life** — free-form or guided Journal entry.

Do not present these as five equal dashboard statistics. Use an editorial hierarchy: one featured path, a paired Study/Practice row, then quieter Notebook/Reflection continuations.

### Returning-state modules

When local data exists, show at most three contextual modules:

- last-read passage;
- unfinished note or recently edited notebook;
- last-used practice.

Do not show streaks, missed-day warnings, “productivity,” or completion pressure.

## Serious study reader

### Desktop

Use a three-region reading layout when width allows:

- left: collapsible table of contents;
- centre: readable text column, 65–72 characters per line;
- right: notes and source context for the active passage.

The centre text remains the visual priority. Side rails should collapse before the reading column becomes narrow.

### Tablet

- reading column plus one collapsible rail;
- notes open as an adjacent panel in landscape and a sheet in portrait;
- table of contents becomes a popover or drawer.

### Phone

- one uninterrupted reading column;
- compact top progress/context line;
- bottom actions for Contents, Note, Bookmark, and Text settings;
- notes open in a full-height sheet with a visible close button;
- restore exact reading position after closing a note or returning later;
- no horizontal pagination and no gesture-only annotations.

### Reading controls

- text size and line spacing;
- light, bamboo-mist, and ink-night themes;
- bookmark passage;
- add note;
- view source/translation information;
- compare translations only where rights and content quality allow;
- copy a short passage with automatic attribution.

### Whole books and rights

The application cannot silently reproduce copyrighted modern translations as “whole books.” Full works require one of:

- public-domain text with verified status in relevant territories;
- an open licence compatible with the app;
- explicit permission or a publishing agreement;
- original Yi Path commentary and paraphrase linked to properly attributed short excerpts.

Every work needs a rights record: edition, translator, year, territory, licence, allowed excerpt length, attribution text, and review status.

## Notes, notebooks, and Journal

The current IndexedDB database contains only cast `readings`. Dao study requires separate data types while keeping one unified Journal experience.

### Recommended objects

```ts
type ContentAnchor = {
  collectionId: string
  workId: string
  sectionId: string
  blockId?: string
}

type StudyNote = {
  id: string
  schemaVersion: 1
  locale: Locale
  anchor: ContentAnchor
  quotedText?: string
  body: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

type JournalEntry = {
  id: string
  schemaVersion: 1
  kind: 'freeform' | 'study' | 'practice'
  locale: Locale
  title: string
  body: string
  tags: string[]
  sourceNoteIds: string[]
  practiceSessionId?: string
  createdAt: string
  updatedAt: string
}

type ReadingProgress = {
  workId: string
  sectionId: string
  blockId?: string
  scrollOffset?: number
  updatedAt: string
}

type PracticeSession = {
  id: string
  practiceId: string
  durationSeconds: number
  completed: boolean
  reflectionEntryId?: string
  createdAt: string
}
```

### IndexedDB migration

Move from database version 1 to version 2 with new stores:

- `readings` — preserved unchanged;
- `studyNotes`;
- `journalEntries`;
- `readingProgress`;
- `practiceSessions`.

Never destroy or rewrite existing readings during migration. Extend JSON export/import to a versioned schema that includes every new local-first object and validates limits before import.

### Unified Journal UI

Journal remains a top-level destination and becomes a record of several kinds of reflection:

- I Ching reading;
- free-form life entry;
- study reflection;
- practice reflection.

Use visible type labels and filters. Do not force every free entry to contain a hexagram. Search should cover titles, body, tags, source work, passage, concept, and linked notes.

## “Living with a Daoist mentality” without pretending there is one rulebook

Daoism contains diverse texts, interpretations, religious traditions, lineages, and modern practices. The app should help users explore ways of attending and responding, not certify them as Daoist.

### Daily-life interaction pattern

Each scenario uses four stages:

1. **Notice** — what is actually happening, before interpretation?
2. **Allow** — what tension, uncertainty, or limit can remain unresolved for a moment?
3. **Respond** — what is the least forced adequate action?
4. **Reflect** — what changed when the response changed?

Example topics:

- pushing a conversation after it has closed;
- confusing delay with failure;
- adding complexity to solve discomfort;
- acting from status anxiety;
- knowing when enough is enough;
- meeting conflict without either domination or avoidance.

These are reflective exercises, not moral tests. Responses are saved only when the user chooses.

### Content labels

Every lesson or practice should declare its scope:

- **Primary-text reflection**;
- **Historical Daoist practice**;
- **Later lineage tradition**;
- **Modern introductory exercise**;
- **Yi Path editorial reflection**;
- **Contested connection**.

This is especially important for qigong, Taiji, Chinese medicine, meditation systems, the Yijing, and modern wellness adaptations.

## Interactive practice player

The practice player is a reusable state machine, not a decorative timer.

### Session states

```text
Introduction → Setup and safety → Duration/sound choice → Begin
→ Guided phases → Pause/resume or exit → Quiet close
→ Optional reflection → Save locally
```

Every state is deep-link safe where practical, keyboard accessible, and recoverable after an accidental navigation. The user can exit immediately at all times.

### First practice: settling breath

Start with a conservative, modern introductory practice rather than claiming to teach an advanced historical Daoist breathing method.

1. Choose 1, 3, or 5 minutes.
2. Sit or stand comfortably.
3. Breathe naturally; do not force depth or hold the breath.
4. Follow a slow visual expansion and release only if comfortable.
5. Pause or stop if dizzy, uncomfortable, or short of breath.
6. Finish with silence and one optional reflection question.

Do not advertise medical benefits. Advanced breath retention, energy circulation, neidan, or condition-specific instruction requires domain review and, where appropriate, a qualified teacher.

### Visual choreography

The practice combines three restrained visual layers:

1. **Primary guide:** an SVG ink circle, water ring, or opening/closing line form tied to the current phase.
2. **Atmosphere:** existing bamboo/landscape depth moving at very low amplitude.
3. **Progress:** an accessible text timer and stable progress track; never colour alone.

Pressing **Begin** should visibly initiate the scene:

- the page chrome recedes slightly;
- the guide settles into the centre;
- ambient sound fades in only if enabled;
- instruction copy crossfades in place;
- controls remain visible and usable.

On pause, animation freezes at its current visual state, audio fades quickly, and the Pause control becomes Resume. On exit, the scene returns to the practice introduction without losing an already written reflection.

### Motion rules

- Use SVG, CSS transforms, and opacity for the main practice guide.
- Use `requestAnimationFrame` only for progress values that truly need per-frame updates.
- Keep controls responsive within 100ms.
- Never block Pause or Exit during animation.
- Reduced-motion mode uses text cues, a non-pulsing progress bar, and static phase illustrations.
- Do not make the user synchronise their body precisely to an animation.
- Avoid infinite decorative motion outside an active, user-started practice.

## Graphics system

Yes, the graphics can be created as part of implementation.

### Recommended asset mix

- **Core interactive diagrams:** hand-authored React SVG components so they are responsive, themeable, accessible, and crisp.
- **Atmospheric line art:** SVG paths and masks matching the existing bamboo/history language.
- **Texture:** very subtle generated paper/ink raster assets in WebP/AVIF when vector is unsuitable.
- **Illustrative hero art:** AI-assisted concept generation may be used, followed by art direction and manual adaptation; it must not contain embedded text or stereotyped religious imagery.
- **Icons:** continue the existing Lucide family for interface controls.

### Initial visual vocabulary

- water finding a path;
- an empty bowl;
- an uncarved block;
- valley and opening;
- bamboo bending rather than breaking;
- ink dispersing in water;
- a doorway between fullness and space;
- broken and solid lines transforming without implying that Daoism and the Yijing are identical.

Avoid dragons, temple silhouettes, random Chinese calligraphy, Buddha imagery, glowing qi bodies, fantasy mountains, or decorative yin-yang symbols unless the exact context calls for them.

### Localisation rule

Graphics contain no baked-in language. All titles, labels, accessible descriptions, instructions, and captions remain HTML text drawn from the locale content pack.

## Music and sound system

> **Superseded direction:** Dao has no ambient or practice-bed soundtrack. Retain this section only as historical exploration. The implemented direction is the brief state-change cue policy in “Current sound decision” above.

Yes, the sound can be designed and implemented. The current project already synthesises ambient pads, bowls, pentatonic motifs, coin sounds, and history cues through Web Audio.

### Reusable audio architecture

Create semantic channels:

- `ambient` — continuous user-enabled atmosphere;
- `practiceBed` — active-practice sound layer;
- `guidanceCue` — phase transitions;
- `interactionCue` — button/selection feedback;
- `voice` — reserved for possible future narration, independently controllable.

All channels feed a master gain with preference-aware levels. Starting one practice stops or fades any previous practice graph so sounds never stack accidentally.

### Sound palette

- filtered air and water-like noise;
- low harmonic drone with very slow modulation;
- sparse bowl or wood cues;
- short brush/stone interaction sounds;
- optional licensed field recordings such as wind or water, only with explicit rights and compressed fallbacks.

Avoid generic spa loops, constant flute melodies, cinematic “Asian” clichés, loud success tones, or sounds on every tap.

### Behaviour

- No autoplay on route entry.
- Sound begins only after an explicit gesture.
- Remember the user’s setting without changing it for a practice.
- Fade on pause, exit, route change, and tab hide.
- Provide a visible sound toggle inside the player without duplicating the full Settings interface.
- Audio is never the only phase signal.
- Offer silent practice as a complete experience.
- Use lightweight audio graphs on coarse-pointer or lower-power devices, following the project’s existing pattern.

## Responsive and nine-language behaviour

### Navigation

`I Ching` and `Dao` are short, internationally recognisable labels and fit the existing five-item mobile structure more safely than many translated alternatives. The accessible label and page title can use the fuller established local form where appropriate.

The phone bar must support:

- 320px width as a stress case and 375px as a required production check;
- labels wrapping to two lines without increasing the bar unpredictably;
- safe-area bottom padding;
- 44px minimum touch targets;
- active state communicated by shape/weight as well as colour;
- no horizontal scrolling or hidden “More” item.

### Study and practice layouts

- Never use fixed card heights for translated long-form copy.
- Reserve roughly 35% expansion for German and Portuguese controls.
- Keep paragraph width independent from viewport width.
- Localise all timer, state, accessibility, error, and safety copy—not only visible headings.
- Verify Cyrillic and accented Latin characters in the actual Lora/Manrope font stack.
- Avoid uppercase long labels; let eyebrows wrap naturally.
- Use `Intl` for dates, durations, and search casing.

## Accessibility and safety

- All interaction has keyboard and visible-button alternatives.
- Practice state is announced without repeatedly reading the whole instruction.
- Pause, Resume, Sound, and Exit always have visible text or accessible names.
- Reduced motion is tested as a first-class experience.
- Screen readers receive textual phase and remaining-time information without rapid live-region spam.
- No instruction relies on colour, animation, sound, or vibration alone.
- Notes work without precise text selection through an **Add note to this paragraph** action.
- Focus returns to the originating passage after a note sheet closes.
- Breathing practices use modest, non-medical wording and a visible stop-if-uncomfortable instruction.
- Practices tied to a living religious lineage or potentially risky physical/energy technique require expert review before publication.

## Implementation architecture

### Pages

- `DaoPage` — hub and returning state.
- `DaoStartPage` — visual essay.
- `DaoStudyPage` — collection and search.
- `DaoReaderPage` — book/chapter reader.
- `DaoNotebookPage` — notes and notebooks.
- `DaoPracticesPage` — practice collection.
- `DaoPracticePlayerPage` — focused practice experience.

### Reusable components

- `StudyReader`
- `StudyTableOfContents`
- `PassageActions`
- `StudyNoteSheet`
- `NotebookList`
- `PracticePlayer`
- `BreathGuide`
- `PracticeControls`
- `PracticeReflection`
- `SourceDrawer`
- `ScopeBadge`

### Content/data separation

- UI labels remain in locale UI packs.
- Long-form Dao content lives in validated content files.
- Interactive practice definitions contain timing/state metadata but no component code.
- Source and rights records live beside content metadata.
- User notes, progress, entries, and sessions remain local IndexedDB data.

## Delivery roadmap

### Phase 0 — truth, scope, and rights

- Define Dao content taxonomy and scope labels.
- Build the claim ledger and quotation ledger.
- Choose the first legally usable text/excerpts.
- Review the first practice for historical honesty and physical safety.
- Lock navigation naming in all nine languages.

### Phase 1 — navigation and Dao home

- Replace Library/Learn navigation with I Ching/Dao.
- Add `/dao` and the editorial hub layout.
- Link existing Learn and Library content through the I Ching destination without destructive route moves.
- Add responsive and locale tests for the five-item phone bar.

### Phase 2 — notes and expanded Journal

- Add IndexedDB v2 stores and backward-safe migration.
- Add free-form, study, and practice journal entry types.
- Add paragraph notes and whole-work notes.
- Extend export/import and tests.

### Phase 3 — study reader

- Ship one reviewed collection with contents, progress, bookmarks, notes, source drawer, and responsive reader layouts.
- Verify rights and attribution in every displayed language.

### Phase 4 — first real practice

- Build the reusable practice state machine.
- Ship one settling-breath practice with silent and sound-enabled modes.
- Add reflection handoff to Journal.
- Verify pause, exit, tab hide, reduced motion, and screen reader behaviour.

### Phase 5 — graphics and audio polish

- Create the SVG visual vocabulary.
- Extend the existing Web Audio engine into semantic channels.
- Produce or license any field recordings/textures.
- Profile low-power phone performance and loading.

### Phase 6 — content depth and nine-language release

- Add concepts, texts, traditions, practices, and connection modules one reviewed unit at a time.
- Run meaning, naturalness, UI-context, mobile, accessibility, source, and rights review for every locale.

## Recommended first complete slice

The first release should prove the complete loop rather than build a huge empty library:

1. `/dao` hub;
2. four-chapter “Start here” essay;
3. one legally usable short text or curated passage set;
4. passage notes and one whole-work notebook;
5. free-form and study Journal entries;
6. one safe settling-breath practice;
7. one coherent SVG scene family;
8. existing ambient engine plus two practice cues;
9. responsive shells and UI copy in all nine languages;
10. long-form translations only after the English content and sources are locked.

## Definition of done

- Dao is visibly separate from I Ching on desktop and phone.
- The phone bar remains usable at 320px and natural in all nine languages.
- A user can read, annotate, write a whole-entry reflection, practise, and return to the exact source.
- Existing I Ching readings survive database migration unchanged.
- The first practice works fully with sound off and reduced motion on.
- Graphics are responsive, accessible, text-free, and culturally restrained.
- Audio is optional, explicit-start, non-stacking, and suspended when inactive.
- Every quote and factual claim is traceable to reviewed sources.
- Every full text or excerpt has a rights decision.
- No streak, score, supernatural certainty, medical promise, or single definition of “a Daoist life” is imposed on the user.
