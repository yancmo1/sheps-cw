# Dit Dit PRD

Last Updated: June 26, 2026

## Product Summary

Dit Dit is the first runnable app shell for the Sheps CW project. The current goal is not full Morse training yet. The current goal is to prove that the app can launch cleanly, look good on the Raspberry Pi touchscreen, and provide a simple touch-first home screen for future practice, settings, and exit workflows.

Dit Dit is built under the W5XY Labs brand and uses Didah/CW language to keep the app approachable, recognizable, and connected to real Morse learning culture.

## Current Repository Reality

The repo now contains two app areas:

```text
app/
├── src/                 # earlier Vite dashboard prototype
├── package.json         # earlier app package
├── Dockerfile           # currently builds from ./app
└── ditdit/
    ├── package.json     # newer Dit Dit app package
    └── src/
        ├── App.jsx      # current touch-first app shell
        ├── main.jsx
        └── styles.css
```

The newer app is in:

```text
app/ditdit/
```

The older dashboard still exists in:

```text
app/src/
```

## Important Technical Gap

`docker-compose.yml` currently builds using:

```yaml
context: ./app
```

That means the container currently targets the older top-level `app/` package unless the Docker setup is changed.

Before continuing Pi/kiosk work, Codex should align the Docker and run commands with the intended app location:

```text
app/ditdit
```

Recommended next technical task:

- Decide whether `app/ditdit` is the permanent app home.
- If yes, update Docker build context and commands to use `app/ditdit`.
- Keep the older `app/src` prototype only if it still has value; otherwise remove or archive it to avoid confusion.

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

1. Cleanly choose the app home: `app/ditdit` or top-level `app`.
2. Update Docker and package commands to match that decision.
3. Update README/AGENTS/docs so Codex knows where to work.
4. Test the new app locally.
5. Test the new app through Docker.
6. Test on the Raspberry Pi touchscreen.
7. Create a simple kiosk launcher script with cancel-to-desktop behavior.
8. Then begin the first real Practice screen.

## First Practice Screen Target

The first real practice screen should stay simple:

- Show current lesson/focus.
- Provide a large Start/Stop practice control.
- Display input method placeholder.
- Display a basic response area.
- Avoid scoring complexity until the Morse engine exists.

## Open Decisions

- Should the project keep the older `app/src` dashboard?
- Should Docker build from `app/ditdit` directly?
- Should the kiosk launcher live in `scripts/`, `app/ditdit/scripts/`, or a future `deploy/pi/` folder?
- Should the app name be `Dit Dit`, `Dit Dit Box`, or `Dit Dit CW Trainer` on the device home screen?
- Should the exit flow only exit fullscreen browser, or should it stop the service and return to desktop?
