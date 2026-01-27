---
"@repo/budget-time": minor
---

Add configurable timezone and day reset hour

- add timezone setting (defaults to America/Denver)
- add configurable reset hour (0-23, defaults to 4 AM)
- day boundary calculations now timezone-aware via date-fns-tz
- reorganized General Settings into 2-column grid layout
