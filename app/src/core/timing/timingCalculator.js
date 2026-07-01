const MIN_WPM = 5
const DEFAULT_WPM = 20

function toFiniteNumber(value, fallback) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : fallback
}

export function normalizeWpm(wpm = DEFAULT_WPM) {
  return Math.max(MIN_WPM, toFiniteNumber(wpm, DEFAULT_WPM))
}

export function getMorseUnitSeconds(wpm = DEFAULT_WPM) {
  return 1.2 / normalizeWpm(wpm)
}

export function getCharacterGapSeconds({ wpm = DEFAULT_WPM, farnsworth = wpm } = {}) {
  const effectiveWpm = normalizeWpm(wpm)
  const effectiveFarnsworth = normalizeWpm(farnsworth)

  if (effectiveFarnsworth >= effectiveWpm) {
    return getMorseUnitSeconds(effectiveWpm) * 3
  }

  return getMorseUnitSeconds(effectiveFarnsworth) * 3
}

export function getPostCharacterDelayMs(options = {}) {
  return Math.round(getCharacterGapSeconds(options) * 1000)
}

export function getSymbolDurationSeconds(symbol, { wpm = DEFAULT_WPM } = {}) {
  const unit = getMorseUnitSeconds(wpm)
  return symbol === '-' ? unit * 3 : unit
}

export function getCharacterPlaybackDurationMs(pattern, options = {}) {
  if (typeof pattern !== 'string' || pattern.length === 0) {
    return getPostCharacterDelayMs(options)
  }

  const unitMs = getMorseUnitSeconds(options?.wpm) * 1000
  const elementMs = [...pattern].reduce((sum, symbol) => {
    return sum + getSymbolDurationSeconds(symbol, options) * 1000
  }, 0)
  const interElementGapMs = Math.max(0, pattern.length - 1) * unitMs

  return Math.ceil(elementMs + interElementGapMs + getPostCharacterDelayMs(options))
}
