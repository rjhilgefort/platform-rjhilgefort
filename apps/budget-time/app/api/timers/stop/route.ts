import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '../../../../db/client'
import { activeTimers, timerHistory, budgetTypes, earningTypes } from '../../../../db/schema'
import {
  updateBalance,
  getOrCreateTodayBalance,
  getEarningPoolBudgetType,
  getAppSettings,
} from '../../../../lib/balance'
import { calculateElapsedSeconds, calculateEarnings } from '../../../../lib/timer-logic'

export async function POST(request: Request) {
  const { kidId } = await request.json()

  if (!kidId) {
    return NextResponse.json({ error: 'kidId required' }, { status: 400 })
  }

  // Find active timer
  const timer = await db.query.activeTimers.findFirst({
    where: eq(activeTimers.kidId, kidId),
  })

  if (!timer) {
    return NextResponse.json(
      { error: 'No active timer for this kid' },
      { status: 404 }
    )
  }

  const elapsedSeconds = calculateElapsedSeconds(timer.startedAt)

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
      const settings = await getAppSettings()
      penalty = settings.negativeBalancePenalty
    }

    const earnedSeconds = calculateEarnings(elapsedSeconds, earningType, penalty)
    await updateBalance(kidId, timer.budgetTypeId, earnedSeconds)

    // Log to history
    await db.insert(timerHistory).values({
      kidId,
      eventType: 'earned',
      budgetTypeId: timer.budgetTypeId,
      earningTypeId: timer.earningTypeId,
      seconds: earnedSeconds,
    })

    // Delete active timer
    await db.delete(activeTimers).where(eq(activeTimers.id, timer.id))

    // Get updated balance
    const balance = await getOrCreateTodayBalance(kidId)

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

      await db.insert(timerHistory).values({
        kidId,
        eventType: 'budget_used',
        budgetTypeId: timer.budgetTypeId,
        earningTypeId: null,
        seconds: elapsedSeconds,
      })
    } else if (elapsedSeconds <= remainingSeconds) {
      // No overflow - deduct normally
      await updateBalance(kidId, timer.budgetTypeId, -elapsedSeconds)

      await db.insert(timerHistory).values({
        kidId,
        eventType: 'budget_used',
        budgetTypeId: timer.budgetTypeId,
        earningTypeId: null,
        seconds: elapsedSeconds,
      })
    } else {
      // Overflow: deduct all remaining from original, overflow from Extra
      const overflow = elapsedSeconds - remainingSeconds

      // Deduct all remaining from original budget (sets to 0)
      await updateBalance(kidId, timer.budgetTypeId, -remainingSeconds)

      // Log original budget usage
      await db.insert(timerHistory).values({
        kidId,
        eventType: 'budget_used',
        budgetTypeId: timer.budgetTypeId,
        earningTypeId: null,
        seconds: remainingSeconds,
      })

      // Deduct overflow from Extra (earning pool) if it exists
      if (earningPool) {
        await updateBalance(kidId, earningPool.id, -overflow)

        // Log overflow to Extra
        await db.insert(timerHistory).values({
          kidId,
          eventType: 'budget_used',
          budgetTypeId: earningPool.id,
          earningTypeId: null,
          seconds: overflow,
        })
      }
    }

    // Delete active timer
    await db.delete(activeTimers).where(eq(activeTimers.id, timer.id))

    // Get updated balance
    const balance = await getOrCreateTodayBalance(kidId)

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
