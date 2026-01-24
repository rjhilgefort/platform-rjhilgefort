import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '../../../../db/client'
import { activeTimers, timerHistory, budgetTypes, earningTypes } from '../../../../db/schema'
import { updateBalance, getOrCreateTodayBalance } from '../../../../lib/balance'
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

    const earnedSeconds = calculateEarnings(elapsedSeconds, earningType)
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
    await updateBalance(kidId, timer.budgetTypeId, -elapsedSeconds)

    // Log to history
    await db.insert(timerHistory).values({
      kidId,
      eventType: 'budget_used',
      budgetTypeId: timer.budgetTypeId,
      earningTypeId: null,
      seconds: elapsedSeconds,
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
