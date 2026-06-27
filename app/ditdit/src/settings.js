const STORAGE_KEY = 'ditdit_settings'

export const DEFAULT_SETTINGS = {
  wpm: 20,
  farnsworth: 10,
  frequency: 600,
  volume: 80,
}

export function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
    }
  } catch {
    // ignore parse or access errors
  }
  return { ...DEFAULT_SETTINGS }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // ignore storage errors
  }
}
