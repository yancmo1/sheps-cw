# Dit Dit – Design Review & Improvement Recommendations

**Review Date:** June 29, 2026  
**Reviewer:** GitHub Copilot  
**Version:** Based on current app/ implementation  
**Status:** Early-stage foundation review

---

## Executive Summary

Dit Dit has established a solid touch-first foundation with working practice sessions, local progress tracking, and Raspberry Pi deployment. The app successfully delivers on its initial goal of providing a clean, approachable interface for basic Morse code practice.

However, the current implementation is missing several critical components needed to become a comprehensive learning platform. This review identifies 40+ improvement opportunities across user experience, learning design, architecture, content, and platform features.

**Key Strengths:**
- Clean, touch-optimized interface
- Working browser-based Morse audio engine
- Local persistence for settings and progress
- Successful Pi deployment and kiosk mode
- Good architectural direction with separation of concerns
- Accessible missed-character practice loop

**Critical Gaps:**
- No adaptive learning or intelligent progression
- Limited lesson content (only 4 basic character sets)
- Missing onboarding and learning guidance
- No core Morse engine extracted from UI
- Limited feedback and motivation mechanics
- Incomplete kiosk/appliance experience

---

## Current State Assessment

### What Works Well

1. **Touch-First Design:** Large buttons, clear typography, and generous spacing work well for 7-inch touchscreens
2. **Simple Practice Flow:** Setup → Session → Results → Repeat is intuitive
3. **Local-First Approach:** No backend dependency; data lives on device
4. **Progress Tracking Foundation:** Basic statistics and session history provide meaningful feedback
5. **Docker + Pi Integration:** Clean deployment story with working kiosk launcher
6. **Missed Character Loop:** Immediate follow-up practice on weak characters is valuable

### Critical Limitations

1. **No Learning Progression:** No curriculum, no adaptive difficulty, no skill tree
2. **Minimal Content:** Four character sets insufficient for beginner-to-proficient journey
3. **No User Guidance:** First-time users receive no orientation or learning strategy
4. **Monolithic UI Logic:** Core Morse timing and learning logic still embedded in React components
5. **Limited Audio Control:** No pitch variation, tone shaping, or noise/QRM simulation
6. **Incomplete Kiosk Flow:** Missing startup cancel-to-desktop and proper exit handling
7. **No Motivation System:** No streaks, achievements, or learning milestones
8. **Static Lessons:** No spaced repetition, no dynamic difficulty adjustment

---

## Recommended Improvements

### 1. Learning Design & Pedagogy

#### 1.1 Implement Learning Curriculum

**Priority:** 🔴 Critical  
**Effort:** High  
**Impact:** Transformative

Create a structured learning path that guides users from absolute beginner to proficient operator.

**Specific Actions:**
- Implement Koch Method progression (standard 40-character sequence)
- Add Long Island CW Club (LICW) lesson plans as alternate path
- Create character introduction lessons (one new character at a time)
- Build character mixing lessons (gradual integration)
- Add common word practice (THE, AND, FOR, etc.)
- Include callsign practice (W1ABC format recognition)
- Create Q-code lessons (QSO, QTH, QRM, etc.)
- Add prosign training (AR, SK, BT, etc.)

**Success Metrics:**
- User can follow clear path from E/T to full alphabet + numbers
- Each lesson builds measurably on previous content
- Users understand "why this, then that" progression logic

#### 1.2 Build Adaptive Learning Engine

**Priority:** 🔴 Critical  
**Effort:** High  
**Impact:** Transformative

Move from static lessons to intelligent, personalized practice.

**Specific Actions:**
- Track per-character accuracy over time (last 10, 50, 100 exposures)
- Identify weak characters automatically
- Increase frequency of weak characters in practice
- Implement spaced repetition algorithm (SM-2 or simpler variant)
- Adjust character introduction timing based on mastery
- Create dynamic "review deck" from historical misses
- Add confidence scoring (not just right/wrong)
- Build character confusion detection (common pairs: E/T, S/H, etc.)

**Success Metrics:**
- Users spend more time on characters they struggle with
- Overall accuracy improves session-over-session
- Weak characters strengthen measurably over 5-10 sessions

#### 1.3 Introduce Learning Modes Beyond Identify

**Priority:** 🟡 High  
**Effort:** Medium  
**Impact:** High

Expand practice variety to match real-world CW usage.

**Specific Actions:**
- **Copy Mode:** User types what they hear (keyboard or on-screen)
- **Send Mode:** User taps dit/dah buttons; system scores timing
- **Conversation Mode:** Simulated QSO with common exchanges
- **Speed Ladder:** Gradual WPM increase within single session
- **QRM Practice:** Add noise/interference to audio
- **Fading Practice:** Character volume fades in/out randomly
- **Head Copy:** No visual confirmation until end of sentence
- **Blind Send:** User sends without hearing their own audio (future hardware)

**Success Metrics:**
- Users engage with 2+ practice modes per week
- Mode variety correlates with faster skill acquisition
- Users report feeling more prepared for on-air operation

#### 1.4 Add Learning Guidance & Onboarding

**Priority:** 🟡 High  
**Effort:** Medium  
**Impact:** High

Help new users understand what to do and why.

**Specific Actions:**
- Create first-launch tutorial (2-3 screens)
- Explain "Listen for the rhythm, not the dots and dashes"
- Introduce Didah Method philosophy inline
- Add "Daily Recommendation" on home screen
- Show suggested next lesson based on progress
- Include tips screen with learning strategies
- Add tooltips/hints for settings (WPM, Farnsworth)
- Create help screen with common questions
- Explain Koch vs. LICW vs. custom paths

**Success Metrics:**
- First-time users complete at least one practice session
- Users understand Farnsworth timing purpose
- Fewer abandoned sessions in first week

---

### 2. User Experience & Interface

#### 2.1 Improve Visual Feedback & Animation

**Priority:** 🟡 High  
**Effort:** Low-Medium  
**Impact:** Medium

Make the app feel more responsive and alive.

**Specific Actions:**
- Add success animation on correct answers (subtle scale/glow)
- Show progress bar during character playback
- Animate lesson transitions (fade/slide)
- Add sound toggle with visual indicator
- Show "loading" state when audio is preparing
- Add tactile feedback hints (suggest vibration on future hardware)
- Improve button press states (more obvious active state)
- Add subtle background patterns or texture

**Success Metrics:**
- Users report app feels more polished
- Touch interactions feel more responsive
- Engagement time increases slightly

#### 2.2 Enhance Practice Session Screen

**Priority:** 🟡 High  
**Effort:** Medium  
**Impact:** Medium

Improve the core practice loop with better context and controls.

**Specific Actions:**
- Show real-time accuracy percentage during session
- Add optional hints (show first dit/dah as clue)
- Display recently practiced characters at top
- Add pause/resume capability
- Show timer for Listen Only mode reps
- Improve auto-advance UX (show countdown indicator)
- Add "I don't know" skip option (counts as miss)
- Display keyboard shortcuts prominently for desktop

**Success Metrics:**
- Users complete more sessions per visit
- Fewer mid-session exits
- Users use hints strategically, not as crutch

#### 2.3 Redesign Progress Screen

**Priority:** 🟢 Medium  
**Effort:** Medium  
**Impact:** Medium

Transform basic stats into meaningful learning insights.

