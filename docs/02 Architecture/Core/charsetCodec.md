# charsetCodec

Source: `app/src/core/codec/charsetCodec.js`  
Morse map: `app/src/core/codec/morseMap.js`

## Purpose

Provide a pure character/Morse codec layer for:

- character validation
- character → Morse encoding
- Morse → character decoding
- parsing user-entered character sets

No UI or React dependencies.

## Supported character set

Defined by `MORSE` in `morseMap.js`:

- Letters `A-Z`
- Digits `0-9`
- Prosign tokens: `AR`, `SK`, `BT`, `AS`, `KN`, `CA`, `SOS`

## Exported API

### `normalizeCharacterToken(value): string`

Trims and uppercases token input.

### `getAvailableCharacters(): string[]`

Returns all keys from `MORSE`.

### `isSupportedCharacter(character): boolean`

Checks membership in the supported set after normalization.

### `encodeCharacter(character): string | null`

Maps supported token to Morse pattern, e.g.:

- `A -> .-`
- `SK -> ...-.-`

Returns `null` for unsupported input.

### `decodeMorse(pattern): string | null`

Reverse lookup from Morse pattern to token.

### `parseCharacterInput(rawInput): { characters: string[], invalidTokens: string[] }`

Parses free-form user input with these rules:

1. Normalize input to uppercase
2. If no delimiters are present, split into single characters (`"ABC123" -> [A,B,C,1,2,3]`)
3. If delimiters are present (`space`, `,`, `;`, `|`, `/`), split by delimiter and preserve full tokens (`"A SK SOS"`)
4. If a token is unsupported but contains valid single-char values, expand it (`"XYZ" -> X,Y,Z`)
5. Return deduplicated `characters` and deduplicated `invalidTokens`

## Notes

- Intended for setup/custom input validation and future import pipelines.
- Keeps prosign tokens as first-class values when explicitly delimited.
