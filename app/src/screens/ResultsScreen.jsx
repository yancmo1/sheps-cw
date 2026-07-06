import { useEffect } from 'react'
import TouchButton from '../components/TouchButton.jsx'
import { getDynamicSpeedRecommendation, saveSessionResult } from '../progress.js'

const MODE_LABELS = {
  identify: 'Listen & Identify',
  copy: 'Copy Mode',
  'speed-ladder': 'Speed Ladder',
  listen: 'Listen Only',
}

export default function ResultsScreen({
  data,
  settings,
  streak,
  onApplyRecommendedSpeed,
  onPracticeAgain,
  onPracticeMissed,
  onHome,
}) {
  useEffect(() => {
    if (data?.id) {
      saveSessionResult(data)
    }
  }, [data?.id, data])

  const {
    lessonName,
    mode,
    sessionLength,
    attempted,
    correct,
    accuracy,
    missed = [],
    finalWpm,
    ladderStoppedEarly,
    avgResponseMs,
    timingSampleCount,
  } = data
  const isScored = mode === 'identify' || mode === 'copy' || mode === 'speed-ladder'
  const hasMisses = isScored && missed.length > 0
  const completionCount = isScored ? attempted : sessionLength
  const speedRecommendation = getDynamicSpeedRecommendation(data, settings)
  const topMissed = missed.slice(0, 3)
  const isDailyChallenge = String(data?.lessonId || '').startsWith('challenge-')
  const accuracyColor = !isScored
    ? '#587163'
    : accuracy >= 85
      ? '#4caf50'
      : accuracy >= 60
        ? '#ffd676'
        : '#c0392b'

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
              <span className="mini-stat-label">{isScored ? 'Correct' : 'Reps'}</span>
              <span className="mini-stat-value">
                {isScored ? `${correct} / ${attempted}` : completionCount}
              </span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-label">{isScored ? 'Accuracy' : 'Tracking'}</span>
              <span className="mini-stat-value">{isScored ? `${accuracy}%` : 'Not scored'}</span>
            </div>
          </div>
        </section>

        {isScored && (
          <section className="results-card" aria-labelledby="accuracy-gauge-title">
            <p id="accuracy-gauge-title" className="section-kicker">Accuracy Gauge</p>
            <div className="accuracy-gauge-wrap" aria-label={`Accuracy ${accuracy}%`}>
              <div
                className="accuracy-gauge"
                style={{
                  '--gauge-value': `${accuracy}%`,
                  '--gauge-color': accuracyColor,
                }}
              >
                <span className="accuracy-gauge-value">{accuracy}%</span>
              </div>
            </div>
          </section>
        )}

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
              {isScored ? 'Nice work. No missed characters this round.' : 'Listen-only session complete.'}
            </p>
          )}
        </section>

        {isScored && (
          <section className="results-card" aria-labelledby="speed-recommendation-title">
            <p id="speed-recommendation-title" className="section-kicker">Speed Recommendation</p>
            <p className="missed-chars">
              {speedRecommendation.reason}
            </p>
            <p className="missed-chars">
              Current: {speedRecommendation.currentWpm} WPM
              {' · '}
              Suggested: {speedRecommendation.nextWpm} WPM
            </p>
            {speedRecommendation.hasRecommendation && (
              <div className="inline-action-row">
                <TouchButton
                  onClick={() => onApplyRecommendedSpeed?.(speedRecommendation)}
                >
                  Apply Suggested Speed
                </TouchButton>
              </div>
            )}
          </section>
        )}

        {isDailyChallenge && (
          <section className="results-card" aria-labelledby="daily-challenge-reward-title">
            <p id="daily-challenge-reward-title" className="section-kicker">Daily Challenge Reward</p>
            <p className="missed-chars all-correct">
              Challenge complete! You earned progress toward the <strong>Daily Challenger</strong> badge.
            </p>
          </section>
        )}

        {mode === 'speed-ladder' && (
          <section className="results-card" aria-labelledby="ladder-title">
            <p id="ladder-title" className="section-kicker">Speed Ladder</p>
            <p className="missed-chars">
              Final achieved speed: <strong>{finalWpm ?? settings?.wpm ?? '—'} WPM</strong>
            </p>
            {ladderStoppedEarly && (
              <p className="missed-chars">Ladder stopped when round accuracy dropped below threshold.</p>
            )}
          </section>
        )}

        {mode === 'copy' && timingSampleCount > 0 && (
          <section className="results-card" aria-labelledby="copy-timing-title">
            <p id="copy-timing-title" className="section-kicker">Copy Timing</p>
            <p className="missed-chars">
              Average response: <strong>{avgResponseMs} ms</strong> across {timingSampleCount} item{timingSampleCount === 1 ? '' : 's'}.
            </p>
          </section>
        )}

        <section className="results-card" aria-labelledby="streak-status-title">
          <p id="streak-status-title" className="section-kicker">Streak Status</p>
          {(streak?.currentStreakDays ?? 0) > 0 ? (
            <p className="missed-chars all-correct">
              Streak continues! {streak.currentStreakDays} day{streak.currentStreakDays === 1 ? '' : 's'} in a row.
            </p>
          ) : (
            <p className="missed-chars">
              No active streak yet. Start a new one with a quick practice session today.
            </p>
          )}
          <p className="missed-chars">
            Longest streak: {streak?.longestStreakDays ?? 0} day{(streak?.longestStreakDays ?? 0) === 1 ? '' : 's'}.
          </p>
        </section>

        {isScored && (
          <section className="results-card" aria-labelledby="improvement-tips-title">
            <p id="improvement-tips-title" className="section-kicker">Recommended Next Drill</p>
            {topMissed.length > 0 ? (
              <p className="missed-chars">
                Practice these next: <strong>{topMissed.join(' ')}</strong>
              </p>
            ) : (
              <p className="missed-chars all-correct">
                Great pass. Try Daily Review or increase speed for the next session.
              </p>
            )}
          </section>
        )}

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
