import { describe, expect, it } from 'vitest'
import {
  normalizeCharacterToken,
  getAvailableCharacters,
  isSupportedCharacter,
  encodeCharacter,
  decodeMorse,
  parseCharacterInput,
} from './charsetCodec.js'

describe('charsetCodec', () => {
  it('normalizes character tokens', () => {
    expect(normalizeCharacterToken(' a ')).toBe('A')
    expect(normalizeCharacterToken(null)).toBe('')
  })

  it('reports supported character availability', () => {
    const supported = getAvailableCharacters()
    expect(supported).toContain('A')
    expect(supported).toContain('0')
    expect(supported).toContain('SOS')
  })

  it('checks support for single and multi-character tokens', () => {
    expect(isSupportedCharacter('a')).toBe(true)
    expect(isSupportedCharacter('SK')).toBe(true)
    expect(isSupportedCharacter('?')).toBe(false)
  })

  it('encodes and decodes Morse patterns', () => {
    expect(encodeCharacter('a')).toBe('.-')
    expect(encodeCharacter('SK')).toBe('...-.-')
    expect(encodeCharacter('?')).toBeNull()

    expect(decodeMorse('.-')).toBe('A')
    expect(decodeMorse('...-.-')).toBe('SK')
    expect(decodeMorse('..--..')).toBeNull()
  })

  it('parses contiguous custom input as individual characters', () => {
    expect(parseCharacterInput('abc123')).toEqual({
      characters: ['A', 'B', 'C', '1', '2', '3'],
      invalidTokens: [],
    })
  })

  it('parses delimited input and preserves multi-character tokens like prosigns', () => {
    expect(parseCharacterInput('A SK sos')).toEqual({
      characters: ['A', 'SK', 'SOS'],
      invalidTokens: [],
    })
  })

  it('reports unsupported tokens while returning valid parsed characters', () => {
    expect(parseCharacterInput('A ? 9,XYZ')).toEqual({
      characters: ['A', '9', 'X', 'Y', 'Z'],
      invalidTokens: ['?'],
    })
  })
})
