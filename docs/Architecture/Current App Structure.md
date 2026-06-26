# Current App Structure

Last Updated: June 26, 2026

## Current State

The repository currently has a split app structure:

```text
app/
├── src/                 # earlier Vite dashboard prototype
├── package.json         # earlier app package
├── package-lock.json
├── Dockerfile
└── ditdit/
    ├── package.json     # newer Dit Dit app package
    └── src/
        ├── App.jsx
        ├── main.jsx
        └── styles.css
```

## Intended Direction

The newer `app/ditdit/` app appears to be the intended forward path because it has the touch-first Dit Dit interface with these main actions:

- Practice
- Settings
- Exit to Desktop

This app is closer to the Raspberry Pi kiosk goal than the older dashboard prototype.

## Current Risk

There are now two runnable-looking React app areas. This can confuse Codex, Docker, and future development.

The project should avoid letting features split between:

```text
app/src/
```

and

```text
app/ditdit/src/
```

## Recommended Cleanup

Recommended path:

1. Treat `app/ditdit/` as the official Dit Dit app home.
2. Update Docker to build from `app/ditdit/`.
3. Update run commands in README and AGENTS.md.
4. Either remove the older `app/src/` prototype or move it to an archive/reference folder.
5. Keep future React work inside `app/ditdit/src/` unless the structure changes again intentionally.

## Current Docker Mismatch

`docker-compose.yml` currently uses:

```yaml
context: ./app
```

That means Docker is currently aligned with the older top-level app package, not necessarily the new `app/ditdit` package.

Before kiosk work continues, this needs to be corrected or explicitly accepted.

## Suggested Future Layout

If `app/ditdit/` remains the app home, a clean future layout could be:

```text
app/
└── ditdit/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── styles.css
    │   ├── screens/
    │   ├── components/
    │   └── services/
    ├── public/
    ├── package.json
    ├── package-lock.json
    └── vite.config.js

scripts/
└── pi/
    ├── launch-ditdit.sh
    └── install-kiosk-service.sh

docs/
├── Architecture/
├── Features/
├── Branding/
└── Daily Notes/
```

## Rule for Codex

Until the structure is cleaned up, Codex should confirm which app folder is intended before editing React files.

Current preferred target:

```text
app/ditdit/
```
