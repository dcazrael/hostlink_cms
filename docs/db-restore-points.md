# DB Restore Points Before Migrations

Always create a database restore point before running schema or content migrations.

## Create restore point

Run from project root on the host machine:

```bash
pnpm db:restore-point
```

Backups are written to:

`backups/restore-points/hostlink_YYYYMMDD_HHMMSS.dump`

## Safe migration commands

These create a restore point first, then run the migration:

```bash
pnpm migrate:home-to-landing:safe
pnpm migrate:landing-section-items:safe
pnpm migrate:ui-copy-keys:safe
```

## Notes

- Do not run `db:restore-point` from inside the `payload` container.
- The script uses `docker compose exec postgres pg_dump ...` from the host.
