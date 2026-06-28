#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LAUNCHER="$REPO_ROOT/deploy/pi/start-ditdit-kiosk.sh"
SOURCE_DESKTOP_FILE="$REPO_ROOT/deploy/pi/DitDit.desktop"
DESKTOP_DIR="${XDG_DESKTOP_DIR:-$HOME/Desktop}"
TARGET_DESKTOP_FILE="$DESKTOP_DIR/DitDit.desktop"

if [[ ! -f "$SOURCE_DESKTOP_FILE" ]]; then
  echo "Desktop shortcut template was not found at $SOURCE_DESKTOP_FILE." >&2
  exit 1
fi

echo "Making launcher executable..."
chmod +x "$LAUNCHER"

echo "Installing desktop shortcut to $TARGET_DESKTOP_FILE..."
mkdir -p "$DESKTOP_DIR"
cp "$SOURCE_DESKTOP_FILE" "$TARGET_DESKTOP_FILE"
chmod +x "$TARGET_DESKTOP_FILE"

if command -v gio >/dev/null 2>&1; then
  echo "Marking desktop shortcut trusted, if supported..."
  if ! gio set "$TARGET_DESKTOP_FILE" metadata::trusted true >/dev/null 2>&1; then
    echo "Could not mark the shortcut trusted automatically."
    echo "If the desktop asks what to do, right-click the Dit Dit icon and choose a trust option such as \"Trust this executable\"."
  fi
else
  echo "gio is not installed, so the shortcut could not be marked trusted automatically."
  echo "If the desktop asks what to do, right-click the Dit Dit icon and choose a trust option such as \"Trust this executable\"."
fi

echo "Installed Dit Dit desktop shortcut:"
echo "  $TARGET_DESKTOP_FILE"
echo
echo "Launch it from the Pi desktop session so Chromium can access the display."