**Specific Actions:**
- Add progress graph (accuracy over time)
- Show per-character mastery heatmap
- Display learning streak (consecutive days)
- Highlight improvement areas vs. mastery areas
- Add "weak character" quick-practice shortcut
- Show session completion rate (finished vs. abandoned)
- Add time-of-day practice patterns
- Include character exposure count (total times heard)
- Show learning velocity (characters mastered per week)

**Success Metrics:**
- Users check Progress screen 2x more often
- Users can clearly identify their weak spots
- Progress visualization motivates continued practice

#### 2.4 Expand Settings & Customization

**Priority:** 🟢 Medium  
**Effort:** Low-Medium  
**Impact:** Medium

Give users more control over practice experience.

**Specific Actions:**
- Add theme selector (dark/light/high-contrast)
- Include audio envelope controls (attack/decay shaping)
- Add keyboard shortcut customization
- Allow WPM range presets (beginner/intermediate/advanced)
- Include session length presets beyond 5/10/15
- Add "challenge mode" toggles (faster speed, no hints)
- Allow character set customization (build your own lesson)
- Include left-handed mode (rearrange touch targets)
- Add screen timeout prevention toggle for Pi

**Success Metrics:**
- Users adjust at least one setting beyond defaults
- Customization correlates with longer retention
- Advanced users appreciate fine-grained control

#### 2.5 Improve Results Screen Actionability

**Priority:** 🟢 Medium  
**Effort:** Low  
**Impact:** Medium

Make post-session choices more obvious and valuable.

**Specific Actions:**
- Add visual accuracy dial/gauge (not just percentage)
- Show comparison to previous session
- Highlight personal best achievements
- Surface specific character improvement recommendations
- Add "Practice these 3 characters next" suggestion
- Include session replay option (listen to mistakes)
- Show streak continuation status
- Add share/export summary option (future)

**Success Metrics:**
- Users click "Practice Missed" 3x more often
- Post-session engagement time increases
- Users follow suggested next actions

---

### 3. Content & Lessons

#### 3.1 Expand Character Set Coverage

**Priority:** 🔴 Critical  
**Effort:** Low  
**Impact:** High

Move from 11 characters to full Morse alphabet.

**Specific Actions:**
- Add all 26 letters
- Include 0-9 digits
- Add prosigns (AR, SK, BT, AS, KN)
- Include punctuation (. , ? / = +)
- Add common abbreviations (TNX, 73, 88, etc.)
- Create special character lessons (@, $, etc.)

**Success Metrics:**
- Users can practice any character they want
- Comprehensive coverage supports diverse learning goals

#### 3.2 Create Structured Lesson Library

**Priority:** 🔴 Critical  
**Effort:** High  
**Impact:** High

Replace flat 4-lesson list with categorized, progressive library.

**Specific Actions:**
- **Beginner Track:** Koch 1-10, Koch 11-20, Koch 21-30, Koch 31-40
- **LICW Track:** LICW Lesson 1-12 (authentic didah method)
- **Numbers Only:** 0-9 isolated practice
- **Letters Only:** A-Z isolated practice  
- **Common Words:** THE, AND, TO, FOR, IS, etc.
- **Callsigns:** W1ABC, K2XYZ, VE3, G4, etc.
- **Q-Codes:** QSO, QTH, QRM, QRN, QRZ, etc.
- **Abbreviations:** CQ, DE, 73, 88, TNX, etc.
- **Prosigns:** AR, SK, BT, AS, KN, etc.
- **Challenging Pairs:** E/T, I/S, H/5, etc.
- **Speed Drills:** Same lesson at increasing WPM

**Data Structure:**
```javascript
{
  id: 'koch-01',
  name: 'Koch Method - Lesson 1',
  category: 'Beginner',
  sequence: 1,
  characters: ['K', 'M'],
  description: 'Start with two distinct sounds',
  prerequisite: null,
  recommendedWPM: 20,
  recommendedFarnsworth: 15,
}
```

**Success Metrics:**
- 40+ structured lessons available
- Users can follow clear curriculum path
- Lessons align with recognized teaching methods

#### 3.3 Add Lesson Metadata & Guidance

**Priority:** 🟢 Medium  
**Effort:** Low  
**Impact:** Medium

Help users choose appropriate lessons.

**Specific Actions:**
- Add difficulty ratings (1-5 stars)
- Include estimated completion time
- Show prerequisite lessons
- Display lesson objectives
- Add teacher notes/tips per lesson
- Include recommended settings
- Show completion rate across all users (future)

**Success Metrics:**
- Users select lessons that match skill level
- Fewer frustrated beginners in advanced content
- Clearer learning path visibility

---

### 4. Audio & Morse Engine

#### 4.1 Extract Core Morse Engine

**Priority:** 🔴 Critical  
**Effort:** High  
**Impact:** Architectural

Move Morse logic out of React components into reusable core.

**Specific Actions:**
- Create standalone `@ditdit/morse-engine` package
- Extract timing calculations to pure functions
- Move character encoding/decoding to core
- Build session generator in core (no React dependency)
- Create pluggable audio interface
- Design testable, hardware-agnostic API
- Add comprehensive unit test coverage
- Document core engine API

**Target Structure:**
```
src/
  core/
    timing/
      timingCalculator.js
      farnsworthTiming.js
    encoding/
      morseCodec.js
      characterMapping.js
    session/
      sessionBuilder.js
      itemGenerator.js
      resultCalculator.js
    learning/
      adaptiveEngine.js
      spacedRepetition.js
      weaknessDetection.js
```

**Success Metrics:**
- Core engine has zero UI dependencies
- Same engine powers app/, Pi, future hardware
- Test coverage >90% on core modules
- Other developers can integrate engine independently

#### 4.2 Improve Audio Quality & Control

**Priority:** 🟡 High  
**Effort:** Medium  
**Impact:** Medium

Make Morse tones more pleasant and realistic.

**Specific Actions:**
- Add tone shaping (attack/decay envelope)
- Implement smoother ramp-up/ramp-down (reduce clicks)
- Add frequency randomization option (+/- 50Hz per character)
- Include pitch variation practice mode
- Add optional background noise/QRM simulation
- Support multiple tone profiles (sine, square, filtered)
- Allow stereo panning for future two-operator practice
- Add volume normalization across different frequencies

**Success Metrics:**
- No audible clicks or pops during playback
- Tone sounds more natural and radio-like
- Users report improved audio quality

#### 4.3 Add Timing Validation & Tuning

**Priority:** 🟢 Medium  
**Effort:** Medium  
**Impact:** Medium

Ensure timing calculations match real-world expectations.

**Specific Actions:**
- Validate against ARRL timing standards
- Add timing debug mode (show actual vs. expected ms)
- Include timing profile comparison tool
- Support Paris/Codex timing standards
- Add inter-character spacing customization
- Include inter-word spacing adjustment
- Create timing accuracy test suite
- Document timing calculation formulas

**Success Metrics:**
- Timing matches ARRL specifications ±5%
- Users familiar with CW confirm accuracy
- Farnsworth timing functions correctly at all speeds

---

### 5. Adaptive Learning & Intelligence

#### 5.1 Implement Spaced Repetition

**Priority:** 🔴 Critical  
**Effort:** High  
**Impact:** Transformative

Use proven memory science to optimize practice.

