# EN-First i18n Workflow

## Layers

1. UI copy: `ui-copy-keys` with `t('...')`.
2. Landing content: localized CMS fields in `landing-sections`.

## Frontend Standard

- Frontend components use direct `t('key.path', 'fallback')` calls.
- Pass `t` from route/render root into child components.
- Do not use homepage-specific copy objects (`uiCopy`) in frontend components.
- `useTranslation` from `@payloadcms/ui` is for Payload Admin components only.

## Scanner

Use the scanner to report hardcoded UI literals and optionally seed missing keys.

Commands:

```bash
pnpm i18n:scan-hardcoded
pnpm i18n:scan-hardcoded -- --seed
pnpm i18n:scan-hardcoded -- --seed --dry-run
pnpm i18n:scan-hardcoded -- --ci --max-literals=0
```

Report output:

`docs/i18n/hardcoded-report.json`

## What gets scanned

- `JSXText` in visible tags.
- Visible JSX props (`title`, `placeholder`, `aria-label`, `alt`, `label`).

## What is ignored/skipped

- Dynamic expressions such as `{item.text}` (reported as `dynamic-cms-expression`).
- Class names, URLs, import strings, tests, Payload schema/config files.

## Key and seed behavior

- Generated key format: `auto.{scope}.{normalized-file}.{shortHash}`
- Source locale for extracted literals: `en`
- Mirror mode: EN literal is also written to JA at creation time
- Existing translations are not overwritten unless a locale value is empty

## When to use what

- Use `ui-copy-keys` for shared chrome and component UI text.
- Use localized landing-section content fields for page-specific marketing content.
