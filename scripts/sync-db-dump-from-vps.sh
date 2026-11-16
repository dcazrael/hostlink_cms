#!/usr/bin/env bash
set -euo pipefail

# sync-db-dump-from-vps.sh
#
# Creates a compressed/custom-format Postgres dump from the VPS Docker Postgres
# container and downloads it to the local machine.
#
# This does NOT restore into the local database.
# This does NOT modify production data.

SSH_USER="${SSH_USER:-root}" # change if needed
SSH_HOST="${SSH_HOST:-85.215.37.60}"
SSH_PORT="${SSH_PORT:-22}"

REMOTE_PROJECT_PATH="${REMOTE_PROJECT_PATH:-/srv/hostlink/site}"
REMOTE_PG_CONTAINER="${REMOTE_PG_CONTAINER:-hostlink-site-postgres-1}"

REMOTE_ENV_FILE="${REMOTE_ENV_FILE:-.env.production}"

LOCAL_DUMP_DIR="${LOCAL_DUMP_DIR:-./backups/production}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
LOCAL_DUMP_FILE="${LOCAL_DUMP_DIR}/hostlink_site-${TIMESTAMP}.dump"

mkdir -p "$LOCAL_DUMP_DIR"

echo "Creating dump from VPS Postgres container..."
echo "Remote: ${SSH_USER}@${SSH_HOST}:${SSH_PORT}"
echo "Container: ${REMOTE_PG_CONTAINER}"
echo "Project path: ${REMOTE_PROJECT_PATH}"
echo "Output: ${LOCAL_DUMP_FILE}"
echo

ssh -p "$SSH_PORT" "${SSH_USER}@${SSH_HOST}" "
  set -euo pipefail
  cd '${REMOTE_PROJECT_PATH}'

  if [ ! -f '${REMOTE_ENV_FILE}' ]; then
    echo 'Missing env file: ${REMOTE_PROJECT_PATH}/${REMOTE_ENV_FILE}' >&2
    exit 1
  fi

  set -a
  . './${REMOTE_ENV_FILE}'
  set +a

  if [ -z \"\${POSTGRES_DB:-}\" ]; then
    echo 'POSTGRES_DB is missing in ${REMOTE_ENV_FILE}' >&2
    exit 1
  fi

  if [ -z \"\${POSTGRES_USER:-}\" ]; then
    echo 'POSTGRES_USER is missing in ${REMOTE_ENV_FILE}' >&2
    exit 1
  fi

  docker exec \
    -e PGPASSWORD=\"\${POSTGRES_PASSWORD:-}\" \
    '${REMOTE_PG_CONTAINER}' \
    pg_dump \
      -U \"\$POSTGRES_USER\" \
      -d \"\$POSTGRES_DB\" \
      -Fc \
      --no-owner \
      --no-privileges
" > "$LOCAL_DUMP_FILE"

echo
echo "Dump downloaded successfully:"
echo "$LOCAL_DUMP_FILE"
