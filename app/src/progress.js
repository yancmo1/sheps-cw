const STORAGE_KEY = 'ditdit.sessionHistory.v1'
const MAX_SESSIONS = 100

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

      return {
        character,
        selected,
        correct,
      }
    })
    .filter(Boolean)
}

function normalizeMissed(missed, items) {
  if (Array.isArray(missed)) {
    return [...new Set(missed.filter(char => typeof char === 'string' && char))]
  }

  return [...new Set(items.filter(item => !item.correct).map(item => item.character))]
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
    mode: entry.mode === 'listen' ? 'listen' : 'identify',
    sessionLength: Math.max(0, toNumber(entry.sessionLength ?? attempted)),
    attempted,
    correct,
    accuracy,
    missed: normalizeMissed(entry.missed, items),
    items,
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

export function getProgressSummary(history) {
  const safeHistory = Array.isArray(history) ? history : []
  const scoredSessions = safeHistory.filter(session => session?.mode === 'identify')
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
