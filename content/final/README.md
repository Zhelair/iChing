# Yi Path — final-format library

This is the clean hand-off folder for the app. It preserves one consistent card structure based on Hexagram 1:

1. canonical data;
2. classical Chinese judgment and line texts;
3. English, Bulgarian, and Russian core reading (with six extended packs in `content/locales`);
4. questions for reflection;
5. changing-line reflections.

## Editorial status

- Hexagrams **01–64** are expanded reference drafts with individually authored changing-line reflections. EN, BG, and RU remain in the source cards; DE, IT, FR, ES, PT-PT, and PL live in validated on-demand packs.
- Every card remains an AI-assisted editorial draft and should receive a later scholarly / native-language review before a public launch. The generic structural-draft generator is retained only as a development fallback; it does not create any of the final cards.

The surrounding `library` folder remains the working source. Do editorial work there first, then regenerate or update the matching file here only once it reaches the same level of detail as Hexagram 1.
