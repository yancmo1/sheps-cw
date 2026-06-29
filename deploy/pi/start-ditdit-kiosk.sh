#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$PROJECT_ROOT/deploy/pi/docker-compose.yml"
DITDIT_URL="${DITDIT_URL:-http://localhost:3000}"
WAIT_SECONDS="${WAIT_SECONDS:-20}"
SERVICE_NAME="${DITDIT_SERVICE_NAME:-ditditbox.service}"
LOG_DIR="/home/pi/.cache/ditdit"
CHROMIUM_LOG="$LOG_DIR/chromium.log"

RUN_STARTED_AT="$(date +%s)"
STEP_STARTED_AT="$RUN_STARTED_AT"

timestamp() {
  date '+%Y-%m-%d %H:%M:%S'
}

mark_step() {
  local label="$1"
  local now
  now="$(date +%s)"
  echo "[$(timestamp)] $label: $((now - STEP_STARTED_AT))s"
  STEP_STARTED_AT="$now"
}

fail() {
  echo "[$(timestamp)] ERROR: $*" >&2
  exit 1
}

health_check() {
  curl -fsS "$DITDIT_URL" >/dev/null 2>&1
}

run_compose() {
  docker compose -f "$COMPOSE_FILE" "$@"
}

check_start_dependencies() {
  if [[ ! -f "$COMPOSE_FILE" ]]; then
    fail "Docker Compose file was not found at $COMPOSE_FILE."
  fi

  if ! command -v docker >/dev/null 2>&1; then
    fail "Docker is required to start Dit Dit when the service is not already running."
  fi

  if ! docker compose version >/dev/null 2>&1; then
    fail "Docker Compose plugin is required. Confirm 'docker compose version' works."
  fi
}

start_service_or_container() {
  echo "[$(timestamp)] Dit Dit is not responding; starting the app service without rebuilding..."

  if command -v systemctl >/dev/null 2>&1 && systemctl cat "$SERVICE_NAME" >/dev/null 2>&1; then
    if sudo systemctl start "$SERVICE_NAME"; then
      mark_step "service/container start"
      return
    fi
    echo "[$(timestamp)] systemd start failed; falling back to Docker Compose --no-build." >&2
  else
    echo "[$(timestamp)] $SERVICE_NAME is not installed; falling back to Docker Compose --no-build."
  fi

  run_compose up -d --no-build
  mark_step "service/container start"
}

wait_for_app() {
  echo "[$(timestamp)] Waiting for Dit Dit at $DITDIT_URL..."
  for _ in $(seq 1 "$WAIT_SECONDS"); do
    if health_check; then
      mark_step "wait for app"
      return
    fi
    sleep 1
  done

  echo "[$(timestamp)] Dit Dit did not respond at $DITDIT_URL after ${WAIT_SECONDS}s." >&2
  echo "[$(timestamp)] Docker Compose status:" >&2
  run_compose ps >&2 || true
  echo "[$(timestamp)] Recent Docker Compose logs:" >&2
  run_compose logs --tail=80 >&2 || true
  exit 1
}

find_chromium() {
  for command_name in chromium chromium-browser; do
    if command -v "$command_name" >/dev/null 2>&1; then
      echo "$command_name"
      return
    fi
  done

  echo "Chromium was not found. Install it with:" >&2
  echo "  sudo apt install chromium" >&2
  exit 1
}

if ! command -v curl >/dev/null 2>&1; then
  fail "curl is required for kiosk health checks. Install it with: sudo apt install curl"
fi

cd "$PROJECT_ROOT"

if health_check; then
  echo "Dit Dit is already running."
  mark_step "app health check"
else
  mark_step "app health check"
  check_start_dependencies
  start_service_or_container
  wait_for_app
fi

CHROMIUM="$(find_chromium)"
export DISPLAY="${DISPLAY:-:0}"
export XAUTHORITY="${XAUTHORITY:-/home/pi/.Xauthority}"
export LIBGL_ALWAYS_SOFTWARE="${LIBGL_ALWAYS_SOFTWARE:-1}"

rm -rf /tmp/ditdit-kiosk-profile
mkdir -p "$LOG_DIR"

mark_step "Chromium launch"
echo "[$(timestamp)] Launching Chromium kiosk mode with $CHROMIUM."
echo "[$(timestamp)] Chromium log: $CHROMIUM_LOG"
echo "[$(timestamp)] Total setup time: $(($(date +%s) - RUN_STARTED_AT))s"

exec "$CHROMIUM" \
  --kiosk \
  --disable-gpu \
  --disable-dev-shm-usage \
  --no-first-run \
  --no-default-browser-check \
  --disable-session-crashed-bubble \
  --disable-infobars \
  --disable-features=TranslateUI \
  --check-for-update-interval=31536000 \
  --user-data-dir=/tmp/ditdit-kiosk-profile \
  "$DITDIT_URL" \
  >"$CHROMIUM_LOG" 2>&1
