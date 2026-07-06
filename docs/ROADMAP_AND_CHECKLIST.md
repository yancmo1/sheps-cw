# Dit Dit: Roadmap & Implementation Checklist

**Last Updated:** July 1, 2026  
**Status:** Phase 1 content + UX + core extraction + live CW input decode complete; adaptive foundation next  
**Reference Document:** [Dit_Dit_Design_Review_and_Improvements.md](Dit_Dit_Design_Review_and_Improvements.md) (archived June 29 — comprehensive 40+ improvement opportunities, basis for this checklist)

---

## Phase 1 Progress: 80% Complete

**Content & UX (✅ Complete)**
- Expanded to 42 lessons across 9 learning paths
- Full alphabet, digits (0-9), 7 prosigns all available
- Practice Setup refactored: Learning Plans dropdown + multiselect lesson interface
- Users can now combine lessons for mixed practice

**Next in Phase 1:**
- Per-character accuracy tracking foundation
- Pi kiosk startup/exit flow
- First-launch user onboarding

---

## What's Already Done ✅

Core foundation is in place:

- [x] Touch-first interface optimized for 7-inch touchscreen
- [x] Browser-based Morse audio engine with adjustable tone and speed
- [x] Farnsworth timing support
- [x] Multiple lesson paths (Beginner, Koch, LICW, Numbers, Review)
- [x] Practice session flow (Setup → Session → Results → Repeat)
- [x] Local settings persistence (speed, tone, volume)
- [x] Local progress history and basic statistics
- [x] Missed-character practice loop
- [x] Home screen with Practice, Key Decode, Progress, Settings, Exit flows
- [x] Docker deployment + Pi kiosk integration
- [x] Basic keyboard input support (Space = Dit, Enter = Dah)
- [x] Live key-decode screen with straight-key and paddle support
- [x] Iambic A/B paddle mode selection and sidetone
- [x] Character-speed tracking with last/average WPM feedback

**Architecture in place:**

- [x] Core Morse timing logic exists (app/src/core/morseTiming.js)
- [x] Character/morse library (app/src/data/morse.js, morseCharacters.js)
- [x] Vite build system
- [x] React component structure (screens, components, services)

---

## Phase 1: Critical Foundation (Weeks 1–4)

**Goal:** Expand to comprehensive character coverage, structured lessons, and core extraction. This phase unlocks adaptive learning and professional-quality foundation.

### Content Expansion ✅

- [x] **Add full alphabet (26 letters)** 
  - [x] Update lessons.js with complete letter set
  - [x] Add to relevant lesson paths
  - [x] Test in app: verify all 26 in practice

- [x] **Add digits (0-9)**
  - [x] Create digits.js lesson (Numbers: 0-4, 5-9, All)
  - [x] Add to Numbers lesson path (3 lessons)
  - [x] Test practice session with digits

- [x] **Add prosigns (AR, SK, BT, AS, KN, CA, SOS)**
  - [x] Create prosigns.js lesson (2 lessons: Basic + Extended)
  - [x] Add as separate practice path
  - [x] Update morse library with prosign encodings

- [x] **Create structured lesson library (42 lessons total)**
  - [x] Beginner track (4 lessons): E I S H 5, T M O 0, A N, W J
  - [x] Koch track (13 lessons): Koch Method 1-13 full progression
  - [x] LICW track (6 lessons): Long Island CW Club method
  - [x] Numbers track (3 lessons): 0-4, 5-9, All 0-9
  - [x] Review track (1 lesson): A-Z Full Alphabet
  - [x] Common track (5 lessons): All letters, all digits, letters+digits, common words, Q-codes
  - [x] Prosigns track (2 lessons): Basic + Extended prosigns
  - [x] Abbreviations track (3 lessons): Q-codes, abbreviations, callsigns
  - [x] Confusing Pairs track (6 lessons): E/T, I/S, H/5, D/B, G/7, M/N focused drills
  - [x] **Acceptance:** 42 lessons available, organized by Learning Plans, users can multiselect

### Practice Setup UX ✅

### Live Input Decode & Speed Feedback ✅

- [x] Add a dedicated Key Decode screen to Home navigation
- [x] Support straight-key input via keyboard and touch key
- [x] Support dual-paddle input with Iambic A/B selection
- [x] Show live Morse decoding, transcript, and pattern feedback while keying
- [x] Add sidetone while keying for a more realistic feel
- [x] Track character speed and show last/average WPM feedback
- [x] Acceptance: users can practice sending CW and immediately see decoded characters plus speed feedback


