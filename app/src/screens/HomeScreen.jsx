import TouchButton from '../components/TouchButton.jsx'

export default function HomeScreen({ onPractice, onProgress, onSettings, onExit }) {
  return (
    <section className="home-screen" aria-labelledby="home-title">
      <p className="brand-kicker">W5XY Labs</p>
      <h1 id="home-title">Dit Dit</h1>
      <p className="subtitle">CW Trainer</p>

      <div className="action-stack" aria-label="Main navigation">
        <TouchButton onClick={onPractice}>Practice</TouchButton>
        <TouchButton onClick={onProgress}>Progress</TouchButton>
        <TouchButton onClick={onSettings}>Settings</TouchButton>
        <TouchButton variant="secondary" onClick={onExit}>Exit to Desktop</TouchButton>
      </div>
    </section>
  )
}
