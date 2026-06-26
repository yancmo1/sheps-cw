#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"
DITDIT_URL="${DITDIT_URL:-http://localhost:3000}"

run_compose() {
  if docker compose version >/dev/null 2>&1; then
    docker compose -f "$COMPOSE_FILE" "$@"
    return
  fi

  if command -v docker-compose >/dev/null 2>&1; then
    docker-compose -f "$COMPOSE_FILE" "$@"
    return
  fi

  echo "Docker Compose is required. Install the Docker Compose plugin or docker-compose." >&2
  exit 1
}

find_chromium() {
  for command_name in chromium-browser chromium google-chrome google-chrome-stable; do
    if command -v "$command_name" >/dev/null 2>&1; then
      echo "$command_name"
      return
    fi
  done

  echo "Chromium was not found. Install chromium-browser on the Raspberry Pi." >&2
  exit 1
}

run_compose up -d --build

if command -v curl >/dev/null 2>&1; then
  for _ in {1..30}; do
    if curl --silent --fail "$DITDIT_URL" >/dev/null; then
      break
    fi
    sleep 1
  done
fi

CHROMIUM="$(find_chromium)"

exec "$CHROMIUM" \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --app="$DITDIT_URL"
