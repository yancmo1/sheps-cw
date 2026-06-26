# Sheps CW

A modern Morse Code (CW) training application designed to help operators learn, practice, and master Morse code through adaptive training techniques.

The project is being developed with a **core-first** architecture, allowing the Morse engine to remain independent from the user interface, audio system, and hardware platform. While the initial target is a Raspberry Pi 3 Model B, the long-term goal is dedicated handheld hardware.

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

# Planned Repository Layout

```
src/
└── sheps_cw/
    ├── app/
    ├── ui/
    ├── services/
    ├── core/
    ├── audio/
    ├── hardware/
    ├── storage/
    └── utils/
```

Additional project documentation is maintained under:

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

🚧 Early architecture phase.

Current focus:

- Project structure
- Documentation
- Core architecture
- Adaptive learning design

No production code has been written yet.

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