- [x] **Organize Practice Setup by Learning Plans**
  - [x] Extract unique learning paths from lesson data
  - [x] Implement dropdown to select Learning Plan
  - [x] Display lessons for selected plan below
  - [x] **Acceptance:** Dropdown shows Koch, LICW, Full Character Set, etc.; lessons group under each

- [x] **Implement multiselect lesson interface**
  - [x] Allow users to click multiple lessons
  - [x] Combine character sets from selected lessons
  - [x] Show combined character preview
  - [x] Replace old button-grid UI
  - [x] **Acceptance:** Users can select "Koch 1 + Koch 2 + Q-codes" and practice mixed set

- [x] **Add custom character input as alternative**
  - [x] Text input field for manual character entry
  - [x] Toggle between lesson selection and custom input
  - [x] Validate characters exist in Morse library
  - [x] **Acceptance:** Users can enter "EISH" or "ABC123" for custom practice

### Core Architecture Extraction ✅

- [x] **Create core Morse engine structure** → Completed 2026-07-01
  - [x] Create src/core/ folder hierarchy
  - [x] Move morseTiming.js calculations to pure functions (no React dependency)
  - [x] Extract character encoding to standalone module
  - [x] Create session generator (no UI coupling)
  - [x] **Acceptance:** Core modules have zero imports from app/src/components/

- [x] **Add unit tests for core engine** → Completed 2026-07-01
  - [x] Test timing calculations (dit/dah/space durations at various WPM)
  - [x] Test Farnsworth timing math
  - [x] Test character-to-morse encoding
  - [x] Test morse-to-character decoding
  - [x] **Acceptance:** >90% test coverage for src/core/

- [x] **Document core engine API** → Completed 2026-07-01
  - [x] Write timingCalculator.md explaining timing math
  - [x] Write charsetCodec.md explaining encoding format
  - [x] Write sessionBuilder.md API reference
  - [x] **Acceptance:** Another developer can use core without touching React

### Adaptive Learning Foundation

- [x] **Add per-character accuracy tracking** → Completed 2026-07-02
  - [x] Store accuracy for each character across all sessions
  - [x] Track rolling accuracy (last 10, 50, 100 exposures)
  - [x] Flag characters <80% as "weak"
  - [x] **Acceptance:** Progress screen shows per-character accuracy heatmap

- [x] **Implement weak character detection** → Completed 2026-07-02
  - [x] Identify characters below threshold automatically
  - [x] Create automatic "Weak Character Practice" session
  - [x] Increase frequency of weak characters in standard lessons
  - [x] **Acceptance:** User can click "Practice Weak Characters" and drill specific chars

- [x] **Add character confusion detection** → Completed 2026-07-02
  - [x] Identify common confusion pairs (E/T, S/H, etc.)
  - [x] Log when user misidentifies one char as another
  - [x] Show confusion patterns in Progress screen
  - [x] **Acceptance:** User sees "Often confuse E with T" on Progress

### Pi Kiosk & Exit Flow

- [ ] **Implement startup cancel-to-desktop**
  - [ ] Create pre-launch screen (Python/Node + Tkinter or browser)
  - [ ] Show 10-second countdown timer
  - [ ] Add large "Cancel to Desktop" button
  - [ ] On cancel: stop service, exit to Pi desktop
  - [ ] On timeout: launch Chromium + Docker service
  - [ ] **Acceptance:** User never feels trapped after Pi boot; can exit before app loads

- [ ] **Improve Exit-to-Desktop flow**
  - [ ] Detect if running in kiosk mode vs. normal browser
  - [ ] Make Exit button reliably close app and return to desktop
  - [ ] Add fallback "Force Exit" if normal close fails
  - [ ] **Acceptance:** Exit works >90% of the time on first click

### User Onboarding

- [ ] **Create first-launch tutorial**
  - [ ] Show 2-3 screen intro (home, what is Dit Dit, how to practice)
  - [ ] Explain "Listen for the rhythm, not the dots and dashes"
  - [ ] Introduce Didah Method philosophy
  - [ ] Auto-advance tutorial on first visit only
  - [ ] **Acceptance:** New user sees tutorial, understands basic workflow

- [ ] **Add learning guidance on Home screen**
  - [ ] Show "Recommended Next Lesson" based on progress
  - [ ] Display "Daily Recommendation"
  - [ ] Include "Tip of the Day" mini-help
  - [ ] **Acceptance:** User can understand what to practice next without confusion

### Quality & Testing

- [ ] **Set up test infrastructure**
  - [ ] Add Vitest or Jest to app/
  - [ ] Create tests/ folder with example tests
  - [ ] Configure coverage reporting
  - [ ] Add pre-commit test validation
  - [ ] **Acceptance:** npm run test passes with >80% coverage target

