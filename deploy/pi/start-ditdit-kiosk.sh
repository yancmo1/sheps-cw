#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$PROJECT_ROOT/deploy/pi/docker-compose.yml"
DITDIT_URL="${DITDIT_URL:-http://localhost:3000}"
WAIT_SECONDS="${WAIT_SECONDS:-60}"
DITDIT_CONTAINER_NAME="${DITDIT_CONTAINER_NAME:-ditdit}"
DITDIT_BUILD_ON_START="${DITDIT_BUILD_ON_START:-0}"
STARTUP_CANCEL_ENABLED="${STARTUP_CANCEL_ENABLED:-1}"
STARTUP_CANCEL_SECONDS="${STARTUP_CANCEL_SECONDS:-10}"
LOG_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/ditdit"
CHROMIUM_LOG="$LOG_DIR/chromium.log"

cd "$PROJECT_ROOT"

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

start_ditdit() {
  if [[ ! -f "$COMPOSE_FILE" ]]; then
    echo "Docker Compose file was not found at $COMPOSE_FILE." >&2
    echo "Cannot start Dit Dit kiosk mode without the Pi Compose file." >&2
    exit 1
  fi

  if [[ "$(docker inspect -f '{{.State.Running}}' "$DITDIT_CONTAINER_NAME" 2>/dev/null || true)" == "true" ]]; then
    echo "Dit Dit container '$DITDIT_CONTAINER_NAME' is already running."
    echo "Skipping Docker Compose startup."
    return
  fi

  echo "Project root: $PROJECT_ROOT"
  echo "Starting Dit Dit with Docker Compose..."

  if [[ "$DITDIT_BUILD_ON_START" == "1" ]]; then
    echo "DITDIT_BUILD_ON_START=1, forcing image rebuild before start."
    run_compose up -d --build
    return
  fi

  run_compose up -d
}

find_chromium() {
  for command_name in chromium-browser chromium; do
    if command -v "$command_name" >/dev/null 2>&1; then
      echo "$command_name"
      return
    fi
  done

  echo "Chromium was not found. Install chromium-browser on the Raspberry Pi." >&2
  exit 1
}

ensure_desktop_session() {
  if [[ -n "${DISPLAY:-}" || -n "${WAYLAND_DISPLAY:-}" ]]; then
    return
  fi

  if [[ -S /tmp/.X11-unix/X0 ]]; then
    export DISPLAY=:0
    echo "DISPLAY was not set. Using DISPLAY=:0."
    return
  fi

  cat >&2 <<'EOF'
No Raspberry Pi desktop session was detected.

Chromium kiosk mode must be launched from the Pi desktop session, or from an
environment that has DISPLAY or WAYLAND_DISPLAY set. If you run this over plain
SSH, Chromium cannot find the screen and exits with "Missing X server or
$DISPLAY".

Use the desktop shortcut installer:

  deploy/pi/install-desktop-shortcut.sh

Then launch Dit Dit from the Pi desktop.
EOF
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
  echo "Check the Docker Compose service status below and retry after fixing the app startup." >&2
  run_compose ps >&2 || true
  exit 1
}

show_startup_cancel_window() {
  if [[ "$STARTUP_CANCEL_ENABLED" != "1" ]]; then
    return
  fi

  if ! [[ "$STARTUP_CANCEL_SECONDS" =~ ^[0-9]+$ ]]; then
    echo "STARTUP_CANCEL_SECONDS must be a whole number. Using 10 seconds."
    STARTUP_CANCEL_SECONDS=10
  fi

  if ! command -v zenity >/dev/null 2>&1; then
    echo "zenity is not installed; skipping startup cancel window."
    return
  fi

  local zenity_exit=0

  zenity \
    --question \
    --title="Dit Dit Startup" \
    --ok-label="Launch Dit Dit" \
    --cancel-label="Cancel to Desktop" \
    --timeout="$STARTUP_CANCEL_SECONDS" \
    --width=520 \
    --text="Dit Dit will launch in $STARTUP_CANCEL_SECONDS seconds.\n\nSelect Cancel to Desktop to stay at the desktop." \
    || zenity_exit=$?

  case "$zenity_exit" in
    0)
      echo "Startup window confirmed: launching Dit Dit."
      ;;
    1)
      echo "Startup canceled by user. Staying on desktop."
      exit 0
      ;;
    5)
      echo "Startup window timed out; launching Dit Dit."
      ;;
    *)
      echo "Startup window failed with exit code $zenity_exit; launching Dit Dit."
      ;;
  esac
}

start_ditdit
wait_for_ditdit

CHROMIUM="$(find_chromium)"
ensure_desktop_session
show_startup_cancel_window

mkdir -p "$LOG_DIR"
export LIBGL_ALWAYS_SOFTWARE="${LIBGL_ALWAYS_SOFTWARE:-1}"

echo "Launching Chromium kiosk mode with $CHROMIUM..."
echo "Chromium log: $CHROMIUM_LOG"

exec "$CHROMIUM" \
  --kiosk \
  --no-first-run \
  --noerrdialogs \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-features=TranslateUI \
  --disable-gpu \
  --disable-gpu-compositing \
  --disable-gpu-rasterization \
  --disable-accelerated-2d-canvas \
  --disable-accelerated-video-decode \
  --disable-dev-shm-usage \
  --disable-pinch \
  --overscroll-history-navigation=0 \
  --check-for-update-interval=31536000 \
  --touch-events=enabled \
  "$DITDIT_URL" \
  >"$CHROMIUM_LOG" 2>&1
