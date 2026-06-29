export function shuffle(items) {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function buildChoices(character, availableCharacters, fallbackCharacters = []) {
  const pool = [...new Set([...availableCharacters, ...fallbackCharacters])]
  const distractors = shuffle(pool.filter(candidate => candidate !== character)).slice(0, 3)
  return shuffle([character, ...distractors])
}

export function buildItems(characters, length, { fallbackCharacters = [] } = {}) {
  if (!Array.isArray(characters) || characters.length === 0 || length <= 0) {
    return []
  }

  return Array.from({ length }, () => {
    const char = characters[Math.floor(Math.random() * characters.length)]
    return {
      char,
      choices: buildChoices(char, characters, fallbackCharacters),
    }
  })
}

export function createSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `session-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
}

export function calculateSessionResult({
  completedItems,
  config,
  lesson,
  characters,
  id = createSessionId(),
  createdAt = new Date().toISOString(),
}) {
  const items = Array.isArray(completedItems) ? completedItems : []
  const attempted = items.length
  const correct = items.filter(item => item.correct === true).length
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0
  const missed = [...new Set(
    items
      .filter(item => item.correct === false)
      .map(item => item.character)
  )]

  return {
    id,
    createdAt,
    lessonId: lesson?.id ?? 'custom',
    lessonName: config.lessonName ?? lesson?.name ?? 'Custom Set',
    mode: config.mode,
    sessionLength: config.length,
    attempted,
    correct,
    accuracy,
    missed,
    items,
    characters,
  }
}
