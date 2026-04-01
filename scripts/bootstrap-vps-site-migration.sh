#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: sudo bash ./scripts/bootstrap-vps-site-migration.sh [options]

Options:
  --skip-os-packages  Skip apt package and Caddy installation steps
  --skip-db-import    Skip the Neon dump and local Postgres restore
  --skip-caddy        Skip writing and reloading the Caddy config
  --force-reclone     Delete the existing app directory before cloning
  -h, --help          Show this help text
EOF
}

SKIP_OS_PACKAGES="false"
SKIP_DB_IMPORT="false"
SKIP_CADDY="false"
FORCE_RECLONE="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-os-packages)
      SKIP_OS_PACKAGES="true"
      shift
      ;;
    --skip-db-import)
      SKIP_DB_IMPORT="true"
      shift
      ;;
    --skip-caddy)
      SKIP_CADDY="true"
      shift
      ;;
    --force-reclone)
      FORCE_RECLONE="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

readonly VPS_OS="debian-13"
readonly VPS_ARCH="$(uname -m)"
readonly REPO_SSH_URL="git@github.com:dcazrael/hostlink_cms.git"
readonly REPO_BRANCH="main"
readonly VPS_APP_DIR="/srv/hostlink/site"
readonly ENV_FILE_NAME=".env.production"
readonly COMPOSE_FILE_NAME="docker-compose.vps.yml"
readonly COMPOSE_PROJECT_NAME_VALUE="hostlink-site"
readonly APP_PORT_VALUE="3300"
readonly APP_HEALTHCHECK_PATH_VALUE="/"
readonly NEXT_PUBLIC_SERVER_URL_VALUE="https://hostlink.jp"
readonly NEON_DIRECT_DATABASE_URL="postgresql://neondb_owner:npg_SKb4tC1MhUyO@ep-tiny-sound-ager9mec.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
readonly LOCAL_POSTGRES_DB_VALUE="hostlink_site"
readonly LOCAL_POSTGRES_USER_VALUE="hostlink"
readonly LOCAL_POSTGRES_PASSWORD_VALUE="DnGmvBhukmDbj8GLgLc4"
readonly PAYLOAD_SECRET_VALUE="68e14bfc8c77938c4f4323b9"
readonly CRON_SECRET_VALUE="68e14bfc8c77938c4f4323c8"
readonly PREVIEW_SECRET_VALUE="68e14bfc8c77938c4f4323d7"
readonly SMTP_HOST_VALUE="smtppro.zoho.eu"
readonly SMTP_PORT_VALUE="465"
readonly SMTP_SECURE_VALUE="true"
readonly SMTP_REQUIRE_TLS_VALUE="false"
readonly SMTP_USER_VALUE="sales@hostlink.jp"
readonly SMTP_PASS_VALUE="&CLmBRk7verhsDJ"
readonly SMTP_FROM_ADDRESS_VALUE="sales@hostlink.jp"
readonly SMTP_FROM_NAME_VALUE="HostLink"
readonly TURNSTILE_SITE_KEY_VALUE="0x4AAAAAAClkN8dmFk7gDz9B"
readonly TURNSTILE_SECRET_KEY_VALUE="0x4AAAAAAClkNz_Oo62T3ur2qqbi4NAZsig"
readonly SPAM_IP_HASH_SALT_VALUE="$(openssl rand -hex 32)"
readonly APP_ENV_FILE_PATH="${VPS_APP_DIR}/${ENV_FILE_NAME}"
readonly COMPOSE_FILE_PATH="${VPS_APP_DIR}/${COMPOSE_FILE_NAME}"
readonly DUMP_FILE_PATH="/tmp/hostlink-neon-$(date +%Y%m%d-%H%M%S).dump"
readonly BOOTSTRAP_CADDYFILE_PATH="/etc/caddy/Caddyfile"
readonly TLS_READY_CADDYFILE_PATH="/etc/caddy/Caddyfile.production"
readonly RUN_AS_USER="${SUDO_USER:-root}"

section() {
  printf '\n[%s] %s\n' "$(date +%H:%M:%S)" "$1"
}

cleanup() {
  if [[ -f "$DUMP_FILE_PATH" ]]; then
    rm -f "$DUMP_FILE_PATH"
  fi
}

require_root() {
  if [[ "$(id -u)" -ne 0 ]]; then
    echo "Run this script as root or with sudo." >&2
    exit 1
  fi
}