**Specific Actions:**
- Implement SM-2 algorithm (or simpler Leitner system)
- Track per-character repetition intervals
- Schedule character reviews based on performance
- Increase interval on success, decrease on failure
- Create daily review deck from due items
- Show "due for review" count on home screen
- Add optional email/notification reminders (future)

**Algorithm Sketch:**
```javascript
// Per-character state
{
  character: 'A',
  easeFactor: 2.5,
  interval: 1, // days
  repetitions: 0,
  nextReview: '2026-06-30T00:00:00Z',
  lastReview: '2026-06-29T14:23:00Z',
}
```

**Success Metrics:**
- Characters stick in long-term memory better
- Users report less "forgetting" of early lessons
- Daily review completion correlates with retention

#### 5.2 Build Character Weakness Detection

**Priority:** 🟡 High  
**Effort:** Medium  
**Impact:** High

Automatically identify and prioritize problem areas.

**Specific Actions:**
- Track rolling accuracy per character (last 10, 50, 100)
- Flag characters below 80% accuracy as "weak"
- Detect character confusion pairs (E/T, H/5, B/6)
- Increase practice frequency for weak characters
- Create automatic remediation lessons
- Show weakness trends over time
- Add "focus mode" that drills only weak characters

**Success Metrics:**
- Weak characters identified accurately
- Targeted practice improves weak character accuracy
- Users see measurable improvement in problem areas

#### 5.3 Implement Dynamic Difficulty Adjustment

**Priority:** 🟢 Medium  
**Effort:** Medium  
**Impact:** High

Automatically adjust practice difficulty to challenge without frustration.

**Specific Actions:**
- Track session-level accuracy trends
- Increase speed when accuracy consistently >95%
- Decrease speed when accuracy drops below 70%
- Add more confusing characters when mastery is high
- Reduce character set when user is struggling
- Adjust Farnsworth timing based on performance
- Create "flow state" optimization (keep in 80-95% range)

**Success Metrics:**
- Users stay engaged (not bored, not frustrated)
- Speed progression happens automatically
- Users report practice feels "just right" difficulty

---

### 6. Motivation & Engagement

#### 6.1 Add Streak & Milestone Tracking

**Priority:** 🟡 High  
**Effort:** Low-Medium  
**Impact:** Medium

Encourage consistent daily practice.

**Specific Actions:**
- Track consecutive days practiced
- Show current streak on home screen
- Celebrate streak milestones (7, 30, 100 days)
- Add "streak freeze" for one missed day (earn through practice)
- Show longest streak in Progress screen
- Include streak continuation reminder if broken
- Add calendar view showing practice days

**Success Metrics:**
- Daily active users increase 30%
- 7-day streak completion rate doubles
- Users cite streaks as motivation factor

#### 6.2 Create Achievement System

**Priority:** 🟢 Medium  
**Effort:** Medium  
**Impact:** Medium

Recognize learning milestones and accomplishments.

**Specific Actions:**
- Award badges for milestones:
  - First session complete
  - 10 sessions complete
  - First perfect session (100%)
  - Master a character (100% last 20 exposures)
  - Complete Koch Method
  - Reach 20 WPM
  - Practice at 5am (early bird)
  - 1000 total characters practiced
  - etc.
- Show achievement gallery in Progress screen
- Add subtle notifications when earned
- Include rarity indicators (% of users who have it)

**Success Metrics:**
- Users complete more sessions to unlock achievements
- Achievement screen visited frequently
- Users report feeling recognized for progress

#### 6.3 Add Session Variety & Challenges

**Priority:** 🟢 Medium  
**Effort:** Medium  
**Impact:** Medium

Keep practice fresh and engaging.

**Specific Actions:**
- **Daily Challenge:** Pre-configured session each day
- **Speed Ladder:** Gradual WPM increase, see how high you can go
- **Perfect Session:** Practice until 100% accuracy achieved
- **Time Trial:** Max characters in 2 minutes
- **Endurance Mode:** 50-100 character marathon
- **Random Mode:** Surprise lesson + settings
- **Boss Fight:** Extra difficult session (low WPM, high Farnsworth, confusing characters)

**Success Metrics:**
- Users engage with challenges weekly
- Challenges correlate with faster skill growth
- Users report more fun and variety

---

### 7. Raspberry Pi & Kiosk Experience

#### 7.1 Implement Startup Cancel Flow

**Priority:** 🟡 High  
**Effort:** Medium  
**Impact:** High (Pi users)

Prevent user from feeling trapped after Pi boot.

**Specific Actions:**
- Create Python/Node pre-launch screen
- Show countdown timer (10 seconds)
- Include large "Cancel to Desktop" button
- If canceled, stop service and exit to Pi desktop
- If not canceled, launch Chromium kiosk + Docker service
- Add desktop shortcut for manual launch
- Include systemd service for auto-start (optional)

**Technical Notes:**
- Use Tkinter or PyQt for pre-launch GUI
- Integrate with systemd start flow
- Provide escape hatch via keyboard combo (Ctrl+Alt+D)

**Success Metrics:**
- Users never feel trapped
- Support requests about "can't exit" drop to zero
- Pi boots smoothly into training or desktop

#### 7.2 Improve Exit-to-Desktop Flow

**Priority:** 🟡 High  
**Effort:** Low-Medium  
**Impact:** High (Pi users)

Make exiting to desktop more reliable.

**Specific Actions:**
- Detect if running in kiosk vs. normal browser
- If kiosk, attempt `window.close()` + signal to launcher script
- Launcher script listens for exit signal via file/socket
- Launcher closes Chromium and stops Docker service
- Show clear instructions if auto-close fails
- Add "Force Exit" button that definitely works
- Include desktop shortcut for manual service stop

**Success Metrics:**
- Exit works first try >90% of time
- Users understand what to do if auto-exit fails
- No confused users stuck in app

#### 7.3 Add Pi-Specific Optimizations

**Priority:** 🟢 Medium  
**Effort:** Medium  
**Impact:** Medium (Pi users)

Optimize for Raspberry Pi hardware constraints.

**Specific Actions:**
- Reduce asset sizes (optimize images, fonts)
- Lazy-load non-critical components
- Add touchscreen calibration helper
- Implement screen rotation support
- Add brightness control in settings
- Include low-power mode (reduce animations)
- Disable unnecessary browser features in kiosk
- Add device info screen (IP address, storage, etc.)

**Success Metrics:**
- App loads faster on Pi
- No performance lag during practice
- Battery life improves if Pi is portable

---

### 8. Data & Analytics

#### 8.1 Enhance Local Data Model

**Priority:** 🟢 Medium  
**Effort:** Low-Medium  
**Impact:** Medium

Make stored data more queryable and useful.

**Specific Actions:**
- Add session tags (morning, evening, review, challenge)
- Include device identifier (for multi-device future)
- Store per-item response time (speed of answer)
- Track session abandonment reason (explicit end vs. close)
- Add lesson completion percentage
- Include settings snapshot per session
- Store character exposure timestamps
- Add user notes field for sessions

**Success Metrics:**
- Richer progress insights available
- Data supports future analytics features
- Export/backup more valuable

#### 8.2 Add Data Export & Backup

**Priority:** 🟢 Medium  
**Effort:** Low  
**Impact:** Medium

Let users own and preserve their data.

