const STORAGE_KEY = 'ditdit.sessionHistory.v1'
const MAX_SESSIONS = 100
const DEFAULT_ROLLING_WINDOWS = [10, 50, 100]

function isScoredMode(mode) {
  return mode === 'identify' || mode === 'copy' || mode === 'speed-ladder'
}

function toNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function clampPercentage(value) {
  return Math.max(0, Math.min(100, Math.round(toNumber(value))))
}

function normalizeItems(items) {
  if (!Array.isArray(items)) return []

  return items
    .map(item => {
      if (!item || typeof item !== 'object') return null

      const character = typeof item.character === 'string' ? item.character : null
      if (!character) return null

      const selected = typeof item.selected === 'string' ? item.selected : null
      const correct = item.correct === null
        ? null
        : typeof item.correct === 'boolean'
          ? item.correct
          : Boolean(item.correct)
      const responseMs = toNumber(item.responseMs)

      return {
        character,
        selected,
        correct,
        responseMs,
      }
    })
    .filter(Boolean)
}

function normalizeMissed(missed, items) {
  if (Array.isArray(missed)) {
    return [...new Set(missed.filter(char => typeof char === 'string' && char))]
  }

  return [...new Set(items.filter(item => item.correct === false).map(item => item.character))]
}

function normalizeSession(entry) {
  if (!entry || typeof entry !== 'object') return null

  const items = normalizeItems(entry.items)
  const attempted = Math.max(0, toNumber(entry.attempted ?? items.length))
  const correct = Math.max(
    0,
    Math.min(
      attempted,
      toNumber(entry.correct ?? items.filter(item => item.correct).length)
    )
  )
  const accuracy = attempted > 0
    ? clampPercentage(entry.accuracy ?? (correct / attempted) * 100)
    : 0

  const createdAt = typeof entry.createdAt === 'string' && entry.createdAt
    ? entry.createdAt
    : new Date(0).toISOString()

  return {
    id: typeof entry.id === 'string' && entry.id ? entry.id : `session-${createdAt}`,
    createdAt,
    lessonId: typeof entry.lessonId === 'string' ? entry.lessonId : 'custom',
    lessonName: typeof entry.lessonName === 'string' && entry.lessonName ? entry.lessonName : 'Custom Set',
    mode: entry.mode === 'listen'
      ? 'listen'
      : entry.mode === 'copy'
        ? 'copy'
        : entry.mode === 'speed-ladder'
          ? 'speed-ladder'
        : 'identify',
    sessionLength: Math.max(0, toNumber(entry.sessionLength ?? attempted)),
    attempted,
    correct,
    accuracy,
    missed: normalizeMissed(entry.missed, items),
    items,
    wpm: toNumber(entry.wpm),
    farnsworth: toNumber(entry.farnsworth),
    finalWpm: toNumber(entry.finalWpm),
    ladderStoppedEarly: Boolean(entry.ladderStoppedEarly),
  }
}

function persistHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch {
    // ignore storage errors
  }
}

export function loadSessionHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map(normalizeSession)
      .filter(Boolean)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, MAX_SESSIONS)
  } catch {
    return []
  }
}

export function saveSessionResult(result) {
  const session = normalizeSession(result)
  if (!session || session.attempted === 0) {
    return loadSessionHistory()
  }

  const history = loadSessionHistory().filter(entry => entry.id !== session.id)
  const nextHistory = [session, ...history].slice(0, MAX_SESSIONS)
  persistHistory(nextHistory)
  return nextHistory
}

export function clearSessionHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore storage errors
  }
}

function setSessionHistory(history) {
  const nextHistory = (Array.isArray(history) ? history : [])
    .map(normalizeSession)
    .filter(Boolean)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, MAX_SESSIONS)

  persistHistory(nextHistory)
  return nextHistory
}

export function exportSessionHistoryJson() {
  return JSON.stringify(loadSessionHistory(), null, 2)
}

