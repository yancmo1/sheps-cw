# timingCalculator

Source: `app/src/core/timing/timingCalculator.js`  
Compatibility export: `app/src/core/morseTiming.js`

## Purpose

Provide pure Morse timing utilities with zero React/UI coupling.

## Timing model

- Dit unit duration: $t_{dit}=\frac{1.2}{\mathrm{WPM}}$ seconds
- Dah duration: $t_{dah}=3\cdot t_{dit}$
- Inter-element gap (inside one character): $t_{dit}$
- Inter-character gap:
  - Normal: $3\cdot t_{dit}(\mathrm{wpm})$
  - Farnsworth (slower spacing): $3\cdot t_{dit}(\mathrm{farnsworth})$ when `farnsworth < wpm`

## Exported API

### `normalizeWpm(wpm = 20): number`

- Coerces to finite number
- Minimum clamp: `5`
- Fallback: `20`

### `getMorseUnitSeconds(wpm = 20): number`

Returns dit unit duration in seconds.

### `getCharacterGapSeconds({ wpm = 20, farnsworth = wpm }): number`

Returns inter-character gap duration in seconds.

### `getPostCharacterDelayMs(options): number`

Same as `getCharacterGapSeconds(options)` but in rounded milliseconds.

### `getSymbolDurationSeconds(symbol, { wpm = 20 }): number`

- `'-'` → dah (`3 * unit`)
- Any other symbol → dit (`1 * unit`)

### `getCharacterPlaybackDurationMs(pattern, options): number`

Returns total playback window for one encoded pattern including:
1. Symbol durations
2. Inter-element gaps
3. Post-character gap

For empty/invalid `pattern`, falls back to post-character delay only.

## Example

At 20 WPM:

- Dit = `0.06s`
- Dah = `0.18s`
- Character gap (non-Farnsworth) = `0.18s`
- Pattern `".-"` total window = `480ms`

## Notes

- Module is deterministic and pure (except reading function args).
- Safe to reuse from React app, Pi services, or future core package extraction.
