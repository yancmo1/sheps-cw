import { getMorseUnitSeconds, getCharacterGapSeconds } from '../morseTiming.js'

export const KEY_INPUT_MODES = {
  STRAIGHT: 'straight',
  IAMBIC_A: 'iambic-a',
  IAMBIC_B: 'iambic-b',
}

export function buildKeyDecodeTiming({ wpm = 20, farnsworth = wpm } = {}) {
  const unitMs = getMorseUnitSeconds(wpm) * 1000
  const characterGapMs = getCharacterGapSeconds({ wpm, farnsworth }) * 1000

  return {
    unitMs,
    dotDashThresholdMs: unitMs * 2,
    characterGapMs,
    wordGapMs: characterGapMs + unitMs * 4,
  }
}

export function classifyKeyPressDuration(durationMs, timing) {
  const safeDuration = Math.max(0, Number(durationMs) || 0)
  return safeDuration < timing.dotDashThresholdMs ? '.' : '-'
}

export function getAlternateSymbol(symbol) {
  return symbol === '.' ? '-' : '.'
}

export function getPaddleElementDurationMs(symbol, timing) {
  return symbol === '-' ? timing.unitMs * 3 : timing.unitMs
}

export function pickPaddleSymbol({
  dotPressed,
  dashPressed,
  lastSymbol = null,
  pendingSymbol = null,
}) {
  if (pendingSymbol) {
    return {
      symbol: pendingSymbol,
      consumedPending: true,
    }
  }

  if (dotPressed && dashPressed) {
    return {
      symbol: getAlternateSymbol(lastSymbol ?? '-'),
      consumedPending: false,
    }
  }

  if (dotPressed) {
    return {
      symbol: '.',
      consumedPending: false,
    }
  }

  if (dashPressed) {
    return {
      symbol: '-',
      consumedPending: false,
    }
  }

  return {
    symbol: null,
    consumedPending: false,
  }
}

export function estimateCharacterSpeedWpm(symbolEvents = []) {
  if (!Array.isArray(symbolEvents) || symbolEvents.length === 0) {
    return null
  }

  const unitEstimates = []

  for (const event of symbolEvents) {
    const duration = Number(event?.durationMs)
    const gapBefore = Number(event?.gapBeforeMs)

    if (Number.isFinite(duration) && duration > 0) {
      if (event?.symbol === '-') {
        unitEstimates.push(duration / 3)
      } else {
        unitEstimates.push(duration)
      }
    }

    if (Number.isFinite(gapBefore) && gapBefore > 0) {
      unitEstimates.push(gapBefore)
    }
  }

  if (unitEstimates.length === 0) {
    return null
  }

  const unitAvgMs = unitEstimates.reduce((sum, value) => sum + value, 0) / unitEstimates.length
  if (unitAvgMs <= 0) {
    return null
  }

  return 1200 / unitAvgMs
}
