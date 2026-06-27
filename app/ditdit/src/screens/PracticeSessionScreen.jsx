import { useState, useEffect, useRef } from 'react'
import TouchButton from '../components/TouchButton.jsx'
import { getLessonById } from '../data/lessons.js'
import { playCharacter } from '../audio/cwAudio.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildItems(lesson, length) {
  const chars = lesson.characters
  return Array.from({ length }, () => {
    const char = chars[Math.floor(Math.random() * chars.length)]
    const others = shuffle(chars.filter(c => c !== char))
    // Up to 4 choices total (may be fewer for tiny character sets)
    const choices = shuffle([char, ...others.slice(0, 3)])
    return { char, choices }
  })
}

export default function PracticeSessionScreen({ config, settings, onFinish }) {
  const lesson = getLessonById(config.lessonId)
  const isIdentify = config.mode === 'identify'

  // Built once on mount
  const [items] = useState(() => buildItems(lesson, config.length))
  const [index, setIndex] = useState(0)

  // 'playing' | 'answering' | 'feedback' | 'revealed'
  const [phase, setPhase] = useState('playing')
  const [selected, setSelected] = useState(null)

  // Stable refs that avoid stale-closure issues
  const settingsRef = useRef(settings)
  useEffect(() => { settingsRef.current = settings }, [settings])

  const resultsRef = useRef([])
  const mountedRef = useRef(true)
  const playingRef = useRef(false)

  useEffect(() => {
    return () => { mountedRef.current = false }
  }, [])

  // Play the character whenever the index advances (or on initial mount)
  useEffect(() => {
    let stale = false

    async function play() {
      if (playingRef.current) return
      playingRef.current = true
      setPhase('playing')
      try {
        await playCharacter(items[index].char, settingsRef.current)
      } finally {
        playingRef.current = false
        if (!stale && mountedRef.current) {
          setPhase(isIdentify ? 'answering' : 'revealed')
        }
      }
    }

    play()

    return () => { stale = true }
    // Only re-run when the item index changes; settings changes don't re-trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  async function handlePlayAgain() {
    if (playingRef.current) return
    playingRef.current = true
    const resumePhase = phase
    setPhase('playing')
    try {
      await playCharacter(items[index].char, settingsRef.current)
    } finally {
      playingRef.current = false
      if (mountedRef.current) {
        setPhase(resumePhase)
      }
    }
  }

  function handleAnswer(choice) {
    if (phase !== 'answering') return
    const correct = choice === items[index].char
    resultsRef.current = [...resultsRef.current, { char: items[index].char, correct }]
    setSelected(choice)
    setPhase('feedback')
  }

  function handleNext() {
    const nextIndex = index + 1
    if (nextIndex >= items.length) {
      finish()
    } else {
      setSelected(null)
      setIndex(nextIndex)
    }
  }

  function finish() {
    onFinish({
      mode: config.mode,
      lessonId: config.lessonId,
      length: config.length,
      results: resultsRef.current,
      played: resultsRef.current.length,
    })
  }

  const item = items[index]
  const isLastItem = index + 1 >= items.length
  const canPlayAgain = phase !== 'playing'
  const showFeedback = phase === 'feedback' || phase === 'revealed'
  const isCorrect = selected === item.char

  return (
    <section className="screen session-screen" aria-labelledby="session-title">
      {/* Top bar: progress + end */}
      <div className="session-top">
        <p className="session-progress" aria-live="polite">
          {index + 1} <span className="session-progress-of">of</span> {items.length}
        </p>
        <button type="button" className="end-btn" onClick={finish}>
          End
        </button>
      </div>

      {/* Character display */}
      <div className="char-display" aria-live="polite" aria-label="Character">
        {phase === 'revealed' || phase === 'feedback'
          ? <span className="char-revealed">{item.char}</span>
          : <span className="char-hidden">?</span>
        }
      </div>

      {/* Play Again */}
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

      {/* Answer choices (identify mode only) */}
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

      {/* Feedback + Next */}
      {showFeedback && (
        <div className="session-feedback">
          {isIdentify && (
            <p className={`feedback-text ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
              {isCorrect ? '✓ Correct!' : `✗ Answer: ${item.char}`}
            </p>
          )}
          <TouchButton onClick={handleNext}>
            {isLastItem ? 'See Results' : 'Next →'}
          </TouchButton>
        </div>
      )}
    </section>
  )
}
