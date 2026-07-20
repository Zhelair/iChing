# Bulgarian localization review

**Locale:** Bulgarian (`bg`)  
**Review date:** 2026-07-20  
**Scope:** Complete editorial and interface review  
**Status:** High-confidence editorial review complete; optional native-editor sign-off remains

## What was reviewed

- all 64 hexagram titles;
- all 64 modern editorial cards, including core threads, context, reflection questions, and changing-line reflections;
- primary navigation and common actions;
- home, method selection, casting, reading result, library, learning, and settings copy;
- digital coins, ordinary coins, yarrow-stalk practice, and direct entry;
- journal, history, privacy, support, image export, and PDF export copy;
- accessibility labels, empty states, errors, and backup/restore language.

The English editorial source was used to verify meaning. Existing Bulgarian text was preserved whenever it was accurate and natural. Changes were limited to clear mistranslations, grammatical problems, inconsistent terminology, English-shaped syntax, awkward collocations, and wording that did not fit Yi Path's calm voice.

## Approved language standard

- Address the reader consistently with polite plural verb forms.
- Prefer concrete Bulgarian verbs and natural sentence rhythm over English noun chains.
- Preserve contemplative imagery without copying English syntax mechanically.
- Keep suggestions invitational and non-dogmatic; never turn them into predictions.
- Use Bulgarian quotation marks (`„…“`) and em dashes where appropriate.
- Keep canonical Chinese characters and tone-marked pinyin in the shared source fields.
- Use readable Bulgarian transliteration in localized titles.

## Approved recurring terminology

| English concept | Bulgarian term |
|---|---|
| primary hexagram | основна хексаграма |
| resulting hexagram | трансформационна хексаграма |
| changing line | променяща се линия |
| stable line | стабилна линия |
| reading | прочит |
| digital coins | дигитални монети |
| physical coins | обикновени монети |
| yarrow stalks | стъбла от бял равнец |
| yarrow method | практика с бял равнец |
| direct entry | ръчно въвеждане / въведено ръчно |
| backup | резервно копие |
| Xi Ci | „Сици“ |

`Трансформационна хексаграма` is preferred over `резултатна хексаграма`: it describes the structural transformation without implying a guaranteed outcome and follows terminology used in a recent published Bulgarian study of the text.

## Representative title decisions

- `Kūn` — `Възприемчива земя`
- `Sòng` — `Конфликт и граници`
- `Shī` — `Общо усилие и дисциплина`
- `Tóng Rén` — `Единомишленици под открито небе`
- `Gǔ` — `Поправяне на старите вреди`
- `Wú Wàng` — `Невинност`
- `Dà Guò` — `Голямо преобладаване`
- `Lí` — `Сияен пламък`
- `Cuì` — `Обединяване`
- `Shēng` — `Възход`
- `Kùn` — `Изтощение`
- `Zhèn` — `Пробуждащият гръм`
- `Gèn` — `Неподвижност`
- `Guī Mèi` — `Невестата`
- `Duì` — `Радост от общуването`
- `Xiǎo Guò` — `Малко преобладаване`
- `Wèi Jì` — `Все още незавършено`

The modern titles remain Yi Path editorial titles, not copied translations of a classical edition. The complete approved list is protected by the regression test in `src/data/content.test.ts`.

## Reference hierarchy

Established Bulgarian terminology, method language, and hexagram identity were cross-checked against:

- Teodora Petrova Kutsarova, *Идзин. Книга на промените*, volume 1 preview, Iztok-Zapad, 2025: <https://iztok-zapad.eu/image/catalog/materials/idzin-kniga-na-promenite-kniga%20parva.pdf>
- Canonical received-text identity and King Wen sequence: <https://ctext.org/book-of-changes>

These references informed terminology and identity only. Yi Path's modern explanatory prose remains original editorial material.

## Technical protection

- Bulgarian content is edited in `content/final/*.md`, then regenerated with `npm.cmd run content:build`.
- Generated full and browser-sharded JSON files remain synchronized.
- The test suite locks all 64 approved Bulgarian titles.
- Interface tests lock the critical recurring terminology and reject a return to `резултатна хексаграма` or `JSON архив`.
- Structural tests continue to require 64 complete cards and all changing-line reflections.

## Verification completed

- `npm.cmd test`: 59 tests passed across 7 test files.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: production build passed.
- Mobile viewport review at 390 × 844: Home, Reading, Learn, Library, hexagram 13, Journal, Settings, and Support.
- No horizontal overflow, framework error overlay, blank state, or repeatable failed request was found in the reviewed routes.

## Optional final assurance

The locale has received a complete high-confidence language and meaning audit. A professional native Bulgarian editor may still provide publication-level sign-off or taste-level adjustments, but the locale no longer depends on that review for basic correctness, consistency, or natural readability.
