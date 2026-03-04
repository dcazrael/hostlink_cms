#!/usr/bin/env sh
set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/backups/restore-points}"

TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="$BACKUP_DIR/hostlink_${TIMESTAMP}.dump"

mkdir -p "$BACKUP_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker CLI not found."
  echo "Run this command on the host machine (not inside the payload container)."
  exit 1
fi

if ! docker compose ps postgres >/dev/null 2>&1; then
  echo "Error: postgres service is not available via docker compose."
  echo "Run this command from the project root where docker-compose.yml exists."
  exit 1
fi

echo "[restore-point] Creating backup at: $BACKUP_FILE"

docker compose exec -T postgres \
  pg_dump \
  -U hostlink \
  -d hostlink \
  --format=custom \
  --no-owner \
  --no-privileges >"$BACKUP_FILE"

if [ ! -s "$BACKUP_FILE" ]; then
  echo "Error: backup file is empty: $BACKUP_FILE"
  rm -f "$BACKUP_FILE"
  exit 1
fi

if command -v sha256sum >/dev/null 2>&1; then
  sha256sum "$BACKUP_FILE" >"${BACKUP_FILE}.sha256"
fi

echo "[restore-point] Backup complete: $BACKUP_FILE"
echo "[restore-point] Next step: run your migration."
