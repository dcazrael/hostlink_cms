# VPS Deployment

This repo should be the first production app moved onto the VPS.

Production topology for the website:

- `https://hostlink.jp` -> this repo
- `https://www.hostlink.jp` -> redirect to `https://hostlink.jp`

Later, the same VPS can also host:

- `https://ops.hostlink.jp` -> Hostlink Ops app
- `https://staging.ops.hostlink.jp` -> Hostlink Ops staging
- `https://n8n.hostlink.jp` -> optional future n8n host

## Files

- `docker-compose.vps.yml`: VPS runtime for website + postgres
- `.env.vps.example`: production env template for the VPS
- `scripts/bootstrap-vps-site-migration.sh`: one-time full VPS bootstrap and Neon -> local Postgres migration
- `scripts/deploy-vps.sh`: production deploy helper (runs migration flow inline)
- `.github/workflows/deploy.yml`: production GitHub Actions deploy workflow
- `infra/caddy/Caddyfile.example`: Caddy config for `hostlink.jp`

## One-Time Migration

For the first move off Vercel and off Neon, use the one-shot bootstrap script on the VPS:

```bash
sudo bash ./scripts/bootstrap-vps-site-migration.sh
```

It will:

- install Caddy and migration dependencies on Debian
- clone the website repo to `/srv/hostlink/site`
- generate `.env.production`
- dump Neon and restore into local Docker Postgres
- build and start the website container
- install an HTTP-only Caddy config for pre-cutover validation
- print the Cloudflare changes to make

Because Cloudflare still points at Vercel during bootstrap, the script writes `/etc/caddy/Caddyfile.production` as the TLS-ready config. After DNS points to the VPS, activate it with:

