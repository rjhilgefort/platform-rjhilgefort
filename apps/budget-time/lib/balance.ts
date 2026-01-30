import { eq, and } from 'drizzle-orm'
import { db } from '../db/client'
import {
  kids,
  dailyBalances,
  dailyTypeBalances,
  budgetTypes,
  kidBudgetDefaults,
  appSettings,
  DailyBalance,
  DailyTypeBalance,
  BudgetType,
} from '../db/schema'
import { getBudgetDate, getPreviousBudgetDate } from './day-boundary'

export interface TypeBalance {
  budgetTypeId: number
  budgetTypeSlug: string
  budgetTypeDisplayName: string
  budgetTypeIcon: string | null
  remainingSeconds: number
  carryoverSeconds: number
  allowCarryover: boolean
  isEarningPool: boolean
}

export interface FullDailyBalance {
  dailyBalanceId: number
  kidId: number
  date: string
  typeBalances: TypeBalance[]
}

/**
 * Get all budget types ordered by displayName
 */
export async function getAllBudgetTypes(): Promise<BudgetType[]> {
  return db.query.budgetTypes.findMany({
    orderBy: (bt, { asc }) => asc(bt.displayName),
  })
}

/**
 * Get or create today's balance for a kid
 * Handles carryover from previous day for all budget types
 */
export async function getOrCreateTodayBalance(kidId: number): Promise<FullDailyBalance> {
  const timezone = await getTimezone()
  const resetHour = await getResetHour()
  const today = getBudgetDate(timezone, resetHour)

  // Check if today's balance exists
  const existing = await db.query.dailyBalances.findFirst({
    where: and(eq(dailyBalances.kidId, kidId), eq(dailyBalances.date, today)),
  })

  const allBudgetTypes = await getAllBudgetTypes()

  if (existing) {
    // Get all type balances for this daily balance
    const typeBalancesData = await db.query.dailyTypeBalances.findMany({
      where: eq(dailyTypeBalances.dailyBalanceId, existing.id),
    })

    // Create any missing type balances (new budget types added)
    const existingTypeIds = new Set(typeBalancesData.map((tb) => tb.budgetTypeId))
    const missingTypes = allBudgetTypes.filter((bt) => !existingTypeIds.has(bt.id))

    if (missingTypes.length > 0) {
      const defaults = await getKidBudgetDefaults(kidId)
      const newBalances = missingTypes.map((bt) => {
        const defaultMinutes = defaults.find((d) => d.budgetTypeId === bt.id)?.dailyBudgetMinutes ?? 60
        return {
          dailyBalanceId: existing.id,
          budgetTypeId: bt.id,
          remainingSeconds: defaultMinutes * 60,
          carryoverSeconds: 0,
        }
      })
      await db.insert(dailyTypeBalances).values(newBalances).onConflictDoNothing()
    }

    // Re-fetch to get complete data
    const updatedTypeBalances = await db.query.dailyTypeBalances.findMany({
      where: eq(dailyTypeBalances.dailyBalanceId, existing.id),
    })

    return buildFullBalance(existing, updatedTypeBalances, allBudgetTypes)
  }

  // Verify kid exists
  const kid = await db.query.kids.findFirst({
    where: eq(kids.id, kidId),
  })

  if (!kid) {
    throw new Error(`Kid ${kidId} not found`)
  }

  // Get kid's budget defaults
  const defaults = await getKidBudgetDefaults(kidId)

  // Get yesterday's balance for carryover
  const yesterday = getPreviousBudgetDate(timezone, resetHour)
  const yesterdayBalance = await db.query.dailyBalances.findFirst({
    where: and(eq(dailyBalances.kidId, kidId), eq(dailyBalances.date, yesterday)),
  })

  let yesterdayTypeBalances: DailyTypeBalance[] = []
  if (yesterdayBalance) {
    yesterdayTypeBalances = await db.query.dailyTypeBalances.findMany({
      where: eq(dailyTypeBalances.dailyBalanceId, yesterdayBalance.id),
    })
  }

  // Create today's balance (handle race condition with onConflictDoNothing)
  const [insertedBalance] = await db
    .insert(dailyBalances)
    .values({
      kidId,
      date: today,
    })
    .onConflictDoNothing()
    .returning()

  // If insert returned nothing, another request created it - fetch it
  const newBalance = insertedBalance ?? await db.query.dailyBalances.findFirst({
    where: and(eq(dailyBalances.kidId, kidId), eq(dailyBalances.date, today)),
  })

  if (!newBalance) {
    throw new Error('Failed to create balance')
  }

  // Check if type balances already exist (created by the other request)
  const existingTypeBalances = await db.query.dailyTypeBalances.findMany({
    where: eq(dailyTypeBalances.dailyBalanceId, newBalance.id),
  })

  if (existingTypeBalances.length > 0) {
    // Another request already created the type balances, return them
    return buildFullBalance(newBalance, existingTypeBalances, allBudgetTypes)
  }

  // Create type balances for each budget type
  const typeBalanceValues = allBudgetTypes.map((bt) => {
    const defaultMinutes = defaults.find((d) => d.budgetTypeId === bt.id)?.dailyBudgetMinutes ?? 60
    const yesterdayTb = yesterdayTypeBalances.find((ytb) => ytb.budgetTypeId === bt.id)
    // For earning pool (Extra), preserve negative balance as debt to pay back
    // For regular budgets, only carry over positive remaining time
    const carryover = bt.allowCarryover && yesterdayTb
      ? (bt.isEarningPool ? yesterdayTb.remainingSeconds : Math.max(0, yesterdayTb.remainingSeconds))
      : 0

    return {
      dailyBalanceId: newBalance.id,
      budgetTypeId: bt.id,
      remainingSeconds: defaultMinutes * 60 + carryover,
      carryoverSeconds: carryover,
    }
  })

  await db.insert(dailyTypeBalances).values(typeBalanceValues).onConflictDoNothing()

  const createdTypeBalances = await db.query.dailyTypeBalances.findMany({
    where: eq(dailyTypeBalances.dailyBalanceId, newBalance.id),
  })

  // Log new day balance creation for debugging
  console.log(`[balance] Created new daily balance for kid ${kidId} on ${today}:`, {
    balanceId: newBalance.id,
    typeBalances: createdTypeBalances.map((tb) => ({
      budgetTypeId: tb.budgetTypeId,
      remainingSeconds: tb.remainingSeconds,
      carryoverSeconds: tb.carryoverSeconds,
    })),
  })

  return buildFullBalance(newBalance, createdTypeBalances, allBudgetTypes)
}

