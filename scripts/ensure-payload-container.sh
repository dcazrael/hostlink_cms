#!/bin/sh
set -eu

payload_running="$(docker compose ps -q payload)"

if [ -z "$payload_running" ]; then
  docker compose up -d postgres payload
  exit 0
fi

payload_state="$(docker inspect -f '{{.State.Status}}' "$payload_running")"

if [ "$payload_state" != "running" ]; then
  docker compose up -d postgres payload
fi
