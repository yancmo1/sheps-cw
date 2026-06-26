## Learning Plans

Last Updated: June 26, 2026

The training engine is designed to support multiple structured learning paths.

Planned learning plans include:

- Koch Method
- Long Island CW Club (LICW) curriculum
- CW Ops
- CW Academy
- Custom user-defined lesson plans
- Future instructor-created lesson packs

Learning plans define lesson order and progression, while the adaptive engine personalizes review and reinforcement based on individual performance.

## Current App Relationship

The current Dit Dit app shell does not implement learning plans yet.

The home screen currently shows the app direction only. The first real practice workflow should eventually connect to a selected learning plan, but the app should not hard-code LICW logic directly into the UI.

Recommended architecture:

```text
Learning Plan
    ↓
Lesson Selection
    ↓
Practice Session
    ↓
Performance Results
    ↓
Adaptive Review
```

## LICW Direction

LICW should be treated as an important planned learning path because the Didah naming/language aligns well with learning Morse by sound and rhythm.

Implementation should stay flexible:

- Do not make LICW the only learning model.
- Do not bury lesson order inside React components.
- Store lesson-plan structure separately from the UI.
- Let the future adaptive engine adjust review without changing the base lesson plan.

## Future Data Shape Thought

A future lesson plan may need fields like:

```text
id
name
description
source
lesson_order
characters_per_lesson
practice_modes
review_rules
```

This is only a planning note, not a final schema.
