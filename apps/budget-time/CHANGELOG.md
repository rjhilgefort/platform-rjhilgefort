# @repo/budget-time

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
