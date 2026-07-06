import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_SETTINGS, loadSettings } from './settings.js'

describe('settings defaults', () => {
  it('includes envelope and frequency variation defaults', () => {
    expect(DEFAULT_SETTINGS.attackMs).toBe(5)
    expect(DEFAULT_SETTINGS.decayMs).toBe(5)
    expect(DEFAULT_SETTINGS.frequencyJitter).toBe(0)
    expect(DEFAULT_SETTINGS.largeText).toBe(false)
    expect(DEFAULT_SETTINGS.reduceMotion).toBe(false)
    expect(DEFAULT_SETTINGS.largeTouchTargets).toBe(false)
    expect(DEFAULT_SETTINGS.theme).toBe('dark')
  })

  it('merges stored settings with new defaults', () => {
    const originalLocalStorage = globalThis.localStorage
    const getItem = vi.fn().mockReturnValue(JSON.stringify({ wpm: 18 }))
    globalThis.localStorage = {
      getItem,
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0,
    }

    const loaded = loadSettings()
    expect(loaded.wpm).toBe(18)
    expect(loaded.attackMs).toBe(5)
    expect(loaded.decayMs).toBe(5)
    expect(loaded.frequencyJitter).toBe(0)
    expect(loaded.largeText).toBe(false)
    expect(loaded.reduceMotion).toBe(false)
    expect(loaded.largeTouchTargets).toBe(false)
    expect(loaded.theme).toBe('dark')

    globalThis.localStorage = originalLocalStorage
  })
})
