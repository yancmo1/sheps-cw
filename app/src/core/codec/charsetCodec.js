import { MORSE } from './morseMap.js'

const REVERSE_MORSE = Object.fromEntries(
  Object.entries(MORSE).map(([character, pattern]) => [pattern, character])
)

export function normalizeCharacterToken(value) {
  return String(value ?? '').trim().toUpperCase()
}

export function getAvailableCharacters() {
  return Object.keys(MORSE)
}

export function isSupportedCharacter(character) {
  const normalized = normalizeCharacterToken(character)
  return normalized.length > 0 && Object.hasOwn(MORSE, normalized)
}

export function encodeCharacter(character) {
  const normalized = normalizeCharacterToken(character)
  return MORSE[normalized] ?? null
}

export function decodeMorse(pattern) {
  const normalized = String(pattern ?? '').trim()
  return REVERSE_MORSE[normalized] ?? null
}

function tokenizeInput(rawInput) {
  const normalizedInput = normalizeCharacterToken(rawInput)
  if (!normalizedInput) return []

  const hasDelimiter = /[\s,;|/]+/.test(normalizedInput)
  if (!hasDelimiter) {
    return [...normalizedInput]
  }

  return normalizedInput
    .split(/[\s,;|/]+/)
    .map(token => token.trim())
    .filter(Boolean)
}

export function parseCharacterInput(rawInput) {
  const tokens = tokenizeInput(rawInput)
  const characters = []
  const invalidTokens = []

  for (const token of tokens) {
    if (isSupportedCharacter(token)) {
      characters.push(token)
      continue
    }

    const expanded = [...token]
    const validExpanded = expanded.filter(isSupportedCharacter)

    if (validExpanded.length > 0) {
      characters.push(...validExpanded)
      continue
    }

    invalidTokens.push(token)
  }

  const dedupedCharacters = [...new Set(characters)]
  const dedupedInvalidTokens = [...new Set(invalidTokens)]

  return {
    characters: dedupedCharacters,
    invalidTokens: dedupedInvalidTokens,
  }
}