export function exportSessionHistoryCsv() {
  const history = loadSessionHistory()
  const rows = [
    ['id', 'createdAt', 'lessonId', 'lessonName', 'mode', 'attempted', 'correct', 'accuracy', 'sessionLength', 'wpm', 'farnsworth'].join(','),
    ...history.map(session => [
      session.id,
      session.createdAt,
      session.lessonId,
      `"${String(session.lessonName || '').replace(/"/g, '""')}"`,
      session.mode,
      session.attempted,
      session.correct,
      session.accuracy,
      session.sessionLength,
      session.wpm,
      session.farnsworth,
    ].join(',')),
  ]

  return rows.join('\n')
}

export function importSessionHistoryJson(jsonText, { overwrite = true } = {}) {
  const parsed = JSON.parse(jsonText)
  if (!Array.isArray(parsed)) {
    throw new Error('Invalid backup format: expected a JSON array of sessions.')
  }

  const incoming = parsed
    .map(normalizeSession)
    .filter(Boolean)

  const merged = overwrite
    ? incoming
    : [...incoming, ...loadSessionHistory()]

  return setSessionHistory(merged)
}

export function getProgressSummary(history) {
  const safeHistory = Array.isArray(history) ? history : []
  const scoredSessions = safeHistory.filter(session => isScoredMode(session?.mode))
  const totalSessions = safeHistory.length
  const totalCharacters = safeHistory.reduce((sum, session) => sum + toNumber(session.attempted), 0)
  const scoredCharacters = scoredSessions.reduce((sum, session) => sum + toNumber(session.attempted), 0)
  const totalCorrect = scoredSessions.reduce((sum, session) => sum + toNumber(session.correct), 0)
  const overallAccuracy = scoredCharacters > 0
    ? Math.round((totalCorrect / scoredCharacters) * 100)
    : 0
  const bestSessionAccuracy = scoredSessions.reduce(
    (best, session) => Math.max(best, clampPercentage(session.accuracy)),
    0
  )

  return {
    totalSessions,
    totalCharacters,
    totalCorrect,
    overallAccuracy,
    bestSessionAccuracy,
    scoredSessionCount: scoredSessions.length,
    recentSessions: safeHistory.slice(0, 10),
  }
}

export function getMissedCharacterSummary(history) {
  const counts = new Map()

  for (const session of Array.isArray(history) ? history : []) {
    for (const item of Array.isArray(session.items) ? session.items : []) {
      if (item && item.character && item.correct === false) {
        counts.set(item.character, (counts.get(item.character) ?? 0) + 1)
      }
    }
  }

  return [...counts.entries()]
    .map(([character, count]) => ({ character, count }))
    .sort((a, b) => b.count - a.count || a.character.localeCompare(b.character))
}

export function getCharacterMasterySummary(history) {
  const counts = new Map()

  for (const session of Array.isArray(history) ? history : []) {
    if (!isScoredMode(session?.mode)) continue

    for (const item of Array.isArray(session.items) ? session.items : []) {
      if (!item?.character || typeof item.correct !== 'boolean') continue

      const entry = counts.get(item.character) ?? {
        character: item.character,
        attempts: 0,
        correct: 0,
        missed: 0,
      }

      entry.attempts += 1
      if (item.correct) {
        entry.correct += 1
      } else {
        entry.missed += 1
      }
      counts.set(item.character, entry)
    }
  }

  return [...counts.values()]
    .map(entry => {
      const accuracy = entry.attempts > 0
        ? Math.round((entry.correct / entry.attempts) * 100)
        : 0
      const status = entry.attempts < 5
        ? 'New'
        : accuracy >= 85
          ? 'Solid'
          : accuracy >= 65
            ? 'Building'
            : 'Review'

      return {
        ...entry,
        accuracy,
        status,
      }
    })
    .sort((a, b) => a.character.localeCompare(b.character, undefined, { numeric: true }))
}

