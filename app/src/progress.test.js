import { describe, expect, it } from 'vitest'
import {
  buildDailyChallenge,
  exportSessionHistoryCsv,
  exportSessionHistoryJson,
  getAchievementsSummary,
  getAdaptiveSessionAdjustments,
  getAccuracyTrendSummary,
  getCharacterConfusionSummary,
  getDueCharacterReviewSet,
  getDynamicSpeedRecommendation,
  importSessionHistoryJson,
  getPracticeStreakSummary,
  getCharacterPerformanceSummary,
  getSpacedRepetitionSummary,
  getTodayPracticeSummary,
  getWeakCharacterPracticeSet,
} from './progress.js'

const HISTORY = [
  {
    id: 's2',
    createdAt: '2026-07-02T12:00:00.000Z',
    mode: 'identify',
    items: [
      { character: 'E', selected: 'T', correct: false },
      { character: 'E', selected: 'E', correct: true },
      { character: 'T', selected: 'E', correct: false },
      { character: 'A', selected: 'A', correct: true },
    ],
  },
  {
    id: 's1',
    createdAt: '2026-07-01T12:00:00.000Z',
    mode: 'identify',
    items: [
      { character: 'E', selected: 'T', correct: false },
      { character: 'E', selected: 'E', correct: true },
      { character: 'E', selected: 'E', correct: true },
      { character: 'T', selected: 'T', correct: true },
      { character: 'T', selected: 'T', correct: true },
      { character: 'A', selected: 'A', correct: true },
    ],
  },
]

const HISTORY_WITH_COPY = [
  ...HISTORY,
  {
    id: 's3',
    createdAt: '2026-07-02T15:00:00.000Z',
    mode: 'copy',
    items: [
      { character: 'N', selected: 'N', correct: true },
      { character: 'M', selected: 'N', correct: false },
    ],
  },
]

