import { NextResponse } from 'next/server'
import { eq, sql } from 'drizzle-orm'
import { db } from '../../../../db/client'
import { timerEvents, budgetTypes, earningTypes } from '../../../../db/schema'
import {
  updateBalance,
  getOrCreateTodayBalance,
  getEarningPoolBudgetType,
  getNegativeBalancePenalty,
} from '../../../../lib/balance'
import { calculateElapsedSeconds, calculateEarnings } from '../../../../lib/timer-logic'
import { eventBroadcaster } from '../../../../lib/events'

export async function POST(request: Request) {
  const { kidId } = await request.json()

  if (!kidId) {
    return NextResponse.json({ error: 'kidId required' }, { status: 400 })
  }

  return await db.transaction(async (tx) => {
    // Lock the active timer row with FOR UPDATE to prevent concurrent stops
    const rows = await tx.execute(
      sql`SELECT * FROM timer_events WHERE kid_id = ${kidId} AND ended_at IS NULL FOR UPDATE LIMIT 1`
    )

    const row = rows.rows[0]
    if (!row) {
      return NextResponse.json(
        { error: 'No active timer for this kid' },
        { status: 404 }
      )
    }

    // Map snake_case row to expected shape
    const timer = {
      id: row.id as number,
      kidId: row.kid_id as number,
      budgetTypeId: row.budget_type_id as number,
      earningTypeId: row.earning_type_id as number | null,
      eventType: row.event_type as string,
      startedAt: row.started_at ? new Date(row.started_at as string) : null,
      endedAt: row.ended_at as Date | null,
      seconds: row.seconds as number,
    }

    if (!timer.startedAt) {
      return NextResponse.json({ error: 'Timer has no start time' }, { status: 500 })
    }

    const now = new Date()
    const elapsedSeconds = calculateElapsedSeconds(timer.startedAt, now)

    // Get budget type info
    const budgetType = await tx.query.budgetTypes.findFirst({
      where: eq(budgetTypes.id, timer.budgetTypeId),
    })

    if (!budgetType) {
      return NextResponse.json({ error: 'Budget type not found' }, { status: 404 })
    }

    // Process based on timer type
    if (timer.earningTypeId) {
      // Earning timer: add earned time to target budget
      const earningType = await tx.query.earningTypes.findFirst({
        where: eq(earningTypes.id, timer.earningTypeId),
      })

      if (!earningType) {
        return NextResponse.json({ error: 'Earning type not found' }, { status: 404 })
      }

      // Check if kid has negative Extra balance (apply penalty if so)
      const currentBalance = await getOrCreateTodayBalance(kidId, tx)
      const extraTypeBalance = currentBalance.typeBalances.find((tb) => tb.isEarningPool)
      const extraBalance = extraTypeBalance?.remainingSeconds ?? 0

      let penalty = 0
      if (extraBalance < 0) {
        penalty = await getNegativeBalancePenalty(tx)
      }

      const earnedSeconds = calculateEarnings(elapsedSeconds, earningType, penalty)
      await updateBalance(kidId, timer.budgetTypeId, earnedSeconds, tx)

      // Update timer to completed state
      await tx
        .update(timerEvents)
        .set({
          eventType: 'earned',
          endedAt: now,
          seconds: earnedSeconds,
        })
        .where(eq(timerEvents.id, timer.id))

      // Get updated balance
      const balance = await getOrCreateTodayBalance(kidId, tx)

      // Broadcast event
      eventBroadcaster.emit({ type: 'timer_stopped', kidId, elapsedSeconds: earnedSeconds })

      return NextResponse.json({
        stopped: {
          budgetTypeId: timer.budgetTypeId,
          budgetTypeSlug: budgetType.slug,
          budgetTypeDisplayName: budgetType.displayName,
          earningTypeId: timer.earningTypeId,
          earningTypeSlug: earningType.slug,
          earningTypeDisplayName: earningType.displayName,
          elapsedSeconds,
          earnedSeconds,
        },
        balance: {
          typeBalances: balance.typeBalances,
        },
      })
    } else {
      // Consumption timer: subtract elapsed time from budget
      const currentBalance = await getOrCreateTodayBalance(kidId, tx)
      const currentTypeBalance = currentBalance.typeBalances.find(
        (tb) => tb.budgetTypeId === timer.budgetTypeId
      )

      if (!currentTypeBalance) {
        return NextResponse.json({ error: 'Type balance not found' }, { status: 404 })
      }

      const remainingSeconds = currentTypeBalance.remainingSeconds
      const earningPool = await getEarningPoolBudgetType(tx)

      // Check if this IS the earning pool (Extra) - let it go negative directly
      if (budgetType.isEarningPool) {
        await updateBalance(kidId, timer.budgetTypeId, -elapsedSeconds, tx)

        await tx
          .update(timerEvents)
          .set({
            eventType: 'budget_used',
            endedAt: now,
            seconds: elapsedSeconds,
          })
          .where(eq(timerEvents.id, timer.id))
      } else if (elapsedSeconds <= remainingSeconds) {
        // No overflow - deduct normally
        await updateBalance(kidId, timer.budgetTypeId, -elapsedSeconds, tx)

        await tx
          .update(timerEvents)
          .set({
            eventType: 'budget_used',
            endedAt: now,
            seconds: elapsedSeconds,
          })
          .where(eq(timerEvents.id, timer.id))
      } else {
        // Overflow: deduct all remaining from original, overflow from Extra
        const overflow = elapsedSeconds - remainingSeconds

        await updateBalance(kidId, timer.budgetTypeId, -remainingSeconds, tx)

        await tx
          .update(timerEvents)
          .set({
            eventType: 'budget_used',
            endedAt: now,
            seconds: remainingSeconds,
          })
          .where(eq(timerEvents.id, timer.id))

        if (earningPool) {
          await updateBalance(kidId, earningPool.id, -overflow, tx)

          await tx.insert(timerEvents).values({
            kidId,
            eventType: 'budget_used',
            budgetTypeId: earningPool.id,
            earningTypeId: null,
            startedAt: timer.startedAt,
            endedAt: now,
            seconds: overflow,
          })
        }
      }

      // Get updated balance
      const balance = await getOrCreateTodayBalance(kidId, tx)

      // Broadcast event
      eventBroadcaster.emit({ type: 'timer_stopped', kidId, elapsedSeconds })

      return NextResponse.json({
        stopped: {
          budgetTypeId: timer.budgetTypeId,
          budgetTypeSlug: budgetType.slug,
          budgetTypeDisplayName: budgetType.displayName,
          earningTypeId: null,
          earningTypeSlug: null,
          earningTypeDisplayName: null,
          elapsedSeconds,
        },
        balance: {
          typeBalances: balance.typeBalances,
        },
      })
    }
  })
}
