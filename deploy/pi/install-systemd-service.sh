#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$REPO_ROOT/deploy/pi/docker-compose.yml"
SERVICE_TEMPLATE="$REPO_ROOT/deploy/pi/ditditbox.service"
SERVICE_NAME="ditditbox.service"
SERVICE_DEST="/etc/systemd/system/$SERVICE_NAME"
APP_URL="${DITDIT_URL:-http://localhost:3000}"
WAIT_SECONDS="${WAIT_SECONDS:-45}"

timestamp() {
  date '+%Y-%m-%d %H:%M:%S'
}

log() {
  echo "[$(timestamp)] $*"
}

fail() {
  echo "[$(timestamp)] ERROR: $*" >&2
  exit 1
}

if [[ ! -f "$COMPOSE_FILE" ]]; then
  fail "Expected Compose file was not found at $COMPOSE_FILE."
fi

if [[ ! -f "$SERVICE_TEMPLATE" ]]; then
  fail "Expected service template was not found at $SERVICE_TEMPLATE."
fi

if ! command -v docker >/dev/null 2>&1; then
  fail "Docker is required. Install Docker, then rerun this installer."
fi

if ! docker compose version >/dev/null 2>&1; then
  fail "Docker Compose plugin is required. Confirm 'docker compose version' works."
fi

if ! command -v curl >/dev/null 2>&1; then
  fail "curl is required to verify Dit Dit after service start. Install it with: sudo apt install curl"
fi

DOCKER_BIN="$(command -v docker)"
SERVICE_TMP="$(mktemp)"
trap 'rm -f "$SERVICE_TMP"' EXIT

if [[ "$DOCKER_BIN" != "/usr/bin/docker" ]]; then
  log "Docker was found at $DOCKER_BIN; patching service ExecStart/ExecStop for this host."
  sed "s#/usr/bin/docker#$DOCKER_BIN#g" "$SERVICE_TEMPLATE" > "$SERVICE_TMP"
else
  cp "$SERVICE_TEMPLATE" "$SERVICE_TMP"
fi

cd "$REPO_ROOT"

log "Building Dit Dit Docker image for install/update..."
docker compose -f "$COMPOSE_FILE" build

log "Installing $SERVICE_NAME to $SERVICE_DEST..."
sudo cp "$SERVICE_TMP" "$SERVICE_DEST"
sudo chmod 0644 "$SERVICE_DEST"

log "Reloading systemd and enabling $SERVICE_NAME..."
sudo systemctl daemon-reload
sudo systemctl enable "$SERVICE_NAME"

log "Restarting $SERVICE_NAME..."
sudo systemctl restart "$SERVICE_NAME"

log "Service status:"
sudo systemctl status "$SERVICE_NAME" --no-pager || true

log "Waiting for Dit Dit at $APP_URL..."
for _ in $(seq 1 "$WAIT_SECONDS"); do
  if curl -fsS "$APP_URL" >/dev/null 2>&1; then
    log "Success: Dit Dit is responding at $APP_URL."
    exit 0
  fi
  sleep 1
done

echo >&2
echo "Dit Dit did not respond at $APP_URL after ${WAIT_SECONDS}s." >&2
echo "Recent container status and logs:" >&2
docker compose -f "$COMPOSE_FILE" ps >&2 || true
docker compose -f "$COMPOSE_FILE" logs --tail=80 >&2 || true
exit 1