/**
 * Get a kid's budget defaults
 */
async function getKidBudgetDefaults(kidId: number) {
  return db.query.kidBudgetDefaults.findMany({
    where: eq(kidBudgetDefaults.kidId, kidId),
  })
}

/**
 * Build full balance object from raw data
 */
function buildFullBalance(
  dailyBalance: DailyBalance,
  typeBalances: DailyTypeBalance[],
  allBudgetTypes: BudgetType[]
): FullDailyBalance {
  return {
    dailyBalanceId: dailyBalance.id,
    kidId: dailyBalance.kidId,
    date: dailyBalance.date,
    typeBalances: typeBalances.map((tb) => {
      const bt = allBudgetTypes.find((b) => b.id === tb.budgetTypeId)
      return {
        budgetTypeId: tb.budgetTypeId,
        budgetTypeSlug: bt?.slug ?? '',
        budgetTypeDisplayName: bt?.displayName ?? '',
        budgetTypeIcon: bt?.icon ?? null,
        remainingSeconds: tb.remainingSeconds,
        carryoverSeconds: tb.carryoverSeconds,
        allowCarryover: bt?.allowCarryover ?? true,
        isEarningPool: bt?.isEarningPool ?? false,
      }
    }),
  }
}

/**
 * Update a kid's balance for a specific budget type
 */
