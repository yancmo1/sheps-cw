# sessionBuilder

Source: `app/src/core/session/sessionBuilder.js`  
Compatibility export: `app/src/core/session.js`

## Purpose

Provide pure session construction and result aggregation helpers with no UI coupling.

## Exported API

### `shuffle(items): any[]`

Returns a shuffled copy using Fisher-Yates.

### `buildChoices(character, availableCharacters, fallbackCharacters = []): string[]`

Builds up to 4 answer choices:

- Always includes the correct `character`
- Distractors are sampled from unique pool of `availableCharacters + fallbackCharacters`
- Result order is shuffled

### `buildItems(characters, length, { fallbackCharacters = [] } = {}): Array<{ char, choices }>`

Creates a randomized item list:

- Picks `length` characters (with repetition) from `characters`
- Builds choices per item via `buildChoices`
- Returns `[]` if `characters` is empty/invalid or `length <= 0`

### `createSessionId(): string`

Session ID strategy:

1. Prefer `crypto.randomUUID()`
2. Fallback to deterministic non-crypto format:
   `session-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`

### `calculateSessionResult(input): object`

Input shape:

- `completedItems`: `[{ character, selected, correct }]`
- `config`: `{ mode, length, lessonName? }`
- `lesson`: `{ id, name } | null`
- `characters`: selected session character set
- optional `id`, `createdAt`

Output includes:

- metadata: `id`, `createdAt`, `lessonId`, `lessonName`, `mode`, `sessionLength`
- counters: `attempted`, `correct`, `accuracy`
- `missed`: unique incorrect `character` values
- passthrough: `items`, `characters`

Accuracy is rounded integer percentage:

$$
\mathrm{accuracy}=\begin{cases}
0 & \text{if attempted}=0 \\
\mathrm{round}\left(\frac{\mathrm{correct}}{\mathrm{attempted}}\cdot 100\right) & \text{otherwise}
\end{cases}
$$

## Notes

- Suitable for reuse in React UI, kiosk shell, CLI drills, and future core package extraction.
- Keeps scoring logic centralized and testable.