**Specific Actions:**
- Export progress as JSON
- Export progress as CSV for spreadsheet analysis
- Create human-readable summary report (PDF future)
- Add import capability (restore from backup)
- Include "Download my data" button in Settings
- Show storage usage statistics
- Add automatic backup reminder (monthly)

**Success Metrics:**
- Users feel ownership of their data
- Data loss scenarios reduced
- Power users analyze their own data

#### 8.3 Implement Anonymous Usage Analytics (Optional)

**Priority:** 🟣 Low  
**Effort:** Medium  
**Impact:** Low-Medium (product improvement)

Understand how real users interact with app.

**Specific Actions:**
- Track lesson popularity (which are practiced most)
- Monitor session completion rate
- Measure feature adoption (auto-advance, hints, etc.)
- Identify common drop-off points
- Collect crash/error reports (if any)
- Respect privacy: fully anonymous, opt-in, local-first

**Success Metrics:**
- Product decisions informed by real usage
- Features that aren't used get removed/improved
- User pain points identified quickly

---

### 9. Accessibility & Inclusion

#### 9.1 Improve Keyboard Navigation

**Priority:** 🟡 High  
**Effort:** Low  
**Impact:** Medium

Support users who prefer or require keyboard control.

**Specific Actions:**
- Add clear keyboard shortcut guide
- Ensure all buttons have keyboard access
- Add number key shortcuts for answer choices
- Include Space = play again, Enter = next
- Show shortcuts on hover/focus
- Add keyboard shortcut customization
- Test with screen reader (announce shortcuts)

**Success Metrics:**
- Keyboard-only users can complete full practice flow
- Shortcuts feel intuitive
- Power users adopt keyboard controls

#### 9.2 Add Screen Reader Support

**Priority:** 🟢 Medium  
**Effort:** Medium  
**Impact:** Medium (accessibility)

Make app usable for visually impaired learners.

**Specific Actions:**
- Add ARIA labels to all interactive elements
- Announce session progress changes
- Speak correct/incorrect feedback
- Provide audio descriptions for visual info
- Test with VoiceOver (macOS) and NVDA (Windows)
- Add "screen reader mode" that optimizes flow
- Ensure skip navigation links exist

**Success Metrics:**
- App passes WCAG 2.1 AA standards
- Screen reader users complete practice sessions
- Blind users report app is usable

#### 9.3 Support High Contrast & Large Text

**Priority:** 🟢 Medium  
**Effort:** Low  
**Impact:** Medium (accessibility)

Accommodate visual impairments and preferences.

**Specific Actions:**
- Add high-contrast theme (WCAG AAA)
- Support browser zoom without breaking layout
- Include large text mode (1.5x-2x sizes)
- Test with color blindness simulators
- Ensure touch targets remain 44x44px minimum
- Add option to disable animations (vestibular issues)

**Success Metrics:**
- Users with low vision can read all text
- App works well at 200% browser zoom
- Color blind users distinguish feedback states

---

### 10. Testing & Quality

#### 10.1 Add Comprehensive Test Coverage

**Priority:** 🔴 Critical  
**Effort:** High  
**Impact:** High (technical quality)

Prevent regressions and ensure reliability.

**Specific Actions:**
- Unit tests for core engine (timing, encoding, session)
- Integration tests for audio playback
- Component tests for React screens
- End-to-end tests for practice flow
- Timing accuracy verification tests
- Browser compatibility tests
- Pi hardware integration tests
- Performance benchmarks (load time, audio latency)

**Target Coverage:**
- Core engine: >90%
- React components: >70%
- Integration flows: 100% of critical paths

**Success Metrics:**
- Bugs caught before reaching users
- Confidence in making changes
- Faster development velocity

#### 10.2 Implement Error Handling & Recovery

**Priority:** 🟡 High  
**Effort:** Low-Medium  
**Impact:** High

Gracefully handle failures instead of crashing.

**Specific Actions:**
- Catch localStorage errors (quota exceeded, disabled)
- Handle audio API failures (no audio device)
- Add fallback for Web Audio API (use HTML5 audio)
- Show friendly error messages, not stack traces
- Include "Report a Problem" button
- Add automatic error logging (local first)
- Create recovery suggestions per error type

**Success Metrics:**
- App doesn't crash on common errors
- Users know what to do when something fails
- Error reports include actionable info

#### 10.3 Add Performance Monitoring

**Priority:** 🟢 Medium  
**Effort:** Low  
**Impact:** Medium

Ensure app stays fast as features grow.

**Specific Actions:**
- Measure initial load time
- Track audio playback latency
- Monitor React render performance
- Add bundle size budgets
- Profile memory usage on Pi
- Set performance budgets (load <2s, audio <100ms latency)
- Add dev-mode performance warnings

**Success Metrics:**
- App loads in <2 seconds on Pi
- Audio playback feels instant (<100ms delay)
- No performance regressions over time

---

### 11. Documentation & Community

#### 11.1 Create User Documentation

**Priority:** 🟡 High  
**Effort:** Medium  
**Impact:** High

Help users get the most from Dit Dit.

**Specific Actions:**
- Write getting started guide
- Create learning philosophy explainer (Didah Method)
- Document keyboard shortcuts
- Explain WPM vs. Farnsworth timing
- Add tips for effective practice
- Include troubleshooting guide
- Create FAQ section
- Add video tutorials (future)

**Success Metrics:**
- Support questions decrease
- Users understand best practices
- Documentation visit rate >50% of users

#### 11.2 Build Developer Documentation

**Priority:** 🟢 Medium  
**Effort:** Medium  
**Impact:** Medium (future)

Enable others to contribute or integrate.

**Specific Actions:**
- Document core engine API
- Add architecture diagrams (update existing)
- Write contribution guide
- Create code style guide
- Document build and deployment process
- Add issue templates
- Include component storybook (future)

**Success Metrics:**
- Outside contributors can make PRs
- New team members onboard quickly
- Core engine can be used in other projects

---

## Implementation Priority Matrix

### Phase 1: Critical Foundation (Next 2-4 weeks)
🔴 Must-have for viable product

1. Expand to full character set (26 letters + 10 digits)
2. Create structured lesson library (40+ lessons)
3. Extract core Morse engine from UI
4. Implement basic adaptive learning (track weak characters)
5. Add comprehensive test coverage
6. Fix Pi startup cancel-to-desktop flow
7. Add user onboarding/first-run experience

### Phase 2: Learning Intelligence (4-8 weeks)
🟡 Essential for effective learning

8. Implement spaced repetition algorithm
9. Build character weakness detection
10. Add dynamic difficulty adjustment
11. Create copy mode (type what you hear)
12. Improve audio quality (tone shaping, no clicks)
13. Add streak tracking
14. Enhance progress screen with insights

### Phase 3: Polish & Engagement (8-12 weeks)
🟢 Valuable for retention

15. Add achievement system
16. Create daily challenges
17. Implement visual feedback improvements
18. Add theme customization
19. Build data export/backup
20. Improve keyboard navigation
21. Add screen reader support
22. Create send mode (user taps dit/dah)

### Phase 4: Advanced Features (12+ weeks)
🟣 Nice-to-have, future vision

23. Add QRM/noise simulation
24. Create conversation/QSO mode
25. Implement collaborative practice (two-operator)
26. Add hardware key input (GPIO)
27. Create speed ladder drills
28. Add community features (leaderboards, sharing)
29. Implement paddle support
30. Build CW Ops / CW Academy integration