function getScoredItems(history) {
  return (Array.isArray(history) ? history : [])
    .filter(session => isScoredMode(session?.mode))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .flatMap(session => Array.isArray(session.items) ? session.items : [])
    .filter(item => item?.character && typeof item.correct === 'boolean')
}

function getScoredItemsWithDate(history) {
  return (Array.isArray(history) ? history : [])
    .filter(session => isScoredMode(session?.mode))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .flatMap(session => {
      const createdAt = typeof session?.createdAt === 'string' ? session.createdAt : null
      return (Array.isArray(session.items) ? session.items : [])
        .filter(item => item?.character && typeof item.correct === 'boolean')
        .map(item => ({ ...item, createdAt }))
    })
}

function getStartOfLocalDay(value) {
  const date = value ? new Date(value) : new Date()
  if (Number.isNaN(date.getTime())) return null
  date.setHours(0, 0, 0, 0)
  return date
}

function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function isSameLocalDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
}

export function getCharacterPerformanceSummary(
  history,
  {
    rollingWindows = DEFAULT_ROLLING_WINDOWS,
    weakThreshold = 80,
    minAttemptsForWeak = 5,
  } = {}
) {
  const safeWindows = [...new Set(
    (Array.isArray(rollingWindows) ? rollingWindows : DEFAULT_ROLLING_WINDOWS)
      .map(value => Math.max(1, Math.floor(toNumber(value))))
      .filter(Boolean)
  )].sort((a, b) => a - b)

  const perCharacter = new Map()

  for (const item of getScoredItems(history)) {
    const bucket = perCharacter.get(item.character) ?? []
    bucket.push(item.correct)
    perCharacter.set(item.character, bucket)
  }

  return [...perCharacter.entries()]
    .map(([character, outcomes]) => {
      const attempts = outcomes.length
      const correct = outcomes.filter(Boolean).length
      const allTimeAccuracy = attempts > 0
        ? Math.round((correct / attempts) * 100)
        : 0

      const rolling = Object.fromEntries(
        safeWindows.map(windowSize => {
          const windowOutcomes = outcomes.slice(-windowSize)
          const windowAttempts = windowOutcomes.length
          const windowCorrect = windowOutcomes.filter(Boolean).length
          const accuracy = windowAttempts > 0
            ? Math.round((windowCorrect / windowAttempts) * 100)
            : 0

          return [windowSize, {
            attempts: windowAttempts,
            correct: windowCorrect,
            accuracy,
          }]
        })
      )

      const primaryWindow = safeWindows[0]
      const primaryRolling = rolling[primaryWindow]
      const isWeak = Boolean(
        primaryRolling
        && primaryRolling.attempts >= minAttemptsForWeak
        && primaryRolling.accuracy < weakThreshold
      )

      return {
        character,
        attempts,
        correct,
        missed: attempts - correct,
        accuracy: allTimeAccuracy,
        rolling,
        isWeak,
      }
    })
    .sort((a, b) => a.character.localeCompare(b.character, undefined, { numeric: true }))
}

export function getWeakCharacterPracticeSet(
  history,
  {
    limit = 8,
    weakThreshold = 80,
    minAttemptsForWeak = 5,
    rollingWindow = 10,
  } = {}
) {
  const summary = getCharacterPerformanceSummary(history, {
    rollingWindows: [rollingWindow, 50, 100],
    weakThreshold,
    minAttemptsForWeak,
  })

  return summary
    .filter(item => item.isWeak)
    .sort((a, b) => {
      const aWindow = a.rolling[rollingWindow]
      const bWindow = b.rolling[rollingWindow]
      const aAccuracy = aWindow?.accuracy ?? 100
      const bAccuracy = bWindow?.accuracy ?? 100
      if (aAccuracy !== bAccuracy) return aAccuracy - bAccuracy

      const aAttempts = aWindow?.attempts ?? 0
      const bAttempts = bWindow?.attempts ?? 0
      if (aAttempts !== bAttempts) return bAttempts - aAttempts

      return a.character.localeCompare(b.character, undefined, { numeric: true })
    })
    .slice(0, Math.max(1, Math.floor(toNumber(limit))))
    .map(item => item.character)
}

