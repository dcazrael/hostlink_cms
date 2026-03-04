# Migration Checklist

Use this checklist for every schema/content migration.

## 1) Create restore point

```bash
pnpm db:restore-point
```

## 2) Run migration in safe mode

Prefer `:safe` wrappers when available:

```bash
pnpm migrate:home-to-landing:safe
pnpm migrate:landing-section-items:safe
pnpm migrate:ui-copy-keys:safe
```

## 3) Verify content immediately

Check in admin:

- open 2-3 representative docs before and after migration
- verify localized tabs still contain expected values
- verify relation order for landing sections

## 4) Verify runtime

- open `/` and one non-home landing page
- open one legal page (`/privacy`, `/imprint`)
- confirm no unexpected 404s

## 5) Rollback reference

Restore the latest dump from `backups/restore-points/` if verification fails.
