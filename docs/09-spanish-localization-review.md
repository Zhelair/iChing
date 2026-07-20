# Spanish localization review

**Locale:** European Spanish (`es-ES`)  
**Review date:** 2026-07-20  
**Scope:** Complete editorial and interface review  
**Status:** High-confidence editorial review complete; optional native-editor sign-off remains

## What was reviewed

- all 64 hexagram titles;
- all 64 modern editorial cards, including core threads, context, reflection questions, and changing-line reflections;
- primary navigation and common actions;
- home, method selection, casting, reading result, library, learning, and settings copy;
- digital coins, ordinary coins, yarrow-stalk practice, and manual entry;
- journal, history, privacy, support, image export, and PDF export copy;
- accessibility labels, empty states, errors, and backup/restore language.

The English editorial source was used to verify meaning. Existing Spanish was preserved whenever it was accurate and natural. Changes were limited to mistranslations, false friends, inconsistent address, English-shaped syntax, awkward collocations, unclear imagery, and wording that did not fit Yi Path's calm voice.

## Approved language standard

- Use contemporary European Spanish that remains readily understandable across the Spanish-speaking world.
- Address the reader consistently as informal singular `tú`.
- Prefer direct, concrete verbs over abstract noun phrases and literal English constructions.
- Preserve contemplative imagery without making the language ornate or obscure.
- Keep suggestions invitational and non-dogmatic; never turn them into predictions.
- Use Spanish angle quotation marks (`«…»`) where quotation marks are needed.
- Keep canonical Chinese characters and tone-marked pinyin in the shared source fields.

The informal register was chosen because Yi Path is a quiet, personal practice. The existing editorial cards already used `tú`; bringing the interface into the same register removes the previous split between an intimate editorial voice and a formal, institutional UI.

## Approved recurring terminology

| English concept | Spanish term |
|---|---|
| reading | lectura |
| primary hexagram | hexagrama principal |
| resulting hexagram | hexagrama resultante |
| changing line | línea mutante |
| stable line | línea estable |
| digital coins | monedas digitales |
| physical coins | monedas corrientes |
| yarrow stalks | tallos de milenrama |
| yarrow method | práctica con tallos de milenrama |
| direct entry | entrada manual |
| backup | copia de seguridad |
| Xi Ci | «Xici» |

`Hexagrama resultante` and `línea mutante` are both established, natural Spanish terms and are used consistently throughout the reading flow. The text explicitly describes the resulting hexagram as a structural direction or emerging possibility, not a promised future.

`Monedas corrientes` replaces `monedas reales`, which created an unnecessary contrast between “real” and digital. `Entrada manual` replaces the literal and less informative `entrada directa`.

## Representative title decisions

- `Sòng` — `Conflicto y límites`
- `Shī` — `Esfuerzo colectivo y disciplina`
- `Tóng Rén` — `Comunidad a cielo abierto`
- `Gǔ` — `Reparar lo deteriorado`
- `Shì Kè` — `Morder para abrir paso`
- `Bō` — `Despojo`
- `Dà Guò` — `Gran exceso`
- `Lí` — `La llama que se adhiere`
- `Guài` — `Ruptura decisiva`
- `Zhèn` — `El choque que despierta`
- `Guī Mèi` — `La doncella que se casa`
- `Duì` — `Intercambio gozoso`
- `Xiǎo Guò` — `Pequeño exceso`
- `Wèi Jì` — `Antes de concluir`

The titles remain original Yi Path editorial titles, not copied translations from a published edition. Established Spanish editions and reference lists were used to verify identity and terminology, while the app's explanatory prose remains original.

## Reference hierarchy

Spanish terminology, publication history, and hexagram identity were cross-checked against:

- Chinese Text Project, received-text identity and King Wen sequence: <https://ctext.org/book-of-changes>
- Universitat Autònoma de Barcelona translation database, Spanish publication history of *I Ching. El libro de las mutaciones*: <https://dtieao.uab.cat/txicc/lite/traducciones/i-ching-el-libro-de-las-mutaciones/>
- Biblioteca Nacional de España bibliographic record for the Wilhelm/Vogelmann Spanish edition: <https://datos.bne.es/edicion/bimo0001009542.html>
- *I Ching o El libro de los cambios*, direct Spanish translation from Chinese, Alianza Editorial preview: <https://alianzaeditorial.es/primer_capitulo/i-ching-o-el-libro-de-los-cambios.pdf>

These references informed terminology and identity only. Yi Path's modern explanatory prose remains original editorial material.

## Technical protection

- Spanish editorial content is edited in `content/locales/es.json`.
- Spanish interface and feature copy is edited in `src/i18n/locales/es.json`.
- The test suite locks all 64 reviewed Spanish titles.
- Interface tests lock the critical recurring terminology and reject a return to `Monedas reales`, `Entrada directa`, `Taller de tallos de milenrama`, and selected formal-address regressions.
- Structural tests continue to require 64 complete cards, all changing-line reflections, and every live interface key.

## Verification completed

- `npm.cmd test`: 61 tests passed across 7 test files.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: production build passed.
- Mobile viewport review at 390 × 844: Home, Reading, Learn, Library, hexagram 13, Journal, Settings, and Support.
- No horizontal overflow, framework error overlay, blank state, or repeatable failed request was found in the reviewed routes.

## Optional final assurance

The locale has received a complete high-confidence language and meaning audit. A professional native Spanish editor may still provide publication-level sign-off or taste-level adjustments, but the locale no longer depends on that review for basic correctness, consistency, or natural readability.
