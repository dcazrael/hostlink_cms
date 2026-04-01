#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: ./scripts/vps-db-migrate.sh [--branch <branch>] [--env-file <path>] [--compose-file <path>] [--skip-git-sync]
EOF
}

branch_name="prod"
env_file=".env.production"
compose_file="docker-compose.vps.yml"
skip_git_sync="false"

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
    echo "Refusing to run migrations with uncommitted changes in the VPS checkout." >&2
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
  build website

for attempt in $(seq 1 10); do
  if docker compose \
    --project-name "$project_name" \
    --env-file "$env_file" \
    -f "$compose_file" \
    run --rm website pnpm db:migrate; then
    exit 0
  fi

  sleep 3
done

echo "Database migration run failed after multiple attempts." >&2
exit 1
