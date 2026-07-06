# 0001 Project Direction

## Status

Accepted

## Date

2026-07-06

## Decision

Dit Dit is the forward app direction for Sheps CW. New React application work should target `app/`.

## Context

The repository has a working touch-first React/Vite app and an older dashboard prototype. Keeping both as active product surfaces creates confusion for development, deployment, and future automation.

## Consequences

- `app/` is the active app.
- Prototype material is archived for reference.
- Future core behavior should be extracted into pure, testable modules that the app can consume.
