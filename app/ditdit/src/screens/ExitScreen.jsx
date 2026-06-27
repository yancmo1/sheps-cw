import TouchButton from '../components/TouchButton.jsx'

export default function ExitScreen({ message, onCancel, onExit }) {
  return (
    <section className="screen exit-screen" aria-labelledby="exit-title">
      <div className="exit-card">
        <p className="brand-kicker">Dit Dit</p>
        <h1 id="exit-title" className="screen-title">Exit to Desktop?</h1>

        {message ? (
          <p className="exit-message">{message}</p>
        ) : (
          <p className="exit-message">Exit Dit Dit and return to the desktop?</p>
        )}
      </div>

      <div className="action-stack exit-actions">
        {message ? (
          <TouchButton onClick={onCancel}>Back to Dit Dit</TouchButton>
        ) : (
          <>
            <TouchButton onClick={onCancel}>Cancel</TouchButton>
            <TouchButton variant="secondary" onClick={onExit}>Exit</TouchButton>
          </>
        )}
      </div>
    </section>
  )
}
