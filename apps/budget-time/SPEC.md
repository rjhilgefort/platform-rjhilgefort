# Budget-Time Specification

## Overview

Parental screen time management app with earning incentives. Kids spend time budgets on activities (TV, Games) and earn additional time through productive activities (Chores, Reading).

**Two-PIN System:**
- **Family PIN** - Login access for kids/family
- **Parent PIN** - Config access for sensitive operations

---

## Pages

| Route | Purpose |
|-------|---------|
| `/login` | Family PIN entry |
| `/` | Main dashboard - kid cards, timers, balances |
| `/config` | Parent settings (requires parent PIN) |

---

## API Endpoints

### Auth

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth` | Login with family PIN, sets auth cookie |
| DELETE | `/api/auth` | Logout, clears auth cookie |
| POST | `/api/auth/validate-pin` | Validate parent PIN without session |

### Timers

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/timers/status` | Live timer status for all kids |
| POST | `/api/timers/start` | Start consumption or earning timer |
| POST | `/api/timers/stop` | Stop active timer, update balance |

**Request/Response:**
- `start`: `{ kidId, budgetTypeId?, earningTypeId? }` - One of budgetTypeId or earningTypeId required
- `stop`: `{ kidId }` - Returns elapsed/earned seconds and updated balance

### Config

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/config` | Get kids, budget types, earning types, defaults |
| PUT | `/api/config` | Update config (parent PIN required) |

**PUT Actions:**
- `updateKidBudgetDefault` - Set daily default for kid/budget type
- `createBudgetType` / `updateBudgetType` / `deleteBudgetType`
- `createEarningType` / `updateEarningType` / `deleteEarningType`

### Balance

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/balance` | Get all kids' current daily balances |
| POST | `/api/balance/set` | Set kid's balance for budget type (parent PIN) |
| POST | `/api/balance/reset-to-default` | Reset all balances to daily defaults (parent PIN) |
| POST | `/api/bonus` | Add bonus time to kid's budget (parent PIN) |

---

## Database Schema

### `budget_types`
Categories of time usage.

| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| slug | text | unique |
| display_name | text | |
| allow_carryover | boolean | default: true |
| is_earning_pool | boolean | default: false, max one true |
| icon | text | nullable |

### `earning_types`
Activities that earn time.

| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| slug | text | unique |
| display_name | text | |
| ratio_numerator | real | default: 1 |
| ratio_denominator | real | default: 1 |
| icon | text | nullable |

### `kids`
| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| name | text | unique |

### `kid_budget_defaults`
Daily defaults per kid/budget type.

| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| kid_id | integer | FK kids |
| budget_type_id | integer | FK budget_types |
| daily_budget_minutes | integer | default: 60 |

### `daily_balances`
Per-kid per-day anchor record.

| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| kid_id | integer | FK kids |
| date | date | unique with kid_id |

### `daily_type_balances`
Balance per budget type per day.

| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| daily_balance_id | integer | FK daily_balances |
| budget_type_id | integer | FK budget_types |
| remaining_seconds | integer | |
| carryover_seconds | integer | default: 0 |

### `active_timers`
Currently running timers (max one per kid).

| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| kid_id | integer | FK kids, unique |
| budget_type_id | integer | FK budget_types |
| earning_type_id | integer | FK earning_types, nullable |
| started_at | timestamptz | |

### `timer_history`
Audit log of all balance changes.

| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| kid_id | integer | FK kids |
| event_type | text | 'earned', 'budget_used', 'bonus_added' |
| budget_type_id | integer | FK budget_types |
| earning_type_id | integer | FK earning_types, nullable |
| seconds | integer | |
| created_at | timestamptz | default: now() |

---

## Key Concepts

### Timer Types
- **Consumption timer**: Subtracts from budget (TV, Games)
- **Earning timer**: Adds to "Extra" pool via ratio conversion

### Earning Ratio
`earned_minutes = activity_minutes × (numerator / denominator)`

Example: Reading with 2:1 ratio earns 2 minutes for every 1 minute of reading.

### Carryover
Unused time rolls to next day if `allow_carryover=true` on budget type. Stored in `carryover_seconds` column.

### Real-time Sync
Client polls `/api/timers/status` every 30s. Server calculates elapsed time to prevent client drift.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `FAMILY_PIN` | Yes | PIN for family login |
| `PARENT_PIN` | Yes | PIN for config access |
| `COOKIE_SECURE` | No | Set `false` for HTTP (dev) |

---

## Tech Stack

- **Next.js 15** - React framework, API routes
- **React 19** - UI library
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Drizzle ORM** - Database queries & migrations
- **Tailwind CSS** - Styling
- **DaisyUI** - UI components
- **Effect** - Functional programming utilities
- **date-fns** - Date manipulation
- **react-icons** - Icon library (Tabler icons)
