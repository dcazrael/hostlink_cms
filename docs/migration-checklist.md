# Migration Checklist

Use this checklist for every schema/content migration. This checklist is for the developer making the change — the operator deploy steps live in `docs/deployment-vps.md`.

## 1) Create restore point

```bash
pnpm db:restore-point
```

On the VPS, the deploy script does this automatically before migrations. See `docs/deployment-vps.md`.

## 2) Run migration locally (development)

```bash
pnpm db:migrate
```

This runs committed Payload migrations against your local database.

## 3) Verify migrations pass

```bash
pnpm payload migrate:status
```

Confirm each migration shows **Yes / Batch N**.

## 4) Verify TypeScript

```bash
pnpm tsc --noEmit
```

## 5) Push

Push the schema change and migration file together.

## 6) Verify production after deploy

- confirm CI deploy passed
- confirm admin and frontend load
- verify representative content still renders