---

## Design Philosophy Recommendations

### Maintain Touch-First, Pi-First Mindset

Continue optimizing for:
- 7-inch 1024x600 touchscreen
- Finger touch (not stylus or mouse)
- Direct, immediate feedback
- Minimal cognitive load during practice
- Approachable, friendly tone

### Preserve Local-First Architecture

Keep as core principle:
- No backend required for core functionality
- Data lives on device
- Offline-capable
- Privacy-respecting
- Fast, no network latency

### Build for Humans Learning Hard Skills

Remember users are:
- Frustrated beginners who want encouragement
- Intermediate learners who need challenge
- Advanced operators who want precision
- Hobbyists who practice for fun
- Real humans who forget and need reminders

### Stay True to Didah Method

Emphasize:
- Rhythm over dots-and-dashes
- Sound patterns over visual representation
- Listening skill over memorization
- Gradual, proven progression (Koch, LICW)
- Immediate, supportive feedback

---

## Success Metrics Summary

**Engagement:**
- Daily active users increase 50%
- Average session length increases to 12 minutes
- 7-day retention improves to 60%

**Learning Outcomes:**
- Users reach 20 WPM proficiency in 8-12 weeks
- Weak character accuracy improves 30% after targeted practice
- 80% of users report feeling confident in their skills

**Technical Quality:**
- App loads in <2 seconds on Pi
- Zero crashes in typical usage
- Test coverage >80% overall

**User Satisfaction:**
- Net Promoter Score >40
- App Store rating >4.5 stars (future)
- Positive Reddit/forum mentions

---

## Closing Recommendations

**Focus First On:**
1. **Content:** More lessons, more characters, clear curriculum
2. **Intelligence:** Adaptive learning that responds to user performance
3. **Motivation:** Streaks, achievements, progress visualization
4. **Core:** Extract engine from UI, add tests, ensure quality

**Avoid These Traps:**
- Feature bloat before foundation is solid
- Premature optimization (backend, cloud sync, etc.)
- Losing touch-first focus for desktop users
- Adding complexity that obscures core learning loop

**Validate Through:**
- Real Raspberry Pi testing with actual touchscreen
- Beginner user testing (watch first-time experience)
- Amateur radio operator feedback (is timing accurate?)
- Continuous data review (where do users struggle/drop off?)

---

**Next Steps:**
1. Review and prioritize these recommendations
2. Create detailed implementation plan for Phase 1
3. Set up test infrastructure before building new features
4. Begin lesson content creation in parallel with code
5. Schedule Pi hardware testing sessions

**Questions for Consideration:**
- Which learning method should be default? (Koch vs. LICW)
- Should adaptive learning be always-on or opt-in?
- What's the right balance between guidance and freedom?
- How much gamification is appropriate for serious learning tool?
- Should Dit Dit support multiple user profiles on one device?

---

*This design review is based on the current state of Dit Dit as of June 29, 2026. Priorities and recommendations should be continuously re-evaluated as the product evolves and user feedback is gathered.*

# Dit Dit – Design Review & Phased Improvement Roadmap

**Review Date:** June 29, 2026  
**Reviewer:** GitHub Copilot / Project Review  
**Version:** Based on current `app/` implementation  
**Status:** Early-stage foundation roadmap

---

## Purpose

This document captures product, learning, architecture, and Raspberry Pi improvement ideas for Dit Dit. It is intentionally organized as a phased roadmap, not a single implementation task.

The goal is to keep Dit Dit moving forward in small, reviewable steps while preserving the working app.

Dit Dit should remain:

- Touch-first
- Local-first
- Raspberry Pi friendly
- Beginner friendly
- Simple enough to maintain
- Focused on learning Morse by sound and rhythm

---

## Current State Summary

Dit Dit already has a useful early foundation:

- Working React/Vite app
- Touch-friendly dashboard and practice flow
- Listen & Identify mode
- Listen Only mode
- Practice missed characters flow
- Browser-based Morse audio playback
- Local settings and progress history
- Raspberry Pi deployment path
- Kiosk-oriented startup work
- Initial core/session logic extraction underway

The current app is no longer just a mockup. It is a working early product. Future work should protect that progress and avoid large rewrites.

---

## Guiding Principles

### 1. Small Moves First

Prefer small, reviewable changes over large architecture jumps.

Do not turn a roadmap item into a broad rewrite unless the app clearly needs it.

### 2. Core-First, But Not Over-Engineered

Move reusable practice/session logic into `app/src/core/` as needed.

Avoid creating a standalone package until there is a real need for reuse outside the app.

### 3. Preserve the Working Practice Loop

The core flow should continue working at all times:

1. Pick a practice mode or lesson
2. Listen
3. Answer or observe
4. Review results
5. Practice missed characters

### 4. Local-First by Default

Core functionality should not require a backend, account, cloud sync, or internet connection.

### 5. Build for the Pi

The 7-inch touchscreen Raspberry Pi appliance experience should stay central to design decisions.

---

# Phase 0 – Stabilize Current Foundation

**Goal:** Make sure the current app is organized, buildable, and easy to continue working on.

**Status:** Current / immediate

## TODOs

- [ ] Confirm the current app builds from `app/` with `npm run build`.
- [ ] Confirm Listen & Identify mode still works.
- [ ] Confirm Listen Only mode still works.
- [ ] Confirm Practice Missed Characters still works.
- [ ] Confirm Results screen calculations still match previous behavior.
- [ ] Confirm local progress history is still saved.
- [ ] Confirm browser audio playback works after any core extraction.
- [ ] Confirm settings still persist correctly.
- [ ] Confirm exit flow still works in normal browser and Pi/kiosk context.
- [ ] Keep Docker, `deploy/pi`, docs, and Obsidian files unchanged unless a change is specifically needed.

## Notes

This phase is mostly about protecting what already works. It should not include redesigns, new modes, or major data changes.

---

# Phase 1 – Core Session Cleanup

**Goal:** Keep React screens from becoming overloaded by moving reusable session logic into small core helpers.

**Priority:** High  
**Effort:** Low to Medium  
**Risk:** Low if behavior is preserved

## TODOs

- [ ] Keep session-related helpers in `app/src/core/session.js`.
- [ ] Keep helpers pure where practical.
- [ ] Avoid React state, browser APIs, localStorage, and audio playback inside core helpers.
- [ ] Keep UI flow inside React components.
- [ ] Keep persistence decisions near the app layer for now.
- [ ] Confirm helpers receive plain arguments and return plain values.

## Candidate Helpers

- [ ] `shuffle`
- [ ] `buildChoices`
- [ ] `buildItems`
- [ ] `createSessionId`
- [ ] `calculateSessionResult`
- [ ] Any small missed-character helper, if it simplifies the screen without hiding behavior

## Morse Timing Notes

Timing helpers may stay in `app/src/audio/cwAudio.js` if they are only used by audio playback.

Move them into `app/src/core/morseTiming.js` only if they are needed by more than the audio layer.

Potential helpers:

- [ ] `getMorseUnitSeconds`
- [ ] `getPostCharacterDelayMs`

## Validation

- [ ] Run `npm run build` from `app/`.
- [ ] Manually test the main practice modes.
- [ ] Compare the session result output before and after extraction.

