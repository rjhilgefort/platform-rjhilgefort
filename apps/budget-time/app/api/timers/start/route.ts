import { NextResponse } from 'next/server'
import { eq, sql } from 'drizzle-orm'
import * as Schema from 'effect/Schema'
import { db } from '../../../../db/client'
import { timerEvents, kids, budgetTypes, earningTypes } from '../../../../db/schema'
import { getOrCreateTodayBalance } from '../../../../lib/balance'
import { eventBroadcaster } from '../../../../lib/events'
import { apiHandler, parseBody, NullableNumber } from '../../../../lib/api-utils'

const StartTimerBody = Schema.Struct({
  kidId: Schema.Number,
  budgetTypeId: Schema.optional(NullableNumber),
  earningTypeId: Schema.optional(NullableNumber),
})

export const POST = apiHandler(async (request: Request) => {
  const body = await request.json()
  const parsed = parseBody(StartTimerBody, body)
  if (!parsed.success) return parsed.response

  const { kidId } = parsed.data
  const requestedBudgetTypeId = parsed.data.budgetTypeId ?? undefined
  const earningTypeId = parsed.data.earningTypeId ?? undefined

  // For earning timers, budgetTypeId is optional (will use Extra)
  if (!earningTypeId && !requestedBudgetTypeId) {
    return NextResponse.json(
      { error: 'budgetTypeId required for consumption timers' },
      { status: 400 }
    )
  }

  return await db.transaction(async (tx) => {
    // Verify kid exists
    const kid = await tx.query.kids.findFirst({
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
      earningType = await tx.query.earningTypes.findFirst({
        where: eq(earningTypes.id, earningTypeId),
      })
      if (!earningType) {
        return NextResponse.json({ error: 'Earning type not found' }, { status: 404 })
      }

      budgetType = await tx.query.budgetTypes.findFirst({
        where: eq(budgetTypes.isEarningPool, true),
      })
      if (!budgetType) {
        return NextResponse.json({ error: 'Earning pool budget type not found' }, { status: 500 })
      }
      budgetTypeId = budgetType.id
    } else {
      budgetType = await tx.query.budgetTypes.findFirst({
        where: eq(budgetTypes.id, budgetTypeId!),
      })
      if (!budgetType) {
        return NextResponse.json({ error: 'Budget type not found' }, { status: 404 })
      }
    }

    // Lock any existing active timer row with FOR UPDATE to prevent concurrent starts
    const existingRows = await tx.execute(
      sql`SELECT id FROM timer_events WHERE kid_id = ${kidId} AND ended_at IS NULL FOR UPDATE LIMIT 1`
    )

    const existingRow = existingRows.rows[0]
    if (existingRow) {
      return NextResponse.json(
        { error: 'Timer already active for this kid' },
        { status: 409 }
      )
    }

    // Ensure today's balance exists
    const balance = await getOrCreateTodayBalance(kidId, tx)

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
    const result = await tx
      .insert(timerEvents)
      .values({
        kidId,
        eventType: 'in_progress',
        budgetTypeId: budgetTypeId!,
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
  })
})
