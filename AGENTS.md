# Agent Notes

## Project Snapshot

Sheps CW is an early-stage Morse code training project by W5XY Labs. The current forward app direction is the Dit Dit touch-first React app under `app/`. The long-term direction is a core-first CW learning engine that can run behind desktop UI, Raspberry Pi deployment, and future dedicated hardware.

The repository also doubles as an Obsidian planning vault. Project intent and feature notes live under `docs/`; keep those notes readable in Obsidian and preserve existing wiki-link style where present.

## Current Stack

- Frontend: React 19, Vite 8, JavaScript modules.
- Current app target: `app/`.
- Earlier dashboard prototype has been archived under `legacy/app-prototype/`.
- Build/dev commands should be run from the intended app folder.
- Pi appliance container: `deploy/pi/docker-compose.yml` builds the active app from `app/` and serves it with nginx at `http://localhost:3000`.
- Root `src/`, `tests/`, and `assets/` are reserved for future non-UI/core work.

## Important Structure Warning

There is one active React app and one archived prototype:

```text
app/src/                          # active Dit Dit touch-first app
legacy/app-prototype/src/         # archived dashboard prototype
```

Prefer `app/` for all new React work.

Do not accidentally add new feature work to `legacy/app-prototype/`.

## Useful Commands

Run these from the repository root unless noted.

For the current Dit Dit app:

```sh
cd app
npm run dev
npm run build
npm run preview
```

For the archived prototype, only if intentionally reviewing legacy work:

```sh
cd legacy/app-prototype
npm run dev
npm run lint
npm run build
```

Pi appliance Docker uses the top-level `app/` Dockerfile/context:

```sh
docker compose -f deploy/pi/docker-compose.yml build
docker compose -f deploy/pi/docker-compose.yml up -d --no-build
```

Docker and Pi compose should continue to point at top-level `app/`.

## Architecture Intent

Keep the Morse learning core independent from UI, audio, GPIO, storage, and platform concerns. The planned layering is:

```text
Application
User Interface
Services
Core Morse Engine
Hardware / Audio / Storage
```

When adding core behavior, prefer pure, testable modules that can later be reused by desktop, Raspberry Pi, and hardware targets. UI should consume core services rather than owning Morse timing, lesson progression, statistics, or adaptive-learning rules directly.

## Product Direction

- Company/developer brand: W5XY Labs.
- Leading product name: Dit Dit.
- Device/app language: Dit Dit / Dit Dit Box / CW Trainer.
- Learning-method language: Didah / Didah Method.
- Product tone should be friendly, approachable, touch-first, and learning-focused rather than a generic engineering utility.
- Long Island CW Club (LICW), Koch Method, CW Ops, CW Academy, and custom lesson plans are expected future learning-path inputs.

## Current App Notes

Current target app:

- App folder: `app/`.
- Main entry: `app/src/main.jsx`.
- App shell: `app/src/App.jsx`.
- Styling: `app/src/styles.css`.
- Current screens:
  - Home
  - Practice Setup
  - Practice Session
  - Results
  - Progress
  - Settings
  - Exit
- Current implemented app capabilities:
  - Browser-based Morse audio
  - Local settings persistence
  - Local progress history
  - Missed-character practice
  - Pi kiosk/desktop exit flow foundation
- Pi deployment lives under `deploy/pi/` and should remain separate from React app behavior.

Older prototype is archived under:

- Main entry: `legacy/app-prototype/src/main.jsx`.
- App shell: `legacy/app-prototype/src/App.jsx`.
- Dashboard: `legacy/app-prototype/src/Dashboard.jsx`.

## Working Conventions

- Do not treat the root README status as fully current; it still describes the project as earlier than the current app state.
- Avoid committing or modifying Obsidian workspace state such as `.obsidian/workspace.json` unless the user explicitly asks.
- Leave unrelated dirty files alone.
- Use focused changes and update docs when architecture or product decisions become concrete.
- Add tests proportionally when implementing core logic, adaptive-learning rules, statistics, audio timing, or persistence behavior.

## Known Gaps

- Use `/opt/ditditbox` as the canonical Pi checkout/install path for appliance deployment.
- The root README is stale and should be updated soon.
- No dedicated reusable core Morse engine package exists yet.
- No hardware key, paddle, or GPIO input exists yet.
- Lesson progression and adaptive learning are still future phases.
- Pi launcher/service hardening exists but still needs continued real-hardware testing.
- Core-first architecture is still planned, but current implemented behavior is mostly inside the React app.
