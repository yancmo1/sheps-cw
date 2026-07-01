import { describe, expect, it } from 'vitest'
import {
  normalizeWpm,
  getMorseUnitSeconds,
  getCharacterGapSeconds,
  getPostCharacterDelayMs,
  getSymbolDurationSeconds,
  getCharacterPlaybackDurationMs,
} from './timingCalculator.js'

describe('timingCalculator', () => {
  it('normalizes invalid and low WPM values', () => {
    expect(normalizeWpm()).toBe(20)
    expect(normalizeWpm(25)).toBe(25)
    expect(normalizeWpm(0)).toBe(5)
    expect(normalizeWpm(-10)).toBe(5)
    expect(normalizeWpm('18')).toBe(18)
    expect(normalizeWpm('abc')).toBe(20)
  })

  it('calculates dit unit seconds by WPM', () => {
    expect(getMorseUnitSeconds(20)).toBeCloseTo(0.06, 5)
    expect(getMorseUnitSeconds(12)).toBeCloseTo(0.1, 5)
  })

  it('uses character speed for gap when Farnsworth is not slower', () => {
    const gap = getCharacterGapSeconds({ wpm: 20, farnsworth: 20 })
    expect(gap).toBeCloseTo(0.18, 5)
  })

  it('uses slower Farnsworth speed for character gap when lower than character WPM', () => {
    const normalGap = getCharacterGapSeconds({ wpm: 20, farnsworth: 20 })
    const slowedGap = getCharacterGapSeconds({ wpm: 20, farnsworth: 10 })

    expect(slowedGap).toBeGreaterThan(normalGap)
    expect(getPostCharacterDelayMs({ wpm: 20, farnsworth: 10 })).toBe(360)
  })

  it('calculates symbol durations for dits and dahs', () => {
    expect(getSymbolDurationSeconds('.', { wpm: 20 })).toBeCloseTo(0.06, 5)
    expect(getSymbolDurationSeconds('-', { wpm: 20 })).toBeCloseTo(0.18, 5)
    // Unknown symbols default to dit-length behavior for safety
    expect(getSymbolDurationSeconds('x', { wpm: 20 })).toBeCloseTo(0.06, 5)
  })

  it('calculates full playback window for a character pattern', () => {
    // "A" => .- : 1 unit + 1 unit gap + 3 units + 3-unit post-char gap = 8 units
    const totalMs = getCharacterPlaybackDurationMs('.-', { wpm: 20, farnsworth: 20 })
    expect(totalMs).toBe(480)
  })

  it('falls back to post-character delay for empty patterns', () => {
    const fallback = getCharacterPlaybackDurationMs('', { wpm: 20, farnsworth: 20 })
    expect(fallback).toBe(getPostCharacterDelayMs({ wpm: 20, farnsworth: 20 }))
  })
})
