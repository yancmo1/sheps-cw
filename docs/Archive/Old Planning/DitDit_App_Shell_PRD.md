# Dit Dit App Shell PRD

## Project

**Project Name:** Dit Dit  
**Parent Project:** ShepsCW  
**Product Type:** Raspberry Pi touchscreen Morse/CW trainer  
**Target Device:** Raspberry Pi with 7-inch touchscreen  
**Current Phase:** First runnable app shell

---

## Purpose

Create the first minimal runnable application shell for **Dit Dit**, a local touchscreen Morse/CW trainer intended to run on a Raspberry Pi.

This first version is not meant to implement Morse training logic yet. The goal is to get a simple, clean, touch-friendly app running on the Pi so the project has a real visual foundation before adding trainer features.

---

## Current Goal

Build a small local web app that can be manually launched on the Raspberry Pi and viewed full screen on the touchscreen.

The app should provide:

- A simple landing/dashboard screen
- Large touch-friendly buttons
- Placeholder navigation for future training features
- A clear structure for later kiosk/autostart work

---

## Recommended Location

Create the app here:

```text
app/ditdit/
```

Expected structure:

```text
sheps-cw/
  app/
    ditdit/
      README.md
      package.json
      index.html
      src/
        App.jsx
        main.jsx
        styles.css
```

If the repository already has an established frontend structure, follow the existing pattern, but keep the Dit Dit app isolated under `app/ditdit/` unless there is a strong reason not to.

---

## Suggested Stack

Use:

```text
React + Vite
```

Reasoning:

- Lightweight
- Easy to run locally
- Fast development loop
- Works well for touchscreen dashboard-style UIs
- Keeps the project flexible before adding backend or hardware integration

Do not add a backend yet unless absolutely necessary.

---

## App Name and Branding

The app name should display as:

```text
Dit Dit
```

Optional subtitle:

```text
CW Trainer
```

Tone should be simple, playful, and focused. Avoid over-polishing or creating a complex brand system at this stage.

---

## Initial Screens

### 1. Home Screen

The home screen should be the default screen when the app opens.

It should include:

- Large title: `Dit Dit`
- Optional subtitle: `CW Trainer`
- Three large buttons:
  - `Practice`
  - `Settings`
  - `Exit to Desktop`

The layout should be optimized for a 7-inch touchscreen.

Design expectations:

- Large readable text
- Large button targets
- Comfortable spacing
- Dark dashboard-style background
- Simple, clean layout
- No clutter

---

### 2. Practice Placeholder Screen

When the user taps `Practice`, show a placeholder screen.

Content:

```text
Practice Mode
Practice mode coming soon.
```

Include a large `Back` button to return to the home screen.

---

### 3. Settings Placeholder Screen

When the user taps `Settings`, show a placeholder screen.

Content:

```text
Settings
Settings coming soon.
```

Include a large `Back` button to return to the home screen.

---

### 4. Exit to Desktop Placeholder

The `Exit to Desktop` button should not attempt to control the Pi desktop yet.

For now, it should show a simple placeholder message such as:

```text
Exit handling will be added in the Raspberry Pi launcher layer.
```

This feature will eventually be handled outside the web app by the Pi launcher/autostart system.

---

## Functional Requirements

### Required

- App runs locally on the Raspberry Pi.
- App can be launched manually during development.
- App has a home screen with three large buttons.
- Practice and Settings buttons navigate to placeholder screens.
- Each placeholder screen has a large Back button.
- Exit to Desktop button displays a placeholder message only.
- App does not require internet access after dependencies are installed.
- App does not require authentication.
- App does not require a backend.
- App should be easy to run from the command line.

### Not Required Yet

Do not implement these in this milestone:

- Morse/CW lesson engine
- Audio generation
- Paddle/key input
- User profiles
- Stats tracking
- Adaptive learning
- LICW learning plan integration
- Docker deployment
- Pi reboot autostart
- Chromium kiosk mode
- Actual Exit to Desktop behavior

---

## UI/UX Requirements

The app should feel like a simple appliance interface, not a normal website.

### Touchscreen Design

- Buttons should be large enough for finger use.
- Avoid small text links.
- Avoid dense menus.
- Avoid hover-only behavior.
- Keep navigation obvious.

### Suggested Visual Direction

- Dark background
- High contrast text
- Large rounded panels or buttons
- Centered layout
- Minimal distractions

### Screen Size Assumption

Initial target display:

```text
7-inch Raspberry Pi touchscreen
1024x600 resolution
```

The app should remain usable at this size.

---

## Development Requirements

### Install

The README should include a basic install command such as:

```bash
npm install
```

### Run

The README should include a basic run command such as:

```bash
npm run dev -- --host 0.0.0.0
```

This allows the app to be viewed from the Pi or another device on the local network during development.

### Build

The README should include:

```bash
npm run build
```

---

## README Requirements

Create a `README.md` inside:

```text
app/ditdit/README.md
```

The README should include:

1. What Dit Dit is
2. How to install dependencies
3. How to run the app manually
4. How to build the app
5. Notes about Raspberry Pi touchscreen usage
6. A future TODO section for autostart/kiosk behavior

---

## Future Startup Flow TODO

Do not implement this yet, but document it in the README as a future task.

Future desired behavior:

```text
Raspberry Pi boots
↓
Startup screen appears:
“Dit Dit is starting…”
↓
Show short countdown
↓
User may press Cancel to Desktop
↓
If not canceled, launch Dit Dit fullscreen
```

Important requirement:

The user should not feel trapped in the app after reboot. There must eventually be a visible startup screen with a cancel option before launching the app fullscreen.

This should likely be handled in a Pi launcher layer, not directly inside the React app.

Potential future approaches:

- Desktop autostart script during early development
- Chromium kiosk mode after the app shell is stable
- systemd service later if Dit Dit becomes more appliance-like

---

## Acceptance Criteria

This milestone is complete when:

- `app/ditdit/` exists.
- A React/Vite app runs successfully.
- The app displays a clean Dit Dit home screen.
- The home screen has large touch-friendly buttons for Practice, Settings, and Exit to Desktop.
- Practice opens a placeholder Practice screen.
- Settings opens a placeholder Settings screen.
- Exit to Desktop shows a placeholder message only.
- Each child screen can return to the home screen.
- The app can be run manually using the documented README commands.
- The README includes future notes for Pi reboot startup, countdown, and Cancel to Desktop behavior.

---

## Codex Instructions

Please implement only this first app shell milestone.

Keep the solution small, readable, and easy to modify. Avoid adding extra frameworks, complex routing, backend services, authentication, database logic, or hardware integration.

Prioritize getting a clean first screen running on the Raspberry Pi touchscreen.

