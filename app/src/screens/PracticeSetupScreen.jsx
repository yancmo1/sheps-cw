import { useState } from 'react'
import TouchButton from '../components/TouchButton.jsx'
import LessonPlanPicker from '../components/LessonPlanPicker.jsx'
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
      <div className="setup-header">
        <TouchButton variant="secondary" size="sm" onClick={onBack}>← Back</TouchButton>
        <h1 id="setup-title" className="setup-title">Practice Setup</h1>
      </div>

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
          <LessonPlanPicker
            value={selectedPlan}
            options={LEARNING_PLANS}
            onChange={handlePlanChange}
            label="Select learning plan"
          />
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

        {/* Only show selection card when there's a meaningful selection or custom input */}
        {(selectedCharacters.length > 0) && (
          <div 
            key={`${selectedLessonIds.join('-')}-${customCharacters}-${length}`}
            className="selection-card selection-card-compact selection-card-animate" 
            aria-live="polite"
          >
            <p className="selection-card-meta">
              {selectedMode?.label ?? 'Listen & Identify'} · {selectedCharacters.length} characters · {length} items
            </p>
            {/* Character preview - purely decorative, not interactive */}
            {selectedCharacters.length > 0 && (
              <div className="character-chip-row" aria-label="Selected characters">
                {selectedCharacters.slice(0, 16).map(character => (
                  <span key={character} className="character-chip">
                    {character}
                  </span>
                ))}
                {selectedCharacters.length > 16 && (
                  <span className="character-chip">+{selectedCharacters.length - 16}</span>
                )}
              </div>
            )}
          </div>
        )}

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