export function getCharacterConfusionSummary(history, { limit = 8 } = {}) {
  const confusion = new Map()

  for (const item of getScoredItems(history)) {
    if (item.correct !== false || !item.selected || item.selected === item.character) continue

    const key = `${item.character}->${item.selected}`
    const existing = confusion.get(key) ?? {
      expected: item.character,
      selected: item.selected,
      count: 0,
    }

    existing.count += 1
    confusion.set(key, existing)
  }

  return [...confusion.values()]
    .sort((a, b) => b.count - a.count || a.expected.localeCompare(b.expected))
    .slice(0, Math.max(1, Math.floor(toNumber(limit))))
}

export function getSpacedRepetitionSummary(history, { now = new Date() } = {}) {
  const today = getStartOfLocalDay(now)
  if (!today) return []

  const eventsByCharacter = new Map()
  for (const item of getScoredItemsWithDate(history)) {
    const events = eventsByCharacter.get(item.character) ?? []
    events.push(item)
    eventsByCharacter.set(item.character, events)
  }

  return [...eventsByCharacter.entries()]
    .map(([character, events]) => {
      let repetitions = 0
      let intervalDays = 1
      let easeFactor = 2.5

      for (const event of events) {
        if (event.correct) {
          repetitions += 1
          if (repetitions === 1) {
            intervalDays = 1
          } else if (repetitions === 2) {
            intervalDays = 2
          } else {
            intervalDays = Math.max(1, Math.round(intervalDays * easeFactor))
          }
          easeFactor = Math.min(2.8, easeFactor + 0.05)
        } else {
          repetitions = 0
          intervalDays = 1
          easeFactor = Math.max(1.3, easeFactor - 0.2)
        }
      }

      const lastSeenRaw = events[events.length - 1]?.createdAt
      const lastSeenDate = getStartOfLocalDay(lastSeenRaw)
      const nextReviewDate = lastSeenDate ? addDays(lastSeenDate, intervalDays) : today
      const isDue = nextReviewDate <= today

      return {
        character,
        repetitions,
        intervalDays,
        easeFactor: Math.round(easeFactor * 100) / 100,
        lastSeenAt: lastSeenDate ? lastSeenDate.toISOString() : null,
        nextReviewAt: nextReviewDate.toISOString(),
        isDue,
      }
    })
    .sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt) || a.character.localeCompare(b.character))
}

export function getDueCharacterReviewSet(
  history,
  {
    limit = 12,
    now = new Date(),
  } = {}
) {
  const spaced = getSpacedRepetitionSummary(history, { now })
  const performance = getCharacterPerformanceSummary(history, {
    rollingWindows: [10],
    weakThreshold: 80,
    minAttemptsForWeak: 1,
  })

  const byCharacter = new Map(performance.map(item => [item.character, item]))

  return spaced
    .filter(item => item.isDue)
    .sort((a, b) => {
      if (a.nextReviewAt !== b.nextReviewAt) return a.nextReviewAt.localeCompare(b.nextReviewAt)

      const aAcc = byCharacter.get(a.character)?.rolling?.[10]?.accuracy ?? 100
      const bAcc = byCharacter.get(b.character)?.rolling?.[10]?.accuracy ?? 100
      if (aAcc !== bAcc) return aAcc - bAcc

      return a.character.localeCompare(b.character, undefined, { numeric: true })
    })
    .slice(0, Math.max(1, Math.floor(toNumber(limit))))
    .map(item => item.character)
}