- [ ] **Add error handling & recovery**
  - [ ] Catch localStorage quota exceeded errors
  - [ ] Handle audio API failures gracefully
  - [ ] Show user-friendly error messages (no stack traces)
  - [ ] Add "Report a Problem" button in Settings
  - [ ] **Acceptance:** App doesn't crash when localStorage is disabled or audio unavailable

- [ ] **Add performance validation**
  - [ ] Measure app load time on Pi (target <2s)
  - [ ] Measure audio playback latency (target <100ms)
  - [ ] Set bundle size budget
  - [ ] **Acceptance:** Performance meets targets, logged in app metrics

### Documentation

- [ ] **Update user documentation**
  - [ ] Write "Getting Started" guide (1-2 pages)
  - [ ] Document keyboard shortcuts (Space, Enter, etc.)
  - [ ] Explain WPM vs. Farnsworth timing
  - [ ] Add troubleshooting section
  - [ ] **Acceptance:** New user can learn to use app from docs

---

## Phase 2: Learning Intelligence (Weeks 5–8)

**Goal:** Add adaptive learning engine that personalizes practice, implement spaced repetition, improve audio quality.

### Spaced Repetition

- [x] **Implement spaced repetition algorithm (SM-2 or Leitner)**
  - [x] Track per-character: easeFactor, interval, repetitions, nextReview
  - [x] Schedule character reviews based on performance
  - [x] Increase interval on success, decrease on failure
  - [x] Create daily review deck from due items
  - [x] **Acceptance:** Characters show in practice with correct spacing; review status visible in Progress

- [x] **Add "Due for Review" indicator**
  - [x] Show count of characters due today on Home screen
  - [x] Create "Daily Review" quick-start option
  - [x] Track which characters user practiced today
  - [x] **Acceptance:** User can see "3 characters due for review today" and practice them

### Dynamic Difficulty Adjustment

- [x] **Implement dynamic speed adjustment**
  - [x] Increase WPM when session accuracy >95%
  - [x] Decrease WPM when accuracy <70%
  - [x] Adjust gradually (±1-2 WPM per session)
  - [x] Show speed recommendation on Results screen
  - [x] **Acceptance:** User's speed gradually increases as they improve

- [x] **Dynamic character set adjustment**
  - [x] Add more confusing characters when mastery is high
  - [x] Reduce character set when user struggling
  - [x] Adjust Farnsworth timing based on performance
  - [x] **Acceptance:** Practice feels "just right" difficulty-wise

### New Practice Modes

- [x] **Implement Copy Mode (user types what they hear)**
  - [x] Show input field or on-screen keyboard
  - [x] Play Morse, user types character
  - [x] Score accuracy and timing
  - [x] Support both keyboard and touch input
  - [x] **Acceptance:** User can select Copy Mode and complete practice session

- [x] **Create Speed Ladder drills**
  - [x] Same lesson, increasing WPM per round
  - [x] Show current WPM on screen
  - [x] Stop when accuracy falls below threshold
  - [x] Display final WPM achieved
  - [x] **Acceptance:** User can run speed ladder, see how high they can go

### Audio Improvements

- [ ] **Improve tone quality (eliminate clicks/pops)**
  - [x] Add attack/decay envelope (fade-in, fade-out)
  - [x] Smooth ramp-up/ramp-down of tone
  - [ ] Test audio on Pi speakers and desktop
  - [ ] **Acceptance:** No audible clicks at start/end of tones

- [ ] **Add audio envelope controls**
  - [x] Allow users to adjust attack (0-50ms)
  - [x] Allow users to adjust decay (0-50ms)
  - [ ] Preview tone when changing settings
  - [x] **Acceptance:** User can customize tone envelope in Settings

- [ ] **Add frequency randomization option**
  - [x] Optional +/- 50Hz per character (simulates real QSB)
  - [x] Include frequency variation practice mode
  - [x] **Acceptance:** User can enable frequency variation in Settings

### Progress Screen Enhancements

- [x] **Add accuracy trend graph**
  - [x] Display accuracy over time (last 10, 30, all-time sessions)
  - [x] Show trend line (improving/stable/declining)
  - [x] **Acceptance:** User can see if they're improving

- [x] **Add per-character mastery heatmap**
  - [x] Visual grid showing accuracy per character
  - [x] Color-code: green (strong), yellow (ok), red (weak)
  - [x] Click to drill that character
  - [x] **Acceptance:** User sees at a glance which chars need work

