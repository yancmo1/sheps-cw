# Sheps CW

Sheps CW is a W5XY Labs Morse code training project. The current product is **Dit Dit**, a touch-first React/Vite CW trainer that runs in the browser and can be deployed as a Raspberry Pi touchscreen appliance.

The repository also serves as the Obsidian vault for project planning, product notes, architecture notes, research, and decisions.

## Current Implementation

The active application lives in `app/`.

Current Dit Dit capabilities include:

- Touch-first Home, Practice Setup, Practice Session, Results, Progress, Settings, Key Decode, and Exit screens
- Browser-based Morse audio
- Local settings persistence
- Local progress history
- Structured lesson data
- Missed-character practice
- Straight-key and paddle-oriented browser input for key decode practice
- Raspberry Pi kiosk/deployment foundation under `deploy/pi/`

The older dashboard prototype is archived under `docs/Archive/Legacy Prototype/app-prototype/` for reference only.

## Architecture Direction

The long-term direction is a reusable core Morse learning engine that can run behind desktop UI, Raspberry Pi deployment, and future dedicated hardware.

Planned layering:

```text
Application
User Interface
Services
Core Morse Engine
Hardware / Audio / Storage
```

Core behavior should remain independent from React, browser audio, GPIO, storage, and platform-specific launchers. When adding timing, lesson progression, statistics, or adaptive-learning behavior, prefer pure testable modules that UI and future hardware surfaces can consume.

## Repository Layout

```text
app/                         # active Dit Dit React/Vite app
deploy/pi/                   # Raspberry Pi compose, service, and launcher scripts
docs/                        # Obsidian project vault notes
docs/00 Home/                # dashboard and overview
docs/01 Product/             # product, branding, glossary, PRD
docs/02 Architecture/        # architecture notes, diagrams, core API docs
docs/03 Learning/            # learning and feature notes
docs/04 Hardware/            # hardware notes
docs/05 Development/         # sprint, roadmap, prompts, future ideas
docs/06 Research/            # research inbox and research notes
docs/07 Decisions/           # decision log and records
docs/Templates/              # reusable Obsidian templates
docs/Archive/                # legacy prototype and historical notes
media/                       # vault media and attachments
docker-compose.local.yml     # local Docker convenience for the active app
workspace.code-workspace     # VS Code workspace
```

## Obsidian Usage

Open the repository root as the Obsidian vault. The primary landing page is:

```text
docs/00 Home/Project Dashboard.md
```

Stable vault configuration can be tracked, but device/window state is ignored:

```text
.obsidian/workspace.json
.obsidian/workspace-mobile.json
```

## Development Commands

Install app dependencies:

```sh
npm --prefix app install
```

Run the app in development:

```sh
npm --prefix app run dev
```

Build the app:

```sh
npm --prefix app run build
```

Run tests:

```sh
npm --prefix app run test
```

Validate lesson data:

```sh
npm --prefix app run validate:lessons
```

Root convenience scripts are also available:

```sh
npm run ditdit:install
npm run ditdit:dev
npm run ditdit:build
npm run ditdit:preview
```

## Local Docker

From the repository root:

```sh
docker compose -f docker-compose.local.yml up -d --build
```

The local container serves the active app at:

```text
http://localhost:8080
```

Stop it with:

```sh
docker compose -f docker-compose.local.yml down
```

## Raspberry Pi Deployment

The Pi appliance layer builds the active `app/` and serves it with nginx at `http://localhost:3000`.

```sh
docker compose -f deploy/pi/docker-compose.yml build
docker compose -f deploy/pi/docker-compose.yml up -d --no-build
```

Useful Pi scripts live under `deploy/pi/`.

Canonical Pi checkout/install path:

```text
/opt/ditditbox
```

## Current Status

Dit Dit is an early working app, not just a mockup. The near-term focus is:

- Keep the active app stable
- Harden Raspberry Pi kiosk startup and exit behavior
- Continue extracting reusable core behavior
- Build adaptive-learning behavior on top of tested core modules
- Keep the Obsidian workspace organized enough to guide future work

## Key Notes

- [[Project Dashboard]]
- [[Project Overview]]
- [[Current App Structure]]
- [[Roadmap]]
- [[Decision Log]]

## License

License to be determined.