export function getTodayPracticeSummary(history, { now = new Date() } = {}) {
  const today = getStartOfLocalDay(now)
  if (!today) {
    return {
      practicedCharacters: [],
      scoredSessions: 0,
      scoredAttempts: 0,
    }
  }

  const characters = new Set()
  let scoredSessions = 0
  let scoredAttempts = 0

  for (const session of Array.isArray(history) ? history : []) {
    if (!isScoredMode(session?.mode)) continue
    const sessionDate = new Date(session.createdAt)
    if (Number.isNaN(sessionDate.getTime())) continue
    if (!isSameLocalDay(sessionDate, today)) continue

    scoredSessions += 1

    for (const item of Array.isArray(session.items) ? session.items : []) {
      if (!item?.character || typeof item.correct !== 'boolean') continue
      scoredAttempts += 1
      characters.add(item.character)
    }
  }

  return {
    practicedCharacters: [...characters].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    scoredSessions,
    scoredAttempts,
  }
}

export function getDynamicSpeedRecommendation(result, settings) {
  if (!result || !isScoredMode(result.mode) || result.attempted <= 0) {
    return {
      hasRecommendation: false,
      nextWpm: settings?.wpm ?? null,
      reason: 'No scored session available for recommendation.',
    }
  }

  const currentWpm = Math.max(5, Math.floor(toNumber(settings?.wpm || 20)))
  const currentFarnsworth = Math.max(5, Math.floor(toNumber(settings?.farnsworth || currentWpm)))
  const accuracy = clampPercentage(result.accuracy)

  let delta = 0
  let reason = 'Keep current speed for now.'

  if (accuracy >= 95) {
    delta = 1
    reason = 'Great accuracy. You are ready to speed up a little.'
  } else if (accuracy < 70) {
    delta = -1
    reason = 'Accuracy dropped. Slowing down can improve copy quality.'
  }

  const nextWpm = Math.max(5, Math.min(40, currentWpm + delta))
  const nextFarnsworth = Math.max(5, Math.min(nextWpm, currentFarnsworth + (delta < 0 ? -1 : delta > 0 ? 1 : 0)))

  return {
    hasRecommendation: delta !== 0,
    accuracy,
    currentWpm,
    nextWpm,
    currentFarnsworth,
    nextFarnsworth,
    delta,
    reason,
  }
}

export function getPracticeStreakSummary(history, { now = new Date() } = {}) {
  const dayKeys = new Set()

  for (const session of Array.isArray(history) ? history : []) {
    const date = new Date(session?.createdAt)
    if (Number.isNaN(date.getTime())) continue
    date.setHours(0, 0, 0, 0)
    dayKeys.add(date.toISOString())
  }

  const days = [...dayKeys]
    .map(value => new Date(value))
    .sort((a, b) => a.getTime() - b.getTime())

  if (days.length === 0) {
    return {
      currentStreakDays: 0,
      longestStreakDays: 0,
      practicedToday: false,
      lastPracticeDate: null,
    }
  }

  let longest = 1
  let running = 1
  for (let i = 1; i < days.length; i += 1) {
    const previous = days[i - 1]
    const current = days[i]
    const diffDays = Math.round((current.getTime() - previous.getTime()) / 86400000)
    if (diffDays === 1) {
      running += 1
    } else {
      running = 1
    }
    longest = Math.max(longest, running)
  }

  const today = getStartOfLocalDay(now)
  const yesterday = addDays(today, -1)
  const lastPracticeDate = days[days.length - 1]
  const practicedToday = isSameLocalDay(lastPracticeDate, today)
  const practicedYesterday = isSameLocalDay(lastPracticeDate, yesterday)

  let currentStreakDays = 0
  if (practicedToday || practicedYesterday) {
    currentStreakDays = 1
    for (let i = days.length - 1; i > 0; i -= 1) {
      const diffDays = Math.round((days[i].getTime() - days[i - 1].getTime()) / 86400000)
      if (diffDays === 1) {
        currentStreakDays += 1
      } else {
        break
      }
    }
  }

  return {
    currentStreakDays,
    longestStreakDays: longest,
    practicedToday,
    lastPracticeDate: lastPracticeDate.toISOString(),
  }
}

