import { useState, useEffect, useMemo, useRef } from 'react'
import TouchButton from '../components/TouchButton.jsx'
import { LESSONS, getLessonById } from '../data/lessons/index.js'
import { encodeCharacter, isSupportedCharacter } from '../core/codec/charsetCodec.js'
import { playCharacter } from '../audio/cwAudio.js'
import { getCharacterPlaybackDurationMs, getPostCharacterDelayMs } from '../core/morseTiming.js'
import { buildItems, calculateSessionResult } from '../core/session.js'

const MODE_LABELS = {
  identify: 'Listen & Identify',
  listen: 'Listen Only',
}

const AUTO_ADVANCE_DELAY_MS = 950
const FALLBACK_CHARACTERS = [...new Set(LESSONS.flatMap(lesson => lesson.characters))]

function wait(ms) {
  return new Promise(resolve => {
    window.setTimeout(resolve, ms)
  })
}

function getPlaybackWindowMs(char, settings) {
  const pattern = encodeCharacter(char)
  if (!pattern) return getPostCharacterDelayMs(settings)
  return getCharacterPlaybackDurationMs(pattern, settings) + 100
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
  const autoAdvance = Boolean(config.autoAdvance)

  const [items] = useState(() => buildItems(
    characters,
    config.length,
    { fallbackCharacters: FALLBACK_CHARACTERS }
  ))
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('ready')
  const [selected, setSelected] = useState(null)

  const settingsRef = useRef(settings)
  useEffect(() => { settingsRef.current = settings }, [settings])

  const resultsRef = useRef([])
  const mountedRef = useRef(true)
  const playingRef = useRef(false)
  const pendingAutoPlayRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  async function handlePlayAgain() {
    if (items.length === 0 || playingRef.current) return

    playingRef.current = true
    const resumePhase = phase
    const completionPhase = resumePhase === 'ready'
      ? isIdentify ? 'answering' : 'revealed'
      : resumePhase
    const settingsSnapshot = settingsRef.current
    let completed = false
    let completionTimer = null

    function completePlayback() {
      if (completed) return
      completed = true
      if (completionTimer) {
        window.clearTimeout(completionTimer)
      }
      playingRef.current = false
      if (mountedRef.current) {
        setPhase(completionPhase)
      }
    }

    setPhase('playing')
    completionTimer = window.setTimeout(
      completePlayback,
      getPlaybackWindowMs(items[index].char, settingsSnapshot)
    )

    try {
      await playCharacter(items[index].char, settingsSnapshot)
      await wait(getPostCharacterDelayMs(settingsSnapshot))
    } finally {
      completePlayback()
    }
  }

  function recordListenOnlyItem() {
    const item = items[index]
    if (!item) return

    const alreadyRecorded = resultsRef.current.length > index
    if (alreadyRecorded) return

    resultsRef.current = [
      ...resultsRef.current,
      { character: item.char, selected: null, correct: null },
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

    onFinish(calculateSessionResult({
      completedItems: resultsRef.current,
      config,
      lesson,
      characters,
    }))
  }

  function handleNext({ autoPlay = false } = {}) {
    if (!isIdentify) {
      recordListenOnlyItem()
    }

    const nextIndex = index + 1
    if (nextIndex >= items.length) {
      finish()
      return
    }

    setSelected(null)
    pendingAutoPlayRef.current = autoPlay
    setPhase('ready')
    setIndex(nextIndex)
  }

  useEffect(() => {
    if (!pendingAutoPlayRef.current || phase !== 'ready' || playingRef.current) return

    pendingAutoPlayRef.current = false
    handlePlayAgain()
  }, [index, phase])

  useEffect(() => {
    const shouldAutoAdvance = autoAdvance
      && ((isIdentify && phase === 'feedback') || (!isIdentify && phase === 'revealed'))

    if (!shouldAutoAdvance) return undefined

    const timer = window.setTimeout(() => {
      if (mountedRef.current) {
        handleNext({ autoPlay: true })
      }
    }, AUTO_ADVANCE_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [autoAdvance, index, isIdentify, phase])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.repeat) return

      if ((event.key === 'Enter' || event.key === ' ') && phase === 'ready') {
        event.preventDefault()
        handlePlayAgain()
        return
      }

      if (
        (event.key === 'Enter' || event.key === ' ')
        && (phase === 'feedback' || phase === 'revealed')
      ) {
        event.preventDefault()
        handleNext()
        return
      }

      if (!isIdentify || phase !== 'answering') return

      const choice = event.key.toUpperCase()
      if (!isSupportedCharacter(choice)) return

      event.preventDefault()
      handleAnswer(choice)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isIdentify, phase, index])


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
  const completedItems = resultsRef.current
  const answeredCount = completedItems.length
  const correctCount = completedItems.filter(result => result.correct === true).length
  const liveAccuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : null
  const progressPct = Math.round(((index + (showFeedback ? 1 : 0)) / items.length) * 100)

  return (
    <section className="screen session-screen" aria-labelledby="session-title">
      <div className="session-top">
        <div className="session-meta">
          <p className="session-progress" aria-live="polite">
            {index + 1} <span className="session-progress-of">of</span> {items.length}
          </p>
          {isIdentify && (
            <p className="session-accuracy">
              Accuracy {liveAccuracy === null ? '—' : `${liveAccuracy}%`}
            </p>
          )}
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

      <div className="session-meter" aria-hidden="true">
        <span style={{ width: `${progressPct}%` }} />
      </div>

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
          {phase === 'ready' ? '▶ Play' : '▶ Play Again'}
        </TouchButton>
        {isIdentify && (
          <TouchButton
            variant="secondary"
            size="sm"
            onClick={() => handleAnswer(null)}
            disabled={phase !== 'answering'}
          >
            I don&apos;t know
          </TouchButton>
        )}
      </div>

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
    </section>
  )
}
