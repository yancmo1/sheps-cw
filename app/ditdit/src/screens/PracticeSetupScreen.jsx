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
      </div>

      <div className="setup-actions">
        <TouchButton onClick={() => onStart({ mode, lessonId, length })}>
          Start
        </TouchButton>
      </div>
    </section>
  )
}
