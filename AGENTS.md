# Agent Notes

## Project Snapshot

Sheps CW is an early-stage Morse code training project by W5XY Labs. The current runnable app is a Vite + React dashboard under `app/`, branded around Dit Dit / Didah Trainer. The long-term direction is a core-first CW learning engine that can run behind desktop UI, Raspberry Pi deployment, and future dedicated hardware.

The repository also doubles as an Obsidian planning vault. Project intent and feature notes live under `docs/`; keep those notes readable in Obsidian and preserve existing wiki-link style where present.

## Current Stack

- Frontend: React 19, Vite 8, JavaScript modules.
- Linting: `oxlint` via `npm run lint` in `app/`.
- Build: `npm run build` in `app/`.
- Container: `docker-compose.yml` builds `app/Dockerfile` and serves the Vite build with nginx on host port `8080`.
- Root `src/`, `tests/`, and `assets/` are placeholders for future non-UI/core work.

## Useful Commands

Run these from the repository root unless noted.

```sh
cd app
npm run dev
npm run lint
npm run build
```

```sh
docker compose up --build
```

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
- Learning-method language: Didah / Didah Method.
- Product tone should be friendly, approachable, and learning-focused rather than a generic engineering utility.
- Long Island CW Club (LICW), Koch Method, CW Ops, CW Academy, and custom lesson plans are expected future learning-path inputs.

## Current App Notes

- Main entry: `app/src/main.jsx`.
- App shell: `app/src/App.jsx`.
- Current dashboard: `app/src/Dashboard.jsx`.
- Global CSS reset: `app/src/index.css`.
- Styling is currently inline in `Dashboard.jsx`; if the UI grows, migrate carefully toward local components/styles without mixing unrelated refactors into feature work.

## Working Conventions

- Do not treat the root README status as fully current; it still says no production code exists, but the React app now exists.
- Avoid committing or modifying Obsidian workspace state such as `.obsidian/workspace.json` unless the user explicitly asks.
- Leave unrelated dirty files alone.
- Use focused changes and update docs when architecture or product decisions become concrete.
- Add tests proportionally when implementing core logic, adaptive-learning rules, statistics, audio timing, or persistence behavior.

## Known Gaps

- `docs/PRD.md` is currently empty.
- Several feature docs are placeholders.
- No real Morse timing engine, lesson engine, audio engine, statistics engine, persistence layer, or hardware abstraction exists yet.
- The dashboard button does not start a practice flow yet.
