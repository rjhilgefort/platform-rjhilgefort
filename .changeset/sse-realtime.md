---
"@repo/budget-time": minor
---

Add Server-Sent Events (SSE) for real-time updates

- New `/api/events` endpoint for SSE connections
- `useServerEvents` hook for client-side subscription
- Events broadcast on: timer start/stop, bonus added, balance changes
- Reduces reliance on 30s polling - updates push instantly
- Automatic reconnection on connection loss
