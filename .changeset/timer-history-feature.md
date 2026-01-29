---
"@repo/budget-time": minor
---

feat: add timer history page with schema consolidation

- Consolidate `active_timers` and `timer_history` into unified `timer_events` table
- Active timers identified by `ended_at IS NULL`
- New `/history` page with day grouping, kid filter, pagination
- Support editing end time with PIN validation
- Add history link to main page header