detect_arch() {
  case "$VPS_ARCH" in
    x86_64)
      echo "amd64"
      ;;
    aarch64)
      echo "arm64"
      ;;
    *)
      echo "$VPS_ARCH"
      ;;
  esac
}

ensure_command() {
  local command_name="$1"

  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Missing required command: $command_name" >&2
    exit 1
  fi
}

ensure_compose() {
  if ! docker compose version >/dev/null 2>&1; then
    echo "Missing required command: docker compose" >&2
    exit 1
  fi
}

install_os_packages() {
  if [[ "$SKIP_OS_PACKAGES" == "true" ]]; then
    section "Skipping OS package installation"
    return
  fi

  section "Installing Debian packages and Caddy"

  export DEBIAN_FRONTEND=noninteractive

  apt-get update
  apt-get install -y ca-certificates curl gnupg postgresql-client apt-transport-https debian-keyring debian-archive-keyring openssh-client

  install -m 0755 -d /etc/apt/keyrings

  if [[ ! -f /etc/apt/keyrings/caddy-stable-archive-keyring.gpg ]]; then
    curl -fsSL https://dl.cloudsmith.io/public/caddy/stable/gpg.key | gpg --dearmor -o /etc/apt/keyrings/caddy-stable-archive-keyring.gpg
  fi

  curl -fsSL https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt -o /etc/apt/sources.list.d/caddy-stable.list
  apt-get update
  apt-get install -y caddy
}

verify_prerequisites() {
  section "Checking required commands"
  ensure_command docker
  ensure_compose
  ensure_command git
  ensure_command curl
  ensure_command openssl
  ensure_command pg_dump
  ensure_command ssh-keyscan
}

prepare_repo_checkout() {
  section "Preparing repo checkout"
  local run_as_home

  run_as_home="$(getent passwd "$RUN_AS_USER" | cut -d: -f6)"

  if [[ -z "$run_as_home" ]]; then
    echo "Could not resolve home directory for clone user: $RUN_AS_USER" >&2
    exit 1
  fi

  if [[ -d "$VPS_APP_DIR/.git" ]]; then
    if [[ "$FORCE_RECLONE" != "true" ]]; then
      echo "App directory already exists: $VPS_APP_DIR" >&2
      echo "Re-run with --force-reclone to delete and re-clone it." >&2
      exit 1
    fi

    rm -rf "$VPS_APP_DIR"
  elif [[ -e "$VPS_APP_DIR" && "$FORCE_RECLONE" != "true" ]]; then
    echo "Path already exists and is not an empty repo directory: $VPS_APP_DIR" >&2
    echo "Re-run with --force-reclone to delete it." >&2
    exit 1
  elif [[ -e "$VPS_APP_DIR" ]]; then
    rm -rf "$VPS_APP_DIR"
  fi

  install -d -m 0755 "$(dirname "$VPS_APP_DIR")"
  install -d -m 0700 "$run_as_home/.ssh"
  touch "$run_as_home/.ssh/known_hosts"
  chmod 0600 "$run_as_home/.ssh/known_hosts"

  if [[ "$RUN_AS_USER" != "root" ]]; then
    chown -R "$RUN_AS_USER:$RUN_AS_USER" "$run_as_home/.ssh"
    runuser -u "$RUN_AS_USER" -- bash -lc "ssh-keyscan -H github.com >> ~/.ssh/known_hosts 2>/dev/null || true"
    runuser -u "$RUN_AS_USER" -- env GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=accept-new" git clone --branch "$REPO_BRANCH" "$REPO_SSH_URL" "$VPS_APP_DIR"
    chown -R root:root "$VPS_APP_DIR"
  else
    ssh-keyscan -H github.com >> "$run_as_home/.ssh/known_hosts" 2>/dev/null || true
    GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=accept-new" git clone --branch "$REPO_BRANCH" "$REPO_SSH_URL" "$VPS_APP_DIR"
  fi
}

