import { describe, expect, it } from 'vitest'
import {
  buildKeyDecodeTiming,
  classifyKeyPressDuration,
  estimateCharacterSpeedWpm,
  getAlternateSymbol,
  getPaddleElementDurationMs,
  pickPaddleSymbol,
} from './keyDecode.js'

describe('keyDecode', () => {
  it('builds timing windows from WPM and Farnsworth settings', () => {
    const timing = buildKeyDecodeTiming({ wpm: 20, farnsworth: 10 })

    expect(timing.unitMs).toBeCloseTo(60, 5)
    expect(timing.dotDashThresholdMs).toBeCloseTo(120, 5)
    expect(timing.characterGapMs).toBeCloseTo(360, 5)
    expect(timing.wordGapMs).toBeCloseTo(600, 5)
  })

  it('classifies short key-down as dot and long key-down as dash', () => {
    const timing = buildKeyDecodeTiming({ wpm: 20 })

    expect(classifyKeyPressDuration(70, timing)).toBe('.')
    expect(classifyKeyPressDuration(130, timing)).toBe('-')
  })

  it('returns alternate symbol helper values', () => {
    expect(getAlternateSymbol('.')).toBe('-')
    expect(getAlternateSymbol('-')).toBe('.')
  })

  it('calculates paddle element durations from timing unit', () => {
    const timing = buildKeyDecodeTiming({ wpm: 20 })
    expect(getPaddleElementDurationMs('.', timing)).toBeCloseTo(60, 5)
    expect(getPaddleElementDurationMs('-', timing)).toBeCloseTo(180, 5)
  })

  it('chooses paddle symbols for single paddles and squeeze alternation', () => {
    expect(pickPaddleSymbol({ dotPressed: true, dashPressed: false })).toEqual({
      symbol: '.',
      consumedPending: false,
    })

    expect(pickPaddleSymbol({ dotPressed: false, dashPressed: true })).toEqual({
      symbol: '-',
      consumedPending: false,
    })

    expect(pickPaddleSymbol({ dotPressed: true, dashPressed: true, lastSymbol: null })).toEqual({
      symbol: '.',
      consumedPending: false,
    })

    expect(pickPaddleSymbol({ dotPressed: true, dashPressed: true, lastSymbol: '.' })).toEqual({
      symbol: '-',
      consumedPending: false,
    })

    expect(pickPaddleSymbol({ dotPressed: true, dashPressed: true, lastSymbol: '-' })).toEqual({
      symbol: '.',
      consumedPending: false,
    })
  })

  it('emits pending iambic-B symbol before reading current paddle state', () => {
    expect(pickPaddleSymbol({
      dotPressed: false,
      dashPressed: false,
      lastSymbol: '.',
      pendingSymbol: '-',
    })).toEqual({
      symbol: '-',
      consumedPending: true,
    })
  })

  it('estimates character speed from element durations and inter-element gaps', () => {
    // Pattern .- at 20 WPM: dot=60ms, gap=60ms, dash=180ms => unit average 60ms => 20 WPM
    expect(estimateCharacterSpeedWpm([
      { symbol: '.', durationMs: 60 },
      { symbol: '-', durationMs: 180, gapBeforeMs: 60 },
    ])).toBeCloseTo(20, 5)
  })

  it('returns null when no valid speed data exists', () => {
    expect(estimateCharacterSpeedWpm([])).toBeNull()
    expect(estimateCharacterSpeedWpm([{ symbol: '.', durationMs: 0 }])).toBeNull()
  })
})
