#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"
DITDIT_URL="${DITDIT_URL:-http://localhost:3000}"
WAIT_SECONDS="${WAIT_SECONDS:-60}"

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

wait_for_ditdit() {
  echo "Waiting for Dit Dit at $DITDIT_URL..."

  for _ in $(seq 1 "$WAIT_SECONDS"); do
    if command -v curl >/dev/null 2>&1; then
      if curl --silent --fail "$DITDIT_URL" >/dev/null; then
        return
      fi
    elif command -v wget >/dev/null 2>&1; then
      if wget --quiet --spider "$DITDIT_URL"; then
        return
      fi
    else
      echo "curl or wget is required to wait for Dit Dit before launching kiosk mode." >&2
      exit 1
    fi

    sleep 1
  done

  echo "Dit Dit did not respond at $DITDIT_URL after $WAIT_SECONDS seconds." >&2
  run_compose ps >&2 || true
  exit 1
}

run_compose up -d --build
wait_for_ditdit

CHROMIUM="$(find_chromium)"

exec "$CHROMIUM" \
  --kiosk \
  --start-fullscreen \
  --no-first-run \
  --noerrdialogs \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-pinch \
  --overscroll-history-navigation=0 \
  --check-for-update-interval=31536000 \
  --touch-events=enabled \
  --app="$DITDIT_URL"