## Codex Handoff Prompt

```text
Review the current Dit Dit React/Vite app under /Users/yancyshepherd/Projects/ShepsCW/app.

Focus only on the current core/session cleanup phase.

Preserve all app behavior. Do not redesign the UI. Do not change Docker, deploy/pi, Obsidian, or unrelated docs. Do not add dependencies.

Confirm that reusable practice/session helpers live in app/src/core/session.js and are pure where practical. React state, localStorage, browser audio, and UI flow should remain outside the core helpers.

Validate Listen & Identify, Listen Only, Practice Missed Characters, results calculation, local progress history, browser audio playback, settings behavior, and exit flow.

Run npm run build from app/ if possible. If the build fails because of a known node_modules/native optional dependency issue, report it clearly and do not treat it as an app-code failure.

Return exact files changed, behavior validation, build result, and any small follow-up recommendations.
```

---

# Phase 2 – Lesson Content Expansion

**Goal:** Give the app enough content to support a real beginner learning path.

**Priority:** High  
**Effort:** Medium  
**Risk:** Low to Medium

## TODOs

- [ ] Add full A-Z Morse character coverage.
- [ ] Add 0-9 digit coverage.
- [ ] Add a small punctuation set only after letters and numbers are stable.
- [ ] Add common ham abbreviations later, not immediately.
- [ ] Create structured lesson metadata.
- [ ] Keep lesson data easy to read and edit.
- [ ] Avoid burying lesson content inside React components.
- [ ] Add recommended WPM/Farnsworth values per lesson if useful.
- [ ] Add lesson descriptions that explain what the learner is practicing.

## Suggested Lesson Structure

```js
{
  id: 'koch-01',
  name: 'Koch 1',
  category: 'Beginner',
  sequence: 1,
  characters: ['K', 'M'],
  description: 'Start with two distinct sounds.',
  prerequisite: null,
  recommendedWPM: 20,
  recommendedFarnsworth: 15,
}
```

## Suggested First Content Targets

- [ ] Koch-style beginner sequence
- [ ] LICW-inspired didah rhythm path
- [ ] Letters-only practice
- [ ] Numbers-only practice
- [ ] Challenging-pair practice
- [ ] Review/mixed practice

## Do Not Do Yet

- [ ] Do not build a full curriculum engine yet.
- [ ] Do not add cloud lesson downloads.
- [ ] Do not add multiple user profiles yet.
- [ ] Do not build QSO/conversation mode yet.

## Validation

- [ ] Existing lessons still work.
- [ ] New lessons appear correctly in the UI.
- [ ] Practice sessions generate valid items from every new lesson.
- [ ] Audio playback works for every added character.
- [ ] Unsupported characters are handled safely.

## Codex Handoff Prompt

```text
Review the current Dit Dit app and expand lesson content in a small, safe way.

Goal: add broader Morse character coverage and structured lesson metadata without redesigning the UI or changing the practice behavior.

Keep lesson data outside React screen logic where practical. Do not add dependencies. Do not create a full curriculum engine. Do not change Docker, deploy/pi, Obsidian, or unrelated docs.

Add or improve lessons for A-Z and 0-9 coverage, using a simple readable data structure. Include lesson id, name, category, sequence, characters, description, and recommended settings if the current app structure supports that cleanly.

Validate that existing lessons still work, new lessons appear correctly, sessions generate valid practice items, and browser audio can play every added character.

Run npm run build from app/ if possible.

Return exact files changed, lesson content added, build result, and any follow-up recommendations.
```

---

# Phase 3 – Progress and Weak Character Tracking

**Goal:** Make the app more useful by showing what the learner struggles with and making missed-character practice smarter.

**Priority:** High  
**Effort:** Medium  
**Risk:** Medium

## TODOs

- [ ] Track per-character attempts.
- [ ] Track per-character correct answers.
- [ ] Track per-character misses.
- [ ] Track recent accuracy per character.
- [ ] Identify weak characters using a simple threshold.
- [ ] Surface weak characters on the Progress screen.
- [ ] Add a quick practice action for weak characters.
- [ ] Improve Practice Missed Characters so it can work from recent misses and/or historical weak characters.
- [ ] Keep local progress data backward compatible where possible.
- [ ] Add migration/fallback behavior if old progress records are missing new fields.

## Simple Weak Character Rule

A character can be considered weak when:

- It has enough attempts to be meaningful, and
- Recent accuracy is below the target threshold.

Example:

```js
attempts >= 5 && accuracy < 80
```

This can become more sophisticated later.

## Do Not Do Yet

- [ ] Do not implement full spaced repetition yet.
- [ ] Do not implement SM-2 yet.
- [ ] Do not add cloud sync.
- [ ] Do not create complex dashboards before the basic data model is stable.

## Validation

- [ ] Existing progress history still displays.
- [ ] New sessions update per-character stats.
- [ ] Weak characters are identified correctly.
- [ ] Practice Missed Characters still works.
- [ ] Local storage handles old and new data safely.

## Codex Handoff Prompt

```text
Review the current Dit Dit app and implement a small first version of per-character progress tracking.

Goal: identify weak characters and make progress data more useful without adding a full adaptive learning engine yet.

Do not redesign the UI. Do not add dependencies. Do not add cloud sync. Do not implement SM-2 or complex spaced repetition. Keep the change small and reviewable.

Track attempts, correct answers, misses, and recent accuracy per character using local storage. Add safe fallback behavior for older progress records. Surface weak characters in the existing Progress experience if there is an appropriate place to do so. Preserve the current Practice Missed Characters behavior and improve it only if it can be done safely.

Validate old progress data, new session updates, weak character detection, local persistence, and the main practice flow.

Run npm run build from app/ if possible.

Return exact files changed, data shape changes, build result, and any follow-up recommendations.
```

---

# Phase 4 – Beginner Guidance and Onboarding

**Goal:** Help a new user understand what to do without making the app feel heavy.

**Priority:** Medium to High  
**Effort:** Medium  
**Risk:** Low to Medium

## TODOs

- [ ] Add a lightweight first-run welcome screen or modal.
- [ ] Explain that Dit Dit teaches Morse by sound and rhythm.
- [ ] Explain WPM and Farnsworth in plain language.
- [ ] Suggest a first lesson.
- [ ] Add a “recommended next practice” area on the home screen.
- [ ] Add short learning tips in appropriate places.
- [ ] Add a simple Help/About screen if needed.
- [ ] Keep onboarding skippable.
- [ ] Store onboarding completion locally.

## Suggested Guidance Topics

- [ ] Listen for sound patterns, not visual dots and dashes.
- [ ] Practice in short, consistent sessions.
- [ ] Use Farnsworth spacing to keep character rhythm realistic.
- [ ] Repeat missed characters instead of jumping ahead.
- [ ] Accuracy matters more than rushing.

## Do Not Do Yet

- [ ] Do not add a large tutorial system.
- [ ] Do not block the user from using the app.
- [ ] Do not force account creation.
- [ ] Do not create a complex recommendation engine yet.

## Validation

- [ ] First-run guidance appears only when appropriate.
- [ ] User can skip onboarding.
- [ ] Onboarding completion persists locally.
- [ ] Existing users are not disrupted.
- [ ] Home screen remains simple.

## Codex Handoff Prompt

