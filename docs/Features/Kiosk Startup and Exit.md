# Kiosk Startup and Exit

Last Updated: June 28, 2026

## Feature Goal

Dit Dit should feel like a small dedicated training box, but the user should not be trapped inside the app when the Raspberry Pi boots.

The app should launch automatically when desired, while still giving the user a clear way to cancel to the desktop during startup.

## Startup Flow

Target Raspberry Pi boot behavior:

1. Raspberry Pi starts.
2. A simple startup message appears:

   ```text
   Dit Dit is starting...
   Press Esc or click Cancel to go to desktop.
   ```

3. The user has a short cancel window.
4. If the user cancels, the Pi continues to the desktop.
5. If the user does nothing, Dit Dit launches in fullscreen/kiosk mode.

## In-App Exit Flow

The app already has an `Exit to Desktop` button in the current `app` interface.

Current behavior:

- The button opens an exit confirmation screen.
- Confirming exit attempts to close the browser window.
- If Chromium does not allow the web app to close itself, the app shows guidance to close the Chromium window from the Pi desktop.

Future behavior:

- Exit should close or leave the fullscreen/kiosk browser.
- Exit should return the user to the Pi desktop.
- The implementation may need to happen outside React through the launcher/service layer.

## Technical Notes

This feature likely needs more than React.

Possible pieces:

- Raspberry Pi desktop autostart entry.
- Shell launcher script.
- Browser kiosk command.
- Small pre-launch cancel dialog or countdown.
- Optional systemd user service if needed later.

The React app can display the Exit button, but the actual desktop exit behavior belongs to the Pi launcher environment.

## Recommended First Implementation

Start simple.

1. Create a launcher script that shows a cancel prompt/countdown.
2. If not canceled, open Chromium in kiosk mode to the Dit Dit app URL.
3. Keep the script readable and easy to disable while testing.
4. Do not make the Pi hard to recover during early development.

## Recovery Requirement

There must always be a clear way to recover the Pi during development.

Acceptable recovery options:

- Keyboard shortcut exits kiosk.
- Cancel button during startup.
- Known terminal command disables autostart.
- SSH access remains available.

## Open Questions

- Should the app run from local Vite during development or from Docker/nginx during kiosk testing?
- Current Pi appliance deployment serves Dit Dit at `127.0.0.1:3000` / `http://localhost:3000`; should any separate local-development Docker path keep using another port?
- Should the launcher remain under `deploy/pi/` long term, or move to another runtime/deployment package later?
- Should `Exit to Desktop` call a local helper endpoint, close the browser, or show instructions only?
- Should the cancel window be 5 seconds, 10 seconds, or user-configurable?

## Codex Guidance

Do not wire irreversible autostart behavior until desktop recovery options are validated.

Current app home:

```text
app/
```
