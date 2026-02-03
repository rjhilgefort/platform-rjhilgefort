import { NextResponse } from 'next/server'
import { eq, isNull } from 'drizzle-orm'
import { db } from '../../../../db/client'
import { timerEvents, kids, budgetTypes, earningTypes } from '../../../../db/schema'
import { getOrCreateTodayBalance } from '../../../../lib/balance'
import { eventBroadcaster } from '../../../../lib/events'

export async function POST(request: Request) {
  const { kidId, budgetTypeId: requestedBudgetTypeId, earningTypeId } = await request.json()

  // For earning timers, budgetTypeId is optional (will use Extra)
  if (!kidId || (!earningTypeId && !requestedBudgetTypeId)) {
    return NextResponse.json(
      { error: 'kidId required, budgetTypeId required for consumption timers' },
      { status: 400 }
    )
  }

  // Verify kid exists
  const kid = await db.query.kids.findFirst({
    where: eq(kids.id, kidId),
  })

  if (!kid) {
    return NextResponse.json({ error: 'Kid not found' }, { status: 404 })
  }

  // If earning timer, verify earning type and get Extra budget type
  let earningType = null
  let budgetTypeId = requestedBudgetTypeId
  let budgetType = null

  if (earningTypeId) {
    earningType = await db.query.earningTypes.findFirst({
      where: eq(earningTypes.id, earningTypeId),
    })
    if (!earningType) {
      return NextResponse.json({ error: 'Earning type not found' }, { status: 404 })
    }

    // Force earning timers to use the earning pool budget type
    budgetType = await db.query.budgetTypes.findFirst({
      where: eq(budgetTypes.isEarningPool, true),
    })
    if (!budgetType) {
      return NextResponse.json({ error: 'Earning pool budget type not found' }, { status: 500 })
    }
    budgetTypeId = budgetType.id
  } else {
    // Verify budget type exists for consumption timers
    budgetType = await db.query.budgetTypes.findFirst({
      where: eq(budgetTypes.id, budgetTypeId),
    })
    if (!budgetType) {
      return NextResponse.json({ error: 'Budget type not found' }, { status: 404 })
    }
  }

  // Check for existing active timer (ended_at IS NULL means active)
  const existingTimer = await db.query.timerEvents.findFirst({
    where: (te, { and }) => and(eq(te.kidId, kidId), isNull(te.endedAt)),
  })

  if (existingTimer) {
    return NextResponse.json(
      { error: 'Timer already active for this kid' },
      { status: 409 }
    )
  }

  // Ensure today's balance exists
  const balance = await getOrCreateTodayBalance(kidId)

  // For consumption timers (no earningTypeId), check if there's time remaining
  // Exception: Extra (isEarningPool) can start even at 0 or negative
  if (!earningTypeId && !budgetType.isEarningPool) {
    const typeBalance = balance.typeBalances.find((tb) => tb.budgetTypeId === budgetTypeId)
    if (!typeBalance || typeBalance.remainingSeconds <= 0) {
      return NextResponse.json(
        { error: 'No time remaining for this budget' },
        { status: 400 }
      )
    }

    // Check if Extra is negative - prevent starting other budget timers until paid back
    const extraBalance = balance.typeBalances.find((tb) => tb.isEarningPool)
    if (extraBalance && extraBalance.remainingSeconds < 0) {
      return NextResponse.json(
        { error: 'Extra balance must be paid back before starting other timers' },
        { status: 400 }
      )
    }
  }

  // Create active timer (in_progress with ended_at = NULL)
  const result = await db
    .insert(timerEvents)
    .values({
      kidId,
      eventType: 'in_progress',
      budgetTypeId,
      earningTypeId: earningTypeId ?? null,
      startedAt: new Date(),
      endedAt: null,
      seconds: 0,
    })
    .returning()

  const timer = result[0]
  if (!timer) {
    return NextResponse.json({ error: 'Failed to create timer' }, { status: 500 })
  }

  // Broadcast event to connected clients
  eventBroadcaster.emit({
    type: 'timer_started',
    kidId,
    budgetTypeId: earningTypeId ? undefined : budgetTypeId,
    earningTypeId: earningTypeId ?? undefined,
  })

  return NextResponse.json({
    timer: {
      id: timer.id,
      kidId: timer.kidId,
      budgetTypeId: timer.budgetTypeId,
      budgetTypeSlug: budgetType.slug,
      budgetTypeDisplayName: budgetType.displayName,
      earningTypeId: timer.earningTypeId,
      earningTypeSlug: earningType?.slug ?? null,
      earningTypeDisplayName: earningType?.displayName ?? null,
      startedAt: timer.startedAt?.toISOString() ?? new Date().toISOString(),
    },
    balance: {
      typeBalances: balance.typeBalances,
    },
  })
}
