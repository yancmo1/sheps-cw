import { useState, useEffect, useMemo, useRef } from 'react'
import TouchButton from '../components/TouchButton.jsx'
import { LESSONS, getLessonById } from '../data/lessons/index.js'
import { encodeCharacter, isSupportedCharacter } from '../core/codec/charsetCodec.js'
import { playCharacter } from '../audio/cwAudio.js'
import { getCharacterPlaybackDurationMs, getPostCharacterDelayMs } from '../core/morseTiming.js'
import { buildItems, calculateSessionResult } from '../core/session.js'
import { getWeakCharacterPracticeSet, loadSessionHistory } from '../progress.js'

const MODE_LABELS = {
  identify: 'Listen & Identify',
  copy: 'Copy Mode',
  'speed-ladder': 'Speed Ladder',
  listen: 'Listen Only',
}

const AUTO_ADVANCE_DELAY_MS = 950
const FALLBACK_CHARACTERS = [...new Set(LESSONS.flatMap(lesson => lesson.characters))]
const SPEED_LADDER_ROUND_SIZE = 5
const SPEED_LADDER_STEP_WPM = 2
const SPEED_LADDER_THRESHOLD = 75

function toNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

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
  const effectiveSettings = useMemo(
    () => ({ ...settings, ...(config.sessionSettingsOverride ?? {}) }),
    [settings, config.sessionSettingsOverride]
  )
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
  const isCopy = config.mode === 'copy'
  const isSpeedLadder = config.mode === 'speed-ladder'
  const isChoiceMode = isIdentify || isSpeedLadder
  const isScored = isChoiceMode || isCopy
  const modeLabel = MODE_LABELS[config.mode] ?? MODE_LABELS.identify
  const autoAdvance = Boolean(config.autoAdvance)
  const sessionHistory = useMemo(() => loadSessionHistory(), [])
  const weakCharacterSet = useMemo(() => new Set(getWeakCharacterPracticeSet(sessionHistory, {
    limit: 16,
    weakThreshold: 80,
    minAttemptsForWeak: 5,
    rollingWindow: 10,
  })), [sessionHistory])
  const weightedCharacters = useMemo(
    () => characters.flatMap(character => (weakCharacterSet.has(character)
      ? [character, character, character]
      : [character]
    )),
    [characters, weakCharacterSet]
  )

  const [items] = useState(() => buildItems(
    characters,
    config.length,
    {
      fallbackCharacters: FALLBACK_CHARACTERS,
      weightedCharacters,
    }
  ))
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('ready')
  const [selected, setSelected] = useState(null)
  const [copyInput, setCopyInput] = useState('')

  const settingsRef = useRef(effectiveSettings)
  useEffect(() => { settingsRef.current = effectiveSettings }, [effectiveSettings])

  const resultsRef = useRef([])
  const promptStartRef = useRef(null)
  const mountedRef = useRef(true)
  const playingRef = useRef(false)
  const pendingAutoPlayRef = useRef(false)
  const baseLadderWpmRef = useRef(Math.max(5, Math.floor(toNumber(effectiveSettings.wpm || settings.wpm || 20))))
  const highestPassingWpmRef = useRef(baseLadderWpmRef.current)

  function getSettingsForItem(itemIndex) {
    if (!isSpeedLadder) return settingsRef.current

    const roundIndex = Math.floor(itemIndex / SPEED_LADDER_ROUND_SIZE)
    const baseWpm = baseLadderWpmRef.current
    const baseFarnsworth = Math.max(5, Math.floor(toNumber(effectiveSettings.farnsworth || settings.farnsworth || baseWpm)))
    const roundWpm = Math.min(40, baseWpm + (roundIndex * SPEED_LADDER_STEP_WPM))
    const roundFarnsworth = Math.min(roundWpm, Math.max(5, baseFarnsworth + (roundIndex * SPEED_LADDER_STEP_WPM)))

    return {
      ...settingsRef.current,
      wpm: roundWpm,
      farnsworth: roundFarnsworth,
    }
  }

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  async function handlePlayAgain() {
    if (items.length === 0 || playingRef.current) return

    playingRef.current = true
    const resumePhase = phase
    const completionPhase = resumePhase === 'ready'
      ? isChoiceMode ? 'answering' : isCopy ? 'copying' : 'revealed'
      : resumePhase
    const settingsSnapshot = getSettingsForItem(index)
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
        if (completionPhase === 'copying') {
          promptStartRef.current = Date.now()
        }
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

  function handleCopySubmit(rawValue) {
    if (phase !== 'copying') return

    const value = typeof rawValue === 'string' ? rawValue.trim().toUpperCase() : ''
    if (!value) return

    const currentItem = items[index]
    const correct = value === currentItem.char
    const responseMs = promptStartRef.current ? Math.max(0, Date.now() - promptStartRef.current) : 0

    resultsRef.current = [
      ...resultsRef.current,
      { character: currentItem.char, selected: value, correct, responseMs },
    ]

    setSelected(value)
    setPhase('feedback')
  }

  function finish(resultMeta = null) {
    if (!isScored && phase === 'revealed') {
      recordListenOnlyItem()
    }

    const finalSettings = isSpeedLadder ? getSettingsForItem(Math.max(0, index)) : settingsRef.current

    onFinish(calculateSessionResult({
      completedItems: resultsRef.current,
      config,
      lesson,
      characters,
      settings: finalSettings,
      resultMeta,
    }))
  }

  function handleNext({ autoPlay = false } = {}) {
    if (!isScored) {
      recordListenOnlyItem()
    }

    if (isSpeedLadder && resultsRef.current.length > 0 && resultsRef.current.length % SPEED_LADDER_ROUND_SIZE === 0) {
      const roundStart = resultsRef.current.length - SPEED_LADDER_ROUND_SIZE
      const roundItems = resultsRef.current.slice(roundStart)
      const roundCorrect = roundItems.filter(item => item.correct === true).length
      const roundAccuracy = Math.round((roundCorrect / roundItems.length) * 100)
      const roundIndex = Math.floor(roundStart / SPEED_LADDER_ROUND_SIZE)
      const roundWpm = Math.min(40, baseLadderWpmRef.current + (roundIndex * SPEED_LADDER_STEP_WPM))

      if (roundAccuracy >= SPEED_LADDER_THRESHOLD) {
        highestPassingWpmRef.current = Math.max(highestPassingWpmRef.current, roundWpm)
      } else {
        finish({
          finalWpm: highestPassingWpmRef.current,
          ladderStoppedEarly: true,
        })
        return
      }
    }

    const nextIndex = index + 1
    if (nextIndex >= items.length) {
      finish({
        finalWpm: isSpeedLadder
          ? Math.max(highestPassingWpmRef.current, getSettingsForItem(index).wpm)
          : null,
        ladderStoppedEarly: false,
      })
      return
    }

    setSelected(null)
    setCopyInput('')
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
      && ((isScored && phase === 'feedback') || (!isScored && phase === 'revealed'))

    if (!shouldAutoAdvance) return undefined

    const timer = window.setTimeout(() => {
      if (mountedRef.current) {
        handleNext({ autoPlay: true })
      }
    }, AUTO_ADVANCE_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [autoAdvance, index, isScored, phase])

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

      if (isCopy && phase === 'copying' && event.key === 'Enter') {
        event.preventDefault()
        handleCopySubmit(copyInput)
        return
      }

      if (!isChoiceMode || phase !== 'answering') return

      if (/^[1-4]$/.test(event.key)) {
        const choiceIndex = Number(event.key) - 1
        const currentItem = items[index]
        const choice = currentItem?.choices?.[choiceIndex]
        if (choice) {
          event.preventDefault()
          handleAnswer(choice)
        }
        return
      }

      const choice = event.key.toUpperCase()
      if (!isSupportedCharacter(choice)) return

      event.preventDefault()
      handleAnswer(choice)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isChoiceMode, isCopy, copyInput, phase, index, items])


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
  const currentLadderWpm = isSpeedLadder ? getSettingsForItem(index).wpm : null

  return (
    <section className="screen session-screen" aria-labelledby="session-title">
      <div className="session-top">
        <div className="session-meta">
          <p className="session-progress" aria-live="polite">
            {index + 1} <span className="session-progress-of">of</span> {items.length}
          </p>
          {isScored && (
            <p className="session-accuracy">
              Accuracy {liveAccuracy === null ? '—' : `${liveAccuracy}%`}
            </p>
          )}
          <p className="session-label">{modeLabel}</p>
          <p className="session-subtitle">{sessionLabel}</p>
          {isSpeedLadder && (
            <p className="session-source">Current round speed: {currentLadderWpm} WPM</p>
          )}
          {config.sourceLessonName && (
            <p className="session-source">From {config.sourceLessonName}</p>
          )}
          {config.adaptiveReason && (
            <p className="session-source">Adaptive: {config.adaptiveReason}</p>
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
        {isChoiceMode && (
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
          {isScored && (
            <p className={`feedback-text ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
              {isCorrect ? '✓ Correct!' : `✗ Answer: ${item.char}`}
            </p>
          )}
          {!isScored && (
            <p className="feedback-text">Listen again or continue when you are ready.</p>
          )}
          <TouchButton onClick={handleNext}>
            {isLastItem ? 'See Results' : 'Next →'}
          </TouchButton>
        </div>
      )}

      {isCopy && (
        <div className="copy-input-row" role="group" aria-label="Copy mode answer entry">
          <input
            type="text"
            value={copyInput}
            onChange={event => setCopyInput(event.target.value.toUpperCase())}
            className="copy-input"
            placeholder="Type what you heard"
            aria-label="Type what you heard"
            maxLength={4}
            disabled={phase !== 'copying'}
          />
          <TouchButton
            size="sm"
            onClick={() => handleCopySubmit(copyInput)}
            disabled={phase !== 'copying' || !copyInput.trim()}
          >
            Submit
          </TouchButton>
        </div>
      )}

      {isChoiceMode && (
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
                aria-label={`Choice ${choice}`}
              >
                <span className="answer-btn-index" aria-hidden="true">
                  {item.choices.indexOf(choice) + 1}
                </span>
                {choice}
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
