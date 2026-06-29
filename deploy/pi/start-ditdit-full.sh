#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$PROJECT_ROOT/deploy/pi/docker-compose.yml"
KIOSK_LAUNCHER="$PROJECT_ROOT/deploy/pi/start-ditdit-kiosk.sh"

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Docker Compose file was not found at $COMPOSE_FILE." >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required. Install Docker, then retry." >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose plugin is required. Confirm 'docker compose version' works." >&2
  exit 1
fi

cd "$PROJECT_ROOT"

echo "Dit Dit full launcher: this is slower and intended for troubleshooting or update testing."
echo "Building Docker image..."
docker compose -f "$COMPOSE_FILE" build

echo "Starting Docker app service without another build..."
docker compose -f "$COMPOSE_FILE" up -d --no-build

echo "Launching fast kiosk flow..."
exec "$KIOSK_LAUNCHER"
