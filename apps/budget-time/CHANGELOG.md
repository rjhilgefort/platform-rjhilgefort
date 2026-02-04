# @repo/budget-time

## 0.10.0

### Minor Changes

- 3375352: Add Server-Sent Events (SSE) for real-time updates

  - New `/api/events` endpoint for SSE connections
  - `useServerEvents` hook for client-side subscription
  - Events broadcast on: timer start/stop, bonus added, balance changes
  - Reduces reliance on 30s polling - updates push instantly
  - Automatic reconnection on connection loss

## 0.9.0

### Minor Changes

- ea132b0: Add ExpandingSlider component with soft-max scaling

  - New slider component that auto-expands max value at 80% threshold
  - Replaced number inputs on settings page with sliders
  - Applied to: Current Balance, Daily Defaults, Activity Minutes
  - Includes visual zone indicators when in expanded range

## 0.8.2

### Patch Changes

- b0a13ea: fix: show loading spinner with icon/title until data loaded, prevent stale timer values on refresh

## 0.8.1

### Patch Changes

- 4101989: fix: timer countdown updates when bonus time added during active timer
- 8fa4424: fix: preserve negative Extra balance on daily reset

## 0.8.0

### Minor Changes

- 4d893dd: feat: add timer history page with schema consolidation

  - Consolidate `active_timers` and `timer_history` into unified `timer_events` table
  - Active timers identified by `ended_at IS NULL`
  - New `/history` page with day grouping, kid filter, pagination
  - Support editing end time with PIN validation
  - Add history link to main page header

## 0.7.1

### Patch Changes

- 98f1add: use isEarningPool db column instead of slug checks for Extra budget type

## 0.7.0

### Minor Changes

- aec00d5: add cron job for daily balance creation at reset hour

### Patch Changes

- 9bce314: show Extra time available during active consumption timers

## 0.6.0

### Minor Changes

- ed71d7b: Replace mobile accordion with tabs for kid selection

  - Kids selectable via tabs at top of page
  - Active timer badge on tabs
  - Always visible kid switcher regardless of scroll position

- eae6e02: Kid profile pictures

  - Add profile_picture column to kids table
  - Upload/crop modal with pan/zoom on config page
  - Server-side HEIC to JPEG conversion
  - Display avatar on main page (desktop + mobile)

- e02a396: Add configurable timezone and day reset hour

  - add timezone setting (defaults to America/Denver)
  - add configurable reset hour (0-23, defaults to 4 AM)
  - day boundary calculations now timezone-aware via date-fns-tz
  - reorganized General Settings into 2-column grid layout

### Patch Changes

- 78ebc0a: Mobile layout improvements

  - TimerCard: stack time/button vertically on mobile, align to card bottom
  - Move +/- button to accordion header (right side, before chevron)
  - Icon now inline with title text (wraps under icon)

- 3f346f2: UI improvements and negative balance protection

  - fix PWA icon to use solid green background
  - add app icon and branding to login screen
  - add app icon to main page header
  - prevent starting budget timers when Extra balance is negative

## 0.5.1

### Patch Changes

- 7d4de75: fix: build warnings and refactor app settings to key-value

  - Refactored app_settings table from wide row to key-value pattern
  - Fixed PWA precache size limit (5MB)
  - Fixed React hooks exhaustive-deps warnings
  - Fixed unused variable warning
  - Added globalPassThroughEnv for runtime env vars in turbo.json
  - Swapped penalty +/- button order (minus on left)

## 0.5.0

### Minor Changes

- 332b7a7: feat: add loan payback system - reduce earning rates when Extra balance is negative

## 0.4.6

### Patch Changes

- 553103e: Sort budget types and earning types alphabetically by display name

## 0.4.5

### Patch Changes

- dc85d8f: Improve bonus modal: PIN first, add/subtract time, +/- icon, toast notifications
- 0b9184f: Add mobile accordion view for kids to reduce scrolling

## 0.4.4

### Patch Changes

- 2cd4af5: Allow Extra timer to run into negative balance and start at zero/negative

## 0.4.3

### Patch Changes

- 721ccb7: Use fullscreen display mode for PWA

## 0.4.2

### Patch Changes

- afeebb3: fix: simulate earning API type coercion and error handling

## 0.4.1

