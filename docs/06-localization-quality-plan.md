# Yi Path localization quality plan

## Goal

Make every supported language feel as though Yi Path was written thoughtfully in that language: natural, calm, clear, and consistent, while preserving the meaning of the English editorial source and the canonical identity of the I Ching material.

The app supports nine languages:

- English (`en`)
- Bulgarian (`bg`)
- Russian (`ru`)
- German (`de`)
- Italian (`it`)
- French (`fr`)
- Spanish (`es-ES`)
- European Portuguese (`pt-PT`)
- Polish (`pl-PL`)

English is the semantic source for the modern editorial layer, but it must also remain polished and internally consistent. Classical Chinese, Chinese characters, pinyin, line order, hexagram numbers, trigrams, and casting mechanics are canonical data and must not be altered during a translation review unless a separately verified factual error is found.

## Core principle

Do not regenerate or mass-retranslate a language pack.

Preserve good existing language. Change a string only when there is a clear reason: incorrect meaning, unnatural phrasing, literal translation, inconsistent terminology or form of address, grammar, punctuation, untranslated text, broken interpolation, misleading tone, or poor fit in the interface.

Natural equivalence matters more than matching English word order. Each locale may use the formality, rhythm, and sentence structure that sound most natural in that language, while keeping the same practical meaning.

## Voice standard

Every language should feel:

- calm and contemplative;
- warm but not sentimental;
- contemporary and natural;
- concise enough for a mobile interface;
- respectful without sounding bureaucratic;
- invitational rather than commanding;
- non-dogmatic and free of fortune-telling promises;
- consistent about recurring concepts and forms of address.

The languages do not need to imitate one another grammatically. For example, a natural Spanish form of address does not have to match Russian or Bulgarian mechanically.

## Review order

### Milestone 1: Russian, Bulgarian, and Spanish

Review the three languages as one milestone, but edit and verify them one at a time:

1. Russian
2. Bulgarian
3. Spanish (`es-ES`)
4. Cross-language consistency and final mobile verification

Russian is the pilot because it uses the built-in translation architecture and provides a clear first test of the process. Bulgarian follows through the same architecture. Spanish then validates the process against the separate editorial and UI locale packs used by the remaining extended languages.

### Milestone 2: Remaining languages

After the first milestone and any improvements to the process:

1. German
2. Italian
3. French
4. European Portuguese
5. Polish
6. Final nine-language consistency audit

The order inside Milestone 2 can change if a specific language has a release priority or known problems.

## Per-language workflow

### 1. Inventory all user-facing text

Locate every source used by the locale, including:

- the 64 hexagram editorial cards;
- hexagram titles and recurring terminology;
- primary interface labels and buttons;
- casting instructions for digital coins, physical coins, yarrow stalks, and direct entry;
- journal and library copy;
- history and learning copy;
- settings, privacy, sound, support, and feedback copy;
- image and PDF export text;
- validation, empty-state, loading, and error messages;
- any locale-specific text embedded directly in components.

Do not assume that all languages use the same file layout. Russian and Bulgarian are built into the core corpus and translation source, while Spanish and the other extended languages use separate locale packs.

### 2. Lock canonical and recurring terminology

Create or confirm a language glossary covering:

- all 64 established hexagram names;
- trigrams;
- yin and yang;
- changing and stable lines;
- primary and resulting hexagrams;
- digital coins, physical coins, yarrow stalks, and direct entry;
- journal, reading, reflection, and recurring action labels.

Hexagram names should follow established usage in the target language, not an improvised literal translation of the English editorial title. When reputable traditions use different names, choose the clearest form compatible with Yi Path's tone and record the alternative in the review notes.

Canonical Chinese characters and tone-marked pinyin remain shared across locales. Transliteration into Cyrillic may appear in a localized title where that is the established presentation, but it must not replace the canonical source fields.

### 3. Meaning and naturalness review

Review each string in two distinct passes:

1. **Meaning pass:** confirm that no practical meaning, qualification, warning, or relationship has been added, lost, or reversed.
2. **Native-language pass:** remove English syntax, translationese, awkward collocations, unnecessary repetition, inconsistent register, and unnatural punctuation.