write_env_file() {
  section "Writing production env file"

  {
    printf 'COMPOSE_PROJECT_NAME=%s\n' "$COMPOSE_PROJECT_NAME_VALUE"
    printf 'APP_PORT=%s\n' "$APP_PORT_VALUE"
    printf 'APP_HEALTHCHECK_PATH=%s\n' "$APP_HEALTHCHECK_PATH_VALUE"
    printf 'NODE_ENV=production\n'
    printf 'NEXT_PUBLIC_SERVER_URL=%s\n' "$NEXT_PUBLIC_SERVER_URL_VALUE"
    printf '\n'
    printf 'POSTGRES_DB=%s\n' "$LOCAL_POSTGRES_DB_VALUE"
    printf 'POSTGRES_USER=%s\n' "$LOCAL_POSTGRES_USER_VALUE"
    printf 'POSTGRES_PASSWORD=%s\n' "$LOCAL_POSTGRES_PASSWORD_VALUE"
    printf 'DATABASE_URL=postgresql://%s:%s@postgres:5432/%s\n' "$LOCAL_POSTGRES_USER_VALUE" "$LOCAL_POSTGRES_PASSWORD_VALUE" "$LOCAL_POSTGRES_DB_VALUE"
    printf '\n'
    printf 'PAYLOAD_SECRET=%s\n' "$PAYLOAD_SECRET_VALUE"
    printf 'CRON_SECRET=%s\n' "$CRON_SECRET_VALUE"
    printf 'PREVIEW_SECRET=%s\n' "$PREVIEW_SECRET_VALUE"
    printf '\n'
    printf 'SMTP_HOST=%s\n' "$SMTP_HOST_VALUE"
    printf 'SMTP_PORT=%s\n' "$SMTP_PORT_VALUE"
    printf 'SMTP_SECURE=%s\n' "$SMTP_SECURE_VALUE"
    printf 'SMTP_REQUIRE_TLS=%s\n' "$SMTP_REQUIRE_TLS_VALUE"
    printf 'SMTP_USER=%s\n' "$SMTP_USER_VALUE"
    printf 'SMTP_PASS=%s\n' "$SMTP_PASS_VALUE"
    printf 'SMTP_FROM_ADDRESS=%s\n' "$SMTP_FROM_ADDRESS_VALUE"
    printf 'SMTP_FROM_NAME=%s\n' "$SMTP_FROM_NAME_VALUE"
    printf '\n'
    printf 'TURNSTILE_SITE_KEY=%s\n' "$TURNSTILE_SITE_KEY_VALUE"
    printf 'NEXT_PUBLIC_TURNSTILE_SITE_KEY=%s\n' "$TURNSTILE_SITE_KEY_VALUE"
    printf 'TURNSTILE_SECRET_KEY=%s\n' "$TURNSTILE_SECRET_KEY_VALUE"
    printf 'SPAM_IP_HASH_SALT=%s\n' "$SPAM_IP_HASH_SALT_VALUE"
    printf 'SPAM_MIN_SUBMIT_MS=2500\n'
    printf 'SPAM_RATE_MINUTE_LIMIT=5\n'
    printf 'SPAM_RATE_HOUR_LIMIT=20\n'
    printf 'SPAM_BLOCK_MINUTES=30\n'
  } > "$APP_ENV_FILE_PATH"
}

validate_compose() {
  section "Validating Docker Compose config"

  docker compose \
    --project-name "$COMPOSE_PROJECT_NAME_VALUE" \
    --env-file "$APP_ENV_FILE_PATH" \
    -f "$COMPOSE_FILE_PATH" \
    config >/dev/null
}

start_postgres() {
  section "Starting local Postgres"

  docker compose \
    --project-name "$COMPOSE_PROJECT_NAME_VALUE" \
    --env-file "$APP_ENV_FILE_PATH" \
    -f "$COMPOSE_FILE_PATH" \
    up -d postgres

  for attempt in $(seq 1 30); do
    if docker compose \
      --project-name "$COMPOSE_PROJECT_NAME_VALUE" \
      --env-file "$APP_ENV_FILE_PATH" \
      -f "$COMPOSE_FILE_PATH" \
      exec -T postgres pg_isready -U "$LOCAL_POSTGRES_USER_VALUE" -d "$LOCAL_POSTGRES_DB_VALUE" >/dev/null 2>&1; then
      return
    fi

    sleep 2
  done

  echo "Postgres did not become healthy in time." >&2
  exit 1
}