```bash
sudo cp /etc/caddy/Caddyfile.production /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

## Recommended VPS Layout

- `/etc/caddy/Caddyfile`
- `/srv/hostlink/site`

The website should run on localhost only, behind Caddy.

## First-Time Setup

1. Install Docker Engine, Docker Compose plugin, Git, and Caddy on the VPS.
2. Clone this repo to `/srv/hostlink/site`.
3. Copy `.env.vps.example` to `.env.production`.
4. Replace the placeholder secrets and database credentials.
5. Set:

```env
COMPOSE_PROJECT_NAME=hostlink-site
APP_PORT=3300
APP_HEALTHCHECK_PATH=/
NEXT_PUBLIC_SERVER_URL=https://hostlink.jp
POSTGRES_EXPOSE_PORT=5432
DATABASE_URL=postgres://hostlink:strong-password@postgres:5432/hostlink_site
BUILD_DATABASE_URL=postgres://hostlink:strong-password@host.docker.internal:5432/hostlink_site
```

6. Install the Caddy config from `infra/caddy/Caddyfile.example`.
7. Run the first deploy:

```bash
cd /srv/hostlink/site
./scripts/deploy-vps.sh --branch main
```

## DNS

Cloudflare is the authoritative DNS provider, so make changes there instead of Muumuu.

Create or update:

- `A` `hostlink.jp` -> VPS IPv4
- `A` or `CNAME` `www.hostlink.jp` -> VPS IPv4

Keep records as `DNS only` during the first cutover. Remove the existing `www` target that still points at Vercel once the VPS site is live.
Leave MX/TXT mail records unchanged.

## Normal Deploy

All production schema changes use committed Payload migrations generated and tested in development, then verified with `tsc && pnpm db:migrate` before merging. There is no generic schema push in this flow: a schema change that is not covered by a committed migration must not be deployed.

```bash
cd /srv/hostlink/site
./scripts/deploy-vps.sh --branch main
```

The script runs these steps in order and stops at the first failure:

1. Starts Postgres and waits for readiness.
2. Creates a database restore point (`backups/restore-points/hostlink_<timestamp>.dump`) — always, before any migration or migration-history SQL.
3. Normalizes the legacy migration baseline when the database still carries a dev-mode marker (see below).
4. Builds the `migrator` image and applies pending committed migrations noninteractively:
   `docker compose --project-name hostlink-site --env-file .env.production -f docker-compose.vps.yml run --rm -T migrator pnpm run payload:container migrate </dev/null`
5. Builds and replaces the website container.

If the backup, the baseline fix-up, or the migration run fails, the script exits non-zero **before** the website container is replaced, so the previous website image keeps serving traffic. Migration files that already committed in that run stay applied, so use [Rollback](#rollback) when the new schema has to be undone.

Note that the previous website container keeps serving while the migration runs, so the old code briefly runs against the migrated schema until step 5 replaces it.

### Legacy migration baseline

Legacy VPS databases can carry a dev-mode `payload_migrations` row with `batch = -1`. Payload's `migrate` command treats that marker as "dev mode was used" and asks for an interactive confirmation, which cannot be answered during a noninteractive deploy.

Before running migrations, the script inspects the `payload_migrations` table. If a `batch = -1` row is present it runs one transaction that:

- inserts the known baseline migration `20260614_210456` with `batch = 1` when it is not recorded yet, and
- deletes the `batch = -1` marker rows.

This preserves the previous VPS cutover's assumption that the legacy schema already represents `20260614_210456`. Replaying that initial migration would fail on existing tables. This is specific to the known legacy VPS database, not a general schema-reconciliation mechanism.

Databases without a `payload_migrations` table, and databases whose history has no `batch = -1` marker, are left untouched — for those only pending committed migrations are applied.

### Backups are mandatory

A restore point is created before every migration run. The former `--skip-db-backup` flag was removed: passing it now fails the script instead of deploying without a backup.

Restore points are Postgres dumps of the database only, written to `backups/restore-points/hostlink_<timestamp>.dump` next to a `.sha256` checksum. They do not contain uploaded media files — those live in the website container filesystem, not in Postgres — so a restore point cannot bring media back.

## Deploy Without DB Migration

```bash
cd /srv/hostlink/site
./scripts/deploy-vps.sh --branch main --skip-db-migrate
```

Use when the deploy has no schema changes. This is an explicit app-only bypass: no restore point is created, no migration history is touched, and no migration runs. Only the website container is rebuilt and replaced.

## Rollback

Rollback is manual and has two independent parts: the database and the application. Restoring the database is not a rollback on its own — the restored schema only matches the code that is known to work with it, so the known-good code has to be deployed again afterwards. Nothing in `deploy-vps.sh` performs these steps automatically.

1. Choose the restore point. Restore points live in `backups/restore-points/hostlink_<timestamp>.dump`; use the one created by the deploy you are rolling back (the deploy log prints its path).

2. Stop the website so no request writes to the database while it is being replaced:

```bash
cd /srv/hostlink/site

docker compose \
  --project-name hostlink-site \
  --env-file .env.production \
  -f docker-compose.vps.yml \
  stop website
```

3. Make sure Postgres is up:

```bash
docker compose \
  --project-name hostlink-site \
  --env-file .env.production \
  -f docker-compose.vps.yml \
  up -d postgres
```

4. Replace `POSTGRES_DB` with the dump. **This deletes the current database, including writes made after the restore point.** Keep the website stopped and stop any other database writers first. Verify the dump exists and its checksum before proceeding:

```bash
RESTORE_POINT="backups/restore-points/hostlink_<TIMESTAMP>.dump"
test -s "$RESTORE_POINT" &&
sha256sum -c "${RESTORE_POINT}.sha256" &&
docker compose \
  --project-name hostlink-site \
  --env-file .env.production \
  -f docker-compose.vps.yml \
  exec -T postgres \
  sh -lc 'dropdb -U "$POSTGRES_USER" --force "$POSTGRES_DB" &&
    createdb -U "$POSTGRES_USER" -O "$POSTGRES_USER" "$POSTGRES_DB" &&
    pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --exit-on-error --no-owner --no-privileges' \
  < "$RESTORE_POINT"
