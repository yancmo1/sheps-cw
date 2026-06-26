# Agent Notes

## Project Snapshot

Sheps CW is an early-stage Morse code training project by W5XY Labs. The current forward app direction is the Dit Dit touch-first React app under `app/ditdit/`. The long-term direction is a core-first CW learning engine that can run behind desktop UI, Raspberry Pi deployment, and future dedicated hardware.

The repository also doubles as an Obsidian planning vault. Project intent and feature notes live under `docs/`; keep those notes readable in Obsidian and preserve existing wiki-link style where present.

## Current Stack

- Frontend: React 19, Vite 8, JavaScript modules.
- Current app target: `app/ditdit/`.
- Earlier dashboard prototype still exists under `app/src/`.
- Build/dev commands should be run from the intended app folder.
- Container: `docker-compose.yml` currently builds `app/Dockerfile` from `./app` and serves with nginx on host port `8080`.
- Root `src/`, `tests/`, and `assets/` are placeholders for future non-UI/core work.

## Important Structure Warning

There are currently two React app areas:

```text
app/src/            # earlier dashboard prototype
app/ditdit/src/     # newer Dit Dit touch-first app
```

Prefer `app/ditdit/` for new React work unless the user explicitly chooses to move the app back to top-level `app/`.

Do not accidentally add new feature work to the older `app/src/` dashboard if the task is about Dit Dit.

## Useful Commands

Run these from the repository root unless noted.

For the current Dit Dit app:

```sh
cd app/ditdit
npm run dev
npm run build
npm run preview
```

For the older top-level app, only if intentionally working there:

```sh
cd app
npm run dev
npm run lint
npm run build
```

Docker currently uses the top-level `app/` Dockerfile/context:

```sh
docker compose up --build
```

Before relying on Docker for the new Dit Dit app, verify whether Docker has been updated to build `app/ditdit/`.

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

- App folder: `app/ditdit/`.
- Main entry: `app/ditdit/src/main.jsx`.
- App shell: `app/ditdit/src/App.jsx`.
- Styling: `app/ditdit/src/styles.css`.
- Home actions: Practice, Settings, Exit to Desktop.
- Practice, Settings, and Exit are placeholders only.
- Exit handling should eventually connect to the Raspberry Pi launcher/kiosk layer.

Older prototype still present:

- Main entry: `app/src/main.jsx`.
- App shell: `app/src/App.jsx`.
- Dashboard: `app/src/Dashboard.jsx`.

## Working Conventions

- Do not treat the root README status as fully current; it still describes the project as earlier than the current app state.
- Avoid committing or modifying Obsidian workspace state such as `.obsidian/workspace.json` unless the user explicitly asks.
- Leave unrelated dirty files alone.
- Use focused changes and update docs when architecture or product decisions become concrete.
- Add tests proportionally when implementing core logic, adaptive-learning rules, statistics, audio timing, or persistence behavior.

## Known Gaps

- Docker may still be aligned with the older top-level `app/` package instead of `app/ditdit/`.
- The root README is stale and should be updated soon.
- No real Morse timing engine, lesson engine, audio engine, statistics engine, persistence layer, or hardware abstraction exists yet.
- The Practice button does not start a real practice flow yet.
- The Settings screen is a placeholder.
- The Exit to Desktop screen is a placeholder and needs Pi launcher integration.
