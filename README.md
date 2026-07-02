# Sheps CW

A modern Morse Code (CW) training project with a touch-first Dit Dit app and a long-term core-first architecture.

The project is being developed with a **core-first** architecture, allowing the Morse engine to remain independent from the user interface, audio system, and hardware platform. While the initial target is Raspberry Pi appliance deployment, the long-term goal is dedicated hardware.

**Project & Product Names**:

- **Dit Dit**: The React/Vite app and main CW trainer product (W5XY Labs brand)
- **Dit Dit Box**: The Raspberry Pi appliance deployment of Dit Dit
- **Didah Method**: The friendly learning methodology and educational approach

---

# Project Goals

- Build a modular Morse training engine.
- Support beginners through advanced operators.
- Provide adaptive learning based on individual performance.
- Support keyboards, paddles, straight keys, and future hardware.
- Run on desktop systems during development and embedded hardware for deployment.

---

# Development Philosophy

The project is designed around a layered architecture.

```
Application
    │
User Interface
    │
Services
    │
Core Morse Engine
    │
Hardware / Audio / Storage
```

The **Core Morse Engine** contains the business logic and should never depend on the UI, GPIO, or audio implementations.

This allows the same engine to power:

- Desktop applications
- Raspberry Pi devices
- Future handheld hardware
- Automated testing

---

# Current Repository Layout

```
app/                    # canonical Dit Dit React/Vite app
docker-compose.local.yml # local/dev Docker convenience for the active app
deploy/pi/              # Pi service, compose, launcher, desktop scripts
docs/                   # planning and architecture notes
legacy/app-prototype/   # archived earlier dashboard prototype
src/ tests/ assets/     # placeholders for future core-first modules
```

Documentation is maintained under:

```
docs/
├── Architecture/
├── Diagrams/
├── Excalidraw/
├── Features/
├── Reference/
└── Templates/
```

---

# Current App Status

## What's Working

Dit Dit is a touch-first Morse code training app with browser-based audio and local persistence. The current release includes:

- **Audio**: Browser-based Morse audio generation with adjustable tone and speed (Farnsworth timing support)
- **Practice**: Touch-friendly practice session interface with visual and audio feedback
- **Lessons**: 42 lessons across 9 learning paths (Koch Method, LICW, Beginner, Numbers, Prosigns, Abbreviations, Confusing Pairs, Common, Review)
- **Practice Setup**: Learning Plans dropdown with multiselect lesson interface; supports combining lessons and custom character input
- **Character Coverage**: Full alphabet (26 letters), digits (0-9), 7 prosigns (AR, SK, BT, AS, KN, CA, SOS)
- **Persistence**: Local settings (speed, tone, volume) and practice history saved in browser
- **Missed-Character Practice**: Focused practice on characters you got wrong
- **Navigation**: Touch-first home screen with Practice, Key Decode, Progress, Settings, and Exit flows
- **Live Input Decode**: New Key Decode screen supports straight-key and paddle input, Iambic A/B modes, sidetone, live Morse decoding, and touch-key testing
- **Speed Feedback**: Character-speed tracking shows last and average WPM while you key
- **Pi Integration**: Ready for deployment on Raspberry Pi touchscreen with kiosk/exit behavior

## Non-Goals (Until Core Engine Exists)

- GPIO hardware key/paddle input
- Adaptive learning (static lessons only for now)
- Backend services or user accounts
- Full scoring/analytics

---

# Development: Quick Start

## Local Development

From `app/` directory:

```bash
cd app
npm install
npm run dev
```

Browser opens at `http://localhost:5173`.

## Local Docker

From repository root, build and serve on port `8080`:

```bash
docker compose -f docker-compose.local.yml up -d --build
```

Visit `http://localhost:8080`. Tear down with:

```bash
docker compose -f docker-compose.local.yml down
```

## Pi Deployment

The active app builds into Dit Dit Box appliance through `deploy/pi/`:

```bash
docker compose -f deploy/pi/docker-compose.yml build
docker compose -f deploy/pi/docker-compose.yml up -d
```

Dit Dit Box serves at `http://localhost:3000` on the Pi and launches in kiosk mode with exit-to-desktop support.

Pi appliance install path expectation:

```text
/opt/ditditbox
```

# Development Setup

Current development platform:

- macOS
- Visual Studio Code
- Obsidian (documentation in `docs/`)
- Excalidraw (architecture diagrams)
- GitHub (source control)

Current input options:

- **Straight key** input via keyboard or touch key
- **Paddle input** with Iambic A/B selection
- **Live decode feedback** with sidetone and character-speed tracking

GPIO hardware input support remains a planned next step for real key/paddle integration beyond browser-based testing.

---

# Current Status

**Phase**: Active app foundation + Pi deployment testing.

**Current Focus**:

1. Refine the live key-decode experience for straight keys and paddles
2. Verify touch-first practice flow works smoothly on Pi touchscreen
3. Harden kiosk startup (cancel-to-desktop behavior)
4. Test local persistence and multi-session workflows
5. Build adaptive learning features on top of extracted core modules

**Single Source of Truth**:

- `app/` = canonical Dit Dit React app
- `deploy/pi/` = Dit Dit Box appliance layer
- `legacy/app-prototype/` = archived (reference only)

---

# Development Roadmap

**See [ROADMAP_AND_CHECKLIST.md](docs/ROADMAP_AND_CHECKLIST.md) for detailed, trackable implementation plan organized by phase.**

This document contains:
- ✅ Completed work (what's already in the app)
- 🔴 Phase 1: Critical Foundation (weeks 1–4)
- 🟡 Phase 2: Learning Intelligence (weeks 5–8)
- 🟢 Phase 3: Polish & Engagement (weeks 9–12)
- 🟣 Phase 4: Advanced Features (week 13+)

Each item includes acceptance criteria and dependencies.

---

### Quick Status

**Phase 1 Progress: 80% Complete**

- [x] Touch-first app foundation + browser audio
- [x] Local persistence (settings + progress history)
- [x] Multiple lesson paths (Beginner, Koch, LICW, Numbers, Review)
- [x] Raspberry Pi deployment + kiosk integration
- [x] Comprehensive character coverage (26 letters + digits + 7 prosigns)
- [x] Structured 42-lesson library organized by learning paths
- [x] Practice Setup UX (Learning Plans dropdown + multiselect lessons)
- [x] Core Morse engine extraction (reusable, testable)
- [x] Unit tests for core timing/codec/session (>90% core coverage)
- [x] Live key-decode input flow (straight key, paddle, Iambic A/B, sidetone, speed tracking)
- [ ] Adaptive learning engine

See **[ROADMAP_AND_CHECKLIST.md](docs/ROADMAP_AND_CHECKLIST.md)** for detailed phase breakdown and next steps.

---

# License

License to be determined.
