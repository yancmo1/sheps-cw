import { useMemo, useState } from 'react'
import { loadSettings, saveSettings } from './settings.js'
import HomeScreen from './screens/HomeScreen.jsx'
import PracticeSetupScreen from './screens/PracticeSetupScreen.jsx'
import PracticeSessionScreen from './screens/PracticeSessionScreen.jsx'
import ResultsScreen from './screens/ResultsScreen.jsx'
import ProgressScreen from './screens/ProgressScreen.jsx'
import SettingsScreen from './screens/SettingsScreen.jsx'
import ExitScreen from './screens/ExitScreen.jsx'
import KeyDecodeScreen from './screens/KeyDecodeScreen.jsx'
import { LESSONS } from './data/lessons/index.js'
import {
  buildDailyChallenge,
  getAdaptiveSessionAdjustments,
  getDueCharacterReviewSet,
  getPracticeStreakSummary,
  getTodayPracticeSummary,
  getWeakCharacterPracticeSet,
  loadSessionHistory,
} from './progress.js'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [settings, setSettings] = useState(loadSettings)
  const [sessionConfig, setSessionConfig] = useState(null)
  const [sessionResult, setSessionResult] = useState(null)
  const [exitMessage, setExitMessage] = useState(null)
  const history = useMemo(() => loadSessionHistory(), [screen, sessionResult?.id])
  const allLessonCharacters = useMemo(
    () => [...new Set(LESSONS.flatMap(lesson => lesson.characters))],
    []
  )
  const dailyChallenge = useMemo(
    () => buildDailyChallenge({ availableCharacters: allLessonCharacters }),
    [allLessonCharacters]
  )
  const dueReviewCharacters = useMemo(
    () => getDueCharacterReviewSet(history, { limit: 12 }),
    [history]
  )
  const todayPractice = useMemo(() => getTodayPracticeSummary(history), [history])
  const streak = useMemo(() => getPracticeStreakSummary(history), [history])

  function goHome() {
    setScreen('home')
    setExitMessage(null)
  }

  function handleSettingsChange(updated) {
    setSettings(updated)
    saveSettings(updated)
  }

  function handlePracticeStart(config) {
    const adaptive = getAdaptiveSessionAdjustments(loadSessionHistory(), {
      mode: config.mode,
      characters: config.characters,
      allCharacters: allLessonCharacters,
      settings,
    })

    setSessionConfig({
      ...config,
      characters: adaptive.characters,
      sessionSettingsOverride: adaptive.sessionSettingsOverride,
      adaptiveReason: adaptive.adaptiveReason,
    })
    setScreen('session')
  }

  function handlePracticeAgain() {
    if (!sessionConfig) return
    setScreen('session')
  }

  function handlePracticeMissed() {
    if (!sessionResult || !sessionResult.missed?.length) return

    setSessionConfig({
      mode: 'identify',
      lessonId: 'missed-characters',
      lessonName: 'Missed Characters',
      length: sessionResult.sessionLength,
      characters: sessionResult.missed,
      sourceLessonName: sessionResult.lessonName,
      customLabel: `Missed Characters · ${sessionResult.missed.join(' ')}`,
      autoAdvance: sessionConfig?.autoAdvance ?? false,
    })
    setScreen('session')
  }

  function handlePracticeWeakCharacters() {
    const weakCharacters = getWeakCharacterPracticeSet(loadSessionHistory(), {
      limit: 12,
      weakThreshold: 80,
      minAttemptsForWeak: 5,
      rollingWindow: 10,
    })

    if (!weakCharacters.length) {
      setScreen('practiceSetup')
      return
    }

    setSessionConfig({
      mode: 'identify',
      lessonId: 'weak-characters',
      lessonName: 'Weak Character Practice',
      length: 10,
      characters: weakCharacters,
      customLabel: `Weak Characters · ${weakCharacters.join(' ')}`,
      autoAdvance: false,
    })
    setScreen('session')
  }

  function handleSessionFinish(result) {
    setSessionResult(result)
    setScreen('results')
  }

  function handleApplyRecommendedSpeed(recommendation) {
    if (!recommendation?.hasRecommendation) return

    const nextSettings = {
      ...settings,
      wpm: recommendation.nextWpm,
      farnsworth: Math.min(recommendation.nextWpm, recommendation.nextFarnsworth),
    }

    setSettings(nextSettings)
    saveSettings(nextSettings)
  }

  function handleStartDailyReview() {
    const dueCharacters = getDueCharacterReviewSet(loadSessionHistory(), { limit: 12 })
    if (!dueCharacters.length) {
      setScreen('practiceSetup')
      return
    }

    setSessionConfig({
      mode: 'identify',
      lessonId: 'daily-review',
      lessonName: 'Daily Review',
      length: Math.min(25, Math.max(10, dueCharacters.length * 2)),
      characters: dueCharacters,
      customLabel: `Daily Review · ${dueCharacters.join(' ')}`,
      autoAdvance: false,
    })
    setScreen('session')
  }

  function handlePracticeCharacter(character) {
    if (!character) return

    setSessionConfig({
      mode: 'identify',
      lessonId: `character-${character}`,
      lessonName: `Character Drill · ${character}`,
      length: 10,
      characters: [character],
      customLabel: `Character Drill · ${character}`,
      autoAdvance: false,
    })
    setScreen('session')
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

  function handleStartDailyChallenge() {
    if (!dailyChallenge.characters.length) {
      setScreen('practiceSetup')
      return
    }

    setSessionConfig({
      mode: 'identify',
      lessonId: dailyChallenge.id,
      lessonName: 'Daily Challenge',
      length: dailyChallenge.length,
      characters: dailyChallenge.characters,
      customLabel: `${dailyChallenge.label} · ${dailyChallenge.suggestedWpm} WPM`,
      autoAdvance: false,
      sessionSettingsOverride: {
        wpm: dailyChallenge.suggestedWpm,
        farnsworth: Math.min(dailyChallenge.suggestedWpm, settings.farnsworth),
      },
    })
    setScreen('session')
  }

  return (
    <main className={`app-shell app-theme-${settings.theme || 'dark'}${settings.largeText ? ' app-large-text' : ''}${settings.reduceMotion ? ' app-reduced-motion' : ''}${settings.largeTouchTargets ? ' app-large-touch' : ''}`}>
      {screen === 'home' && (
        <HomeScreen
          onPractice={() => setScreen('practiceSetup')}
          onDailyChallenge={handleStartDailyChallenge}
          onDailyReview={handleStartDailyReview}
          onKeyDecode={() => setScreen('keyDecode')}
          onProgress={() => setScreen('progress')}
          onSettings={() => setScreen('settings')}
          onExit={() => setScreen('exit')}
          dueReviewCount={dueReviewCharacters.length}
          practicedTodayCount={todayPractice.practicedCharacters.length}
          currentStreakDays={streak.currentStreakDays}
        />
      )}

      {screen === 'keyDecode' && (
        <KeyDecodeScreen
          settings={settings}
          onBack={goHome}
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
          settings={settings}
          streak={streak}
          onApplyRecommendedSpeed={handleApplyRecommendedSpeed}
          onPracticeAgain={handlePracticeAgain}
          onPracticeMissed={handlePracticeMissed}
          onHome={goHome}
        />
      )}

      {screen === 'progress' && (
        <ProgressScreen
          onPractice={() => setScreen('practiceSetup')}
          onPracticeCharacter={handlePracticeCharacter}
          onPracticeChallenge={handleStartDailyChallenge}
          onPracticeDaily={handleStartDailyReview}
          onPracticeWeak={handlePracticeWeakCharacters}
          onHome={goHome}
          streak={streak}
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