### Patch Changes

- d88df07: Fix duplicate React key warning in PinPad component

## 0.4.0

### Minor Changes

- 3db46d7: feat: add simulate earning, PIN for earning timers, improved fractions

  - Add "Simulate Earning" section to config page for manually adding earned time
  - Require parent PIN to start earning timers (kids can still stop them)
  - Improve fraction display by removing font-mono for better Unicode rendering

## 0.3.0

### Minor Changes

- 54c250e: feat(budget-time): redesign active timer overlays

  Active budget timer:

  - Replace large icon with horizontal progress bar
  - Layout: icon + label, large time, progress bar, stop button
  - Progress bar depletes left-to-right as time passes

  Active earning timer:

  - Compact centered stacks with icon + label inline
  - Extra section and earning activity section with divider
  - Done button outside section boxes

- 8b3c097: feat(budget-time): earning ratio fractions and tablet-friendly config

  - Add formatFraction utility to display decimals as fractions (1.25 → 1¼)
  - Earning ratios display as fractions on main screen
  - Config page: ratio numerator fixed at 1, only denominator editable
  - Config page: replace ratio input with +/− buttons (0.25 increments)
  - Config page: white background for icon picker and ratio buttons

- 480d839: Add PWA support for installable app on Android tablets

### Patch Changes

- 0c3a097: Refactor timer tiles to use shared TimerCard component with yellow/green backgrounds and subtle borders
- 2af4afb: fix(budget-time): use compact Unicode fraction characters
- 9b84a87: fix(budget-time): fraction display and wider timer buttons

  - Add Fraction component with superscript/subscript styling
  - Wider Start/Stop buttons on timer cards (px-6)

- 3d8608d: Add app icon/favicon - green hourglass with coin

## 0.2.0

### Minor Changes

- 43233bc: feat: overflow from normal budgets into Extra time when depleted

  - Normal budget timers (TV, Games) now overflow into Extra time when depleted
  - Only Extra can go negative (to be earned back later)
  - New visual indicator when using Extra time during active timer
  - Settings page now polls balances every 30s to stay in sync

### Patch Changes

- 651528f: feat: add explainer text for daily defaults in settings
- 5e606a3: fix: toasts no longer block back button, click to dismiss
- 1dcbe1a: fix: move extra time hint inline with timer when budget depleted
- fc0230f: feat: show timer icons in settings page for balances and defaults
- 48cde56: fix: sort timers in settings to match main screen (Extra last)
- 4e79663: feat: display seconds smaller than hours/minutes on all timers
- ed6f433: fix: shrink timer text when >1hr to fit mobile tiles

## 0.1.1

### Patch Changes

- eb4140f: Add COOKIE_SECURE env var to control auth cookie secure flag for HTTP deployments

## 0.1.0

### Minor Changes

- 1c6f888: configurable icons for budget/earning types with picker modal
- 4e4b3f6: Extra earning pool: all earned time credits to Extra, protected from deletion, green highlight + emoji when earning
- 0bae628: rename app from screen-time to budget-time
- 15a117a: Sceen time / bugdet app MVP

### Patch Changes

- 67574cc: config: current balance auto-save, reset preserves earning pool
- 19bba6f: config: decimal ratios, auto-save after 5s inactivity, save toast + green flash
- 91e73d9: config: delete buttons require two-click confirmation
- 9559389: earning timer: hide clock when idle, show larger title
- 4d3191e: Improve button visibility: larger bonus +, bordered settings
- 9ae0d61: iOS-style PIN entry: auto-submit on 4th digit, validate before showing settings, show error on wrong PIN
- 1d06611: Improve iPad landscape support: wider containers, grid layout for kids on config page, side-by-side general settings cards
- c3b592a: Client-side countdown replaces per-second API polling with 30s sync
- d115c57: Earning timer takeover UI with enlarged Extra + earning timer display
- 9bdedd9: PinPad: fixed width, larger buttons, error at bottom
- 1ad4dbd: remove sortOrder field, sort timers by name with Extra position per page (config: top, main: bottom)
- da2e3a9: config: add reset to default button for daily balances
- bb4672f: Timer takeover UI: screen time timers take over kid card with large icon + countdown display
- 07960e7: unified PinPad component for login, config, and bonus modal
