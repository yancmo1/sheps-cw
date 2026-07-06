# 0003 Raspberry Pi Appliance Target

## Status

Accepted

## Date

2026-07-06

## Decision

Raspberry Pi touchscreen deployment remains the first appliance target for Dit Dit.

## Context

Dit Dit is intended to become a touch-first CW trainer that can run locally on a Raspberry Pi, with future paths toward desktop and dedicated hardware.

## Consequences

- `deploy/pi/` remains separate from React app behavior.
- Docker and kiosk scripts should continue to build and serve the active `app/`.
- `/opt/ditditbox` is the canonical Pi checkout/install path.