- [x] **Show learning streak**
  - [x] Consecutive days practiced
  - [x] Display on home screen and Progress
  - [x] **Acceptance:** Streak visible; user motivated to maintain it

### Motivation & Engagement

- [x] **Add streak tracking**
  - [x] Track consecutive days with at least one practice session
  - [x] Show current streak on Home screen
  - [x] Display longest streak in Progress
  - [x] **Acceptance:** Streak displays correctly; updates daily

- [ ] **Create achievement system (Phase 2 starter pack)**
  - [x] First session complete
  - [x] 10 sessions complete
  - [x] First perfect session (100%)
  - [x] Master a character (100% last 20 exposures)
  - [x] Reach 20 WPM
  - [x] Display earned badges in Progress screen
  - [x] **Acceptance:** User earns 1-2 achievements in normal use; sees them

---

## Phase 3: Polish & Engagement (Weeks 9–12)

**Goal:** Improve UX, add engagement features, accessibility, better progress insights.

### Visual & UX Polish

- [ ] **Add success animation on correct answers**
  - [ ] Subtle scale/glow effect or checkmark
  - [ ] Quick and pleasant (150-300ms)
  - [ ] No distraction from next question
  - [ ] **Acceptance:** Correct answer feels satisfying but not annoying

- [ ] **Add progress bar during character playback**
  - [ ] Visual indicator showing character duration
  - [ ] Updates in real-time as tone plays
  - [ ] **Acceptance:** User can see how long character is

- [ ] **Improve button states and feedback**
  - [ ] More obvious active/pressed state
  - [ ] Touch feedback (subtle color change)
  - [ ] Hover state on desktop
  - [ ] **Acceptance:** Users know they touched the button

### Settings & Customization

- [x] **Add theme selector (dark/light/high-contrast)**
  - [x] Store preference in localStorage
  - [x] Apply on next app load
  - [x] High-contrast option meets WCAG AAA
  - [x] **Acceptance:** User can choose theme; persists across sessions

- [ ] **Add keyboard shortcut customization**
  - [ ] Let user reassign Dit/Dah keys
  - [ ] Store preferences in Settings
  - [ ] Support custom layouts (Dvorak, etc. future)
  - [ ] **Acceptance:** User can change keys and use immediately

- [ ] **Create session length presets**
  - [x] Expand beyond current 5/10/15 to include 20, 30, 45, 60
  - [x] Add "Quick 2-minute" and "Marathon 100-char" options
  - [x] **Acceptance:** User can select various session lengths

- [ ] **Add accessibility options**
  - [x] Large text mode (1.5x-2x)
  - [x] Disable animations toggle
  - [x] Increase touch target size option
  - [x] **Acceptance:** Large text readable; animations off when disabled

### Results Screen Improvements

- [x] **Add visual accuracy gauge/dial**
  - [x] Show accuracy on prettier visual display (not just %)
  - [x] Color-code feedback (red <60%, yellow <85%, green ≥85%)
  - [x] **Acceptance:** Results feel more rewarding

- [x] **Surface specific improvement recommendations**
  - [x] "Practice these 3 characters next"
  - [x] Link directly to weak character practice
  - [x] **Acceptance:** User can immediately action recommendations

- [x] **Show streak continuation status**
  - [x] "Streak continues! 7 days in a row"
  - [x] Or "Streak lost. Start a new one today!"
  - [x] **Acceptance:** Streak status clear on Results

### Engagement Features

- [x] **Create daily challenges**
  - [x] Pre-configured session each day
  - [x] "Today's Challenge: 25 characters at 18 WPM"
  - [x] Reward completion with badge/streak bonus
  - [x] **Acceptance:** Challenge available daily; users engage

- [x] **Implement additional achievements**
  - [x] Complete Koch Method (all 40 characters)
  - [x] Reach 20/25/30 WPM
  - [x] Practice at 5am (early bird)
  - [x] 1000 total characters practiced
  - [x] 30-day streak
  - [x] **Acceptance:** 8+ achievements available; users see them

### Data & Privacy

- [ ] **Add data export (JSON/CSV)**
  - [x] Export all progress history as JSON
  - [x] Export session summary as CSV
  - [x] Include "Download my data" button in Settings
  - [x] **Acceptance:** User can download their data; file is complete and readable

- [ ] **Add import capability**
  - [x] Restore from previously exported JSON backup
  - [x] Validate file format before import
  - [x] Show confirmation before overwriting
  - [x] **Acceptance:** User can restore from backup

### Accessibility

- [ ] **Improve keyboard navigation**
  - [ ] Tab through all interactive elements in order
  - [ ] Enter/Space to activate buttons
  - [x] Number keys for answer choices
  - [ ] **Acceptance:** Keyboard-only user can complete full practice flow