```

Recreating the database also removes objects introduced by the failed release that are absent from the backup. If any command fails, keep the website stopped and resolve the restore failure before redeploying.

5. Redeploy the previously known-good code. `deploy-vps.sh` always fetches, checks out, and pulls the branch it is given, so the known-good code has to be reachable from a branch: either revert the bad commit on `main` and push the revert, or point the script at a branch that still contains the known-good commit.

```bash
./scripts/deploy-vps.sh --branch main --skip-db-migrate
```

Use `--skip-db-migrate` here: the restored database already carries the migration history of the known-good release, and running migrations again would move the schema forward instead of holding it at the restored state. The deploy rebuilds the website image from the checked-out code and starts the website container again.

6. Verify the site and the admin load, and check the container status:

```bash
docker compose \
  --project-name hostlink-site \
  --env-file .env.production \
  -f docker-compose.vps.yml \
  ps
```

A rollback restores database rows only. Media files uploaded after the restore point are not in the dump and are not recovered by it.

## Local DB to VPS cutover

Use this when the verified **local** database must become the new production source of truth. This is the correct flow when you:

- pulled the original production DB into local,
- reconciled schema and content locally,
- verified custom block data and collections locally,
- now want VPS Postgres to exactly match local.

This is **dump + restore**, not migration only.

1. Create a local dump on your local machine:

```bash
mkdir -p backups/production-cutover

pnpm db:restore-point
```

Backups are written to `backups/restore-points/hostlink_YYYYMMDD_HHMMSS.dump`. Pick the newest file and copy it to the VPS (e.g. with `scp`).

2. On the VPS, create a VPS restore point that protects the current production database before replacement:

```bash
cd /srv/hostlink/site
mkdir -p backups/restore-points

./scripts/create-db-restore-point.sh \
  --env-file .env.production \
  --compose-file docker-compose.vps.yml \
  --compose-project hostlink-site
```

3. Start VPS Postgres so the local dump can be restored into it:

```bash
docker compose \
  --project-name hostlink-site \
  --env-file .env.production \
  -f docker-compose.vps.yml \
  up -d postgres
```

4. Restore the local dump into VPS Postgres with `pg_restore --clean --if-exists`:

```bash
LOCAL_DUMP="backups/restore-points/hostlink_<TIMESTAMP>.dump"

docker compose \
  --project-name hostlink-site \
  --env-file .env.production \
  -f docker-compose.vps.yml \
  exec -T postgres \
  sh -lc 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists --no-owner --no-privileges' \
  < "$LOCAL_DUMP"
```

5. Deploy the app without running DB migration:

```bash
./scripts/deploy-vps.sh --branch main --skip-db-migrate
```

If the restored local DB is wrong, follow [Rollback](#rollback) using the VPS backup created in step 2. That procedure stops the website, replaces the database completely, and redeploys the known-good code.

## CI guard

The GitHub Actions workflow includes a `Check schema and migration coherence` step that runs on every push to main:

- **Schema + migration both changed** → auto-deploy proceeds, committed migrations run on the VPS.
- **Schema changed but no migration** → the workflow **fails** immediately with instructions to run `pnpm db:migrate:create` and commit the migration.
- **Migration only** → auto-deploy proceeds as a normal application deploy.
- **Neither** → auto-deploy proceeds (no-op migration step).

This ensures every schema change has a corresponding committed migration before reaching production. Always commit the schema change and its migration file in the same push.

Manual deploys via `workflow_dispatch` do not run the coherence check — the deployer is responsible for ensuring schema changes have matching migrations before triggering.

## GitHub Actions

Create a GitHub `production` environment with:

- `DEPLOY_SSH_HOST`
- `DEPLOY_SSH_PORT`
- `DEPLOY_SSH_USER`
- `DEPLOY_SSH_KEY`
- `DEPLOY_APP_DIR`

Use:

- `DEPLOY_APP_DIR=/srv/hostlink/site`

Pushes to `main` auto-deploy when schema changes include their committed migration files.
If schema files change without a migration file, the workflow fails and tells the developer to run `pnpm db:migrate:create` before pushing again.