The review should retain the reflective openness of the source. It must not turn suggestions into predictions, psychological diagnoses, moral judgments, or absolute instructions.

### 4. Interface and mobile review

Check the language in the running application, not only in data files:

- buttons remain understandable without unnecessary abbreviations;
- titles and questions wrap gracefully;
- navigation labels fit common phone widths;
- no important text is clipped or hidden behind fixed controls;
- placeholders, names, dates, numbers, and punctuation render correctly;
- capitalization follows the target language rather than English habits;
- screen-reader labels remain meaningful.

Prefer a small layout adjustment when a natural translation genuinely needs more room. Do not damage the language merely to force it into an English-sized container.

### 5. Technical safety checks

For every language:

- preserve every required translation key;
- preserve interpolation variables, markup, and internal IDs exactly;
- detect empty values and accidental English fallbacks;
- verify exactly 64 ordered editorial cards;
- verify required reflection questions and line reflections;
- lock approved canonical names and important glossary entries in tests;
- run `npm.cmd run lint`;
- run `npm.cmd test`;
- run `npm.cmd run build`;
- inspect the final diff for unrelated edits.

### 6. Handle uncertainty explicitly

High-confidence corrections can be applied directly. A short decision list should be created only for genuinely ambiguous cases, such as:

- two established translations of one hexagram name;
- a deliberate choice between formal and informal address;
- wording whose philosophical nuance materially changes between alternatives;
- terminology that differs between regional variants.

Do not create a large approval list for ordinary grammar or obvious translation errors.

## Definition of done for one language

A language is complete when:

- all user-facing surfaces have been inventoried;
- all 64 names have been checked and terminology is consistent;
- every editorial string has passed meaning and naturalness review;
- interface and feature copy has been reviewed in context;
- no unexplained English leakage remains;
- placeholders and internal identifiers are intact;
- representative mobile flows have been inspected;
- lint, tests, and production build pass;
- only genuine ambiguities remain documented;
- the locale's review status is updated honestly.

## Scope estimate

Each language contains roughly:

- 64 hexagram titles;
- about 750–830 editorial paragraphs, questions, and line reflections;
- a few hundred interface and feature strings.

This is an editorial audit of approximately one thousand user-facing text units per language, not one thousand expected rewrites. Much of the existing material may already be good and should remain untouched.

The safest unit of work is one language at a time, divided into:

1. terminology and hexagram names;
2. interface and feature copy;
3. the 64 editorial cards;
4. mobile and automated verification.

Completing Russian before changing Bulgarian gives the project a tested pattern and exposes any missing tooling. Completing Bulgarian before Spanish keeps the two built-in locales together. Spanish then confirms that the pattern works for the extended packs before it is reused for the remaining five languages.

## Progress tracker

| Language | Terminology | Interface | Editorial cards | Mobile check | Tests/build | Status |
|---|---:|---:|---:|---:|---:|---|
| English | — | — | — | — | — | Semantic source; ongoing editorial maintenance |
| Russian | ☑ | ☑ | ☑ | ☑ | ☑ | Complete — high-confidence editorial review and verification |
| Bulgarian | ☐ | ☐ | ☐ | ☐ | ☐ | Planned second |
| Spanish | ☐ | ☐ | ☐ | ☐ | ☐ | Planned third |
| German | ☐ | ☐ | ☐ | ☐ | ☐ | Milestone 2 |
| Italian | ☐ | ☐ | ☐ | ☐ | ☐ | Milestone 2 |
| French | ☐ | ☐ | ☐ | ☐ | ☐ | Milestone 2 |
| Portuguese (`pt-PT`) | ☐ | ☐ | ☐ | ☐ | ☐ | Milestone 2 |
| Polish | ☐ | ☐ | ☐ | ☐ | ☐ | Milestone 2 |

## Reusable outcome

After Russian, Bulgarian, and Spanish are complete, retain:

- approved per-language terminology glossaries;
- regression tests for canonical names and critical recurring terms;
- automated structural and fallback checks;
- a concise record of intentional language-specific decisions;
- this checklist for all remaining locale audits.

A dedicated localization skill or larger automation should be created only if the first milestone reveals repeated work that cannot be captured cleanly in tests, scripts, glossaries, and this document.
