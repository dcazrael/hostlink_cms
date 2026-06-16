# Migration Checklist

Use this checklist for every schema/content migration.

## 1) Create restore point

```bash
pnpm db:restore-point
```

On the VPS, the deploy script does this automatically before migrations. See `docs/db-restore-points.md` and `docs/deployment-vps.md`.

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

## 5) Commit and push

Always commit the migration file and the updated `src/migrations/index.ts` together.

## 6) Deploy to production

If schema-sensitive files changed, the CI guard blocks auto-deploy. Deploy manually:

```bash
ssh <vps-host>
cd /srv/hostlink/site
./scripts/deploy-vps.sh --branch main
```

## 7) Verify content immediately

Check in admin:

- open 2-3 representative docs after migration
- verify expected fields and values

## 8) Verify runtime

- open `/` in production
- confirm no unexpected 500 errors

## 9) Rollback reference

Restore the latest dump from `backups/restore-points/` if verification fails:

```bash
docker compose exec -T postgres \
  pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists \
  < backups/restore-points/hostlink_latest.dump
```
