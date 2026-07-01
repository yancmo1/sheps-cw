import { describe, expect, it, vi } from 'vitest'
import {
  shuffle,
  buildChoices,
  buildItems,
  createSessionId,
  calculateSessionResult,
} from './sessionBuilder.js'

describe('sessionBuilder', () => {
  it('shuffles without changing members', () => {
    const input = ['A', 'B', 'C', 'D']
    const shuffled = shuffle(input)

    expect(shuffled).toHaveLength(input.length)
    expect([...shuffled].sort()).toEqual([...input].sort())
    expect(shuffled).not.toBe(input)
  })

  it('builds answer choices containing the correct character', () => {
    const choices = buildChoices('A', ['A', 'B', 'C', 'D'], ['E', 'F'])

    expect(choices).toContain('A')
    expect(new Set(choices).size).toBe(choices.length)
    expect(choices.length).toBeLessThanOrEqual(4)
  })

  it('builds an empty item list for invalid input', () => {
    expect(buildItems([], 10)).toEqual([])
    expect(buildItems(['A'], 0)).toEqual([])
    expect(buildItems(null, 5)).toEqual([])
  })

  it('builds session items with char and choices', () => {
    const items = buildItems(['A', 'B'], 8, { fallbackCharacters: ['C'] })

    expect(items).toHaveLength(8)
    for (const item of items) {
      expect(['A', 'B']).toContain(item.char)
      expect(item.choices).toContain(item.char)
      expect(new Set(item.choices).size).toBe(item.choices.length)
    }
  })

  it('creates deterministic fallback session IDs when crypto.randomUUID is unavailable', () => {
    const originalNow = Date.now
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.123456789)
    const uuidSpy = vi.spyOn(globalThis.crypto, 'randomUUID').mockImplementation(() => {
      throw new Error('randomUUID unavailable')
    })
    Date.now = () => 1710000000000

    const id = createSessionId()

    expect(id).toMatch(/^session-1710000000000-/)

    uuidSpy.mockRestore()
    randomSpy.mockRestore()
    Date.now = originalNow
  })

  it('uses crypto.randomUUID when available', () => {
    const uuidSpy = vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('test-uuid-1234')

    const id = createSessionId()
    expect(id).toBe('test-uuid-1234')

    uuidSpy.mockRestore()
  })

  it('calculates session result summary including misses and accuracy', () => {
    const result = calculateSessionResult({
      completedItems: [
        { character: 'A', selected: 'A', correct: true },
        { character: 'B', selected: 'C', correct: false },
        { character: 'B', selected: 'D', correct: false },
      ],
      config: { mode: 'identify', length: 3, lessonName: 'Lesson A' },
      lesson: { id: 'lesson-a', name: 'Lesson A' },
      characters: ['A', 'B', 'C'],
      id: 'session-1',
      createdAt: '2026-07-01T00:00:00.000Z',
    })

    expect(result).toMatchObject({
      id: 'session-1',
      lessonId: 'lesson-a',
      lessonName: 'Lesson A',
      mode: 'identify',
      sessionLength: 3,
      attempted: 3,
      correct: 1,
      accuracy: 33,
      missed: ['B'],
      characters: ['A', 'B', 'C'],
    })
    expect(result.items).toHaveLength(3)
  })

  it('handles empty completed items safely', () => {
    const result = calculateSessionResult({
      completedItems: null,
      config: { mode: 'listen', length: 5 },
      lesson: null,
      characters: [],
      id: 'session-empty',
      createdAt: '2026-07-01T00:00:00.000Z',
    })

    expect(result.attempted).toBe(0)
    expect(result.correct).toBe(0)
    expect(result.accuracy).toBe(0)
    expect(result.lessonId).toBe('custom')
    expect(result.lessonName).toBe('Custom Set')
    expect(result.missed).toEqual([])
  })
})
