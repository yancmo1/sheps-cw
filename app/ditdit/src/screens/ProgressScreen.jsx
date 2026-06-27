import { useMemo, useState } from 'react'
import TouchButton from '../components/TouchButton.jsx'
import {
  clearSessionHistory,
  getMissedCharacterSummary,
  getProgressSummary,
  loadSessionHistory,
} from '../progress.js'

function formatDateTime(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown date'

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export default function ProgressScreen({ onPractice, onHome }) {
  const [history, setHistory] = useState(() => loadSessionHistory())
  const [confirmClear, setConfirmClear] = useState(false)

  const summary = useMemo(() => getProgressSummary(history), [history])
  const missedCharacters = useMemo(
    () => getMissedCharacterSummary(history).slice(0, 8),
    [history]
  )
  const hasHistory = history.length > 0

  function handleClearProgress() {
    clearSessionHistory()
    setHistory([])
    setConfirmClear(false)
  }

  return (
    <section className="screen progress-screen" aria-labelledby="progress-title">
      <div className="screen-header">
        <TouchButton variant="secondary" size="sm" onClick={onHome}>← Home</TouchButton>
        <p className="screen-kicker">Dit Dit</p>
      </div>

      <h1 id="progress-title" className="screen-title">Progress</h1>

      {!hasHistory ? (
        <div className="progress-empty">
          <div className="results-card">
            <p className="score-main">No practice sessions yet.</p>
            <p className="missed-chars">
              Complete a practice session to start tracking progress.
            </p>
          </div>

          <div className="results-actions">
            <TouchButton onClick={onPractice}>Start Practice</TouchButton>
            <TouchButton variant="secondary" onClick={onHome}>Home</TouchButton>
          </div>
        </div>
      ) : (
        <div className="progress-content">
          <div className="stats-grid" aria-label="Progress summary">
            <div className="stat-card">
              <span className="stat-label">Sessions</span>
              <span className="stat-value">{summary.totalSessions}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Characters</span>
              <span className="stat-value">{summary.totalCharacters}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Overall Accuracy</span>
              <span className="stat-value">{summary.overallAccuracy}%</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Best Session</span>
              <span className="stat-value">{summary.bestSessionAccuracy}%</span>
            </div>
          </div>

          <section className="results-card" aria-labelledby="most-missed-title">
            <p id="most-missed-title" className="section-kicker">Most Missed Characters</p>
            {missedCharacters.length > 0 ? (
              <div className="character-chip-row" aria-label="Most missed characters">
                {missedCharacters.map(item => (
                  <span key={item.character} className="character-chip character-chip-summary">
                    {item.character} · {item.count}
                  </span>
                ))}
              </div>
            ) : (
              <p className="missed-chars all-correct">No missed characters recorded yet.</p>
            )}
          </section>

          <section className="progress-history" aria-labelledby="recent-sessions-title">
            <p id="recent-sessions-title" className="section-kicker">Recent Sessions</p>
            <div className="session-history-list">
              {summary.recentSessions.map(session => (
                <article key={session.id} className="history-card">
                  <p className="history-card-time">{formatDateTime(session.createdAt)}</p>
                  <p className="history-card-title">{session.lessonName}</p>
                  <div className="history-card-meta">
                    <span>{session.mode === 'listen' ? 'Listen Only' : 'Listen & Identify'}</span>
                    <span>{session.correct} / {session.attempted}</span>
                    <span>{session.accuracy}%</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="progress-actions">
            <TouchButton onClick={onPractice}>Start Practice</TouchButton>
            <TouchButton variant="secondary" onClick={onHome}>Home</TouchButton>
            {!confirmClear ? (
              <TouchButton variant="secondary" onClick={() => setConfirmClear(true)}>
                Clear Progress
              </TouchButton>
            ) : (
              <div className="confirm-card" role="alert">
                <p className="confirm-card-title">Clear all saved progress?</p>
                <p className="missed-chars">This removes session history only.</p>
                <div className="confirm-actions">
                  <TouchButton onClick={handleClearProgress}>Confirm Clear</TouchButton>
                  <TouchButton variant="secondary" onClick={() => setConfirmClear(false)}>
                    Cancel
                  </TouchButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
