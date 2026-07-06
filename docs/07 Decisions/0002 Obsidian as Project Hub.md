# 0002 Obsidian as Project Hub

## Status

Accepted

## Date

2026-07-06

## Decision

The repository root is also the Obsidian vault. Project notes live under `docs/` using a numbered structure for navigation.

## Context

Sheps CW needs product planning, architecture notes, research, and implementation handoffs to remain close to the code while still being pleasant to browse in Obsidian.

## Consequences

- Stable Obsidian settings may be tracked.
- Device and window state such as `.obsidian/workspace.json` should be ignored.
- Wiki links should be preserved where practical when notes move.