```text
Review the current Dit Dit app and add lightweight beginner guidance.

Goal: help first-time users understand how to start practicing Morse by sound and rhythm without redesigning the app or adding a heavy tutorial system.

Add a skippable first-run welcome/onboarding experience if it fits the current UI. Explain WPM, Farnsworth, rhythm-based learning, and a recommended first lesson in simple language. Store onboarding completion locally. Consider adding a small recommended-next-practice area on the home screen if it can be done cleanly.

Do not add dependencies. Do not require accounts. Do not create a complex recommendation engine. Preserve all current practice behavior.

Validate first-run behavior, skip behavior, persistence, and normal returning-user behavior.

Run npm run build from app/ if possible.

Return exact files changed, summary of onboarding behavior, build result, and follow-up recommendations.
```

---

# Phase 5 – Progress Screen Improvements

**Goal:** Turn basic stats into useful learning insight without overbuilding analytics.

**Priority:** Medium  
**Effort:** Medium  
**Risk:** Medium

## TODOs

- [ ] Show overall sessions completed.
- [ ] Show overall accuracy.
- [ ] Show recent accuracy trend if data supports it.
- [ ] Show weak characters.
- [ ] Show strongest characters.
- [ ] Add a per-character mastery list or simple heatmap.
- [ ] Add a quick action to practice weak characters.
- [ ] Show current streak only if daily practice data is reliable.
- [ ] Keep charts simple or avoid charts until data volume justifies them.

## Do Not Do Yet

- [ ] Do not add a complex analytics dashboard.
- [ ] Do not add third-party chart dependencies unless truly needed.
- [ ] Do not add anonymous analytics yet.
- [ ] Do not add cloud reporting.

## Validation

- [ ] Progress screen works with no history.
- [ ] Progress screen works with old history.
- [ ] Progress screen works with new per-character history.
- [ ] Weak character practice shortcut works.
- [ ] Touch layout remains readable on 7-inch display.

## Codex Handoff Prompt

```text
Review the current Dit Dit Progress experience and improve it using existing local progress data.

Goal: make progress more actionable by showing recent accuracy, weak characters, strong characters, and a simple way to practice weak characters.

Do not add chart dependencies. Do not create a complex analytics dashboard. Do not add cloud analytics. Keep the design touch-friendly for the Raspberry Pi display.

The screen must handle no history, old history, and new per-character history safely.

Run npm run build from app/ if possible.

Return exact files changed, summary of Progress screen improvements, build result, and follow-up recommendations.
```

---

# Phase 6 – Pi/Kiosk Experience Polish

**Goal:** Make the Raspberry Pi appliance feel safe, reliable, and not trapped in kiosk mode.

**Priority:** Medium to High for Pi usage  
**Effort:** Medium  
**Risk:** Medium

## TODOs

- [ ] Confirm current Pi startup path.
- [ ] Confirm current kiosk launch behavior.
- [ ] Confirm current exit behavior.
- [ ] Add or improve a clear “Exit to Desktop” path.
- [ ] Consider a startup cancel countdown before kiosk launch.
- [ ] Add a desktop shortcut for manual app launch if useful.
- [ ] Add a desktop shortcut or script for stopping the app if useful.
- [ ] Keep Docker/service behavior simple.
- [ ] Document Pi-specific behavior clearly.

## Startup Cancel Concept

A future startup helper could:

1. Show a short countdown.
2. Offer a large “Cancel to Desktop” button.
3. Launch kiosk mode if not canceled.
4. Exit cleanly to desktop if canceled.

This should be implemented only after the current Pi service flow is stable.

## Do Not Do Yet

- [ ] Do not redesign deployment.
- [ ] Do not add unnecessary service layers.
- [ ] Do not make kiosk mode harder to debug.
- [ ] Do not assume the Pi is the only way the app will run.

## Validation

- [ ] App still starts normally on Pi.
- [ ] App still starts normally in desktop browser.
- [ ] Exit behavior is understandable.
- [ ] User is not trapped in kiosk mode.
- [ ] Deployment instructions remain accurate.

## Codex Handoff Prompt

```text
Review the current Raspberry Pi startup and kiosk flow for Dit Dit.

Goal: improve the Pi appliance experience without redesigning deployment or changing the normal browser app behavior.

Confirm how the app starts, how kiosk mode launches, and how exit currently works. Add or improve a clear Exit to Desktop path if it can be done safely. Consider a startup cancel countdown only if it fits the current service/launcher structure cleanly.

Do not redesign Docker or deployment. Do not add unnecessary service layers. Keep changes small and easy to test.

Validate normal browser usage and Pi/kiosk behavior as much as possible.

Return exact files changed, summary of Pi behavior changes, validation performed, and follow-up recommendations.
```

---

# Phase 7 – Audio Quality and Timing Refinement

**Goal:** Improve Morse tone quality and timing confidence after the core practice loop is stable.

**Priority:** Medium  
**Effort:** Medium  
**Risk:** Medium

## TODOs

- [ ] Review current Web Audio implementation.
- [ ] Reduce audible clicks/pops if present.
- [ ] Add simple attack/release envelope if needed.
- [ ] Confirm WPM timing calculation.
- [ ] Confirm Farnsworth spacing behavior.
- [ ] Add a small timing test or debug helper if useful.
- [ ] Keep audio controls simple.
- [ ] Preserve current settings behavior.

## Possible Future Audio Features

- [ ] Pitch adjustment
- [ ] Volume control
- [ ] Tone profile options
- [ ] QRM/noise simulation
- [ ] Fading practice
- [ ] Stereo/panning experiments

These should wait until the learning foundation is stronger.

## Validation

- [ ] Audio plays reliably in supported browsers.
- [ ] No obvious clicks or pops.
- [ ] Timing feels consistent.
- [ ] Settings changes affect playback correctly.
- [ ] Pi audio output still works.

## Codex Handoff Prompt

```text
Review the current Dit Dit audio playback implementation.

Goal: improve Morse tone quality and confirm timing behavior without changing practice flow or adding unnecessary audio features.

Look for obvious clicks/pops and add a simple attack/release envelope only if needed. Confirm WPM and Farnsworth timing calculations. Keep settings behavior unchanged. Do not add dependencies. Do not add QRM/noise simulation yet.

Validate browser audio playback, settings behavior, and build.

Run npm run build from app/ if possible.

Return exact files changed, audio/timing summary, build result, and follow-up recommendations.
```

---

# Phase 8 – Simple Motivation Features

**Goal:** Encourage consistent practice without turning Dit Dit into a game first.

**Priority:** Medium  
**Effort:** Low to Medium  
**Risk:** Low to Medium

## TODOs

- [ ] Add daily practice streak if the data model supports it.
- [ ] Show longest streak if reliable.
- [ ] Add simple milestones.
- [ ] Celebrate first completed session.
- [ ] Celebrate first perfect session.
- [ ] Celebrate character mastery later.
- [ ] Keep celebrations subtle.
- [ ] Avoid distracting from practice.

## Possible Milestones

- [ ] First session complete
- [ ] 10 sessions complete
- [ ] First 100% session
- [ ] 100 characters practiced
- [ ] 1,000 characters practiced
- [ ] First weak-character recovery
- [ ] Full alphabet unlocked

## Do Not Do Yet

