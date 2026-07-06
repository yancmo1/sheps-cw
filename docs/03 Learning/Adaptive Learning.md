# Adaptive Learning

## Responsibility

Track per-character performance and adapt practice so learners spend more time where they need it most.

---

## Current Foundation (Implemented)

- Per-character accuracy is tracked from identify-mode session results.
- Rolling accuracy windows are calculated for last 10, 50, and 100 exposures.
- Characters with rolling 10 accuracy below 80% (with at least 5 attempts) are flagged as weak.
- A dedicated **Practice Weak Characters** session can be launched from Progress.
- Standard sessions increase weak-character frequency automatically.
- Confusion pairs (for example, hearing `E` as `T`) are captured and summarized.

---

## Depends On

- [[Session]]
- [[Statistics]]
- [[Learning Engine]]

---

## Notes

- The current weak-character threshold and minimum attempts are simple defaults intended for early-phase tuning.
- This foundation is designed to support a future spaced-repetition scheduler.