export function getAccuracyTrendSummary(history) {
  const scoredSessions = (Array.isArray(history) ? history : [])
    .filter(session => {
      if (!isScoredMode(session?.mode)) return false
      const attempts = toNumber(session.attempted || (Array.isArray(session.items) ? session.items.length : 0))
      return attempts > 0
    })
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))

  if (scoredSessions.length === 0) {
    return {
      trend: 'stable',
      points: [],
      averages: { last10: 0, last30: 0, all: 0 },
    }
  }

  const points = scoredSessions.map((session, index) => ({
    accuracy: (() => {
      const stored = toNumber(session.accuracy)
      if (stored > 0) return clampPercentage(stored)
      const items = Array.isArray(session.items) ? session.items : []
      const attempts = toNumber(session.attempted || items.length)
      const correct = toNumber(
        session.correct
          || items.filter(item => item?.correct === true).length
      )
      return attempts > 0 ? clampPercentage((correct / attempts) * 100) : 0
    })(),
    x: index,
    y: 0,
    createdAt: session.createdAt,
  })).map(point => ({
    ...point,
    y: point.accuracy,
  }))

  function averageOfLast(count) {
    const slice = points.slice(-count)
    if (slice.length === 0) return 0
    return Math.round(slice.reduce((sum, point) => sum + point.y, 0) / slice.length)
  }

  const allAverage = averageOfLast(points.length)
  const last10 = averageOfLast(10)
  const last30 = averageOfLast(30)

  const compareWindow = Math.min(5, Math.floor(points.length / 2))
  let trend = 'stable'
  if (compareWindow >= 2) {
    const recent = points.slice(-compareWindow)
    const previous = points.slice(-(compareWindow * 2), -compareWindow)
    const recentAvg = recent.reduce((sum, point) => sum + point.y, 0) / recent.length
    const previousAvg = previous.reduce((sum, point) => sum + point.y, 0) / previous.length
    const delta = recentAvg - previousAvg
    if (delta >= 4) trend = 'improving'
    else if (delta <= -4) trend = 'declining'
  }

  return {
    trend,
    points,
    averages: {
      last10,
      last30,
      all: allAverage,
    },
  }
}

