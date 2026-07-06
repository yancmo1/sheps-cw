import TouchButton from '../components/TouchButton.jsx'

export default function HomeScreen({
  onPractice,
  onDailyChallenge,
  onDailyReview,
  onKeyDecode,
  onProgress,
  onSettings,
  onExit,
  dueReviewCount = 0,
  practicedTodayCount = 0,
  currentStreakDays = 0,
}) {
  return (
    <section className="home-screen" aria-labelledby="home-title">
      <p className="brand-kicker">W5XY Labs</p>
      <h1 id="home-title">Dit Dit</h1>
      <p className="subtitle">CW Trainer</p>

      {dueReviewCount > 0 && (
        <p className="home-review-note" role="status" aria-live="polite">
          {dueReviewCount} character{dueReviewCount === 1 ? '' : 's'} due for review today
        </p>
      )}
      {practicedTodayCount > 0 && (
        <p className="home-review-note home-review-note-secondary" role="status" aria-live="polite">
          Reviewed today: {practicedTodayCount} character{practicedTodayCount === 1 ? '' : 's'}
        </p>
      )}
      {currentStreakDays > 0 && (
        <p className="home-review-note home-review-note-secondary" role="status" aria-live="polite">
          Streak: {currentStreakDays} day{currentStreakDays === 1 ? '' : 's'}
        </p>
      )}

      <div className="action-stack" aria-label="Main navigation">
        <TouchButton onClick={onDailyChallenge}>Daily Challenge</TouchButton>
        {dueReviewCount > 0 && (
          <TouchButton onClick={onDailyReview}>Daily Review ({dueReviewCount})</TouchButton>
        )}
        <TouchButton onClick={onPractice}>Practice</TouchButton>
        <TouchButton onClick={onKeyDecode}>Key Decode</TouchButton>
        <TouchButton onClick={onProgress}>Progress</TouchButton>
        <TouchButton onClick={onSettings}>Settings</TouchButton>
        <TouchButton variant="secondary" onClick={onExit}>Exit to Desktop</TouchButton>
      </div>
    </section>
  )
}
