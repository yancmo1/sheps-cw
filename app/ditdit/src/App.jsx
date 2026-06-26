import { useState } from 'react'

const screens = {
  home: 'home',
  practice: 'practice',
  settings: 'settings',
  exit: 'exit',
}

export default function App() {
  const [screen, setScreen] = useState(screens.home)
  const [exitMessage, setExitMessage] = useState(
    'Dit Dit asked Chromium to close. If this screen is still visible, close the Chromium window from the Pi desktop.'
  )

  function exitToDesktop() {
    window.close()

    setTimeout(() => {
      setExitMessage(
        'Chromium did not allow Dit Dit to close this window automatically. Close the Chromium window from the Pi desktop to return to the desktop.'
      )
      setScreen(screens.exit)
    }, 300)
  }

  if (screen === screens.practice) {
    return (
      <Shell>
        <PlaceholderScreen
          title="Practice Mode"
          message="Practice mode coming soon."
          onBack={() => setScreen(screens.home)}
        />
      </Shell>
    )
  }

  if (screen === screens.settings) {
    return (
      <Shell>
        <PlaceholderScreen
          title="Settings"
          message="Settings coming soon."
          onBack={() => setScreen(screens.home)}
        />
      </Shell>
    )
  }

  if (screen === screens.exit) {
    return (
      <Shell>
        <PlaceholderScreen
          title="Exit to Desktop"
          message={exitMessage}
          onBack={() => setScreen(screens.home)}
        />
      </Shell>
    )
  }

  return (
    <Shell>
      <section className="home-screen" aria-labelledby="app-title">
        <p className="brand-kicker">W5XY Labs</p>
        <h1 id="app-title">Dit Dit</h1>
        <p className="subtitle">CW Trainer</p>

        <div className="action-stack" aria-label="Main navigation">
          <TouchButton onClick={() => setScreen(screens.practice)}>
            Practice
          </TouchButton>
          <TouchButton onClick={() => setScreen(screens.settings)}>
            Settings
          </TouchButton>
          <TouchButton variant="secondary" onClick={exitToDesktop}>
            Exit to Desktop
          </TouchButton>
        </div>
      </section>
    </Shell>
  )
}

function Shell({ children }) {
  return <main className="app-shell">{children}</main>
}

function PlaceholderScreen({ title, message, onBack }) {
  return (
    <section className="placeholder-screen" aria-labelledby="screen-title">
      <div className="placeholder-copy">
        <p className="brand-kicker">Dit Dit</p>
        <h1 id="screen-title">{title}</h1>
        <p className="placeholder-message">{message}</p>
      </div>

      <TouchButton onClick={onBack}>Back</TouchButton>
    </section>
  )
}

function TouchButton({ children, onClick, variant = 'primary' }) {
  return (
    <button className={`touch-button touch-button-${variant}`} type="button" onClick={onClick}>
      {children}
    </button>
  )
}
