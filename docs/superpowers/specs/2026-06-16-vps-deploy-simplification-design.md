# VPS Deploy Simplification Design

## Goal

Reduce VPS operations to one normal deploy flow, one explicit one-time local-to-VPS cutover flow, and one low-level restore-point helper.

## Final structure

- `scripts/deploy-vps.sh` is the only normal operator entrypoint.
- `scripts/create-db-restore-point.sh` remains a low-level helper.
- `scripts/vps-db-migrate.sh` is merged into `scripts/deploy-vps.sh` and removed.
- `scripts/vps-db-cutover.sh` is removed from the steady-state workflow.
- `docs/deployment-vps.md` becomes the single operator runbook.
- `docs/migration-checklist.md` remains the developer-only checklist.
- `docs/db-restore-points.md` and `docs/local-db-to-vps-cutover.md` are merged into `docs/deployment-vps.md` and removed.

## Operator workflows

### Normal deploy

`./scripts/deploy-vps.sh --branch main`

This performs git sync, ensures Postgres is running, creates a restore point, runs committed migrations, deploys the app, and verifies health.

### One-time local DB to VPS replacement

This is explicit, not hidden in the normal deploy flow:

1. create local dump with `pnpm db:restore-point`
2. copy dump to VPS
3. create VPS restore point
4. restore local dump into VPS Postgres
5. deploy app with `./scripts/deploy-vps.sh --branch main --skip-db-migrate`

## Invariants

- Restore points are part of the normal deploy path.
- Normal deploy must not perform hidden destructive cutover behavior.
- Documentation must have one operator entrypoint, not overlapping runbooks.
- Local-source-of-truth cutover stays explicit and manual.

## Non-goals

- No new migration framework.
- No automatic local-to-VPS DB copy inside normal deploy.
- No broad rewrite of unrelated docs or scripts.
