# Extended editorial locale packs

This folder contains the six modern-language editorial packs that are loaded on demand:

- `de.json` — German (`de-DE`)
- `it.json` — Italian (`it-IT`)
- `fr.json` — French (`fr-FR`)
- `es.json` — Spanish (`es-ES`)
- `pt-PT.json` — European Portuguese
- `pl.json` — Polish (`pl-PL`)

Each pack translates only Yi Path's modern editorial layer: title, core thread, context, reflection questions, and line reflections. The received Classical Chinese judgment and line statements remain in the versioned core corpus and are never translated or replaced here.

Every pack is marked `ai-assisted-editorial-draft-needs-native-review`. The status is part of the data contract and is shown in the source/editorial note. Before a public release, each locale needs a native-language editorial review and a subject-matter review.

The browser validates that a pack has exactly 64 ordered cards with complete required fields before activating it. Extended packs are split from the initial application bundle and fetched only when their language is selected.
