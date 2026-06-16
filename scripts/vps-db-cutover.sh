#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: ./scripts/vps-db-cutover.sh [--branch <branch>] [--env-file <path>]
  [--compose-file <path>] [--skip-git-sync] [--skip-backup]

Runs the one-time production migration cutover when the legacy Payload dev
marker still exists. If cutover is no longer needed, exits successfully and
does nothing.

Exit codes:
  0  - cutover not needed
  20 - cutover ran successfully and already applied migrations
EOF
}

branch_name="main"
env_file=".env.production"
compose_file="docker-compose.vps.yml"
skip_git_sync="false"
skip_backup="false"
baseline_migration="20260614_210456"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --branch)
      branch_name="${2:-}"
      shift 2
      ;;
    --env-file)
      env_file="${2:-}"
      shift 2
      ;;
    --compose-file)
      compose_file="${2:-}"
      shift 2
      ;;
    --skip-git-sync)
      skip_git_sync="true"
      shift
      ;;
    --skip-backup)
      skip_backup="true"
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

if [[ ! -f "$env_file" ]]; then
  echo "Missing environment file: $env_file" >&2
  exit 1
fi

if [[ ! -f "$compose_file" ]]; then
  echo "Missing compose file: $compose_file" >&2
  exit 1
fi

if [[ "$skip_git_sync" != "true" ]]; then
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "Refusing to run cutover with uncommitted changes in the VPS checkout." >&2
    exit 1
  fi

  git fetch origin "$branch_name"

  if git show-ref --verify --quiet "refs/heads/$branch_name"; then
    git checkout "$branch_name"
  else
    git checkout -b "$branch_name" "origin/$branch_name"
  fi

  git pull --ff-only origin "$branch_name"
fi

set -a
# shellcheck disable=SC1090
source "$env_file"
set +a

project_name="${COMPOSE_PROJECT_NAME:-hostlink-site}"

export APP_ENV_FILE="$env_file"
export COMPOSE_PROJECT_NAME="$project_name"

docker compose \
  --project-name "$project_name" \
  --env-file "$env_file" \
  -f "$compose_file" \
  up -d postgres

docker compose \
  --project-name "$project_name" \
  --env-file "$env_file" \
  -f "$compose_file" \
  build migrator

echo "[cutover] Waiting for postgres to be ready..."
for attempt in $(seq 1 10); do
  if docker compose \
    --project-name "$project_name" \
    --env-file "$env_file" \
    -f "$compose_file" \
    exec -T postgres pg_isready -U "$POSTGRES_USER" -q 2>/dev/null; then
    break
  fi
  if [[ $attempt -eq 10 ]]; then
    echo "Error: postgres not ready after 10 attempts." >&2
    exit 1
  fi
  sleep 3
done

dev_marker_present="$({
  docker compose \
    --project-name "$project_name" \
    --env-file "$env_file" \
    -f "$compose_file" \
    exec -T postgres psql "$DATABASE_URL" -Atc "SELECT 1 FROM payload_migrations WHERE batch = -1 LIMIT 1;"
} | tr -d '\r\n')"

if [[ "$dev_marker_present" != "1" ]]; then
  echo "[cutover] No legacy dev marker found. Skipping one-time cutover."
  exit 0
fi

echo "[cutover] Legacy dev marker found. Running one-time migration cutover..."

if [[ "$skip_backup" != "true" ]]; then
  ./scripts/create-db-restore-point.sh \
    --env-file "$env_file" \
    --compose-file "$compose_file" \
    --compose-project "$project_name" \
    --postgres-service postgres \
    --timeout 120
fi

docker compose \
  --project-name "$project_name" \
  --env-file "$env_file" \
  -f "$compose_file" \
  exec -T postgres psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "DELETE FROM payload_migrations WHERE batch = -1;"

docker compose \
  --project-name "$project_name" \
  --env-file "$env_file" \
  -f "$compose_file" \
  exec -T postgres psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "INSERT INTO payload_migrations (name, batch, created_at, updated_at) SELECT '${baseline_migration}', 1, NOW(), NOW() WHERE NOT EXISTS (SELECT 1 FROM payload_migrations WHERE name = '${baseline_migration}');"

docker compose \
  --project-name "$project_name" \
  --env-file "$env_file" \
  -f "$compose_file" \
  run --rm migrator pnpm payload migrate

echo "[cutover] Cutover complete. Future deploys will skip automatically because the legacy dev marker is gone."
exit 20