export function getAchievementsSummary(history) {
  const safeHistory = Array.isArray(history) ? history : []
  const scoredSessions = safeHistory.filter(session => isScoredMode(session?.mode))
  const performance = getCharacterPerformanceSummary(safeHistory, {
    rollingWindows: [20],
    weakThreshold: 80,
    minAttemptsForWeak: 1,
  })

  const earned = []

  if (safeHistory.length >= 1) {
    earned.push({ id: 'first-session', label: 'First Session Complete' })
  }
  if (safeHistory.length >= 10) {
    earned.push({ id: 'ten-sessions', label: '10 Sessions Complete' })
  }
  if (scoredSessions.some(session => clampPercentage(session.accuracy) === 100)) {
    earned.push({ id: 'first-perfect', label: 'First Perfect Session' })
  }
  if (performance.some(item => (item.rolling[20]?.attempts ?? 0) >= 20 && (item.rolling[20]?.accuracy ?? 0) === 100)) {
    earned.push({ id: 'master-character', label: 'Master a Character (20/20)' })
  }
  if (safeHistory.some(session => toNumber(session.wpm) >= 20)) {
    earned.push({ id: 'reach-20wpm', label: 'Reach 20 WPM' })
  }
  if (safeHistory.some(session => toNumber(session.wpm) >= 25)) {
    earned.push({ id: 'reach-25wpm', label: 'Reach 25 WPM' })
  }
  if (safeHistory.some(session => toNumber(session.wpm) >= 30)) {
    earned.push({ id: 'reach-30wpm', label: 'Reach 30 WPM' })
  }

  const totalAttempted = safeHistory.reduce((sum, session) => sum + toNumber(session.attempted), 0)
  if (totalAttempted >= 1000) {
    earned.push({ id: 'thousand-characters', label: '1000 Characters Practiced' })
  }

  const hasEarlyBird = safeHistory.some(session => {
    const date = new Date(session?.createdAt)
    return !Number.isNaN(date.getTime()) && (date.getHours() === 5 || date.getUTCHours() === 5)
  })
  if (hasEarlyBird) {
    earned.push({ id: 'early-bird', label: 'Early Bird (5 AM Practice)' })
  }

  const streak = getPracticeStreakSummary(safeHistory)
  if (streak.longestStreakDays >= 30) {
    earned.push({ id: 'thirty-day-streak', label: '30-Day Streak' })
  }

  const maxKochLevel = safeHistory.reduce((max, session) => {
    const match = String(session?.lessonId || '').match(/koch[-_ ]?(\d+)/i)
    if (!match) return max
    return Math.max(max, toNumber(match[1]))
  }, 0)
  if (maxKochLevel >= 13) {
    earned.push({ id: 'koch-complete', label: 'Complete Koch Method' })
  }

  if (safeHistory.some(session => String(session?.lessonId || '').startsWith('challenge-'))) {
    earned.push({ id: 'daily-challenger', label: 'Daily Challenger' })
  }

  const available = [
    { id: 'first-session', label: 'First Session Complete' },
    { id: 'ten-sessions', label: '10 Sessions Complete' },
    { id: 'first-perfect', label: 'First Perfect Session' },
    { id: 'master-character', label: 'Master a Character (20/20)' },
    { id: 'reach-20wpm', label: 'Reach 20 WPM' },
    { id: 'reach-25wpm', label: 'Reach 25 WPM' },
    { id: 'reach-30wpm', label: 'Reach 30 WPM' },
    { id: 'thousand-characters', label: '1000 Characters Practiced' },
    { id: 'early-bird', label: 'Early Bird (5 AM Practice)' },
    { id: 'thirty-day-streak', label: '30-Day Streak' },
    { id: 'koch-complete', label: 'Complete Koch Method' },
    { id: 'daily-challenger', label: 'Daily Challenger' },
  ]

  return {
    earned,
    available,
  }
}

function seededRandom(seed) {
  let state = seed >>> 0
  return () => {
    state = (1664525 * state + 1013904223) >>> 0
    return state / 0x100000000
  }
}

export function buildDailyChallenge({
  date = new Date(),
  availableCharacters = [],
}) {
  const day = new Date(date)
  day.setHours(0, 0, 0, 0)
  const daySeed = Number(
    `${day.getUTCFullYear()}${String(day.getUTCMonth() + 1).padStart(2, '0')}${String(day.getUTCDate()).padStart(2, '0')}`
  )
  const rand = seededRandom(daySeed)

  const pool = [...new Set((Array.isArray(availableCharacters) ? availableCharacters : []).filter(Boolean))]
  if (pool.length === 0) {
    return {
      id: `challenge-${daySeed}`,
      label: 'Daily Challenge',
      characters: [],
      length: 25,
      suggestedWpm: 18,
    }
  }

  const targetChars = Math.min(8, Math.max(4, Math.floor(pool.length * 0.35)))
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  const selected = shuffled.slice(0, targetChars)
  const suggestedWpm = 16 + Math.floor(rand() * 7) // 16-22

  return {
    id: `challenge-${daySeed}`,
    label: `Today's Challenge · ${selected.join(' ')}`,
    characters: selected,
    length: 25,
    suggestedWpm,
  }
}

