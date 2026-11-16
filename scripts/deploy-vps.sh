#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: ./scripts/deploy-vps.sh [--branch <branch>] [--env-file <path>]
  [--compose-file <path>] [--skip-db-migrate]

Deploy the website to the VPS.

By default creates a database restore point and runs committed migrations
before building the website container. Backups are required for database
changes. Use --skip-db-migrate for an application-only deploy.
EOF
}

branch_name="main"
env_file=".env.production"
compose_file="docker-compose.vps.yml"
skip_db_migrate="false"

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
    --skip-db-migrate)
      skip_db_migrate="true"
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

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Refusing to deploy with uncommitted changes in the VPS checkout." >&2
  exit 1
fi

git fetch origin "$branch_name"

if git show-ref --verify --quiet "refs/heads/$branch_name"; then
  git checkout "$branch_name"
else
  git checkout -b "$branch_name" "origin/$branch_name"
fi

git pull --ff-only origin "$branch_name"

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

echo "[deploy] Waiting for postgres to be ready..."
for attempt in $(seq 1 10); do
  if docker compose \
    --project-name "$project_name" \
    --env-file "$env_file" \
    -f "$compose_file" \
    exec -T postgres pg_isready -U "$POSTGRES_USER" -q 2>/dev/null; then
    echo "[deploy] postgres is ready."
    break
  fi
  if [[ $attempt -eq 10 ]]; then
    echo "Error: postgres not ready after 10 attempts." >&2
    exit 1
  fi
  sleep 3
done

if [[ "$skip_db_migrate" != "true" ]]; then
  ./scripts/create-db-restore-point.sh \
    --env-file "$env_file" \
    --compose-file "$compose_file" \
    --compose-project "$project_name" \
    --postgres-service postgres \
    --timeout 120

  migration_table_exists="$(docker compose \
    --project-name "$project_name" \
    --env-file "$env_file" \
    -f "$compose_file" \
    exec -T postgres psql "$DATABASE_URL" -X -v ON_ERROR_STOP=1 -Atc \
    "SELECT to_regclass('public.payload_migrations') IS NOT NULL;")"

  if [[ "$migration_table_exists" == "t" ]]; then
    dev_marker_present="$(docker compose \
      --project-name "$project_name" \
      --env-file "$env_file" \
      -f "$compose_file" \
      exec -T postgres psql "$DATABASE_URL" -X -v ON_ERROR_STOP=1 -Atc \
      "SELECT 1 FROM payload_migrations WHERE batch = -1 LIMIT 1;")"

    if [[ "$dev_marker_present" == "1" ]]; then
      echo "[deploy] Restoring legacy migration baseline (20260614_210456)."
      # The previous VPS cutover treated the existing dev-pushed schema as this
      # baseline. Replaying its CREATE TABLE statements would fail on existing tables.
      docker compose \
        --project-name "$project_name" \
        --env-file "$env_file" \
        -f "$compose_file" \
        exec -T postgres psql "$DATABASE_URL" -X -v ON_ERROR_STOP=1 -c \
        "BEGIN;
         INSERT INTO payload_migrations (name, batch, created_at, updated_at)
         SELECT '20260614_210456', 1, NOW(), NOW()
         WHERE NOT EXISTS (SELECT 1 FROM payload_migrations WHERE name = '20260614_210456');
         DELETE FROM payload_migrations WHERE batch = -1;
         COMMIT;"
    fi
  fi

  docker compose \
    --project-name "$project_name" \
    --env-file "$env_file" \
    -f "$compose_file" \
    build migrator

  docker compose \
    --project-name "$project_name" \
    --env-file "$env_file" \
    -f "$compose_file" \
    run --rm -T migrator pnpm run payload:container migrate </dev/null
fi

website_image="${project_name}-app:latest"
docker image rm -f "$website_image" 2>/dev/null || true

docker compose \
  --project-name "$project_name" \
  --env-file "$env_file" \
  -f "$compose_file" \
  up -d --build --remove-orphans

if [[ -n "${APP_PORT:-}" ]]; then
  healthcheck_path="${APP_HEALTHCHECK_PATH:-/}"

  for attempt in $(seq 1 30); do
    if wget -q -O /dev/null "http://127.0.0.1:${APP_PORT}${healthcheck_path}"; then
      docker compose \
        --project-name "$project_name" \
        --env-file "$env_file" \
        -f "$compose_file" \
        ps
      exit 0
    fi

    sleep 2
  done

  echo "Application health check failed on http://127.0.0.1:${APP_PORT}${healthcheck_path}" >&2
  exit 1
fi

docker compose \
  --project-name "$project_name" \
  --env-file "$env_file" \
  -f "$compose_file" \
  ps
