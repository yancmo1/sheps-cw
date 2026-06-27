import TouchButton from '../components/TouchButton.jsx'

export default function ResultsScreen({ data, onPracticeAgain, onHome }) {
  const { results, mode, played } = data
  const isIdentify = mode === 'identify'

  if (!isIdentify) {
    return (
      <section className="screen results-screen" aria-labelledby="results-title">
        <div className="screen-header">
          <p className="screen-kicker">Dit Dit</p>
        </div>

        <h1 id="results-title" className="screen-title">Session Complete</h1>

        <div className="results-card">
          <p className="score-main">You listened to {played} character{played !== 1 ? 's' : ''}.</p>
        </div>

        <div className="results-actions">
          <TouchButton onClick={onPracticeAgain}>Practice Again</TouchButton>
          <TouchButton variant="secondary" onClick={onHome}>Back to Home</TouchButton>
        </div>
      </section>
    )
  }

  const correct = results.filter(r => r.correct).length
  const total = results.length
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  const missedSet = new Set(results.filter(r => !r.correct).map(r => r.char))
  const missed = [...missedSet]

  return (
    <section className="screen results-screen" aria-labelledby="results-title">
      <div className="screen-header">
        <p className="screen-kicker">Dit Dit</p>
      </div>

      <h1 id="results-title" className="screen-title">Results</h1>

      <div className="results-card">
        <p className="score-main">You got {correct} of {total} correct.</p>
        <p className="score-pct" aria-label={`${pct} percent`}>{pct}%</p>
        {missed.length > 0 ? (
          <p className="missed-chars">Missed: {missed.join(', ')}</p>
        ) : (
          <p className="missed-chars all-correct">All correct! 🎉</p>
        )}
      </div>

      <div className="results-actions">
        <TouchButton onClick={onPracticeAgain}>Practice Again</TouchButton>
        <TouchButton variant="secondary" onClick={onHome}>Back to Home</TouchButton>
      </div>
    </section>
  )
}
