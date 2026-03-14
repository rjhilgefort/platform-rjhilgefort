---
"@repo/budget-time": patch
---

### Security & Reliability Fixes

- **Transaction safety**: Wrapped timer start/stop API routes in database transactions with `SELECT ... FOR UPDATE` row-level locking to prevent race conditions (e.g., double-deducting balances from concurrent stop requests)
- **Signed auth cookie**: Auth cookie is now HMAC-signed (`authenticated.<signature>`) instead of a plain forgeable string. Existing sessions will need to re-login.
- **Timing-safe PIN comparison**: PIN validation now uses `crypto.timingSafeEqual` to prevent timing attacks
- **Input validation**: Added Effect Schema validation to all POST API routes, replacing manual checks with structured schema validation. Invalid requests now return clean 400 errors instead of unhandled 500s.
- **Error handling**: All API route handlers wrapped in try-catch to return clean 500 errors without leaking stack traces

### Performance

- **Reduced redundant DB calls**: Stop route now calls `getOrCreateTodayBalance` twice (once for state, once for response) instead of 3+ times. Added `updateBalanceDirect` for efficient balance updates without re-fetching.

### Reliability

- **Cron retry logic**: Daily balance creation now retries up to 3 times with exponential backoff (1s, 2s, 4s) per kid on failure
- **Startup self-healing**: Balance creation runs on app startup to catch up on any missed cron runs
- **Negative elapsed guard**: `calculateElapsedSeconds` now clamps to 0 to prevent clock skew from producing negative values

### Cleanup

- **Removed unused GoogleAnalytics**: Removed `<GoogleAnalytics gaId="TODO" />` that was loading GA script with invalid ID on every page