export function getAdaptiveSessionAdjustments(
  history,
  {
    mode,
    characters,
    allCharacters = [],
    settings,
  }
) {
  const baseCharacters = [...new Set((Array.isArray(characters) ? characters : []).filter(Boolean))]
  if (!isScoredMode(mode) || baseCharacters.length === 0) {
    return {
      characters: baseCharacters,
      sessionSettingsOverride: null,
      adaptiveReason: null,
    }
  }

  const recentScored = (Array.isArray(history) ? history : [])
    .filter(session => {
      if (!isScoredMode(session?.mode)) return false
      const attempts = toNumber(session.attempted || (Array.isArray(session.items) ? session.items.length : 0))
      return attempts > 0
    })
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .slice(-5)

  const recentAccuracy = recentScored.length > 0
    ? Math.round(recentScored.reduce((sum, session) => {
      const items = Array.isArray(session.items) ? session.items : []
      const attempts = toNumber(session.attempted || items.length)
      const correct = toNumber(session.correct || items.filter(item => item?.correct === true).length)
      const accuracy = attempts > 0 ? clampPercentage((correct / attempts) * 100) : clampPercentage(session.accuracy)
      return sum + accuracy
    }, 0) / recentScored.length)
    : null

  const performance = getCharacterPerformanceSummary(history, {
    rollingWindows: [10],
    weakThreshold: 80,
    minAttemptsForWeak: 1,
  })
  const performanceByCharacter = new Map(performance.map(item => [item.character, item]))

  let nextCharacters = [...baseCharacters]
  let adaptiveReason = null

  if (recentAccuracy !== null && recentAccuracy < 70 && baseCharacters.length > 4) {
    const targetCount = Math.max(4, Math.ceil(baseCharacters.length * 0.6))
    nextCharacters = [...baseCharacters]
      .sort((a, b) => {
        const aAccuracy = performanceByCharacter.get(a)?.rolling?.[10]?.accuracy ?? 100
        const bAccuracy = performanceByCharacter.get(b)?.rolling?.[10]?.accuracy ?? 100
        if (aAccuracy !== bAccuracy) return aAccuracy - bAccuracy
        return a.localeCompare(b, undefined, { numeric: true })
      })
      .slice(0, targetCount)
    adaptiveReason = 'Reduced set to focus on harder characters.'
  }

  if (recentAccuracy !== null && recentAccuracy >= 90) {
    const confusionCandidates = getCharacterConfusionSummary(history, { limit: 30 })
      .filter(entry => nextCharacters.includes(entry.expected) && !nextCharacters.includes(entry.selected))
      .map(entry => entry.selected)

    const globalCandidates = [...new Set((Array.isArray(allCharacters) ? allCharacters : []).filter(Boolean))]
      .filter(character => !nextCharacters.includes(character))

    const candidates = [...new Set([...confusionCandidates, ...globalCandidates])].slice(0, 3)
    if (candidates.length > 0) {
      nextCharacters = [...nextCharacters, ...candidates].slice(0, 20)
      adaptiveReason = adaptiveReason
        ? `${adaptiveReason} Added challenge characters.`
        : 'Added challenge characters based on strong recent accuracy.'
    }
  }

  const currentWpm = Math.max(5, Math.floor(toNumber(settings?.wpm || 20)))
  const currentFarnsworth = Math.max(5, Math.floor(toNumber(settings?.farnsworth || currentWpm)))
  let nextFarnsworth = currentFarnsworth

  if (recentAccuracy !== null && recentAccuracy < 70) {
    nextFarnsworth = Math.max(5, currentFarnsworth - 1)
  } else if (recentAccuracy !== null && recentAccuracy >= 95) {
    nextFarnsworth = Math.min(currentWpm, currentFarnsworth + 1)
  }

  const sessionSettingsOverride = nextFarnsworth !== currentFarnsworth
    ? { farnsworth: nextFarnsworth }
    : null

  return {
    characters: nextCharacters,
    sessionSettingsOverride,
    adaptiveReason,
    recentAccuracy,
  }
}
