import { eq, and } from 'drizzle-orm'
import { db } from '../db/client'
import {
  kids,
  dailyBalances,
  dailyTypeBalances,
  budgetTypes,
  kidBudgetDefaults,
  DailyBalance,
  DailyTypeBalance,
  BudgetType,
} from '../db/schema'
import { getScreenTimeDate, getPreviousScreenTimeDate } from './day-boundary'

export interface TypeBalance {
  budgetTypeId: number
  budgetTypeSlug: string
  budgetTypeDisplayName: string
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
 * Get all budget types ordered by sortOrder
 */
export async function getAllBudgetTypes(): Promise<BudgetType[]> {
  return db.query.budgetTypes.findMany({
    orderBy: (bt, { asc }) => asc(bt.sortOrder),
  })
}

/**
 * Get or create today's balance for a kid
 * Handles carryover from previous day for all budget types
 */
export async function getOrCreateTodayBalance(kidId: number): Promise<FullDailyBalance> {
  const today = getScreenTimeDate()

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
      await db.insert(dailyTypeBalances).values(newBalances)
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
  const yesterday = getPreviousScreenTimeDate()
  const yesterdayBalance = await db.query.dailyBalances.findFirst({
    where: and(eq(dailyBalances.kidId, kidId), eq(dailyBalances.date, yesterday)),
  })

  let yesterdayTypeBalances: DailyTypeBalance[] = []
  if (yesterdayBalance) {
    yesterdayTypeBalances = await db.query.dailyTypeBalances.findMany({
      where: eq(dailyTypeBalances.dailyBalanceId, yesterdayBalance.id),
    })
  }

  // Create today's balance
  const [newBalance] = await db
    .insert(dailyBalances)
    .values({
      kidId,
      date: today,
    })
    .returning()

  if (!newBalance) {
    throw new Error('Failed to create balance')
  }

  // Create type balances for each budget type
  const typeBalanceValues = allBudgetTypes.map((bt) => {
    const defaultMinutes = defaults.find((d) => d.budgetTypeId === bt.id)?.dailyBudgetMinutes ?? 60
    const yesterdayTb = yesterdayTypeBalances.find((ytb) => ytb.budgetTypeId === bt.id)
    const carryover = bt.allowCarryover && yesterdayTb ? Math.max(0, yesterdayTb.remainingSeconds) : 0

    return {
      dailyBalanceId: newBalance.id,
      budgetTypeId: bt.id,
      remainingSeconds: defaultMinutes * 60 + carryover,
      carryoverSeconds: carryover,
    }
  })

  await db.insert(dailyTypeBalances).values(typeBalanceValues)

  const createdTypeBalances = await db.query.dailyTypeBalances.findMany({
    where: eq(dailyTypeBalances.dailyBalanceId, newBalance.id),
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
