import { NextResponse } from 'next/server'
import { eq, desc, isNotNull, and, lt, inArray } from 'drizzle-orm'
import * as Schema from 'effect/Schema'
import { db } from '../../../db/client'
import { timerEvents, budgetTypes, earningTypes, dailyBalances, dailyTypeBalances, kidBudgetDefaults } from '../../../db/schema'
import { validateParentPin } from '../../../lib/auth'
import { apiHandler, parseBody } from '../../../lib/api-utils'

export const dynamic = 'force-dynamic'

interface HistoryEntry {
  id: number
  kidId: number
  kidName: string
  eventType: string
  budgetTypeId: number
  budgetTypeDisplayName: string
  budgetTypeIcon: string | null
  earningTypeId: number | null
  earningTypeDisplayName: string | null
  earningTypeIcon: string | null
  startedAt: string | null
  endedAt: string | null
  seconds: number
  createdAt: string | null
}

export const GET = apiHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const kidIdParam = searchParams.get('kidId')
  const limitParam = searchParams.get('limit')
  const cursorParam = searchParams.get('cursor')

  const limit = Math.min(parseInt(limitParam ?? '50', 10), 100)
  const cursor = cursorParam ? parseInt(cursorParam, 10) : null

  // Get all kids for the filter dropdown
  const allKids = await db.query.kids.findMany({
    orderBy: (k, { asc }) => asc(k.name),
  })

  // Build query conditions
  const conditions = [isNotNull(timerEvents.endedAt)]

  if (kidIdParam) {
    const kidId = parseInt(kidIdParam, 10)
    conditions.push(eq(timerEvents.kidId, kidId))
  }

  if (cursor) {
    conditions.push(lt(timerEvents.id, cursor))
  }

  // Get history entries
  const entries = await db.query.timerEvents.findMany({
    where: and(...conditions),
    orderBy: [desc(timerEvents.endedAt), desc(timerEvents.id)],
    limit: limit + 1,
  })

  const hasMore = entries.length > limit
  const resultEntries = hasMore ? entries.slice(0, limit) : entries
  const nextCursor = hasMore && resultEntries.length > 0
    ? resultEntries[resultEntries.length - 1]?.id
    : null

  // Enrich entries with related data
  const enrichedEntries: HistoryEntry[] = await Promise.all(
    resultEntries.map(async (entry) => {
      const kid = allKids.find((k) => k.id === entry.kidId)
      const budgetType = await db.query.budgetTypes.findFirst({
        where: eq(budgetTypes.id, entry.budgetTypeId),
      })
      let earningType = null
      if (entry.earningTypeId) {
        earningType = await db.query.earningTypes.findFirst({
          where: eq(earningTypes.id, entry.earningTypeId),
        })
      }

      return {
        id: entry.id,
        kidId: entry.kidId,
        kidName: kid?.name ?? 'Unknown',
        eventType: entry.eventType,
        budgetTypeId: entry.budgetTypeId,
        budgetTypeDisplayName: budgetType?.displayName ?? 'Unknown',
        budgetTypeIcon: budgetType?.icon ?? null,
        earningTypeId: entry.earningTypeId,
        earningTypeDisplayName: earningType?.displayName ?? null,
        earningTypeIcon: earningType?.icon ?? null,
        startedAt: entry.startedAt?.toISOString() ?? null,
        endedAt: entry.endedAt?.toISOString() ?? null,
        seconds: entry.seconds,
        createdAt: entry.createdAt?.toISOString() ?? null,
      }
    })
  )

  // Fetch daily balance data for allowances and end-of-day summaries
  const uniqueDates = [...new Set(
    resultEntries
      .map((e) => e.endedAt)
      .filter((d): d is Date => d !== null)
      .map((d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
  )]

  const dailyAllowances: Record<string, Array<{
    kidId: number
    kidName: string
    budgetTypes: Array<{
      budgetTypeId: number
      displayName: string
      icon: string | null
      allowanceSeconds: number
      carryoverSeconds: number
    }>
  }>> = {}

  const endOfDaySummaries: Record<string, Array<{
    kidId: number
    kidName: string
    budgetTypes: Array<{
      budgetTypeId: number
      displayName: string
      icon: string | null
      remainingSeconds: number
    }>
  }>> = {}

  if (uniqueDates.length > 0) {
    const balanceConditions = [inArray(dailyBalances.date, uniqueDates)]
    if (kidIdParam) {
      balanceConditions.push(eq(dailyBalances.kidId, parseInt(kidIdParam, 10)))
    }

    const [balanceData, defaults] = await Promise.all([
      db
        .select({
          date: dailyBalances.date,
          kidId: dailyBalances.kidId,
          budgetTypeId: dailyTypeBalances.budgetTypeId,
          remainingSeconds: dailyTypeBalances.remainingSeconds,
          carryoverSeconds: dailyTypeBalances.carryoverSeconds,
          budgetDisplayName: budgetTypes.displayName,
          budgetIcon: budgetTypes.icon,
        })
        .from(dailyBalances)
        .innerJoin(dailyTypeBalances, eq(dailyTypeBalances.dailyBalanceId, dailyBalances.id))
        .innerJoin(budgetTypes, eq(budgetTypes.id, dailyTypeBalances.budgetTypeId))
        .where(and(...balanceConditions)),
      db
        .select({
          kidId: kidBudgetDefaults.kidId,
          budgetTypeId: kidBudgetDefaults.budgetTypeId,
          dailyBudgetMinutes: kidBudgetDefaults.dailyBudgetMinutes,
        })
        .from(kidBudgetDefaults),
    ])

    const defaultsMap = new Map<string, number>()
    for (const d of defaults) {
      defaultsMap.set(`${d.kidId}-${d.budgetTypeId}`, d.dailyBudgetMinutes)
    }

    for (const date of uniqueDates) {
      const dateRows = balanceData.filter((r) => r.date === date)

      const kidMap = new Map<number, typeof dateRows>()
      for (const row of dateRows) {
        const existing = kidMap.get(row.kidId)
        if (existing) {
          existing.push(row)
        } else {
          kidMap.set(row.kidId, [row])
        }
      }

      const allowances: (typeof dailyAllowances)[string] = []
      const summaries: (typeof endOfDaySummaries)[string] = []

      for (const [kidId, rows] of kidMap) {
        const kid = allKids.find((k) => k.id === kidId)
        const kidName = kid?.name ?? 'Unknown'
        rows.sort((a, b) => a.budgetTypeId - b.budgetTypeId)

        allowances.push({
          kidId,
          kidName,
          budgetTypes: rows.map((r) => {
            const baseBudgetMinutes = defaultsMap.get(`${kidId}-${r.budgetTypeId}`) ?? 0
            return {
              budgetTypeId: r.budgetTypeId,
              displayName: r.budgetDisplayName,
              icon: r.budgetIcon,
              allowanceSeconds: baseBudgetMinutes * 60 + r.carryoverSeconds,
              carryoverSeconds: r.carryoverSeconds,
            }
          }),
        })

        summaries.push({
          kidId,
          kidName,
          budgetTypes: rows.map((r) => ({
            budgetTypeId: r.budgetTypeId,
            displayName: r.budgetDisplayName,
            icon: r.budgetIcon,
            remainingSeconds: r.remainingSeconds,
          })),
        })
      }

      dailyAllowances[date] = allowances
      endOfDaySummaries[date] = summaries
    }
  }

  return NextResponse.json({
    entries: enrichedEntries,
    dailyAllowances,
    endOfDaySummaries,
    kids: allKids.map((k) => ({ id: k.id, name: k.name })),
    pagination: {
      hasMore,
      nextCursor,
    },
  })
})

