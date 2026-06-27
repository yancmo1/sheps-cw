import { useState } from 'react'
import { loadSettings, saveSettings } from './settings.js'
import HomeScreen from './screens/HomeScreen.jsx'
import PracticeSetupScreen from './screens/PracticeSetupScreen.jsx'
import PracticeSessionScreen from './screens/PracticeSessionScreen.jsx'
import ResultsScreen from './screens/ResultsScreen.jsx'
import SettingsScreen from './screens/SettingsScreen.jsx'
import ExitScreen from './screens/ExitScreen.jsx'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [settings, setSettings] = useState(loadSettings)
  const [sessionConfig, setSessionConfig] = useState(null)
  const [sessionResult, setSessionResult] = useState(null)
  const [exitMessage, setExitMessage] = useState(null)

  function goHome() {
    setScreen('home')
    setExitMessage(null)
  }

  function handleSettingsChange(updated) {
    setSettings(updated)
    saveSettings(updated)
  }

  function handlePracticeStart(config) {
    setSessionConfig(config)
    setScreen('session')
  }

  function handleSessionFinish(result) {
    setSessionResult(result)
    setScreen('results')
  }

  function handleExitConfirm() {
    window.close()
    setTimeout(() => {
      if (document.visibilityState !== 'hidden') {
        setExitMessage(
          'Chromium did not close this window automatically. Close the Chromium window from the Pi desktop to return to the desktop.'
        )
      }
    }, 400)
  }

  return (
    <main className="app-shell">
      {screen === 'home' && (
        <HomeScreen
          onPractice={() => setScreen('practiceSetup')}
          onSettings={() => setScreen('settings')}
          onExit={() => setScreen('exit')}
        />
      )}

      {screen === 'practiceSetup' && (
        <PracticeSetupScreen
          onBack={goHome}
          onStart={handlePracticeStart}
        />
      )}

      {screen === 'session' && sessionConfig && (
        <PracticeSessionScreen
          config={sessionConfig}
          settings={settings}
          onFinish={handleSessionFinish}
        />
      )}

      {screen === 'results' && sessionResult && (
        <ResultsScreen
          data={sessionResult}
          onPracticeAgain={() => setScreen('practiceSetup')}
          onHome={goHome}
        />
      )}

      {screen === 'settings' && (
        <SettingsScreen
          settings={settings}
          onSave={handleSettingsChange}
          onBack={goHome}
        />
      )}

      {screen === 'exit' && (
        <ExitScreen
          message={exitMessage}
          onCancel={goHome}
          onExit={handleExitConfirm}
        />
      )}
    </main>
  )
}
