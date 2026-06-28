# Dit Dit PRD

Last Updated: June 28, 2026

## Product Summary

Dit Dit is the first runnable app shell for the Sheps CW project. The current goal is not full Morse training yet. The current goal is to prove that the app can launch cleanly, look good on the Raspberry Pi touchscreen, and provide a simple touch-first home screen for future practice, settings, and exit workflows.

Dit Dit is built under the W5XY Labs brand and uses Didah/CW language to keep the app approachable, recognizable, and connected to real Morse learning culture.

## Current Repository Reality

The repo now has one active app area and one archived prototype:

```text
app/
├── src/                 # current touch-first app shell
├── package.json
├── Dockerfile
└── vite.config.js

legacy/
└── app-prototype/       # archived earlier dashboard prototype
```

The active app is in:

```text
app/
```

The older dashboard was moved to:

```text
legacy/app-prototype/
```

## Important Technical Gap

`docker-compose.yml` currently builds using:

```yaml
context: ./app
```

Docker and scripts now target top-level `app/`, which is the official app home.

## Current App Shell

The new Dit Dit app currently provides:

- W5XY Labs brand kicker.
- Main title: `Dit Dit`.
- Subtitle: `CW Trainer`.
- Large touch-friendly buttons:
  - Practice
  - Settings
  - Exit to Desktop
- Placeholder screens for Practice, Settings, and Exit.

The app is intentionally minimal. This is good. The current milestone is visual proof and kiosk/navigation flow, not training logic.

## UX Direction

The app should feel:

- Simple
- Friendly
- Touch-first
- Easy to read from a small display
- Calm enough for daily practice
- More like a dedicated learning box than a generic web page

The Raspberry Pi touchscreen should be treated as the primary early target. Desktop browser support is useful for development, but the Pi display should drive layout decisions.

## Kiosk / Pi Startup Requirement

When the Pi boots, the user should not be trapped immediately inside the app.

Planned startup behavior:

1. Pi boots.
2. User sees a short startup screen/message saying Dit Dit is about to launch.
3. User has a small window of time to cancel to desktop.
4. If not canceled, Dit Dit launches in kiosk/fullscreen mode.
5. Inside the app, `Exit to Desktop` should eventually connect to the Pi launcher layer, not just a React placeholder.

This is a launcher/platform feature, not just a React feature.

## Non-Goals Right Now

Do not build these yet unless specifically requested:

- Full Morse timing engine.
- Real practice session logic.
- Audio engine.
- GPIO key/paddle input.
- Statistics storage.
- Adaptive learning engine.
- User accounts.

Those belong after the app shell, kiosk launch, and project structure are stable.

## Next Best Tasks

1. Keep top-level `app/` as the only active Dit Dit app home.
2. Keep `legacy/app-prototype/` as read-only reference unless intentionally revived.
3. Test the app locally.
4. Test the app through Docker.
5. Test on the Raspberry Pi touchscreen.
6. Continue kiosk launcher improvements (cancel-to-desktop behavior).
7. Then begin the first real Practice screen.

## First Practice Screen Target

The first real practice screen should stay simple:

- Show current lesson/focus.
- Provide a large Start/Stop practice control.
- Display input method placeholder.
- Display a basic response area.
- Avoid scoring complexity until the Morse engine exists.

## Open Decisions

- Should the project eventually remove `legacy/app-prototype/` entirely or keep it as historical reference?
- Should the kiosk launcher remain in `deploy/pi/` or move to a dedicated runtime package later?
- Should the app name be `Dit Dit`, `Dit Dit Box`, or `Dit Dit CW Trainer` on the device home screen?
- Should the exit flow only exit fullscreen browser, or should it stop the service and return to desktop?
