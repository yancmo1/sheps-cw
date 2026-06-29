import { useState } from 'react'
import TouchButton from '../components/TouchButton.jsx'
import { LESSONS } from '../data/lessons.js'

const MODES = [
  { id: 'identify', label: 'Listen & Identify' },
  { id: 'listen', label: 'Listen Only' },
]

const SESSION_LENGTHS = [5, 10, 15]

export default function PracticeSetupScreen({ onBack, onStart }) {
  const [mode, setMode] = useState('identify')
  const [lessonId, setLessonId] = useState(LESSONS[0].id)
  const [length, setLength] = useState(10)
  const [autoAdvance, setAutoAdvance] = useState(false)
  const selectedLesson = LESSONS.find(lesson => lesson.id === lessonId) ?? LESSONS[0]
  const selectedMode = MODES.find(item => item.id === mode)

  return (
    <section className="screen" aria-labelledby="setup-title">
      <div className="screen-header">
        <TouchButton variant="secondary" size="sm" onClick={onBack}>← Back</TouchButton>
        <p className="screen-kicker">Dit Dit</p>
      </div>

      <h1 id="setup-title" className="screen-title">Practice Setup</h1>

      <div className="setup-form">
        <fieldset className="setup-field">
          <legend className="setup-legend">Mode</legend>
          <div className="option-group">
            {MODES.map(m => (
              <button
                key={m.id}
                type="button"
                className={`option-btn${mode === m.id ? ' option-btn-active' : ''}`}
                onClick={() => setMode(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="setup-field">
          <legend className="setup-legend">Character Set</legend>
          <div className="option-group">
            {LESSONS.map(l => (
              <button
                key={l.id}
                type="button"
                className={`option-btn${lessonId === l.id ? ' option-btn-active' : ''}`}
                onClick={() => setLessonId(l.id)}
              >
                {l.name}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="selection-card" aria-live="polite">
          <p className="selection-card-kicker">Current Selection</p>
          <p className="selection-card-title">{selectedLesson?.name ?? 'Character Set'}</p>
          <p className="selection-card-meta">
            {selectedMode?.label ?? 'Listen & Identify'} · {length} items ·{' '}
            {autoAdvance ? 'Auto advance' : 'Manual advance'}
          </p>
          <div className="character-chip-row" aria-label="Selected characters">
            {(selectedLesson?.characters ?? []).map(character => (
              <span key={character} className="character-chip">
                {character}
              </span>
            ))}
          </div>
        </div>

        <fieldset className="setup-field">
          <legend className="setup-legend">Session Length</legend>
          <div className="option-group option-group-sm">
            {SESSION_LENGTHS.map(n => (
              <button
                key={n}
                type="button"
                className={`option-btn${length === n ? ' option-btn-active' : ''}`}
                onClick={() => setLength(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="setup-field">
          <legend className="setup-legend">Advance</legend>
          <div className="option-group">
            <button
              type="button"
              className={`option-btn${!autoAdvance ? ' option-btn-active' : ''}`}
              onClick={() => setAutoAdvance(false)}
            >
              Manual
            </button>
            <button
              type="button"
              className={`option-btn${autoAdvance ? ' option-btn-active' : ''}`}
              onClick={() => setAutoAdvance(true)}
            >
              Auto
            </button>
          </div>
        </fieldset>
      </div>

      <div className="setup-actions">
        <TouchButton onClick={() => onStart({
          mode,
          lessonId,
          lessonName: selectedLesson?.name ?? 'Character Set',
          characters: selectedLesson?.characters ?? [],
          length,
          autoAdvance,
        })}
        >
          Start
        </TouchButton>
      </div>
    </section>
  )
}
