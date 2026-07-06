import { useMemo, useState } from 'react'
import TouchButton from '../components/TouchButton.jsx'
import {
  getAchievementsSummary,
  getAccuracyTrendSummary,
  getCharacterConfusionSummary,
  getDueCharacterReviewSet,
  getCharacterPerformanceSummary,
  getCharacterMasterySummary,
  clearSessionHistory,
  getTodayPracticeSummary,
  getMissedCharacterSummary,
  getProgressSummary,
  getWeakCharacterPracticeSet,
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

export default function ProgressScreen({
  onPractice,
  onPracticeChallenge,
  onPracticeCharacter,
  onPracticeDaily,
  onPracticeWeak,
  onHome,
  streak,
}) {
  const [history, setHistory] = useState(() => loadSessionHistory())
  const [confirmClear, setConfirmClear] = useState(false)

  const summary = useMemo(() => getProgressSummary(history), [history])
  const missedCharacters = useMemo(
    () => getMissedCharacterSummary(history).slice(0, 8),
    [history]
  )
  const characterMastery = useMemo(
    () => getCharacterMasterySummary(history),
    [history]
  )
  const characterPerformance = useMemo(
    () => getCharacterPerformanceSummary(history, {
      rollingWindows: [10, 50, 100],
      weakThreshold: 80,
      minAttemptsForWeak: 5,
    }),
    [history]
  )
  const weakCharacters = useMemo(
    () => getWeakCharacterPracticeSet(history, {
      limit: 12,
      weakThreshold: 80,
      minAttemptsForWeak: 5,
      rollingWindow: 10,
    }),
    [history]
  )
  const confusionSummary = useMemo(
    () => getCharacterConfusionSummary(history, { limit: 8 }),
    [history]
  )
  const dueReviewCharacters = useMemo(
    () => getDueCharacterReviewSet(history, { limit: 12 }),
    [history]
  )
  const accuracyTrend = useMemo(
    () => getAccuracyTrendSummary(history),
    [history]
  )
  const achievements = useMemo(
    () => getAchievementsSummary(history),
    [history]
  )
  const todayPractice = useMemo(
    () => getTodayPracticeSummary(history),
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
              <span className="stat-value">
                {summary.scoredSessionCount > 0 ? `${summary.overallAccuracy}%` : '—'}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Best Session</span>
              <span className="stat-value">
                {summary.scoredSessionCount > 0 ? `${summary.bestSessionAccuracy}%` : '—'}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Current Streak</span>
              <span className="stat-value">
                {streak?.currentStreakDays ?? 0}d
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Longest Streak</span>
              <span className="stat-value">
                {streak?.longestStreakDays ?? 0}d
              </span>
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

          <section className="results-card" aria-labelledby="weak-characters-title">
            <p id="weak-characters-title" className="section-kicker">Adaptive Focus · Weak Characters</p>
            {weakCharacters.length > 0 ? (
              <>
                <p className="missed-chars">Recent rolling accuracy is below 80% for these characters.</p>
                <div className="character-chip-row" aria-label="Weak characters">
                  {weakCharacters.map(character => (
                    <span key={character} className="character-chip character-chip-summary">
                      {character}
                    </span>
                  ))}
                </div>
                <div className="inline-action-row">
                  <TouchButton onClick={onPracticeWeak ?? onPractice}>Practice Weak Characters</TouchButton>
                </div>
              </>
            ) : (
              <p className="missed-chars all-correct">
                No weak characters detected yet. Keep practicing to build rolling stats.
              </p>
            )}
          </section>

          <section className="results-card" aria-labelledby="daily-review-title">
            <p id="daily-review-title" className="section-kicker">Due for Review Today</p>
            {dueReviewCharacters.length > 0 ? (
              <>
                <p className="missed-chars">
                  {dueReviewCharacters.length} character{dueReviewCharacters.length === 1 ? '' : 's'} due right now.
                </p>
                <div className="character-chip-row" aria-label="Characters due for review">
                  {dueReviewCharacters.map(character => (
                    <span key={character} className="character-chip character-chip-summary">
                      {character}
                    </span>
                  ))}
                </div>
                <div className="inline-action-row">
                  <TouchButton onClick={onPracticeDaily ?? onPractice}>Start Daily Review</TouchButton>
                </div>
              </>
            ) : (
              <>
                <p className="missed-chars all-correct">No characters due for review today.</p>
                {todayPractice.practicedCharacters.length > 0 && (
                  <p className="missed-chars">
                    Reviewed today: {todayPractice.practicedCharacters.length} characters
                    {' '}
                    ({todayPractice.practicedCharacters.join(' ')}).
                  </p>
                )}
              </>
            )}
          </section>

          {characterMastery.length > 0 && (
            <section className="results-card" aria-labelledby="mastery-title">
              <p id="mastery-title" className="section-kicker">Character Mastery</p>
              <div className="mastery-grid" aria-label="Per-character mastery">
                {characterMastery.map(item => (
                  <article
                    key={item.character}
                    className={`mastery-chip mastery-chip-${item.status.toLowerCase()}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => onPracticeCharacter?.(item.character)}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onPracticeCharacter?.(item.character)
                      }
                    }}
                    aria-label={`Practice ${item.character}`}
                  >
                    <span className="mastery-character">{item.character}</span>
                    <span className="mastery-status">{item.status}</span>
                    <span className="mastery-detail">
                      {item.accuracy}% · {item.attempts} heard
                    </span>
                  </article>
                ))}
              </div>
            </section>
          )}

          {characterPerformance.length > 0 && (
            <section className="results-card" aria-labelledby="rolling-accuracy-title">
              <p id="rolling-accuracy-title" className="section-kicker">Per-Character Rolling Accuracy</p>
              <div className="rolling-grid" aria-label="Per-character rolling accuracy heatmap">
                {characterPerformance.map(item => {
                  const last10 = item.rolling[10]
                  const statusClass = item.isWeak
                    ? 'rolling-chip-weak'
                    : item.accuracy >= 85
                      ? 'rolling-chip-strong'
                      : 'rolling-chip-building'

                  return (
                    <article key={item.character} className={`rolling-chip ${statusClass}`}>
                      <span className="rolling-character">{item.character}</span>
                      <span className="rolling-detail">
                        10: {last10?.accuracy ?? 0}% · 50: {item.rolling[50]?.accuracy ?? 0}%
                      </span>
                      <span className="rolling-detail">
                        100: {item.rolling[100]?.accuracy ?? 0}% · all: {item.accuracy}%
                      </span>
                    </article>
                  )
                })}
              </div>
            </section>
          )}

          {confusionSummary.length > 0 && (
            <section className="results-card" aria-labelledby="confusions-title">
              <p id="confusions-title" className="section-kicker">Common Confusions</p>
              <div className="confusion-list" aria-label="Common confusion pairs">
                {confusionSummary.map(entry => (
                  <p key={`${entry.expected}-${entry.selected}`} className="confusion-row">
                    Often hear <strong>{entry.expected}</strong> as <strong>{entry.selected}</strong>
                    {' '}
                    <span className="confusion-count">({entry.count})</span>
                  </p>
                ))}
              </div>
            </section>
          )}

          {accuracyTrend.points.length > 1 && (
            <section className="results-card" aria-labelledby="accuracy-trend-title">
              <p id="accuracy-trend-title" className="section-kicker">Accuracy Trend</p>
              <p className="missed-chars">
                Trend: <strong>{accuracyTrend.trend}</strong>
                {' · '}
                Last 10: {accuracyTrend.averages.last10}%
                {' · '}
                Last 30: {accuracyTrend.averages.last30}%
                {' · '}
                All: {accuracyTrend.averages.all}%
              </p>
              <svg className="trend-chart" viewBox="0 0 300 80" role="img" aria-label="Accuracy over recent scored sessions">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  points={accuracyTrend.points.map((point, index) => {
                    const x = accuracyTrend.points.length === 1
                      ? 0
                      : (index / (accuracyTrend.points.length - 1)) * 300
                    const y = 80 - (point.y / 100) * 80
                    return `${x},${y}`
                  }).join(' ')}
                />
              </svg>
            </section>
          )}

          {achievements.earned.length > 0 && (
            <section className="results-card" aria-labelledby="achievements-title">
              <p id="achievements-title" className="section-kicker">Achievements</p>
              <div className="achievement-grid" aria-label="Earned achievements">
                {achievements.earned.map(achievement => (
                  <article key={achievement.id} className="achievement-chip">
                    <span className="achievement-icon" aria-hidden="true">🏅</span>
                    <span className="achievement-label">{achievement.label}</span>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="progress-history" aria-labelledby="recent-sessions-title">
            <p id="recent-sessions-title" className="section-kicker">Recent Sessions</p>
            <div className="session-history-list">
              {summary.recentSessions.map(session => (
                <article key={session.id} className="history-card">
                  <p className="history-card-time">{formatDateTime(session.createdAt)}</p>
                  <p className="history-card-title">{session.lessonName}</p>
                  <div className="history-card-meta">
                    <span>
                      {session.mode === 'listen'
                        ? 'Listen Only'
                        : session.mode === 'copy'
                          ? 'Copy Mode'
                          : session.mode === 'speed-ladder'
                            ? 'Speed Ladder'
                          : 'Listen & Identify'}
                    </span>
                    {session.mode === 'identify' || session.mode === 'copy' || session.mode === 'speed-ladder' ? (
                      <>
                        <span>{session.correct} / {session.attempted}</span>
                        <span>{session.accuracy}%</span>
                      </>
                    ) : (
                      <span>{session.sessionLength} reps · not scored</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="progress-actions">
            <TouchButton onClick={onPracticeChallenge ?? onPractice}>Start Daily Challenge</TouchButton>
            <TouchButton onClick={onPractice}>Start Practice</TouchButton>
            {dueReviewCharacters.length > 0 && (
              <TouchButton onClick={onPracticeDaily ?? onPractice}>Start Daily Review</TouchButton>
            )}
            {weakCharacters.length > 0 && (
              <TouchButton onClick={onPracticeWeak ?? onPractice}>Practice Weak Characters</TouchButton>
            )}
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
