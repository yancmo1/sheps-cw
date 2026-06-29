# Dit Dit PRD

Last Updated: June 28, 2026

## Product Summary

Dit Dit is the React/Vite CW trainer app and product for the Sheps CW project. The current goal is still early-stage Morse training, but the app has moved beyond a static shell: it should launch cleanly, look good on the Raspberry Pi touchscreen, and provide a simple touch-first foundation for practice, settings, progress, and exit workflows.

Dit Dit is built under the W5XY Labs brand and uses Didah/CW language to keep the app approachable, recognizable, and connected to real Morse learning culture.

Dit Dit Box is the Raspberry Pi appliance/kiosk deployment of Dit Dit. The active application lives in `app/`; the Pi appliance/kiosk layer lives in `deploy/pi/`.

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

## Deployment Alignment

The active Pi deployment builds the top-level `app/` and serves Dit Dit through the appliance layer in `deploy/pi/`.

```text
deploy/pi/
```

The Pi kiosk path currently serves the app at:

```text
http://localhost:3000
```

The `ditditbox.service` name is acceptable because it refers to the Dit Dit Box appliance deployment, not just the React app.

## Current App Shell

The new Dit Dit app currently provides:

- W5XY Labs brand kicker.
- Main title: `Dit Dit`.
- Subtitle: `CW Trainer`.
- Touch-friendly navigation for Practice, Progress, Settings, and Exit to Desktop.
- Browser-based Morse audio.
- Local settings persistence.
- Local progress history.
- Missed-character practice.
- Exit-to-desktop flow foundation for the Pi kiosk environment.

The app is intentionally still modest. This is good. The current milestone is a dependable touch-first practice foundation and Pi kiosk/navigation flow, not a complete adaptive learning platform.

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
5. Inside the app, `Exit to Desktop` should continue to coordinate cleanly with the Pi launcher layer.

This is a launcher/platform feature, not just a React feature.

## Non-Goals Right Now

Do not build these yet unless specifically requested:

- Full Morse timing engine.
- GPIO key/paddle input.
- Adaptive learning engine.
- User accounts.
- Backend services.
- Dedicated reusable core engine package.

Those belong after the app shell, kiosk launch, and project structure are stable.

## Next Best Tasks

1. Keep top-level `app/` as the only active Dit Dit app home.
2. Keep `legacy/app-prototype/` as read-only reference unless intentionally revived.
3. Test the app locally.
4. Test the app through Docker.
5. Test on the Raspberry Pi touchscreen.
6. Continue kiosk launcher improvements (cancel-to-desktop behavior).
7. Continue extracting future core behavior out of the UI as the training engine becomes more concrete.

## First Practice Screen Target

The early practice experience should stay simple:

- Show current lesson/focus.
- Provide clear start, repeat, answer, and finish controls.
- Keep browser audio and lesson selection easy to test.
- Track basic local results without overbuilding analytics.
- Avoid scoring complexity until the Morse engine exists.

## Open Decisions

- Should the project eventually remove `legacy/app-prototype/` entirely or keep it as historical reference?
- Should the kiosk launcher remain in `deploy/pi/` or move to a dedicated runtime package later?
- Should the app name be `Dit Dit`, `Dit Dit Box`, or `Dit Dit CW Trainer` on the device home screen?
- Should the exit flow only exit fullscreen browser, or should it stop the service and return to desktop?
