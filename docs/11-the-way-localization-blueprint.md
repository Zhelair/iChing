# Yi Path — “The Way of Change” localization blueprint

**Scope:** Natural, consistent publication of the new lesson in all nine supported languages  
**Locales:** English, Bulgarian, Russian, German, Italian, French, Spanish, European Portuguese, and Polish  
**Depends on:** `docs/06-localization-quality-plan.md` and `docs/10-the-way-experience-plan.md`

## Goal

Every visitor should encounter the same careful meaning and calm voice without feeling that they are reading translated English. Completeness is necessary, but it is not quality.

The new lesson adds a special difficulty: it contains philosophical terms, short interaction labels, reflective prompts, historical qualifications, and time-based practice copy. These need different translation treatment while remaining part of one experience.

## Current baseline

The project supports nine locales today.

| Locale | Existing project status | Requirement for the new lesson |
| --- | --- | --- |
| English | Semantic source | New master copy and source audit |
| Bulgarian | High-confidence review complete | New lesson requires a fresh review |
| Russian | High-confidence review complete | New lesson requires a fresh review |
| Spanish | High-confidence review complete | New lesson requires a fresh review |
| German | Existing AI-assisted draft; broader review pending | New lesson remains draft until reviewed in context |
| Italian | Existing AI-assisted draft; broader review pending | New lesson remains draft until reviewed in context |
| French | Existing AI-assisted draft; broader review pending | New lesson remains draft until reviewed in context |
| Portuguese (`pt-PT`) | Existing AI-assisted draft; broader review pending | New lesson remains draft until reviewed in context |
| Polish | Existing AI-assisted draft; broader review pending | New lesson remains draft until reviewed in context |

Existing review status must not automatically transfer to new content. Bulgarian, Russian, and Spanish are strong baselines, but “The Way of Change” introduces a new terminology and source-review surface.

## Source-language contract

English is the semantic master for Yi Path’s modern editorial layer, not the canonical authority for Chinese concepts.

Before translation begins:

1. Lock the chapter IDs, order, interactions, and source claims.
2. Finalise the English copy for meaning, tone, and length.
3. Create a shared term record for each Chinese concept.
4. Record which wording is an explanatory gloss and which is a title or historical name.
5. Mark intentionally open language so translators do not “strengthen” it into advice or prediction.

Canonical Chinese characters, tone-marked pinyin, hexagram numbers, line order, and casting mechanics are shared facts. A translator may localise the surrounding explanation but must not silently alter them.

## Research and source hierarchy

No AI overview, Reddit post, Wikipedia paragraph, or search-result summary is accepted as evidence for a published claim. These can reveal a question worth investigating, but every factual statement must resolve to the source ledger below.

### Layer 1 — primary texts

Use the original passages to identify what a text actually says and where it says it:

- [Book of Changes / Zhouyi — Chinese Text Project](https://ctext.org/book-of-changes/ens)
- [Daodejing — Chinese Text Project](https://ctext.org/dao-de-jing/)
- [Zhuangzi — Chinese Text Project](https://ctext.org/zhuangzi)

The Chinese Text Project is valuable for locating and comparing passages. Its available English rendering is not automatically the final modern English wording; important passages must be checked against more than one respected scholarly translation and commentary.

### Layer 2 — scholarly interpretation and textual history

Use peer-reviewed or specialist academic references to avoid collapsing complex traditions into slogans:

- [Chinese Philosophy of Change (Yijing) — Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/entries/chinese-change/)
- [Daoism — Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/entries/daoism/)
- [Religious Daoism — Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/entries/daoism-religion/)
- [Laozi — Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/entries/laozi/)
- [Zhuangzi — Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/entries/zhuangzi/)
- Edward L. Shaughnessy, [*Unearthing the Changes*](https://cup.columbia.edu/book/unearthing-the-changes/9780231533300/), Columbia University Press.
- Edward Slingerland, *Effortless Action: Wu-wei as Conceptual Metaphor and Spiritual Ideal in Early China*, Oxford University Press.

These sources are used comparatively. A single encyclopedia entry or scholar does not become Yi Path’s unquestionable doctrine, especially where interpretations are contested.

### Layer 3 — archaeology and material history

Use museum and university collections for claims about physical objects, dates, inscriptions, and divination practice:

- [Oracle Bone, Shang Dynasty — Smarthistory / Smithsonian](https://smarthistory.org/oracle-bone/)
- [Oracle bone — Metropolitan Museum of Art](https://www.metmuseum.org/art/collection/search/60695)

Material-history sources must not be stretched into unsupported claims about the direct origin of trigrams or later philosophical schools.

### Layer 4 — target-language editions and terminology

For each of the nine languages, consult reputable published translations and academic reference works in that language. Their purpose is to establish natural book titles, transliterations, philosophical vocabulary, quotation conventions, and established scholarly usage—not to replace the shared claim ledger with nine different factual narratives.

Prefer:

- university-press or academically annotated editions;
- recognised national publishers of Chinese classics;
- university and national-library catalogues;
- scholarly dictionaries and encyclopedias;
- existing reviewed terminology records in `docs/07-russian-localization-review.md`, `docs/08-bulgarian-localization-review.md`, and `docs/09-spanish-localization-review.md`.

### Layer 5 — human review

The final naturalness and terminology decision belongs to a qualified native-language reviewer. For philosophically sensitive passages, the ideal reviewer is both a native editor and familiar with Chinese philosophy or the relevant translation tradition.

### Claim ledger

Before a paragraph enters translation, record each non-trivial claim in a table or structured file:

```text
claim_id
exact English claim
claim type: primary-text / historical / interpretive / Yi Path reflection
primary passage, if any
two supporting scholarly sources for disputed or interpretive claims
confidence and known disagreement
approved wording and prohibited overstatement
reviewer and review date
```

The English lesson is written from this ledger. All other languages translate the approved meaning and qualification, then use their own reputable editions to choose natural terminology. They do not independently translate a Google result or an AI answer.

### Quote provenance rule

Every direct quotation shown in Yi Path must record:

- original work;
- chapter, section, or passage location;
- translator;
- edition and year;
- source language;
- rights/licence status;
- whether the displayed wording is a direct quotation, a close translation, or Yi Path’s paraphrase.

Do not publish floating “ancient wisdom” quote cards with no traceable edition. When translations differ materially, either choose one named translation with a short note or paraphrase the shared idea and link to the source discussion.

## Voice standard

The voice in every language should be:

- calm, lucid, and humane;
- invitational rather than commanding;
- concrete before abstract;
- philosophically modest;
- respectful without sounding ceremonial or religious by default;
- contemporary, not faux-archaic;
- free from wellness clichés and fortune-telling certainty.

Preferred pattern:

> Notice what is moving. You do not need to force an answer.

Avoid patterns equivalent to:

> The universe is telling you to surrender.  
> Activate your energy and manifest the correct path.  
> Ancient Chinese wisdom proves that everything happens for a reason.

## Shared terminology record

Create one structured record per term rather than relying on search-and-replace.

| Concept ID | Shared form | First-use pattern | Editorial warning |
| --- | --- | --- | --- |
| `yijing` | 易經 · Yìjīng | “I Ching (Yijing)” or the established local book title, then the chosen short form | Do not switch randomly among I Ching, Yi Jing, Yijing, and Book of Changes. |
| `dao` | 道 · dào | Established local form plus a brief gloss such as “the Way” where natural | Do not reduce it to a single supernatural force. |
| `yin` | 陰 · yīn | Established local form | Never equate with evil, weakness, or a fixed gender role. |
| `yang` | 陽 · yáng | Established local form | Never equate with good, superiority, or a fixed gender role. |
| `wuwei` | 無為 · wúwéi | Local established spelling + “unforced/responsive action” | “Doing nothing” alone is misleading. |
| `ziran` | 自然 · zìrán | Local established spelling + “naturalness / so-of-itself” | Modern “nature” may be too narrow. |
| `qi` | 氣 · qì | Use only if the approved lesson still needs it | Do not make medical or scientific claims. |
| `zuowang` | 坐忘 · zuòwàng | Use only in a sourced historical note | Do not imply it is required before a reading. |

For every target language, record:

- approved display term;
- accepted alternative spellings;
- rejected forms and why;
- grammatical gender/case behaviour where relevant;
- first-use explanatory phrase;
- short form for later chapters;
- sources or established editions consulted.

Do not invent local transliterations from English. Follow reputable usage in the target language, while preserving characters and tone-marked pinyin in the glossary or source layer.

## Copy classes and how to translate them

### 1. Navigation and controls

Examples: Enter, Replay, Start, Pause, Resume, Exit, Next concept.

- Optimise for immediate comprehension and compact UI fit.
- Use the established product form of address.
- Prefer the standard platform verb over a literary synonym.
- Test every label beside its icon and state.

### 2. Chapter titles and eyebrows

- Preserve the image and rhythm, not English word order.
- A title may be rewritten substantially if a literal version sounds like a slogan or translation.
- Keep title length within two or three mobile lines at 375px.

### 3. Explanatory paragraphs

- Preserve meaning and qualification before sentence structure.
- Break long English sentences when the target language becomes heavy.
- Keep distinctions such as “may suggest,” “can be read as,” and “not a promised future.”
- Do not replace simple language with academic jargon.

### 4. Reflective prompts

- They must sound like questions a thoughtful native speaker might genuinely ask themselves.
- Avoid therapy language unless the source explicitly uses it.
- Avoid imperatives that create blame or promise an outcome.

### 5. Historical notes and sources

- Preserve dates, dynasties, textual titles, attribution uncertainty, and phrases such as “tradition attributes.”
- Do not “smooth away” scholarly caution.
- Localise source names only where an established local title exists; retain a recognisable original title in attribution metadata.

### 6. Timed practice copy

- Keep instructions short enough to read before the phase changes.
- Never rely on audio alone.
- Localise duration and number formatting with `Intl` where possible.
- Verify Start, Paused, Resume, Complete, and Exit states separately.

## Per-locale workflow

### Step 1 — inventory

Export every user-facing string for the feature:

- I Ching and Dao navigation labels;
- `/iching` hub entrances and nested navigation;
- route title, introduction, and duration;
- six chapters;
- interaction controls and state announcements;
- scenario choices and reveals;
- breath-practice states;
- glossary;
- source labels;
- error/loading/fallback copy;
- accessible names and descriptions.

No text should live only inside an SVG.

### Step 2 — terminology lock

Review the shared terms against reputable dictionaries, translations, local editions, and established scholarly usage. Record decisions before translating full paragraphs.

### Step 3 — first translation

Translate the whole journey in sequence. A chapter-by-chapter isolated translation misses recurring imagery and causes inconsistent address, tense, and terminology.

### Step 4 — meaning review

Compare against the locked English meaning and the claim/source sheet.

Check specifically for:

- stronger certainty than the source;
- weakened historical qualification;
- good/evil readings of yin and yang;
- “do nothing” readings of wúwéi;
- mystical or scientific claims not present in the source;
- advice that sounds medical, psychological, financial, or prophetic.

### Step 5 — naturalness review

Read the target copy without looking at English.

Ask:

- Would a native speaker phrase this thought this way?
- Does the voice remain calm without becoming vague?
- Are titles memorable rather than literal?
- Does the text maintain one consistent relationship with the reader?
- Are punctuation, quotation marks, spacing, capitalisation, and transliteration native to the language?

### Step 6 — interaction-context review

Review every string in the working UI at these minimum widths:

- 375×812;
- 390×844;
- 768×1024;
- 1440×900.

Check chapter titles, four-phase controls, choice cards, practice controls, bottom navigation, glossary terms, source links, and focus outlines. Never solve long translations by reducing body text below 16px.

### Step 7 — accessibility-language review

- Accessible names describe the action, not the icon.
- Replay labels include the chapter title.
- State announcements are short and do not repeat the whole chapter.
- Reduced-motion copy still explains what changed.
- Language switching updates `lang` correctly.
- Chinese and pinyin spans may use a more specific language tag where screen-reader behaviour benefits.

### Step 8 — technical verification

- Validate all locale files against the same schema.
- Assert identical chapter IDs, interaction types, source IDs, and glossary IDs.
- Reject missing strings and unintended English fallback.
- Test interpolation tokens and apostrophes/quotes.
- Run type-check, unit tests, build, and browser checks in every locale.
- Capture locale-specific screenshots for review rather than approving from JSON alone.

### Step 9 — status and sign-off

Use honest, feature-level status:

- `draft` — structurally complete but not fully reviewed;
- `reviewed` — meaning, naturalness, and UI-context checks complete at high confidence;
- `native-approved` — reviewed by a qualified native-language editor familiar with the content domain.

The application may ship reviewed content while still noting optional native sign-off internally. It must not call an AI-assisted draft publication-ready.

## Locale-specific attention points

These are review prompts, not automatic translation rules.

### English

- Choose one dominant naming convention for Yijing/I Ching.
- Avoid generic meditation-app language.
- Keep scholarly caution readable rather than academic.

### Bulgarian

- Follow the established terminology recorded in the Bulgarian review.
- Check Cyrillic transliteration, article use, and natural imperative softness.
- Re-check compact mobile labels even though the wider locale has already been reviewed.

### Russian

- Follow the established terminology recorded in the Russian review.
- Avoid bureaucratic or overly solemn phrasing.
- Check that reflective questions do not sound like commands or diagnoses.

### German

- Plan for compound nouns and 25–35% expansion in controls and titles.
- Prefer natural sentence structure over mirroring English front-loaded clauses.
- Decide the reader form of address once and apply it consistently.

### Italian

- Preserve warmth without becoming promotional or mystical.
- Review the rhythm of chapter titles and avoid excessive nominal phrases.
- Check elision, apostrophes, and gender agreement in dynamic copy.

### French

- Choose one form of address and maintain it through controls and reflective copy.
- Use French punctuation and spacing conventions.
- Avoid anglicised philosophical or UI phrasing where a standard French expression exists.

### Spanish

- Reuse the approved Spanish terminology and voice standard.
- Keep a neutral international register compatible with the existing product choice.
- Treat the new philosophical glossary as a fresh review even though the locale is otherwise high-confidence.

### European Portuguese

- Keep `pt-PT` distinct from Brazilian Portuguese in vocabulary, clitics, address, and UI verbs.
- Expect expansion in explanatory copy.
- Verify every compact control with a European Portuguese reviewer.

### Polish

- Check case inflection when philosophical terms appear in sentences.
- Avoid dense chains of abstract nouns.
- Verify title wrapping, verb aspect, and natural reflective questions.

## Layout resilience rules for nine languages

- No fixed-width text buttons.
- Allow labels to wrap to two lines where necessary.
- Reserve at least 35% expansion in chapter navigation and scenario controls.
- Use content-driven card height; never truncate chapter copy.
- Keep icon and label aligned when the label wraps.
- Do not embed text into illustrated assets.
- Test Cyrillic diacritics and Latin accents with the actual Lora/Manrope fonts.
- Avoid uppercase paragraphs; uppercase eyebrows must use language-aware casing and generous tracking.
- Use locale-aware quotes, dates, numbers, and duration formatting.

## Proposed content-file contract

Recommended directory:

```text
content/lessons/the-way/
  en.json
  bg.json
  ru.json
  de.json
  it.json
  fr.json
  es.json
  pt-PT.json
  pl.json
  sources.json
  schema.json
```

Keep interactive logic out of the translation files. Locale files contain copy and review metadata; the component code maps the shared `interaction` ID to a tested component.

Each locale file should record:

```json
{
  "locale": "en",
  "variant": "the-way-v1",
  "status": "reviewed",
  "reviewedAt": "2026-07-21",
  "reviewNotes": "docs/localization/the-way-en.md",
  "chapters": []
}
```

Do not copy the current hard-coded extended-locale status blindly. Feature-level metadata should describe the real status of this lesson.

## Automated protection

Add tests that verify:

1. all nine files exist;
2. every file passes the schema;
3. chapter, glossary, and source IDs match English exactly;
4. control and accessibility labels are non-empty;
5. no target locale contains accidental long English fallback;
6. Chinese characters, pinyin, numbers, and source IDs are unchanged where canonical;
7. reflection prompts retain question punctuation appropriate to the locale;
8. all source links referenced by a chapter exist in `sources.json`;
9. the page renders each locale without horizontal overflow at 375px;
10. changing locale does not reset the current chapter or sound/motion preference.

Automated tests cannot certify naturalness. Their job is to prevent structural regression after editorial approval.

## Review tracker for the new lesson

| Language | Glossary | Meaning | Naturalness | UI/mobile | A11y | Tests/build | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| English | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Source drafting |
| Bulgarian | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Not started |
| Russian | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Not started |
| German | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Not started |
| Italian | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Not started |
| French | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Not started |
| Spanish | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Not started |
| Portuguese (`pt-PT`) | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Not started |
| Polish | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | Not started |

## Definition of done for one locale

A locale is complete for “The Way of Change” only when:

- the glossary and naming convention are recorded;
- every string has passed a meaning review;
- the complete journey reads naturally without reference to English;
- historical qualifications and reflective openness are preserved;
- every control and state has been reviewed in the real interface;
- mobile, desktop, keyboard, reduced-motion, and sound-off states work;
- no unexpected English fallback remains;
- type-check, tests, and production build pass;
- the feature-level status and review notes are accurate.

## Recommended order

1. English source and claim review.
2. Bulgarian, Russian, and Spanish, using the existing reviewed voice standards to refine the workflow.
3. German and French, because expansion and form-of-address choices will stress the layout early.
4. European Portuguese, Italian, and Polish.
5. Final cross-locale visual sweep and terminology consistency audit.

This order is for quality and layout discovery, not importance. The feature should be considered globally complete only after all nine rows meet the definition of done.