restore_neon_dump() {
  if [[ "$SKIP_DB_IMPORT" == "true" ]]; then
    section "Skipping Neon dump and restore"
    return
  fi

  section "Dumping Neon to $DUMP_FILE_PATH"
  pg_dump --format=custom --verbose --file "$DUMP_FILE_PATH" "$NEON_DIRECT_DATABASE_URL"

  section "Restoring Neon dump into local Postgres"
  docker compose \
    --project-name "$COMPOSE_PROJECT_NAME_VALUE" \
    --env-file "$APP_ENV_FILE_PATH" \
    -f "$COMPOSE_FILE_PATH" \
    exec -T postgres pg_restore \
    --username "$LOCAL_POSTGRES_USER_VALUE" \
    --dbname "$LOCAL_POSTGRES_DB_VALUE" \
    --no-owner \
    --no-privileges \
    --clean \
    --if-exists \
    < "$DUMP_FILE_PATH"

  rm -f "$DUMP_FILE_PATH"
}

deploy_website() {
  section "Building and starting the website"

  docker compose \
    --project-name "$COMPOSE_PROJECT_NAME_VALUE" \
    --env-file "$APP_ENV_FILE_PATH" \
    -f "$COMPOSE_FILE_PATH" \
    up -d --build --remove-orphans
}

wait_for_site() {
  section "Waiting for website health check"

  for attempt in $(seq 1 30); do
    if curl -fsS "http://127.0.0.1:${APP_PORT_VALUE}${APP_HEALTHCHECK_PATH_VALUE}" >/dev/null; then
      return
    fi

    sleep 2
  done

  echo "Website health check failed on http://127.0.0.1:${APP_PORT_VALUE}${APP_HEALTHCHECK_PATH_VALUE}" >&2
  exit 1
}

write_caddy_config() {
  if [[ "$SKIP_CADDY" == "true" ]]; then
    section "Skipping Caddy setup"
    return
  fi

  section "Writing Caddy configuration"

  cat > "$BOOTSTRAP_CADDYFILE_PATH" <<EOF
{
  auto_https off
}

http://hostlink.jp {
  reverse_proxy 127.0.0.1:${APP_PORT_VALUE}
}

http://www.hostlink.jp {
  redir http://hostlink.jp{uri} permanent
}
EOF

  cat > "$TLS_READY_CADDYFILE_PATH" <<EOF
hostlink.jp {
  reverse_proxy 127.0.0.1:${APP_PORT_VALUE}
}

www.hostlink.jp {
  redir https://hostlink.jp{uri} permanent
}
EOF

  systemctl enable caddy
  systemctl restart caddy
}

validate_caddy() {
  if [[ "$SKIP_CADDY" == "true" ]]; then
    return
  fi

  section "Validating Caddy locally"
  curl -fsS -H 'Host: hostlink.jp' http://127.0.0.1/ >/dev/null
  systemctl status caddy --no-pager >/dev/null
}

print_summary() {
  local server_ip
  server_ip="$(hostname -I | awk '{print $1}')"

  section "Docker status"
  docker compose \
    --project-name "$COMPOSE_PROJECT_NAME_VALUE" \
    --env-file "$APP_ENV_FILE_PATH" \
    -f "$COMPOSE_FILE_PATH" \
    ps

  if [[ "$SKIP_CADDY" != "true" ]]; then
    section "Caddy status"
    systemctl status caddy --no-pager --lines=5 || true
  fi

  section "Next manual steps"
  cat <<EOF
Cloudflare records to change:
  A   hostlink.jp   -> ${server_ip}   (set to DNS only first)
  A   www           -> ${server_ip}   (or CNAME www -> hostlink.jp, DNS only first)

Post-cutover Caddy TLS activation:
  cp ${TLS_READY_CADDYFILE_PATH} ${BOOTSTRAP_CADDYFILE_PATH}
  systemctl reload caddy

Post-cutover checks:
  - https://hostlink.jp loads from the VPS
  - https://www.hostlink.jp redirects to https://hostlink.jp
  - Payload admin login works
  - form submissions and email paths work
  - content matches the previous Neon-backed site

Cleanup:
  - delete this bootstrap script after the migration succeeds
  - remove /tmp dump files if any failed run left one behind
EOF
}

main() {
  require_root
  trap cleanup EXIT

  section "Starting Hostlink website VPS bootstrap"
  printf 'Detected OS: %s\n' "$VPS_OS"
  printf 'Detected architecture: %s (%s)\n' "$VPS_ARCH" "$(detect_arch)"

  install_os_packages
  verify_prerequisites
  prepare_repo_checkout
  write_env_file
  validate_compose
  start_postgres
  restore_neon_dump
  deploy_website
  wait_for_site
  write_caddy_config
  validate_caddy
  print_summary
}

main "$@"
