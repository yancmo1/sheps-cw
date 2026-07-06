# Project Overview

Sheps CW is the W5XY Labs Morse code training workspace. The current product surface is **Dit Dit**, a touch-first React/Vite app for browser and Raspberry Pi use.

The repository also serves as the Obsidian vault for product notes, architecture notes, research, decisions, and planning.

## Current Implementation

- Active app: `app/`
- App shell: `app/src/App.jsx`
- Main entry: `app/src/main.jsx`
- Styling: `app/src/styles.css`
- Pi appliance layer: `deploy/pi/`
- Current deployment target: Raspberry Pi touchscreen at `http://localhost:3000`

## Architecture Direction

The long-term direction is a reusable Morse learning engine that stays independent from UI, audio, GPIO, storage, and platform concerns.

```text
Application
User Interface
Services
Core Morse Engine
Hardware / Audio / Storage
```

Core behavior should move into pure, testable modules where practical. React screens should consume that core behavior rather than owning Morse timing, progression, statistics, or adaptive-learning rules directly.

## Key Notes

- [[Project Dashboard]]
- [[Current Sprint]]
- [[Roadmap]]
- [[Current App Structure]]
- [[Learning Engine]]
- [[Decision Log]]
- [[Research Inbox]]
