---
"@repo/budget-time": patch
---

fix: build warnings and refactor app settings to key-value

- Refactored app_settings table from wide row to key-value pattern
- Fixed PWA precache size limit (5MB)
- Fixed React hooks exhaustive-deps warnings
- Fixed unused variable warning
- Added globalPassThroughEnv for runtime env vars in turbo.json
- Swapped penalty +/- button order (minus on left)
