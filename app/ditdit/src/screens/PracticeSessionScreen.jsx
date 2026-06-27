import { useState, useEffect, useMemo, useRef } from 'react'
import TouchButton from '../components/TouchButton.jsx'
import { LESSONS, getLessonById } from '../data/lessons.js'
import { getPostCharacterDelayMs, playCharacter } from '../audio/cwAudio.js'

const MODE_LABELS = {
  identify: 'Listen & Identify',
  listen: 'Listen Only',
}

function wait(ms) {
  return new Promise(resolve => {
    window.setTimeout(resolve, ms)
  })
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildChoices(char, availableChars, fallbackChars) {
  const pool = [...new Set([...availableChars, ...fallbackChars])]
  const distractors = shuffle(pool.filter(candidate => candidate !== char)).slice(0, 3)
  return shuffle([char, ...distractors])
}

function buildItems(characters, length) {
  if (!Array.isArray(characters) || characters.length === 0 || length <= 0) {
    return []
  }

  const fallbackChars = [...new Set(LESSONS.flatMap(lesson => lesson.characters))]

  return Array.from({ length }, () => {
    const char = characters[Math.floor(Math.random() * characters.length)]
    return {
      char,
      choices: buildChoices(char, characters, fallbackChars),
    }
  })
}

function createSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `session-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
}

export default function PracticeSessionScreen({ config, settings, onFinish }) {
  const lesson = useMemo(() => {
    if (Array.isArray(config.characters) && config.characters.length > 0) {
      return {
        id: config.lessonId ?? 'custom',
        name: config.lessonName ?? 'Custom Set',
        characters: config.characters,
      }
    }

    return getLessonById(config.lessonId)
  }, [config.characters, config.lessonId, config.lessonName])
  const characters = lesson?.characters ?? []
  const isIdentify = config.mode === 'identify'
  const modeLabel = MODE_LABELS[config.mode] ?? MODE_LABELS.identify

  const [items] = useState(() => buildItems(characters, config.length))
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('playing')
  const [selected, setSelected] = useState(null)

  const settingsRef = useRef(settings)
  useEffect(() => { settingsRef.current = settings }, [settings])

  const resultsRef = useRef([])
  const mountedRef = useRef(true)
  const playingRef = useRef(false)

  useEffect(() => {
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    let stale = false

    async function play() {
      if (items.length === 0 || playingRef.current) return

      playingRef.current = true
      setPhase('playing')
      try {
        await playCharacter(items[index].char, settingsRef.current)
        await wait(getPostCharacterDelayMs(settingsRef.current))
      } finally {
        playingRef.current = false
        if (!stale && mountedRef.current) {
          setPhase(isIdentify ? 'answering' : 'revealed')
        }
      }
    }

    play()

    return () => { stale = true }
  }, [index, isIdentify, items])

  async function handlePlayAgain() {
    if (items.length === 0 || playingRef.current) return

    playingRef.current = true
    const resumePhase = phase
    setPhase('playing')
    try {
      await playCharacter(items[index].char, settingsRef.current)
      await wait(getPostCharacterDelayMs(settingsRef.current))
    } finally {
      playingRef.current = false
      if (mountedRef.current) {
        setPhase(resumePhase)
      }
    }
  }

  function recordListenOnlyItem() {
    const item = items[index]
    if (!item) return

    const alreadyRecorded = resultsRef.current.length > index
    if (alreadyRecorded) return

    resultsRef.current = [
      ...resultsRef.current,
      { character: item.char, selected: item.char, correct: true },
    ]
  }

  function handleAnswer(choice) {
    if (phase !== 'answering') return

    const currentItem = items[index]
    const correct = choice === currentItem.char

    resultsRef.current = [
      ...resultsRef.current,
      { character: currentItem.char, selected: choice, correct },
    ]
    setSelected(choice)
    setPhase('feedback')
  }

  function finish() {
    if (!isIdentify && phase === 'revealed') {
      recordListenOnlyItem()
    }

    const completedItems = resultsRef.current
    const attempted = completedItems.length
    const correct = completedItems.filter(item => item.correct).length
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0
    const missed = [...new Set(completedItems.filter(item => !item.correct).map(item => item.character))]

    onFinish({
      id: createSessionId(),
      createdAt: new Date().toISOString(),
      lessonId: lesson?.id ?? 'custom',
      lessonName: config.lessonName ?? lesson?.name ?? 'Custom Set',
      mode: config.mode,
      sessionLength: config.length,
      attempted,
      correct,
      accuracy,
      missed,
      items: completedItems,
      characters,
    })
  }

  function handleNext() {
    if (!isIdentify) {
      recordListenOnlyItem()
    }

    const nextIndex = index + 1
    if (nextIndex >= items.length) {
      finish()
      return
    }

    setSelected(null)
    setIndex(nextIndex)
  }

  if (!lesson || items.length === 0) {
    return (
      <section className="screen session-screen" aria-labelledby="session-title">
        <div className="screen-header">
          <p className="screen-kicker">Dit Dit</p>
        </div>

        <h1 id="session-title" className="screen-title">Practice Session</h1>

        <div className="results-card">
          <p className="score-main">No characters are available for this practice set.</p>
          <p className="missed-chars">Return home and choose a different lesson.</p>
        </div>

        <div className="results-actions">
          <TouchButton variant="secondary" onClick={finish}>End Session</TouchButton>
        </div>
      </section>
    )
  }

  const item = items[index]
  const isLastItem = index + 1 >= items.length
  const canPlayAgain = phase !== 'playing'
  const showFeedback = phase === 'feedback' || phase === 'revealed'
  const isCorrect = selected === item.char
  const sessionLabel = config.customLabel ?? lesson.name

  return (
    <section className="screen session-screen" aria-labelledby="session-title">
      <div className="session-top">
        <div className="session-meta">
          <p className="session-progress" aria-live="polite">
            {index + 1} <span className="session-progress-of">of</span> {items.length}
          </p>
          <p className="session-label">{modeLabel}</p>
          <p className="session-subtitle">{sessionLabel}</p>
          {config.sourceLessonName && (
            <p className="session-source">From {config.sourceLessonName}</p>
          )}
        </div>
        <button type="button" className="end-btn" onClick={finish}>
          End Session
        </button>
      </div>

      <h1 id="session-title" className="screen-title session-title">Practice Session</h1>

      <div className="char-display" aria-live="polite" aria-label="Character">
        {phase === 'revealed' || phase === 'feedback'
          ? <span className="char-revealed">{item.char}</span>
          : <span className="char-hidden">?</span>}
      </div>

      <div className="play-again-row">
        <TouchButton
          variant="secondary"
          size="sm"
          onClick={handlePlayAgain}
          disabled={!canPlayAgain}
        >
          ▶ Play Again
        </TouchButton>
      </div>

      {isIdentify && (
        <div className="answer-grid" role="group" aria-label="Answer choices">
          {item.choices.map(choice => {
            let state = 'default'
            if (phase === 'feedback') {
              if (choice === item.char) state = 'correct'
              else if (choice === selected) state = 'wrong'
            }

            return (
              <button
                key={choice}
                type="button"
                className={`answer-btn answer-btn-${state}`}
                onClick={() => handleAnswer(choice)}
                disabled={phase !== 'answering'}
              >
                {choice}
              </button>
            )
          })}
        </div>
      )}

      {showFeedback && (
        <div className="session-feedback">
          {isIdentify && (
            <p className={`feedback-text ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
              {isCorrect ? '✓ Correct!' : `✗ Answer: ${item.char}`}
            </p>
          )}
          {!isIdentify && (
            <p className="feedback-text">Listen again or continue when you are ready.</p>
          )}
          <TouchButton onClick={handleNext}>
            {isLastItem ? 'See Results' : 'Next →'}
          </TouchButton>
        </div>
      )}
    </section>
  )
}
