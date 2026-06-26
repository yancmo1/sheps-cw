#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LAUNCHER="$REPO_ROOT/deploy/pi/start-ditdit-kiosk.sh"
DESKTOP_DIR="${XDG_DESKTOP_DIR:-$HOME/Desktop}"
APPLICATIONS_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/applications"
DESKTOP_FILE_NAME="ditdit-kiosk.desktop"

if [[ ! -x "$LAUNCHER" ]]; then
  chmod +x "$LAUNCHER"
fi

mkdir -p "$DESKTOP_DIR" "$APPLICATIONS_DIR"

write_desktop_file() {
  local target="$1"

  cat > "$target" <<EOF
[Desktop Entry]
Type=Application
Name=Dit Dit
Comment=Start Dit Dit kiosk mode
Exec=/usr/bin/env bash "$LAUNCHER"
Path=$REPO_ROOT
Terminal=true
Categories=Education;
StartupNotify=false
EOF

  chmod +x "$target"

  if command -v gio >/dev/null 2>&1; then
    gio set "$target" metadata::trusted true >/dev/null 2>&1 || true
  fi
}

write_desktop_file "$APPLICATIONS_DIR/$DESKTOP_FILE_NAME"
write_desktop_file "$DESKTOP_DIR/$DESKTOP_FILE_NAME"

echo "Installed Dit Dit desktop shortcut:"
echo "  $DESKTOP_DIR/$DESKTOP_FILE_NAME"
echo
echo "Launch it from the Pi desktop session so Chromium can access the display."
