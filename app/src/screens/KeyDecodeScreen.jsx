import { useEffect, useMemo, useRef, useState } from 'react'
import TouchButton from '../components/TouchButton.jsx'
import { decodeMorse } from '../core/codec/charsetCodec.js'
import {
  buildKeyDecodeTiming,
  classifyKeyPressDuration,
  estimateCharacterSpeedWpm,
  getAlternateSymbol,
  getPaddleElementDurationMs,
  KEY_INPUT_MODES,
  pickPaddleSymbol,
} from '../core/decoder/keyDecode.js'
import { startSidetone, stopSidetone } from '../audio/cwAudio.js'

const UNKNOWN_CHARACTER = '□'
const MIN_PRESS_MS = 15
const MAX_TRANSCRIPT_LENGTH = 280

const INPUT_MODE_OPTIONS = [
  { id: KEY_INPUT_MODES.STRAIGHT, label: 'Straight Key' },
  { id: KEY_INPUT_MODES.IAMBIC_A, label: 'Paddle Iambic A' },
  { id: KEY_INPUT_MODES.IAMBIC_B, label: 'Paddle Iambic B' },
]

function toKeyLabel(key) {
  if (!key) return 'Not bound yet'
  if (key === ' ') return 'Space'
  if (key.length === 1) return key.toUpperCase()
  return key
}

function trimTranscript(value) {
  if (value.length <= MAX_TRANSCRIPT_LENGTH) return value
  return value.slice(value.length - MAX_TRANSCRIPT_LENGTH)
}

