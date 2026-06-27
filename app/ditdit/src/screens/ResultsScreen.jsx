import { useEffect } from 'react'
import TouchButton from '../components/TouchButton.jsx'
import { saveSessionResult } from '../progress.js'

const MODE_LABELS = {
  identify: 'Listen & Identify',
  listen: 'Listen Only',
}

export default function ResultsScreen({ data, onPracticeAgain, onPracticeMissed, onHome }) {
  useEffect(() => {
    if (data?.id) {
      saveSessionResult(data)
    }
  }, [data?.id, data])

  const {
    lessonName,
    mode,
    attempted,
    correct,
    accuracy,
    missed = [],
  } = data
  const isIdentify = mode === 'identify'
  const hasMisses = isIdentify && missed.length > 0

  return (
    <section className="screen results-screen" aria-labelledby="results-title">
      <div className="screen-header">
        <p className="screen-kicker">Dit Dit</p>
      </div>

      <h1 id="results-title" className="screen-title">Results</h1>

      <div className="results-content">
        <section className="results-card" aria-labelledby="results-overview-title">
          <p id="results-overview-title" className="section-kicker">At a Glance</p>
          <p className="score-main">{lessonName}</p>
          <div className="results-overview-grid">
            <div className="mini-stat">
              <span className="mini-stat-label">Mode</span>
              <span className="mini-stat-value">{MODE_LABELS[mode] ?? MODE_LABELS.identify}</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-label">Correct</span>
              <span className="mini-stat-value">{correct} / {attempted}</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-label">Accuracy</span>
              <span className="mini-stat-value">{accuracy}%</span>
            </div>
          </div>
        </section>

        <section className="results-card" aria-labelledby="missed-title">
          <p id="missed-title" className="section-kicker">Missed Characters</p>
          {hasMisses ? (
            <div className="character-chip-row" aria-label="Missed characters">
              {missed.map(character => (
                <span key={character} className="character-chip character-chip-emphasis">
                  {character}
                </span>
              ))}
            </div>
          ) : (
            <p className="missed-chars all-correct">
              {isIdentify ? 'Nice work. No missed characters this round.' : 'Listen-only session complete.'}
            </p>
          )}
        </section>

        <section className="results-actions" aria-labelledby="next-actions-title">
          <p id="next-actions-title" className="section-kicker">Next Actions</p>
          <TouchButton onClick={onPracticeAgain}>Practice Again</TouchButton>
          {hasMisses && (
            <TouchButton onClick={onPracticeMissed}>Practice Missed Characters</TouchButton>
          )}
          <TouchButton variant="secondary" onClick={onHome}>Home</TouchButton>
        </section>
      </div>
    </section>
  )
}
