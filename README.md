# Sheps CW

A small-form-factor Morse/CW training project intended to run first on a Raspberry Pi 3 Model B and later on dedicated handheld hardware.

## Phase 1 Goal

Build the core software before committing to final hardware.

## Proposed Architecture

```
src/sheps_cw/
├── app/
├── ui/
├── services/
├── core/
│   ├── morse.py
│   ├── trainer.py
│   ├── timing.py
│   ├── scoring.py
│   └── scheduler.py
├── audio/
├── hardware/
├── storage/
└── utils/
```

The `core` package contains all Morse logic and remains independent of the UI, hardware, and audio layers.

## Planned Modules

- Trainer
- Practice Oscillator
- Key Analyzer
- Statistics
- Hardware Abstraction Layer

## Development Setup

Recommended OS: Raspberry Pi OS Desktop.

For initial development:

- Space = dit
- Enter = dah
- GPIO support comes later.

## Project Status

Initial scaffold. Architecture-first development.