- [ ] Do not add leaderboards.
- [ ] Do not add accounts.
- [ ] Do not add social sharing.
- [ ] Do not add complex achievement galleries.

## Validation

- [ ] Milestones do not break old data.
- [ ] Streak logic handles missed days correctly.
- [ ] UI remains calm and touch-friendly.
- [ ] Practice remains the main focus.

---

# Phase 9 – Additional Practice Modes

**Goal:** Expand beyond Listen & Identify only after the core learning model is stable.

**Priority:** Later  
**Effort:** Medium to High  
**Risk:** Medium to High

## Candidate Modes

- [ ] Copy Mode: user types what they hear.
- [ ] Send Mode: user taps dit/dah controls and receives timing feedback.
- [ ] Speed Ladder: gradual WPM increase within a session.
- [ ] Head Copy: delay visual confirmation until later.
- [ ] Callsign Practice: realistic amateur radio callsign recognition.
- [ ] Q-Code Practice: QSO, QTH, QRM, QRN, QRZ, etc.
- [ ] Prosign Practice: AR, SK, BT, AS, KN, etc.
- [ ] QSO Simulation: simple exchange practice.

## Recommended Order

1. Copy Mode
2. Callsign Practice
3. Q-Code / abbreviation practice
4. Speed Ladder
5. Send Mode
6. QSO Simulation

## Do Not Do Yet

- [ ] Do not add all modes at once.
- [ ] Do not build send timing until the receive/listen experience is solid.
- [ ] Do not add hardware key input until software send mode is proven.

## Validation

- [ ] New mode does not break existing modes.
- [ ] Mode selection is clear.
- [ ] Results are meaningful for that mode.
- [ ] Progress history can distinguish between modes.

---

# Phase 10 – Data Export and Backup

**Goal:** Let users keep and move their local progress data.

**Priority:** Later / Medium  
**Effort:** Low to Medium  
**Risk:** Medium

## TODOs

- [ ] Add export progress as JSON.
- [ ] Add import progress from JSON.
- [ ] Add basic validation before import.
- [ ] Add export summary as CSV later.
- [ ] Show storage usage if useful.
- [ ] Document what data is stored locally.

## Do Not Do Yet

- [ ] Do not add cloud backup.
- [ ] Do not add accounts.
- [ ] Do not add automatic syncing.
- [ ] Do not add PDF reports unless there is a clear need.

## Validation

- [ ] Exported JSON can be imported.
- [ ] Bad import files are rejected safely.
- [ ] Existing local data is not overwritten without confirmation.
- [ ] User understands what will happen before import.

---

# Phase 11 – Accessibility and Keyboard Support

**Goal:** Make Dit Dit easier to use across different input needs and abilities.

**Priority:** Ongoing / Medium  
**Effort:** Low to Medium  
**Risk:** Low

## TODOs

- [ ] Ensure all buttons are keyboard reachable.
- [ ] Add number-key shortcuts for answer choices.
- [ ] Add Space to replay audio if practical.
- [ ] Add Enter for next/continue where appropriate.
- [ ] Add clear focus states.
- [ ] Add ARIA labels where needed.
- [ ] Test basic screen reader flow.
- [ ] Support browser zoom without layout breaking.
- [ ] Consider high-contrast mode later.
- [ ] Respect reduced-motion settings where possible.

## Validation

- [ ] Full practice session can be completed with keyboard only.
- [ ] Focus order is logical.
- [ ] Touch layout still works.
- [ ] Screen reader labels are useful and not noisy.

---

# Phase 12 – Testing and Quality

**Goal:** Add test coverage where it provides real confidence without slowing down early development too much.

**Priority:** Ongoing  
**Effort:** Medium  
**Risk:** Low

## TODOs

- [ ] Add unit tests for pure core helpers.
- [ ] Add tests for session item generation.
- [ ] Add tests for result calculation.
- [ ] Add tests for weak-character detection once implemented.
- [ ] Add tests for lesson data validity.
- [ ] Add timing calculation tests if timing helpers move to core.
- [ ] Consider component tests later.
- [ ] Consider end-to-end tests after the app flow stabilizes.

## Practical Test Priority

Start with tests for:

1. `app/src/core/session.js`
2. Lesson data validation
3. Progress/weak character helpers
4. Timing helpers if extracted

## Do Not Do Yet

- [ ] Do not chase arbitrary coverage numbers early.
- [ ] Do not add heavy testing infrastructure before the core API settles.
- [ ] Do not make tests brittle against small UI copy changes.

## Validation

- [ ] Tests can run locally.
- [ ] Tests are documented in README or app notes.
- [ ] Tests catch real logic regressions.

---

# Future / Long-Term Ideas

These are useful ideas but should not drive near-term work.

## Adaptive Learning Engine

- [ ] Spaced repetition
- [ ] SM-2 or Leitner-style scheduling
- [ ] Dynamic difficulty adjustment
- [ ] Character confusion detection
- [ ] Automatic review deck
- [ ] Confidence scoring

## Advanced Audio

- [ ] QRM/noise simulation
- [ ] Fading practice
- [ ] Pitch variation
- [ ] Radio-like tone profiles
- [ ] Multiple operator audio simulation

## Hardware Expansion

- [ ] GPIO key input
- [ ] Paddle support
- [ ] External speaker tuning
- [ ] Physical controls
- [ ] Offline update workflow

## Community / Sharing

- [ ] Optional anonymous analytics
- [ ] Shared lesson packs
- [ ] Leaderboards
- [ ] Exportable progress reports
- [ ] Instructor mode

These should remain parked until Dit Dit has a stronger single-user learning foundation.

---

# Recommended Immediate Next Steps

## Next 3 Small Moves

1. **Verify the core/session extraction already made.**  
   Make sure behavior is preserved and the build passes.

2. **Expand lesson content.**  
   Add full A-Z and 0-9 coverage with a clean lesson data structure.

3. **Add per-character progress tracking.**  
   Start simple: attempts, correct, misses, recent accuracy, weak characters.

These three moves provide the best foundation for everything else.

---

# Open Decisions

## Learning Path

- [ ] Should the default path be Koch-style, LICW-inspired, or a Dit Dit blended path?
- [ ] Should users choose a path at onboarding, or should the app recommend one?
- [ ] How much LICW-specific naming/content should be included directly?

## Practice Philosophy

- [ ] Should adaptive learning be always-on or optional?
- [ ] Should the app encourage speed first, accuracy first, or rhythm first?
- [ ] How much gamification is appropriate?

## Pi Appliance Behavior

- [ ] Should kiosk mode auto-start by default?
- [ ] Should startup always include a cancel countdown?
- [ ] Should Exit to Desktop stop the container/service or only close Chromium?

## Data Model

- [ ] Should progress history remain one local profile only for now?
- [ ] When should import/export be added?
- [ ] Should old localStorage data be migrated or simply tolerated with fallbacks?

---

# Summary

Dit Dit is in a good early position. The app works, the concept is clear, and the Raspberry Pi appliance direction is strong.

The most important thing now is disciplined sequencing:

1. Protect the working app.
2. Keep extracting core logic in small pieces.
3. Add enough lesson content to support real learning.
4. Track weak characters.
5. Improve guidance and progress insight.
6. Polish the Pi experience.
7. Add advanced learning intelligence later.

Avoid turning Dit Dit into a giant platform too early. Build the small trainer well first.