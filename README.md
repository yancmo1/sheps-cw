# Sheps CW

A modern Morse Code (CW) training project with a touch-first Dit Dit app and a long-term core-first architecture.

The project is being developed with a **core-first** architecture, allowing the Morse engine to remain independent from the user interface, audio system, and hardware platform. While the initial target is Raspberry Pi appliance deployment, the long-term goal is dedicated hardware.

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

# Planned Features

## Training

- Character Trainer
- Koch Method
- Farnsworth Timing
- Adaptive Learning
- Character Review
- Custom Lessons

## Practice

- Practice Oscillator
- Random Character Generator
- Word Practice
- Callsign Practice
- QSO Practice

## Analysis

- Session Statistics
- Accuracy Tracking
- Learning History
- Character Weakness Analysis
- Progress Dashboard

## Hardware

- Keyboard Input
- Paddle Support
- Straight Key Support
- GPIO Integration
- Audio Output
- Hardware Abstraction Layer (HAL)

---

# Local and Pi Commands

From repository root:

```bash
npm run ditdit:install
npm run ditdit:dev
npm run ditdit:build
npm run ditdit:preview

npm run pi:build-image
npm run pi:start
npm run pi:stop
npm run pi:logs
npm run pi:kiosk
```

Local Docker convenience:

```bash
docker compose -f docker-compose.local.yml up -d --build
docker compose -f docker-compose.local.yml down
```

The root `docker-compose.local.yml` is for local/dev convenience and serves the active app on host port `8080`. The Pi appliance deployment uses `deploy/pi/docker-compose.yml` and serves Dit Dit Box at `http://localhost:3000`.

Pi appliance install path expectation:

```text
/opt/ditditbox
```

# Development Setup

Current development platform:

- macOS
- Visual Studio Code
- Obsidian (documentation)
- Excalidraw (architecture diagrams)
- GitHub (source control)

Initial keyboard controls:

- **Space** = Dit
- **Enter** = Dah

GPIO support will be introduced after the core engine is complete.

---

# Current Status

🚧 Active app shell + Pi deployment phase.

Current focus:

- Keep one canonical app path (`app/`)
- Maintain clean Pi deployment flow under `deploy/pi/`
- Continue kiosk startup/exit hardening and training-flow iteration
- Preserve core-first architecture direction for future modules

---

# Roadmap

- [x] Repository created
- [x] Documentation structure established
- [ ] Core project scaffold
- [ ] Morse timing engine
- [ ] Character generation
- [ ] Adaptive learning engine
- [ ] Statistics engine
- [ ] Audio subsystem
- [ ] Desktop UI
- [ ] Raspberry Pi integration
- [ ] Hardware prototype

---

# License

License to be determined.
