#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: ./scripts/deploy-vps.sh [--branch <branch>] [--env-file <path>] [--compose-file <path>] [--skip-db-migrate]
EOF
}

branch_name="prod"
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

if [[ "$skip_db_migrate" != "true" ]]; then
  ./scripts/vps-db-migrate.sh \
    --branch "$branch_name" \
    --env-file "$env_file" \
    --compose-file "$compose_file" \
    --skip-git-sync
fi

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