export async function updateBalance(
  kidId: number,
  budgetTypeId: number,
  deltaSeconds: number
): Promise<FullDailyBalance> {
  const balance = await getOrCreateTodayBalance(kidId)

  const typeBalance = balance.typeBalances.find((tb) => tb.budgetTypeId === budgetTypeId)
  if (!typeBalance) {
    throw new Error(`Budget type ${budgetTypeId} not found for kid ${kidId}`)
  }

  // Find the daily_type_balance record
  const typeBalanceRecord = await db.query.dailyTypeBalances.findFirst({
    where: and(
      eq(dailyTypeBalances.dailyBalanceId, balance.dailyBalanceId),
      eq(dailyTypeBalances.budgetTypeId, budgetTypeId)
    ),
  })

  if (!typeBalanceRecord) {
    throw new Error('Type balance record not found')
  }

  await db
    .update(dailyTypeBalances)
    .set({ remainingSeconds: typeBalanceRecord.remainingSeconds + deltaSeconds })
    .where(eq(dailyTypeBalances.id, typeBalanceRecord.id))

  return getOrCreateTodayBalance(kidId)
}

/**
 * Set absolute balance for a budget type
 */
export async function setBalance(
  kidId: number,
  budgetTypeId: number,
  seconds: number
): Promise<FullDailyBalance> {
  const balance = await getOrCreateTodayBalance(kidId)

  const typeBalanceRecord = await db.query.dailyTypeBalances.findFirst({
    where: and(
      eq(dailyTypeBalances.dailyBalanceId, balance.dailyBalanceId),
      eq(dailyTypeBalances.budgetTypeId, budgetTypeId)
    ),
  })

  if (!typeBalanceRecord) {
    throw new Error('Type balance record not found')
  }

  await db
    .update(dailyTypeBalances)
    .set({ remainingSeconds: seconds })
    .where(eq(dailyTypeBalances.id, typeBalanceRecord.id))

  return getOrCreateTodayBalance(kidId)
}

/**
 * Get budget type by slug
 */
export async function getBudgetTypeBySlug(slug: string): Promise<BudgetType | undefined> {
  return db.query.budgetTypes.findFirst({
    where: eq(budgetTypes.slug, slug),
  })
}

/**
 * Get budget type by id
 */
export async function getBudgetTypeById(id: number): Promise<BudgetType | undefined> {
  return db.query.budgetTypes.findFirst({
    where: eq(budgetTypes.id, id),
  })
}

/**
 * Get the earning pool budget type (Extra)
 */
export async function getEarningPoolBudgetType(): Promise<BudgetType | undefined> {
  return db.query.budgetTypes.findFirst({
    where: eq(budgetTypes.isEarningPool, true),
  })
}

/**
 * Get an app setting by key, with optional default
 */
export async function getAppSetting(key: string, defaultValue: string): Promise<string> {
  const setting = await db.query.appSettings.findFirst({
    where: eq(appSettings.key, key),
  })
  if (setting) return setting.value

  // Create with default if not exists
  await db
    .insert(appSettings)
    .values({ key, value: defaultValue })
    .onConflictDoNothing()
  return defaultValue
}

/**
 * Set an app setting
 */
export async function setAppSetting(key: string, value: string): Promise<void> {
  await db
    .insert(appSettings)
    .values({ key, value })
    .onConflictDoUpdate({
      target: appSettings.key,
      set: { value },
    })
}

/**
 * Get negative balance penalty setting
 */
export async function getNegativeBalancePenalty(): Promise<number> {
  const value = await getAppSetting('negativeBalancePenalty', '-0.25')
  return parseFloat(value)
}

/**
 * Get timezone setting
 */
export async function getTimezone(): Promise<string> {
  return getAppSetting('timezone', 'America/Denver')
}

/**
 * Get reset hour setting (0-23, default 4 = 4 AM)
 */
export async function getResetHour(): Promise<number> {
  const value = await getAppSetting('resetHour', '4')
  return parseInt(value, 10)
}
