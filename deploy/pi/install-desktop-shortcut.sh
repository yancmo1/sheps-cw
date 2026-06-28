#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LAUNCHER="$REPO_ROOT/deploy/pi/start-ditdit-kiosk.sh"
SOURCE_DESKTOP_FILE="$REPO_ROOT/deploy/pi/DitDit.desktop"
DESKTOP_DIR="${XDG_DESKTOP_DIR:-$HOME/Desktop}"
TARGET_DESKTOP_FILE="$DESKTOP_DIR/DitDit.desktop"
LIBFM_CONFIG_DIR="$HOME/.config/libfm"
LIBFM_CONFIG_FILE="$LIBFM_CONFIG_DIR/libfm.conf"

if [[ ! -f "$SOURCE_DESKTOP_FILE" ]]; then
  echo "Desktop shortcut template was not found at $SOURCE_DESKTOP_FILE." >&2
  exit 1
fi

echo "Making launcher executable..."
chmod +x "$LAUNCHER"

echo "Installing desktop shortcut to $TARGET_DESKTOP_FILE..."
mkdir -p "$DESKTOP_DIR"
cp "$SOURCE_DESKTOP_FILE" "$TARGET_DESKTOP_FILE"

echo "Updating desktop shortcut launcher path..."
awk -v launcher="$LAUNCHER" '
  BEGIN { replaced = 0 }
  /^Exec=/ {
    print "Exec=" launcher
    replaced = 1
    next
  }
  { print }
  END {
    if (!replaced) {
      print "Exec=" launcher
    }
  }
' "$TARGET_DESKTOP_FILE" > "$TARGET_DESKTOP_FILE.tmp"
mv "$TARGET_DESKTOP_FILE.tmp" "$TARGET_DESKTOP_FILE"

chmod +x "$TARGET_DESKTOP_FILE"

echo "Configuring file manager execute behavior..."
mkdir -p "$LIBFM_CONFIG_DIR"

if [[ -f "$LIBFM_CONFIG_FILE" ]]; then
  if grep -q '^quick_exec=' "$LIBFM_CONFIG_FILE"; then
    sed -i 's/^quick_exec=.*/quick_exec=1/' "$LIBFM_CONFIG_FILE"
  else
    printf '\nquick_exec=1\n' >> "$LIBFM_CONFIG_FILE"
  fi
else
  cat > "$LIBFM_CONFIG_FILE" <<'EOF'
[config]
quick_exec=1
EOF
fi

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
