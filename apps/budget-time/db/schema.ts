import { sql } from 'drizzle-orm'
import {
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  date,
  unique,
  uniqueIndex,
  boolean,
} from 'drizzle-orm/pg-core'

// Budget types - things kids spend time on (TV, Games, etc.)
export const budgetTypes = pgTable(
  'budget_types',
  {
    id: serial('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    displayName: text('display_name').notNull(),
    allowCarryover: boolean('allow_carryover').notNull().default(true),
    // Pool where all earning timers credit time - only one can be true
    isEarningPool: boolean('is_earning_pool').notNull().default(false),
    icon: text('icon'),
  },
  (t) => [
    // Partial unique index: only one budget type can be the earning pool
    uniqueIndex('unique_earning_pool').on(t.isEarningPool).where(sql`${t.isEarningPool} = true`),
  ]
)

// Earning types - activities that earn time (Chores, Reading, etc.)
export const earningTypes = pgTable('earning_types', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  displayName: text('display_name').notNull(),
  ratioNumerator: real('ratio_numerator').notNull().default(1),
  ratioDenominator: real('ratio_denominator').notNull().default(1),
  icon: text('icon'),
})

export const kids = pgTable('kids', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
})

// Per-kid daily budget defaults
export const kidBudgetDefaults = pgTable(
  'kid_budget_defaults',
  {
    id: serial('id').primaryKey(),
    kidId: integer('kid_id')
      .references(() => kids.id, { onDelete: 'cascade' })
      .notNull(),
    budgetTypeId: integer('budget_type_id')
      .references(() => budgetTypes.id, { onDelete: 'cascade' })
      .notNull(),
    dailyBudgetMinutes: integer('daily_budget_minutes').notNull().default(60),
  },
  (t) => [unique().on(t.kidId, t.budgetTypeId)]
)

export const dailyBalances = pgTable(
  'daily_balances',
  {
    id: serial('id').primaryKey(),
    kidId: integer('kid_id')
      .references(() => kids.id)
      .notNull(),
    date: date('date').notNull(),
  },
  (table) => [unique().on(table.kidId, table.date)]
)

// Daily balance per budget type
export const dailyTypeBalances = pgTable(
  'daily_type_balances',
  {
    id: serial('id').primaryKey(),
    dailyBalanceId: integer('daily_balance_id')
      .references(() => dailyBalances.id, { onDelete: 'cascade' })
      .notNull(),
    budgetTypeId: integer('budget_type_id')
      .references(() => budgetTypes.id, { onDelete: 'cascade' })
      .notNull(),
    remainingSeconds: integer('remaining_seconds').notNull(),
    carryoverSeconds: integer('carryover_seconds').notNull().default(0),
  },
  (t) => [unique().on(t.dailyBalanceId, t.budgetTypeId)]
)

export const activeTimers = pgTable(
  'active_timers',
  {
    id: serial('id').primaryKey(),
    kidId: integer('kid_id')
      .references(() => kids.id)
      .notNull(),
    budgetTypeId: integer('budget_type_id')
      .references(() => budgetTypes.id)
      .notNull(),
    earningTypeId: integer('earning_type_id').references(() => earningTypes.id),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  },
  (table) => [unique().on(table.kidId)]
)

export const timerHistory = pgTable('timer_history', {
  id: serial('id').primaryKey(),
  kidId: integer('kid_id')
    .references(() => kids.id)
    .notNull(),
  eventType: text('event_type').notNull(),
  budgetTypeId: integer('budget_type_id')
    .references(() => budgetTypes.id)
    .notNull(),
  earningTypeId: integer('earning_type_id').references(() => earningTypes.id),
  seconds: integer('seconds').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

// Global app settings (single row table)
export const appSettings = pgTable('app_settings', {
  id: serial('id').primaryKey(),
  negativeBalancePenalty: real('negative_balance_penalty').notNull().default(-0.25),
})

export type BudgetType = typeof budgetTypes.$inferSelect
export type NewBudgetType = typeof budgetTypes.$inferInsert
export type EarningType = typeof earningTypes.$inferSelect
export type NewEarningType = typeof earningTypes.$inferInsert
export type Kid = typeof kids.$inferSelect
export type NewKid = typeof kids.$inferInsert
export type KidBudgetDefault = typeof kidBudgetDefaults.$inferSelect
export type NewKidBudgetDefault = typeof kidBudgetDefaults.$inferInsert
export type DailyBalance = typeof dailyBalances.$inferSelect
export type NewDailyBalance = typeof dailyBalances.$inferInsert
export type DailyTypeBalance = typeof dailyTypeBalances.$inferSelect
export type NewDailyTypeBalance = typeof dailyTypeBalances.$inferInsert
export type ActiveTimer = typeof activeTimers.$inferSelect
export type NewActiveTimer = typeof activeTimers.$inferInsert
export type TimerHistoryEntry = typeof timerHistory.$inferSelect
export type NewTimerHistoryEntry = typeof timerHistory.$inferInsert
export type AppSettings = typeof appSettings.$inferSelect
export type NewAppSettings = typeof appSettings.$inferInsert
