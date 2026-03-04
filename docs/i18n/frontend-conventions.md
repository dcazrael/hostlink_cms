# Frontend i18n Conventions

This document defines the canonical localization pattern for frontend code.

## Single Pattern

Frontend components must use **direct translator calls**:

- Pass `t: TranslateFn` from the route/render root.
- Call `t('namespace.key', 'fallback')` directly in components.

Do not introduce a second abstraction layer like homepage-specific copy objects.

## Source of Translations

UI text translations come from `ui-copy-keys` through:

- `src/i18n/getDictionary.ts`
- `src/i18n/createTranslator.ts`

Fallback chain:

1. requested locale
2. default locale
3. fallback text or key

## CMS Content vs UI Copy

- **UI copy** (buttons, labels, helper strings): use `t('...')`.
- **Landing content** (headlines/body from CMS blocks): keep localized in Payload content fields.

## Scope Note

`useTranslation` from `@payloadcms/ui` is for Payload Admin custom components.
It is not the frontend page localization pattern.

