import { NextResponse } from 'next/server'
import { eq, isNull } from 'drizzle-orm'
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

  // Find active timer (ended_at IS NULL means active)
  const timer = await db.query.timerEvents.findFirst({
    where: (te, { and }) => and(eq(te.kidId, kidId), isNull(te.endedAt)),
  })

  if (!timer) {
    return NextResponse.json(
      { error: 'No active timer for this kid' },
      { status: 404 }
    )
  }

  if (!timer.startedAt) {
    return NextResponse.json({ error: 'Timer has no start time' }, { status: 500 })
  }

  const now = new Date()
  const elapsedSeconds = calculateElapsedSeconds(timer.startedAt, now)

  // Get budget type info
  const budgetType = await db.query.budgetTypes.findFirst({
    where: eq(budgetTypes.id, timer.budgetTypeId),
  })

  if (!budgetType) {
    return NextResponse.json({ error: 'Budget type not found' }, { status: 404 })
  }

  // Process based on timer type
  if (timer.earningTypeId) {
    // Earning timer: add earned time to target budget
    const earningType = await db.query.earningTypes.findFirst({
      where: eq(earningTypes.id, timer.earningTypeId),
    })

    if (!earningType) {
      return NextResponse.json({ error: 'Earning type not found' }, { status: 404 })
    }

    // Check if kid has negative Extra balance (apply penalty if so)
    const currentBalance = await getOrCreateTodayBalance(kidId)
    const extraTypeBalance = currentBalance.typeBalances.find((tb) => tb.isEarningPool)
    const extraBalance = extraTypeBalance?.remainingSeconds ?? 0

    let penalty = 0
    if (extraBalance < 0) {
      penalty = await getNegativeBalancePenalty()
    }

    const earnedSeconds = calculateEarnings(elapsedSeconds, earningType, penalty)
    await updateBalance(kidId, timer.budgetTypeId, earnedSeconds)

    // Update timer to completed state
    await db
      .update(timerEvents)
      .set({
        eventType: 'earned',
        endedAt: now,
        seconds: earnedSeconds,
      })
      .where(eq(timerEvents.id, timer.id))

    // Get updated balance
    const balance = await getOrCreateTodayBalance(kidId)

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
    // Get current balance to determine overflow
    const currentBalance = await getOrCreateTodayBalance(kidId)
    const currentTypeBalance = currentBalance.typeBalances.find(
      (tb) => tb.budgetTypeId === timer.budgetTypeId
    )

    if (!currentTypeBalance) {
      return NextResponse.json({ error: 'Type balance not found' }, { status: 404 })
    }

    const remainingSeconds = currentTypeBalance.remainingSeconds
    const earningPool = await getEarningPoolBudgetType()

    // Check if this IS the earning pool (Extra) - let it go negative directly
    if (budgetType.isEarningPool) {
      await updateBalance(kidId, timer.budgetTypeId, -elapsedSeconds)

      // Update timer to completed state
      await db
        .update(timerEvents)
        .set({
          eventType: 'budget_used',
          endedAt: now,
          seconds: elapsedSeconds,
        })
        .where(eq(timerEvents.id, timer.id))
    } else if (elapsedSeconds <= remainingSeconds) {
      // No overflow - deduct normally
      await updateBalance(kidId, timer.budgetTypeId, -elapsedSeconds)

      // Update timer to completed state
      await db
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

      // Deduct all remaining from original budget (sets to 0)
      await updateBalance(kidId, timer.budgetTypeId, -remainingSeconds)

      // Update original timer with the non-overflow portion
      await db
        .update(timerEvents)
        .set({
          eventType: 'budget_used',
          endedAt: now,
          seconds: remainingSeconds,
        })
        .where(eq(timerEvents.id, timer.id))

      // Deduct overflow from Extra (earning pool) if it exists
      if (earningPool) {
        await updateBalance(kidId, earningPool.id, -overflow)

        // Create separate entry for overflow to Extra
        await db.insert(timerEvents).values({
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
    const balance = await getOrCreateTodayBalance(kidId)

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
}