describe('progress adaptive learning helpers', () => {
  it('computes rolling per-character accuracy', () => {
    const summary = getCharacterPerformanceSummary(HISTORY, {
      rollingWindows: [3, 10],
      weakThreshold: 80,
      minAttemptsForWeak: 2,
    })

    const e = summary.find(item => item.character === 'E')
    const t = summary.find(item => item.character === 'T')

    expect(e).toBeTruthy()
    expect(t).toBeTruthy()

    expect(e.attempts).toBe(5)
    expect(e.accuracy).toBe(60)
    expect(e.rolling[3].accuracy).toBe(67)
    expect(e.isWeak).toBe(true)

    expect(t.attempts).toBe(3)
    expect(t.accuracy).toBe(67)
  })

  it('returns weak practice set sorted by weakest rolling accuracy first', () => {
    const weak = getWeakCharacterPracticeSet(HISTORY, {
      limit: 4,
      weakThreshold: 80,
      minAttemptsForWeak: 2,
      rollingWindow: 10,
    })

    expect(weak).toEqual(['E', 'T'])
  })

  it('summarizes common confusion pairs', () => {
    const confusions = getCharacterConfusionSummary(HISTORY, { limit: 5 })

    expect(confusions[0]).toEqual({
      expected: 'E',
      selected: 'T',
      count: 2,
    })

    expect(confusions[1]).toEqual({
      expected: 'T',
      selected: 'E',
      count: 1,
    })
  })

  it('computes spaced repetition fields and due state', () => {
    const summary = getSpacedRepetitionSummary(HISTORY, {
      now: new Date('2026-07-04T12:00:00.000Z'),
    })

    const e = summary.find(item => item.character === 'E')
    const a = summary.find(item => item.character === 'A')

    expect(e).toBeTruthy()
    expect(a).toBeTruthy()

    expect(e.intervalDays).toBe(1)
    expect(e.isDue).toBe(true)
    expect(a.repetitions).toBe(2)
  })

  it('returns due review set sorted by due date then weaker rolling accuracy', () => {
    const due = getDueCharacterReviewSet(HISTORY, {
      now: new Date('2026-07-04T12:00:00.000Z'),
      limit: 4,
    })

    expect(due).toContain('E')
    expect(due).toContain('T')
  })

  it('tracks characters practiced today from identify sessions', () => {
    const summary = getTodayPracticeSummary(HISTORY_WITH_COPY, {
      now: new Date('2026-07-02T21:00:00.000Z'),
    })

    expect(summary.scoredSessions).toBe(2)
    expect(summary.scoredAttempts).toBe(6)
    expect(summary.practicedCharacters).toEqual(['A', 'E', 'M', 'N', 'T'])
  })

  it('recommends speed increase for very high accuracy', () => {
    const recommendation = getDynamicSpeedRecommendation(
      { mode: 'identify', attempted: 20, accuracy: 96 },
      { wpm: 20, farnsworth: 10 }
    )

    expect(recommendation.hasRecommendation).toBe(true)
    expect(recommendation.delta).toBe(1)
    expect(recommendation.nextWpm).toBe(21)
    expect(recommendation.nextFarnsworth).toBe(11)
  })

  it('recommends speed decrease for low accuracy', () => {
    const recommendation = getDynamicSpeedRecommendation(
      { mode: 'identify', attempted: 20, accuracy: 65 },
      { wpm: 20, farnsworth: 10 }
    )

    expect(recommendation.hasRecommendation).toBe(true)
    expect(recommendation.delta).toBe(-1)
    expect(recommendation.nextWpm).toBe(19)
    expect(recommendation.nextFarnsworth).toBe(9)
  })

  it('supports speed recommendations for copy mode', () => {
    const recommendation = getDynamicSpeedRecommendation(
      { mode: 'copy', attempted: 20, accuracy: 97 },
      { wpm: 18, farnsworth: 10 }
    )

    expect(recommendation.hasRecommendation).toBe(true)
    expect(recommendation.nextWpm).toBe(19)
  })

  it('computes current and longest streaks from practice days', () => {
    const streak = getPracticeStreakSummary(HISTORY, {
      now: new Date('2026-07-02T19:00:00.000Z'),
    })

    expect(streak.currentStreakDays).toBe(2)
    expect(streak.longestStreakDays).toBe(2)
    expect(streak.practicedToday).toBe(true)
  })

  it('computes accuracy trend summary aggregates', () => {
    const trend = getAccuracyTrendSummary(HISTORY_WITH_COPY)

    expect(trend.points.length).toBe(3)
    expect(trend.averages.last10).toBeGreaterThan(0)
    expect(['improving', 'stable', 'declining']).toContain(trend.trend)
  })

  it('returns starter achievements based on history milestones', () => {
    const achievements = getAchievementsSummary([
      {
        id: 's100',
        createdAt: '2026-07-02T16:00:00.000Z',
        mode: 'identify',
        attempted: 5,
        correct: 5,
        accuracy: 100,
        wpm: 21,
        items: [
          { character: 'A', selected: 'A', correct: true },
          { character: 'A', selected: 'A', correct: true },
          { character: 'A', selected: 'A', correct: true },
          { character: 'A', selected: 'A', correct: true },
          { character: 'A', selected: 'A', correct: true },
        ],
      },
    ])

    const ids = achievements.earned.map(item => item.id)

    expect(ids).toContain('first-session')
    expect(ids).toContain('first-perfect')
    expect(ids).toContain('reach-20wpm')
  })

  it('reduces character set and slows Farnsworth when recent accuracy is low', () => {
    const adjusted = getAdaptiveSessionAdjustments(HISTORY_WITH_COPY, {
      mode: 'identify',
      characters: ['A', 'E', 'T', 'M', 'N', 'S'],
      allCharacters: ['A', 'E', 'T', 'M', 'N', 'S', 'H', '5'],
      settings: { wpm: 20, farnsworth: 10 },
    })

    expect(adjusted.characters.length).toBeLessThanOrEqual(6)
    expect(adjusted.characters.length).toBeGreaterThanOrEqual(4)
    expect(adjusted.sessionSettingsOverride?.farnsworth).toBe(9)
  })

  it('adds challenge characters and tightens Farnsworth when recent accuracy is high', () => {
    const strongHistory = [
      {
        id: 's900',
        createdAt: '2026-07-01T12:00:00.000Z',
        mode: 'identify',
        attempted: 10,
        accuracy: 100,
        items: Array.from({ length: 10 }, () => ({ character: 'A', selected: 'A', correct: true })),
      },
      {
        id: 's901',
        createdAt: '2026-07-02T12:00:00.000Z',
        mode: 'identify',
        attempted: 10,
        accuracy: 100,
        items: Array.from({ length: 10 }, () => ({ character: 'A', selected: 'A', correct: true })),
      },
    ]

    const adjusted = getAdaptiveSessionAdjustments(strongHistory, {
      mode: 'identify',
      characters: ['A', 'E'],
      allCharacters: ['A', 'E', 'T', 'M', 'N'],
      settings: { wpm: 20, farnsworth: 10 },
    })

    expect(adjusted.characters.length).toBeGreaterThanOrEqual(2)
    expect(adjusted.sessionSettingsOverride?.farnsworth).toBe(11)
  })

  it('exports and imports session history backups', () => {
    const originalStorage = globalThis.localStorage
    const store = new Map()
    globalThis.localStorage = {
      getItem: key => store.get(key) ?? null,
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: key => store.delete(key),
      clear: () => store.clear(),
      key: () => null,
      length: 0,
    }

    const imported = importSessionHistoryJson(JSON.stringify(HISTORY), { overwrite: true })
    expect(imported.length).toBe(2)

    const json = exportSessionHistoryJson()
    const csv = exportSessionHistoryCsv()

    expect(json).toContain('"lessonName"')
    expect(csv.split('\n')[0]).toContain('lessonName')

    globalThis.localStorage = originalStorage
  })

  it('builds deterministic daily challenge for a given date', () => {
    const challengeA = buildDailyChallenge({
      date: new Date('2026-07-02T10:00:00.000Z'),
      availableCharacters: ['A', 'B', 'C', 'D', 'E', 'F'],
    })
    const challengeB = buildDailyChallenge({
      date: new Date('2026-07-02T22:00:00.000Z'),
      availableCharacters: ['A', 'B', 'C', 'D', 'E', 'F'],
    })

    expect(challengeA.id).toBe(challengeB.id)
    expect(challengeA.characters).toEqual(challengeB.characters)
    expect(challengeA.suggestedWpm).toBeGreaterThanOrEqual(16)
    expect(challengeA.suggestedWpm).toBeLessThanOrEqual(22)
  })

  it('earns additional achievement milestones', () => {
    const longHistory = Array.from({ length: 30 }, (_, i) => ({
      id: `k-${i}`,
      createdAt: `2026-06-${String(i + 1).padStart(2, '0')}T05:10:00.000Z`,
      mode: 'identify',
      lessonId: i === 29 ? 'challenge-20260702' : i === 28 ? 'koch-13' : 'koch-1',
      attempted: 40,
      correct: 35,
      accuracy: 88,
      wpm: i === 29 ? 30 : 25,
      items: Array.from({ length: 40 }, () => ({ character: 'A', selected: 'A', correct: true })),
    }))

    const achievements = getAchievementsSummary(longHistory)
    const ids = achievements.earned.map(item => item.id)

    expect(ids).toContain('reach-25wpm')
    expect(ids).toContain('reach-30wpm')
    expect(ids).toContain('thousand-characters')
    expect(ids).toContain('early-bird')
    expect(ids).toContain('thirty-day-streak')
    expect(ids).toContain('koch-complete')
    expect(ids).toContain('daily-challenger')
  })
})
