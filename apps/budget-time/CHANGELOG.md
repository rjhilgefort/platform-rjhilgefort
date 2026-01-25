# @repo/budget-time

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