const EditHistoryBody = Schema.Struct({
  id: Schema.Number,
  endedAt: Schema.String,
  pin: Schema.String,
})

export const PATCH = apiHandler(async (request: Request) => {
  const body = await request.json()
  const parsed = parseBody(EditHistoryBody, body)
  if (!parsed.success) return parsed.response

  const { id, endedAt, pin } = parsed.data

  // Validate PIN
  const isValidPin = await validateParentPin(pin)
  if (!isValidPin) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 403 })
  }

  // Find the entry
  const entry = await db.query.timerEvents.findFirst({
    where: eq(timerEvents.id, id),
  })

  if (!entry) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
  }

  if (!entry.startedAt) {
    return NextResponse.json(
      { error: 'Cannot edit entry without start time' },
      { status: 400 }
    )
  }

  const newEndedAt = new Date(endedAt)
  if (newEndedAt <= entry.startedAt) {
    return NextResponse.json(
      { error: 'End time must be after start time' },
      { status: 400 }
    )
  }

  // Calculate new duration in seconds
  const elapsedSeconds = Math.floor(
    (newEndedAt.getTime() - entry.startedAt.getTime()) / 1000
  )

  let newSeconds = elapsedSeconds

  // For earned events, apply the earning ratio
  if (entry.eventType === 'earned' && entry.earningTypeId) {
    const earningType = await db.query.earningTypes.findFirst({
      where: eq(earningTypes.id, entry.earningTypeId),
    })
    if (earningType) {
      newSeconds = Math.floor(
        (elapsedSeconds * earningType.ratioDenominator) / earningType.ratioNumerator
      )
    }
  }

  // Update the entry
  await db
    .update(timerEvents)
    .set({
      endedAt: newEndedAt,
      seconds: newSeconds,
    })
    .where(eq(timerEvents.id, id))

  return NextResponse.json({ success: true, newSeconds })
})
