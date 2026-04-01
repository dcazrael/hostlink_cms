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
DATABASE_URL=postgres://hostlink:strong-password@postgres:5432/hostlink_site
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

## Migrations

Do not use the interactive schema-apply flow on the VPS.

Use committed Payload migrations instead:

```bash
pnpm db:migrate:create
pnpm db:migrate
```

This repo currently has no committed migration directory yet, so before the first production schema-changing release you should create and commit an initial migration from a stable schema state.

## GitHub Actions

Create a GitHub `production` environment with:

- `DEPLOY_SSH_HOST`
- `DEPLOY_SSH_PORT`
- `DEPLOY_SSH_USER`
- `DEPLOY_SSH_KEY`
- `DEPLOY_APP_DIR`

Use:

- `DEPLOY_APP_DIR=/srv/hostlink/site`

Pushes to `main` auto-deploy only when no schema-sensitive files changed.
Schema-sensitive production pushes fail intentionally and require:

```bash
cd /srv/hostlink/site
./scripts/vps-db-migrate.sh --branch main
./scripts/deploy-vps.sh --branch main
```
