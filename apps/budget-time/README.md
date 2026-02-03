# Budget Time

Parental screen time management app with earning incentives. Kids spend time budgets on activities (TV, Games) and earn additional time through productive activities (Chores, Reading).

**Live:** https://budgettime.hilgefort.me

## Quick Start

```bash
# Set up environment variables
cd apps/budget-time
cp .env.example .env.local
# Edit .env.local with your database URL and PINs

# Run database migrations
npm run db:push --filter=@repo/budget-time

# Start dev server
npm run dev --filter=@repo/budget-time
```

Visit: http://localhost:3007

## Features

- **Time budgets** — Set daily screen time limits per kid/activity
- **Earning system** — Kids earn extra time through productive activities
- **Configurable ratios** — e.g., 2:1 reading earns 2 minutes for every 1 minute read
- **Carryover support** — Unused time can roll to the next day
- **Two-PIN system** — Family PIN for kids, Parent PIN for config
- **Real-time timers** — Live countdown with server-side sync
- **PWA support** — Installable on mobile devices

## Environment Variables

| Variable        | Required | Description                  |
| --------------- | -------- | ---------------------------- |
| `DATABASE_URL`  | Yes      | PostgreSQL connection string |
| `FAMILY_PIN`    | Yes      | PIN for family login         |
| `PARENT_PIN`    | Yes      | PIN for config access        |
| `COOKIE_SECURE` | No       | Set `false` for HTTP (dev)   |

## Database Commands

```bash
npm run db:generate   # Generate migrations
npm run db:migrate    # Run migrations
npm run db:push       # Push schema changes (dev)
npm run db:studio     # Open Drizzle Studio
npm run db:seed       # Seed initial data
```

## More Info

- [SPEC.md](./SPEC.md) — Full technical specification
- [TODO.md](./TODO.md) — Planned features
- [Root README](../../README.md) — Monorepo commands and setup
