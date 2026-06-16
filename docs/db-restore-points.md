# DB Restore Points

Always create a database restore point before running schema or content migrations.

## Quick reference

```bash
# Local dev — restore point
pnpm db:restore-point

# VPS deploy — automatic restore point before migration
./scripts/deploy-vps.sh --branch main

# VPS — migration only with backup
./scripts/vps-db-migrate.sh --branch main
```

## Standalone restore point

Run from project root on the host machine:

```bash
pnpm db:restore-point
```

Backups are written to:

`backups/restore-points/hostlink_YYYYMMDD_HHMMSS.dump`

## VPS restore point (with env-driven DB identity)

```bash
./scripts/create-db-restore-point.sh \
  --env-file .env.production \
  --compose-file docker-compose.vps.yml \
  --compose-project hostlink-site
```

## What the script does

1. Waits for Postgres readiness (pg_isready).
2. Runs `pg_dump --format=custom --no-owner --no-privileges`.
3. Writes the dump to `backups/restore-points/`.
4. Verifies the file is non-empty.
5. Creates a `sha256sum` sidecar file (if available).

## Advanced flags

```
--env-file PATH         Source POSTGRES_USER / POSTGRES_DB from env file.
--compose-file PATH     Custom Docker Compose file.
--compose-project NAME  Docker Compose project name.
--postgres-service NAME Service name (default: postgres).
--backup-dir PATH       Output directory (default: backups/restore-points).
--timeout SECS          pg_dump timeout (default: 120).
--no-readiness-check    Skip pg_isready wait (not recommended).
```

## Notes

- Do not run `db:restore-point` from inside the `payload` container.
- The script uses `docker compose exec postgres pg_dump ...` from the host.
- On the VPS, `scripts/deploy-vps.sh` and `scripts/vps-db-migrate.sh` create a restore point automatically before running migrations. See `docs/deployment-vps.md`.
