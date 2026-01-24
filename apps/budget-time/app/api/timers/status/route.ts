import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '../../../../db/client'
import { activeTimers, budgetTypes, earningTypes } from '../../../../db/schema'
import { getOrCreateTodayBalance, getAllBudgetTypes } from '../../../../lib/balance'
import { calculateElapsedSeconds, calculateRemainingTime } from '../../../../lib/timer-logic'

export const dynamic = 'force-dynamic'

export async function GET() {
  const allKids = await db.query.kids.findMany({
    orderBy: (kids, { asc }) => asc(kids.id),
  })
  const allBudgetTypes = await getAllBudgetTypes()
  const allEarningTypes = await db.query.earningTypes.findMany({
    orderBy: (et, { asc }) => asc(et.displayName),
  })
  const now = new Date()

  const statuses = await Promise.all(
    allKids.map(async (kid) => {
      const balance = await getOrCreateTodayBalance(kid.id)
      const timer = await db.query.activeTimers.findFirst({
        where: eq(activeTimers.kidId, kid.id),
      })

      let activeTimer = null
      if (timer) {
        const elapsedSeconds = calculateElapsedSeconds(timer.startedAt, now)
        const budgetType = await db.query.budgetTypes.findFirst({
          where: eq(budgetTypes.id, timer.budgetTypeId),
        })
        let earningType = null
        if (timer.earningTypeId) {
          earningType = await db.query.earningTypes.findFirst({
            where: eq(earningTypes.id, timer.earningTypeId),
          })
        }

        activeTimer = {
          budgetTypeId: timer.budgetTypeId,
          budgetTypeSlug: budgetType?.slug ?? '',
          budgetTypeDisplayName: budgetType?.displayName ?? '',
          budgetTypeIcon: budgetType?.icon ?? null,
          earningTypeId: timer.earningTypeId,
          earningTypeSlug: earningType?.slug ?? null,
          earningTypeDisplayName: earningType?.displayName ?? null,
          earningTypeIcon: earningType?.icon ?? null,
          startedAt: timer.startedAt.toISOString(),
          elapsedSeconds,
        }
      }

      // Calculate live remaining time for each budget type
      const liveTypeBalances = balance.typeBalances.map((tb) => ({
        ...tb,
        remainingSeconds: calculateRemainingTime(balance, timer ?? null, tb.budgetTypeId, now),
      }))

      return {
        kidId: kid.id,
        kidName: kid.name,
        typeBalances: liveTypeBalances,
        activeTimer,
      }
    })
  )

  return NextResponse.json({
    statuses,
    budgetTypes: allBudgetTypes,
    earningTypes: allEarningTypes,
    serverTime: now.toISOString(),
  })
}
