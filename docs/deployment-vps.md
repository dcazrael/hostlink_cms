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
- `scripts/vps-db-migrate.sh`: non-interactive migration runner
- `scripts/deploy-vps.sh`: production deploy helper
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

## Schema Changes

All production schema changes use committed Payload migrations generated and tested in development, then verified with `tsc && pnpm db:migrate` before merging.

### One-time automatic cutover

If this production database was originally created via `apply-schema.ts` (the old dev-push workflow), `scripts/deploy-vps.sh` now handles the one-time cutover automatically on the first deploy where the legacy `payload_migrations.batch = -1` marker still exists.

That deploy will:

1. create a restore point,
2. delete the legacy dev marker,
3. seed the baseline migration row,
4. run `pnpm payload migrate`,
5. continue with the normal website deploy.

After that, later deploys skip the cutover automatically because the legacy marker is gone.

### Normal deploy with a schema change

```bash
cd /srv/hostlink/site
./scripts/deploy-vps.sh --branch main
```

`scripts/deploy-vps.sh` calls `scripts/vps-db-migrate.sh`, which first checks whether the one-time legacy cutover is still needed. If not, it:

1. Starts Postgres and waits for readiness.
2. Creates a database restore point (`backups/restore-points/hostlink_<timestamp>.dump`).
3. Runs `pnpm payload migrate` — applies only new, committed migrations.
4. Returns control to `deploy-vps.sh`, which builds and restarts the website container.

### Deploy without migration

```bash
./scripts/deploy-vps.sh --branch main --skip-db-migrate
```

Use when the deploy has no schema changes.

### Deploy with migration but no backup

```bash
./scripts/deploy-vps.sh --branch main --skip-db-backup
```

Only use this for rapid iteration on a dev VPS, never for production.

### CI guard

The GitHub Actions workflow includes a `Check schema and migration coherence` step that runs on every push to main:

- **Schema + migration both changed** → auto-deploy proceeds, committed migrations run on the VPS.
- **Schema changed but no migration** → the workflow **fails** immediately with instructions to run `pnpm db:migrate:create` and commit the migration.
- **Migration only** → auto-deploy proceeds (migration-only deploy).
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
