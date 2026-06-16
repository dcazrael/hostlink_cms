#!/usr/bin/env sh
set -eu

# Usage:
#   ./scripts/create-db-restore-point.sh
#   ./scripts/create-db-restore-point.sh --env-file .env.production --compose-file docker-compose.vps.yml --compose-project hostlink-site
#
# Flags:
#   --env-file PATH         Env file to source for POSTGRES_USER and POSTGRES_DB.
#   --compose-file PATH     Docker Compose file (default: uses project docker-compose.yml).
#   --compose-project NAME  Compose project name (default: hostlink_cms).
#   --postgres-service NAME Service name for postgres (default: postgres).
#   --backup-dir PATH       Output directory (default: $ROOT/backups/restore-points).
#   --timeout SECS          Timeout for the pg_dump command (default: 120).
#   --no-readiness-check    Skip pg_isready wait.
#   -h|--help               Show this help.

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Defaults
BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/backups/restore-points}"
POSTGRES_SERVICE="postgres"
COMPOSE_PROJECT=""
COMPOSE_FILE=""
ENV_FILE=""
TIMEOUT=120
SKIP_READINESS="false"

while [ $# -gt 0 ]; do
  case "$1" in
    --env-file)
      ENV_FILE="${2:-}"
      shift 2
      ;;
    --compose-file)
      COMPOSE_FILE="${2:-}"
      shift 2
      ;;
    --compose-project)
      COMPOSE_PROJECT="${2:-}"
      shift 2
      ;;
    --postgres-service)
      POSTGRES_SERVICE="${2:-}"
      shift 2
      ;;
    --backup-dir)
      BACKUP_DIR="${2:-}"
      shift 2
      ;;
    --timeout)
      TIMEOUT="${2:-}"
      shift 2
      ;;
    --no-readiness-check)
      SKIP_READINESS="true"
      shift
      ;;
    -h|--help)
      cat <<'HELP'
Usage: ./scripts/create-db-restore-point.sh [OPTIONS]

Create a Postgres dump (custom format) before running migrations.

Flags:
  --env-file PATH         Env file for POSTGRES_USER / POSTGRES_DB.
  --compose-file PATH     Docker Compose file.
  --compose-project NAME  Compose project name (default: from env or hostlink_cms).
  --postgres-service NAME Postgres Docker service name (default: postgres).
  --backup-dir PATH       Output directory (default: backups/restore-points).
  --timeout SECS          pg_dump timeout in seconds (default: 120).
  --no-readiness-check    Skip pg_isready wait.
  -h|--help               This help.
HELP
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

# --- DB identity -----------------------------------------------------------
DB_USER="hostlink"
DB_NAME="hostlink"

if [ -n "$ENV_FILE" ]; then
  if [ ! -f "$ENV_FILE" ]; then
    echo "Error: --env-file not found: $ENV_FILE" >&2
    exit 1
  fi
  # Source only the variables we need
  _val="$(grep -s '^POSTGRES_USER=' "$ENV_FILE" | cut -d= -f2- | head -1)"
  [ -n "$_val" ] && DB_USER="$_val"
  _val="$(grep -s '^POSTGRES_DB=' "$ENV_FILE" | cut -d= -f2- | head -1)"
  [ -n "$_val" ] && DB_NAME="$_val"
fi

# --- Compose flags ----------------------------------------------------------
COMPOSE_FLAGS=""
COMPOSE_PROJECT_ACTUAL="${COMPOSE_PROJECT:-hostlink_cms}"

if [ -n "$COMPOSE_FILE" ]; then
  if [ ! -f "$COMPOSE_FILE" ]; then
    echo "Error: --compose-file not found: $COMPOSE_FILE" >&2
    exit 1
  fi
  COMPOSE_FLAGS="-f $COMPOSE_FILE --project-name $COMPOSE_PROJECT_ACTUAL"
fi

compose_cmd() {
  docker compose $COMPOSE_FLAGS "$@"
}

# --- Tool check ------------------------------------------------------------
if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker CLI not found."
  echo "Run this command on the host machine (not inside a container)."
  exit 1
fi

# --- Service check ---------------------------------------------------------
if ! compose_cmd ps "$POSTGRES_SERVICE" >/dev/null 2>&1; then
  echo "Error: $POSTGRES_SERVICE service is not available via docker compose."
  exit 1
fi

# --- DB readiness gate -----------------------------------------------------
if [ "$SKIP_READINESS" != "true" ]; then
  echo "[restore-point] Waiting for $POSTGRES_SERVICE to be ready..."
  _ready=0
  for _i in $(seq 1 15); do
    if compose_cmd exec -T "$POSTGRES_SERVICE" \
      pg_isready -U "$DB_USER" -q 2>/dev/null; then
      _ready=1
      break
    fi
    sleep 2
  done
  if [ "$_ready" -ne 1 ]; then
    echo "Error: $POSTGRES_SERVICE not ready after 30s." >&2
    exit 1
  fi
  echo "[restore-point] $POSTGRES_SERVICE is ready."
fi

# --- Backup ----------------------------------------------------------------
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="$BACKUP_DIR/hostlink_${TIMESTAMP}.dump"

mkdir -p "$BACKUP_DIR"

echo "[restore-point] Creating backup: $BACKUP_FILE"
echo "[restore-point]   DB user: $DB_USER   DB name: $DB_NAME"

if command -v timeout >/dev/null 2>&1; then
  timeout "$TIMEOUT" compose_cmd exec -T "$POSTGRES_SERVICE" \
    pg_dump \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --format=custom \
    --no-owner \
    --no-privileges >"$BACKUP_FILE"
else
  compose_cmd exec -T "$POSTGRES_SERVICE" \
    pg_dump \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --format=custom \
    --no-owner \
    --no-privileges >"$BACKUP_FILE"
fi

if [ ! -s "$BACKUP_FILE" ]; then
  echo "Error: backup file is empty: $BACKUP_FILE" >&2
  rm -f "$BACKUP_FILE"
  exit 1
fi

if command -v sha256sum >/dev/null 2>&1; then
  sha256sum "$BACKUP_FILE" >"${BACKUP_FILE}.sha256"
fi

echo "[restore-point] Backup complete: $BACKUP_FILE"
echo "[restore-point] Next step: run your migration."
