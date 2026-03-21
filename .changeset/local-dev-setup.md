---
"@repo/budget-time": patch
---

### Local Development Setup

- Added `docker-compose.dev.yml` with Postgres 16 on port 5433 for local development
- Added `.env.local.example` with template env vars pointing at local DB
- Added npm scripts: `dev:up`, `dev:down`, `dev:reset` for Docker Compose lifecycle
