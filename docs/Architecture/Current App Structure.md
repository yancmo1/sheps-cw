# Current App Structure

Last Updated: June 28, 2026

## Current State

The repository now has a single active app location plus an archived prototype:

```text
app/
├── src/                 # active Dit Dit touch-first app
├── package.json
├── package-lock.json
├── Dockerfile
└── vite.config.js

legacy/
└── app-prototype/       # archived earlier dashboard prototype
```

## Why This Changed

The project previously had two competing app roots, which caused confusion in scripts, Docker, and agent targeting. The Dit Dit app has now been promoted to top-level `app/`, and the older dashboard prototype was archived.

## Active App Surface

Current Dit Dit interface includes:

- Practice
- Settings
- Exit to Desktop

## Docker and Kiosk Alignment

Both compose files now build from `app/`:

```yaml
context: ./app
```

and

```yaml
context: ../../app
```

## Recommended Working Rule

All new UI work should target:

```text
app/
└── src/
```

Do not add new product behavior in:

```text
legacy/app-prototype/
```

## Pi Install Path Note

For appliance consistency, prefer checkout/install path:

```text
/opt/ditditbox
```
