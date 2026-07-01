import { useState } from 'react'
import TouchButton from '../components/TouchButton.jsx'
import { LESSONS } from '../data/lessons/index.js'
import { parseCharacterInput } from '../core/codec/charsetCodec.js'

const MODES = [
  { id: 'identify', label: 'Listen & Identify' },
  { id: 'listen', label: 'Listen Only' },
]

const SESSION_LENGTHS = [5, 10, 15]

// Extract unique learning paths/families
const LEARNING_PLANS = Array.from(
  new Map(LESSONS.map(l => [l.path || l.family, { path: l.path || l.family, family: l.family }])).values()
).sort((a, b) => a.path.localeCompare(b.path))

export default function PracticeSetupScreen({ onBack, onStart }) {
  const [mode, setMode] = useState('identify')
  const [selectedPlan, setSelectedPlan] = useState(LEARNING_PLANS[0]?.path || '')
  const [selectedLessonIds, setSelectedLessonIds] = useState([])
  const [length, setLength] = useState(10)
  const [autoAdvance, setAutoAdvance] = useState(false)
  const [customCharacters, setCustomCharacters] = useState('')
  
  // Get lessons for selected plan
  const lessonsInPlan = LESSONS.filter(l => (l.path || l.family) === selectedPlan)
  
  // Handle plan change — reset selected lessons
  const handlePlanChange = (newPlan) => {
    setSelectedPlan(newPlan)
    setSelectedLessonIds([])
  }
  
  // Toggle lesson selection
  const toggleLessonId = (lessonId) => {
    setSelectedLessonIds(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    )
  }
  
  // Build combined character set from selected lessons
  const combinedCharacters = selectedLessonIds
    .map(id => LESSONS.find(l => l.id === id)?.characters || [])
    .flat()
    .filter((char, index, arr) => arr.indexOf(char) === index) // deduplicate
  
  const { characters: customCharacterSet, invalidTokens } = parseCharacterInput(customCharacters)

  const isCustom = selectedLessonIds.length === 0 && customCharacters.trim() !== ''
  const selectedCharacters = isCustom ? customCharacterSet : combinedCharacters
  
  const selectedLessons = selectedLessonIds
    .map(id => LESSONS.find(l => l.id === id))
    .filter(Boolean)
  
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
          <legend className="setup-legend">Learning Plan</legend>
          <select
            value={selectedPlan}
            onChange={(e) => handlePlanChange(e.target.value)}
            className="setup-select"
            aria-label="Select learning plan"
          >
            {LEARNING_PLANS.map(plan => (
              <option key={plan.path} value={plan.path}>
                {plan.path}
              </option>
            ))}
          </select>
        </fieldset>

        {lessonsInPlan.length > 0 && (
          <fieldset className="setup-field">
            <legend className="setup-legend">Lessons (select one or more)</legend>
            <div className="option-group">
              {lessonsInPlan.map(lesson => (
                <button
                  key={lesson.id}
                  type="button"
                  className={`option-btn${selectedLessonIds.includes(lesson.id) ? ' option-btn-active' : ''}`}
                  onClick={() => toggleLessonId(lesson.id)}
                >
                  {lesson.name}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <fieldset className="setup-field">
          <legend className="setup-legend">Or Enter Custom</legend>
          <input
            type="text"
            value={customCharacters}
            onChange={(e) => {
              setCustomCharacters(e.target.value)
              if (e.target.value.trim() !== '') {
                setSelectedLessonIds([])
              }
            }}
            placeholder="Enter characters (e.g., ABC or A B C)"
            className="setup-input"
            aria-label="Enter custom characters to practice"
          />
          <p className="setup-hint">Enter characters separated by spaces or commas, or just type them together.</p>
          {invalidTokens.length > 0 && (
            <p className="setup-hint" role="status" aria-live="polite">
              Unsupported: {invalidTokens.join(', ')}
            </p>
          )}
        </fieldset>

        <div className="selection-card" aria-live="polite">
          <p className="selection-card-kicker">Current Selection</p>
          <p className="selection-card-title">
            {isCustom 
              ? 'Custom Characters' 
              : selectedLessons.length === 0
              ? 'No Lessons Selected'
              : selectedLessons.length === 1
              ? selectedLessons[0].name
              : `${selectedLessons.length} Lessons Selected`}
          </p>
          <p className="selection-card-meta">
            {selectedPlan ? `${selectedPlan} · ` : ''}
            {selectedMode?.label ?? 'Listen & Identify'} · {length} items ·{' '}
            {autoAdvance ? 'Auto advance' : 'Manual advance'}
          </p>
          {selectedLessons.length > 0 && (
            <>
              <p className="selection-card-description">
                {selectedLessons.map(l => l.description).filter(Boolean)[0]}
              </p>
              {selectedLessons.length > 1 && (
                <p className="selection-card-description">
                  Total characters: {selectedCharacters.length}
                </p>
              )}
            </>
          )}
          {selectedCharacters.length > 0 && (
            <div className="character-chip-row" aria-label="Selected characters">
              {selectedCharacters.slice(0, 20).map(character => (
                <span key={character} className="character-chip">
                  {character}
                </span>
              ))}
              {selectedCharacters.length > 20 && (
                <span className="character-chip">+{selectedCharacters.length - 20}</span>
              )}
            </div>
          )}
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
        <TouchButton 
          onClick={() => onStart({
            mode,
            lessonId: selectedLessonIds.length > 1 ? 'custom' : (selectedLessonIds[0] || 'custom'),
            lessonName: isCustom 
              ? 'Custom Characters'
              : selectedLessons.length === 1
              ? selectedLessons[0].name
              : `${selectedLessons.length} Lessons`,
            characters: selectedCharacters,
            length,
            autoAdvance,
          })}
          disabled={selectedCharacters.length === 0}
        >
          Start
        </TouchButton>
      </div>
    </section>
  )
}
