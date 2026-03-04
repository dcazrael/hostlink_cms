# Homepage UI Copy Localization

Homepage/shared UI strings are managed in the `ui-copy-keys` collection.

## Where To Edit In Admin

Go to `Collections -> Frontend Copy`.

- `key`: stable translation key (`dot.case`)
- `group`: logical area (`homepage.hero`, `shared.notfound`, etc.)
- `translations`: localized values (`JA`, `EN`)

## Runtime Flow

1. Components call `t('key.path', 'fallback')`.
2. Translator loads active keys from `ui-copy-keys`.
3. Fallback chain is: requested locale -> default locale -> key/fallback.

## Key Files

- `src/i18n/getDictionary.ts`
- `src/i18n/createTranslator.ts`
- `src/components/homepage/RenderHomepageLayout.tsx`
- `docs/i18n/frontend-conventions.md`

## Notes

- Deprecated `ui-copy` global has been removed.
- `Frontend Copy` list includes a group workbench for faster JA/EN edits.
- Homepage/frontend uses direct `t('...')` calls only (no `uiCopy` indirection).
