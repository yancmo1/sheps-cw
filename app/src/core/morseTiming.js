export function getMorseUnitSeconds(wpm = 20) {
  return 1.2 / Math.max(5, wpm)
}

export function getPostCharacterDelayMs({ wpm = 20, farnsworth = wpm } = {}) {
  if (farnsworth >= wpm) return Math.round(getMorseUnitSeconds(wpm) * 3000)

  const normalGapSeconds = getMorseUnitSeconds(wpm) * 3
  const farnsworthGapSeconds = getMorseUnitSeconds(farnsworth) * 3
  return Math.round(Math.max(normalGapSeconds, farnsworthGapSeconds) * 1000)
}