export default function KeyDecodeScreen({ settings, onBack }) {
  const timing = useMemo(
    () => buildKeyDecodeTiming(settings),
    [settings.wpm, settings.farnsworth]
  )

  const [inputMode, setInputMode] = useState(KEY_INPUT_MODES.STRAIGHT)
  const [activeKeyboardKey, setActiveKeyboardKey] = useState(null)
  const [leftPaddleKey, setLeftPaddleKey] = useState(null)
  const [rightPaddleKey, setRightPaddleKey] = useState(null)
  const [isKeyDown, setIsKeyDown] = useState(false)
  const [paddleState, setPaddleState] = useState({ dot: false, dash: false })
  const [currentPattern, setCurrentPattern] = useState('')
  const [decodedText, setDecodedText] = useState('')
  const [lastDecoded, setLastDecoded] = useState('—')
  const [lastCharacterWpm, setLastCharacterWpm] = useState(null)
  const [averageCharacterWpm, setAverageCharacterWpm] = useState(null)
  const [dotCount, setDotCount] = useState(0)
  const [dashCount, setDashCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)

  const isKeyDownRef = useRef(false)
  const keyerRunningRef = useRef(false)
  const keyStartAtRef = useRef(0)
  const pendingGapBeforeRef = useRef(null)
  const lastStraightKeyUpAtRef = useRef(0)
  const paddleDownRef = useRef({ dot: false, dash: false })
  const lastPaddleSymbolRef = useRef(null)
  const pendingPaddleSymbolRef = useRef(null)
  const squeezeLatchedRef = useRef(false)
  const characterSymbolEventsRef = useRef([])
  const speedStatsRef = useRef({ totalWpm: 0, count: 0 })

  const patternRef = useRef('')
  const activeKeyboardKeyRef = useRef(activeKeyboardKey)
  const leftPaddleKeyRef = useRef(leftPaddleKey)
  const rightPaddleKeyRef = useRef(rightPaddleKey)
  const charTimerRef = useRef(null)
  const wordTimerRef = useRef(null)
  const elementTimerRef = useRef(null)
  const gapTimerRef = useRef(null)

  useEffect(() => {
    activeKeyboardKeyRef.current = activeKeyboardKey
  }, [activeKeyboardKey])

  useEffect(() => {
    leftPaddleKeyRef.current = leftPaddleKey
  }, [leftPaddleKey])

  useEffect(() => {
    rightPaddleKeyRef.current = rightPaddleKey
  }, [rightPaddleKey])

  function clearDecodeTimers() {
    if (charTimerRef.current) {
      window.clearTimeout(charTimerRef.current)
      charTimerRef.current = null
    }
    if (wordTimerRef.current) {
      window.clearTimeout(wordTimerRef.current)
      wordTimerRef.current = null
    }
  }

  function clearKeyerTimers() {
    if (elementTimerRef.current) {
      window.clearTimeout(elementTimerRef.current)
      elementTimerRef.current = null
    }

    if (gapTimerRef.current) {
      window.clearTimeout(gapTimerRef.current)
      gapTimerRef.current = null
    }
  }

  function queueWordGap() {
    if (wordTimerRef.current) {
      window.clearTimeout(wordTimerRef.current)
    }

    wordTimerRef.current = window.setTimeout(() => {
      setDecodedText(prev => {
        if (!prev || prev.endsWith(' ')) return prev
        return trimTranscript(`${prev} `)
      })
    }, timing.wordGapMs)
  }

  function queueCharacterFlush(delayMs = timing.characterGapMs) {
    if (charTimerRef.current) {
      window.clearTimeout(charTimerRef.current)
    }

    charTimerRef.current = window.setTimeout(flushCharacter, Math.max(0, delayMs))
  }

  function flushCharacter() {
    const pattern = patternRef.current
    if (!pattern) return

    const decoded = decodeMorse(pattern) ?? UNKNOWN_CHARACTER
    setLastDecoded(decoded)
    setCharacterCount(prev => prev + 1)
    setDecodedText(prev => trimTranscript(`${prev}${decoded}`))

    const measuredWpm = estimateCharacterSpeedWpm(characterSymbolEventsRef.current)
    if (Number.isFinite(measuredWpm) && measuredWpm > 0) {
      setLastCharacterWpm(measuredWpm)

      const nextTotal = speedStatsRef.current.totalWpm + measuredWpm
      const nextCount = speedStatsRef.current.count + 1
      speedStatsRef.current = { totalWpm: nextTotal, count: nextCount }
      setAverageCharacterWpm(nextTotal / nextCount)
    }

    patternRef.current = ''
    characterSymbolEventsRef.current = []
    setCurrentPattern('')
    queueWordGap()
  }

  function appendSymbol(symbol, { durationMs = null, gapBeforeMs = null } = {}) {
    const nextPattern = `${patternRef.current}${symbol}`
    patternRef.current = nextPattern
    setCurrentPattern(nextPattern)

    characterSymbolEventsRef.current = [
      ...characterSymbolEventsRef.current,
      {
        symbol,
        durationMs,
        gapBeforeMs,
      },
    ]

    if (symbol === '.') setDotCount(prev => prev + 1)
    else setDashCount(prev => prev + 1)
  }

  function forceStopSignal() {
    clearKeyerTimers()
    stopSidetone()
    keyerRunningRef.current = false
    isKeyDownRef.current = false
    setIsKeyDown(false)
  }

  function resetPaddleRuntimeState() {
    paddleDownRef.current = { dot: false, dash: false }
    setPaddleState({ dot: false, dash: false })
    lastPaddleSymbolRef.current = null
    pendingPaddleSymbolRef.current = null
    squeezeLatchedRef.current = false
  }

  function emitNextPaddleElement({ afterInterElementGap = false } = {}) {
    const { symbol, consumedPending } = pickPaddleSymbol({
      dotPressed: paddleDownRef.current.dot,
      dashPressed: paddleDownRef.current.dash,
      lastSymbol: lastPaddleSymbolRef.current,
      pendingSymbol: pendingPaddleSymbolRef.current,
    })

    if (consumedPending) {
      pendingPaddleSymbolRef.current = null
    }

    if (!symbol) {
      keyerRunningRef.current = false
      isKeyDownRef.current = false
      setIsKeyDown(false)
      stopSidetone()

      const remainingGapMs = afterInterElementGap
        ? Math.max(0, timing.characterGapMs - timing.unitMs)
        : timing.characterGapMs
      queueCharacterFlush(remainingGapMs)
      return
    }

    clearDecodeTimers()
    const durationMs = getPaddleElementDurationMs(symbol, timing)
    const gapBeforeMs = patternRef.current.length > 0 ? timing.unitMs : null
    appendSymbol(symbol, {
      durationMs,
      gapBeforeMs,
    })
    lastPaddleSymbolRef.current = symbol

    isKeyDownRef.current = true
    setIsKeyDown(true)
    startSidetone(settings).catch(() => {})

    elementTimerRef.current = window.setTimeout(() => {
      stopSidetone()
      isKeyDownRef.current = false
      setIsKeyDown(false)

      gapTimerRef.current = window.setTimeout(() => {
        emitNextPaddleElement({ afterInterElementGap: true })
      }, timing.unitMs)
    }, durationMs)
  }

  function startPaddleKeyerIfNeeded() {
    if (keyerRunningRef.current) return
    keyerRunningRef.current = true
    emitNextPaddleElement({ afterInterElementGap: false })
  }

  function setPaddlePressed(side, pressed) {
    const next = { ...paddleDownRef.current, [side]: pressed }
    paddleDownRef.current = next
    setPaddleState(next)

    const bothDown = next.dot && next.dash
    if (bothDown) {
      squeezeLatchedRef.current = true
    }

    if (
      inputMode === KEY_INPUT_MODES.IAMBIC_B
      && keyerRunningRef.current
      && squeezeLatchedRef.current
      && !next.dot
      && !next.dash
    ) {
      pendingPaddleSymbolRef.current = getAlternateSymbol(lastPaddleSymbolRef.current ?? '-')
      squeezeLatchedRef.current = false
    }

    if (inputMode === KEY_INPUT_MODES.IAMBIC_A && !bothDown) {
      squeezeLatchedRef.current = false
    }

    if (next.dot || next.dash) {
      startPaddleKeyerIfNeeded()
    }
  }

  function handleStraightDown() {
    if (isKeyDownRef.current) return
    if (keyerRunningRef.current) return

    clearDecodeTimers()
    isKeyDownRef.current = true
    setIsKeyDown(true)
    const now = performance.now()
    keyStartAtRef.current = now

    if (patternRef.current.length > 0 && lastStraightKeyUpAtRef.current > 0) {
      pendingGapBeforeRef.current = Math.max(0, now - lastStraightKeyUpAtRef.current)
    } else {
      pendingGapBeforeRef.current = null
    }

    startSidetone(settings).catch(() => {})
  }

  function handleStraightUp() {
    if (!isKeyDownRef.current) return

    const durationMs = performance.now() - keyStartAtRef.current
    isKeyDownRef.current = false
    setIsKeyDown(false)
    stopSidetone()

    if (durationMs < MIN_PRESS_MS) return

    const symbol = classifyKeyPressDuration(durationMs, timing)
    appendSymbol(symbol, {
      durationMs,
      gapBeforeMs: pendingGapBeforeRef.current,
    })
    pendingGapBeforeRef.current = null
    lastStraightKeyUpAtRef.current = performance.now()

    queueCharacterFlush()
  }

  function resetBinding() {
    forceStopSignal()
    resetPaddleRuntimeState()

    if (inputMode === KEY_INPUT_MODES.STRAIGHT) {
      activeKeyboardKeyRef.current = null
      setActiveKeyboardKey(null)
      return
    }

    leftPaddleKeyRef.current = null
    rightPaddleKeyRef.current = null
    setLeftPaddleKey(null)
    setRightPaddleKey(null)
  }

  function clearTranscript() {
    clearDecodeTimers()
    forceStopSignal()
    resetPaddleRuntimeState()

    patternRef.current = ''
    characterSymbolEventsRef.current = []
    speedStatsRef.current = { totalWpm: 0, count: 0 }
    pendingGapBeforeRef.current = null
    lastStraightKeyUpAtRef.current = 0
    setCurrentPattern('')
    setDecodedText('')
    setLastDecoded('—')
    setLastCharacterWpm(null)
    setAverageCharacterWpm(null)
    setDotCount(0)
    setDashCount(0)
    setCharacterCount(0)
  }

  useEffect(() => {
    forceStopSignal()
    resetPaddleRuntimeState()
  }, [inputMode])

  useEffect(() => {
    function onKeyDown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.repeat) return

      if (event.key === 'Escape') {
        event.preventDefault()
        onBack()
        return
      }

      if (inputMode === KEY_INPUT_MODES.STRAIGHT) {
        const currentBoundKey = activeKeyboardKeyRef.current
        if (!currentBoundKey) {
          activeKeyboardKeyRef.current = event.key
          setActiveKeyboardKey(event.key)
        }

        if (currentBoundKey && event.key !== currentBoundKey) return

        event.preventDefault()
        handleStraightDown()
        return
      }

      const currentLeft = leftPaddleKeyRef.current
      const currentRight = rightPaddleKeyRef.current

      if (!currentLeft) {
        leftPaddleKeyRef.current = event.key
        setLeftPaddleKey(event.key)
        event.preventDefault()
        setPaddlePressed('dot', true)
        return
      }

      if (event.key === currentLeft) {
        event.preventDefault()
        setPaddlePressed('dot', true)
        return
      }

      if (!currentRight && event.key !== currentLeft) {
        rightPaddleKeyRef.current = event.key
        setRightPaddleKey(event.key)
        event.preventDefault()
        setPaddlePressed('dash', true)
        return
      }

      if (event.key === currentRight) {
        event.preventDefault()
        setPaddlePressed('dash', true)
      }
    }

    function onKeyUp(event) {
      if (inputMode === KEY_INPUT_MODES.STRAIGHT) {
        const currentBoundKey = activeKeyboardKeyRef.current
        if (!currentBoundKey || event.key !== currentBoundKey) return

        event.preventDefault()
        handleStraightUp()
        return
      }

      const currentLeft = leftPaddleKeyRef.current
      const currentRight = rightPaddleKeyRef.current

      if (currentLeft && event.key === currentLeft) {
        event.preventDefault()
        setPaddlePressed('dot', false)
        return
      }

      if (currentRight && event.key === currentRight) {
        event.preventDefault()
        setPaddlePressed('dash', false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      clearDecodeTimers()
      clearKeyerTimers()
      stopSidetone()
    }
  }, [inputMode, onBack, settings, timing])

  const isPaddleMode = inputMode !== KEY_INPUT_MODES.STRAIGHT
  const statusText = isPaddleMode
    ? paddleState.dot && paddleState.dash
      ? 'SQUEEZE'
      : paddleState.dot
        ? 'DOT PADDLE'
        : paddleState.dash
          ? 'DASH PADDLE'
          : 'Listening'
    : isKeyDown
      ? 'KEY DOWN'
      : 'Listening'

  return (
    <section className="screen key-screen" aria-labelledby="key-title">
      <div className="screen-header">
        <TouchButton variant="secondary" size="sm" onClick={onBack}>← Back</TouchButton>
        <p className="screen-kicker">Dit Dit</p>
      </div>

      <h1 id="key-title" className="screen-title">Key Decode</h1>

      <fieldset className="setup-field">
        <legend className="setup-legend">Input Mode</legend>
        <div className="option-group key-mode-group">
          {INPUT_MODE_OPTIONS.map(option => (
            <button
              key={option.id}
              type="button"
              className={`option-btn${inputMode === option.id ? ' option-btn-active' : ''}`}
              onClick={() => setInputMode(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="key-meta-card">
        {!isPaddleMode && (
          <p className="key-meta-row"><strong>Input key:</strong> {toKeyLabel(activeKeyboardKey)}</p>
        )}
        {isPaddleMode && (
          <>
            <p className="key-meta-row"><strong>Dot paddle key:</strong> {toKeyLabel(leftPaddleKey)}</p>
            <p className="key-meta-row"><strong>Dash paddle key:</strong> {toKeyLabel(rightPaddleKey)}</p>
          </>
        )}
        <p className="key-meta-row"><strong>Status:</strong> {statusText}</p>
        <p className="key-meta-row">
          <strong>Decode timing:</strong> dot&lt;{Math.round(timing.dotDashThresholdMs)}ms · char gap {Math.round(timing.characterGapMs)}ms
        </p>
      </div>

      {!isPaddleMode && (
        <div className="key-touch-row">
          <button
            type="button"
            className={`manual-key-btn${isKeyDown ? ' manual-key-btn-active' : ''}`}
            onPointerDown={(event) => {
              event.preventDefault()
              handleStraightDown()
            }}
            onPointerUp={(event) => {
              event.preventDefault()
              handleStraightUp()
            }}
            onPointerCancel={handleStraightUp}
            onPointerLeave={handleStraightUp}
          >
            {isKeyDown ? 'KEYING…' : 'Touch / Hold Key'}
          </button>
        </div>
      )}

      {isPaddleMode && (
        <div className="paddle-key-grid">
          <button
            type="button"
            className={`manual-key-btn${paddleState.dot ? ' manual-key-btn-active' : ''}`}
            onPointerDown={(event) => {
              event.preventDefault()
              setPaddlePressed('dot', true)
            }}
            onPointerUp={(event) => {
              event.preventDefault()
              setPaddlePressed('dot', false)
            }}
            onPointerCancel={() => setPaddlePressed('dot', false)}
            onPointerLeave={() => setPaddlePressed('dot', false)}
          >
            Dit Paddle
          </button>
          <button
            type="button"
            className={`manual-key-btn${paddleState.dash ? ' manual-key-btn-active' : ''}`}
            onPointerDown={(event) => {
              event.preventDefault()
              setPaddlePressed('dash', true)
            }}
            onPointerUp={(event) => {
              event.preventDefault()
              setPaddlePressed('dash', false)
            }}
            onPointerCancel={() => setPaddlePressed('dash', false)}
            onPointerLeave={() => setPaddlePressed('dash', false)}
          >
            Dah Paddle
          </button>
        </div>
      )}

      <div className="key-readout-grid">
        <div className="key-readout-card">
          <p className="key-readout-label">Current pattern</p>
          <p className="key-readout-value">{currentPattern || '—'}</p>
        </div>
        <div className="key-readout-card">
          <p className="key-readout-label">Last decoded</p>
          <p className="key-readout-value">{lastDecoded}</p>
        </div>
      </div>

      <div className="key-transcript-card" role="status" aria-live="polite">
        <p className="key-readout-label">Decoded text</p>
        <p className="key-transcript-value">{decodedText || 'Start keying to decode characters…'}</p>
      </div>

      <div className="key-stats-row">
        <span>
          · Last speed: {lastCharacterWpm ? `${lastCharacterWpm.toFixed(1)} WPM` : '—'}
        </span>
        <span>
          · Avg speed: {averageCharacterWpm ? `${averageCharacterWpm.toFixed(1)} WPM` : '—'}
        </span>
        <span>· Dits: {dotCount}</span>
        <span>· Dahs: {dashCount}</span>
        <span>· Chars: {characterCount}</span>
      </div>

      <div className="key-actions">
        <TouchButton variant="secondary" onClick={resetBinding}>Reset Key Binding</TouchButton>
        <TouchButton variant="secondary" onClick={clearTranscript}>Clear Text</TouchButton>
      </div>
    </section>
  )
}