- [ ] **Add ARIA labels & screen reader support**
  - [ ] All buttons have descriptive aria-label
  - [ ] Announce session progress changes
  - [ ] Speak correct/incorrect feedback
  - [ ] **Acceptance:** Screen reader user can understand session feedback

- [ ] **Ensure high contrast & large text support**
  - [ ] All text readable at 200% browser zoom
  - [ ] Touch targets remain 44x44px minimum
  - [ ] **Acceptance:** App accessible at large text sizes

### Documentation

- [ ] **Create learning philosophy guide**
  - [ ] Explain Didah Method approach
  - [ ] Tips for effective practice
  - [ ] FAQ section
  - [ ] **Acceptance:** User finds documentation helpful

- [ ] **Build developer onboarding**
  - [ ] Architecture overview diagram
  - [ ] How to add a new lesson
  - [ ] How to contribute a feature
  - [ ] **Acceptance:** New dev can make a PR with minimal guidance

---

## Phase 4: Advanced Features (Weeks 13+)

**Goal:** Advanced learning modes, hardware integration, community features.

### Advanced Practice Modes

- [ ] **Implement Send Mode (user taps dit/dah, system scores)**
  - [ ] Buttons for Dit and Dah
  - [ ] Score timing accuracy
  - [ ] Show correct vs. user-sent Morse
  - [ ] **Acceptance:** User can practice sending; accuracy scored

- [ ] **Create Conversation/QSO Mode**
  - [ ] Simulated two-way CW exchange
  - [ ] Common phrases (CQ, DE, RST, etc.)
  - [ ] User responds to prompts
  - [ ] **Acceptance:** User can practice realistic QSO flow

- [ ] **Add QRM/Noise Simulation**
  - [ ] Optional background noise in practice
  - [ ] Adjustable noise level
  - [ ] Simulates real on-air conditions
  - [ ] **Acceptance:** User can practice in noisy conditions

- [ ] **Implement Head Copy training**
  - [ ] No visual confirmation until sentence end
  - [ ] User types or listens without typing
  - [ ] **Acceptance:** User can do pure head copy practice

### Hardware Integration

- [ ] **Add GPIO key/paddle input (Pi)**
  - [ ] Detect hardware key presses
  - [ ] Support straight key input
  - [ ] Map to Dit/Dah appropriately
  - [ ] **Acceptance:** Hardware key produces Dit/Dah

- [ ] **Implement paddle support (future)**
  - [ ] Iambic paddle keying
  - [ ] Proper timing and character completion
  - [ ] **Acceptance:** Paddle produces proper keying

### Community & Social (Optional)

- [ ] **Add anonymous usage analytics (opt-in)**
  - [ ] Track lesson popularity
  - [ ] Monitor session completion rates
  - [ ] Identify drop-off points
  - [ ] **Acceptance:** Product decisions informed by real usage

- [ ] **Implement achievement sharing (future)**
  - [ ] User can share achievements
  - [ ] Show completion badge on socials
  - [ ] **Acceptance:** Users motivated to share progress

### Integration

- [ ] **CW Ops/CW Academy integration (future)**
  - [ ] Import lesson plans
  - [ ] Sync progress to external platform
  - [ ] **Acceptance:** User can import external lessons

---

## Tracking & Updates

### How to Use This Checklist

1. **Weekly Review:** Check items off as they're completed
2. **Monthly Review:** Reassess priorities based on user feedback
3. **Phase Handoff:** When phase completes, archive and publish release notes
4. **Keep Current:** Update dates and status regularly

### Template for Completed Item

When marking a task complete:

```
- [x] **Task Name** → Completed YYYY-MM-DD
  - PR: link to PR if applicable
  - Branch: merged to main
  - Note: any relevant follow-ups or related tasks
```

### Known Blockers & Dependencies

- GPIO support blocked until Pi hardware testing complete
- Community features depend on hosted backend (future phase)
- Some Phase 3 items may move to Phase 2 if resources allow

---

## Success Metrics (By End of Phase 3)

| Metric | Target |
|--------|--------|
| App load time on Pi | <2s |
| Audio latency | <100ms |
| Test coverage | >80% |
| Characters available | 40+ lessons |
| Core engine extraction | Zero React imports |
| Daily active users | TBD (baseline + 50%) |
| Average session length | 12 minutes |
| 7-day retention | 60% |
| User satisfaction (NPS) | >40 |

---

**Last Reviewed:** July 1, 2026  
**Next Review:** July 8, 2026  
**Owner:** W5XY Labs / Dit Dit Project
