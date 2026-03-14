import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import * as Schema from 'effect/Schema'
import { db } from '../../../db/client'
import { kids, timerEvents, budgetTypes } from '../../../db/schema'
import { updateBalance, getOrCreateTodayBalance } from '../../../lib/balance'
import { eventBroadcaster } from '../../../lib/events'
import { apiHandler, parseBody } from '../../../lib/api-utils'

const BonusBody = Schema.Struct({
  kidId: Schema.Number,
  minutes: Schema.Number,
  budgetTypeId: Schema.Number,
})

export const POST = apiHandler(async (request: Request) => {
  const body = await request.json()
  const parsed = parseBody(BonusBody, body)
  if (!parsed.success) return parsed.response

  const { kidId, minutes, budgetTypeId } = parsed.data

  if (minutes === 0) {
    return NextResponse.json(
      { error: 'minutes must be a non-zero number' },
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

  // Verify budget type exists
  const budgetType = await db.query.budgetTypes.findFirst({
    where: eq(budgetTypes.id, budgetTypeId),
  })

  if (!budgetType) {
    return NextResponse.json({ error: 'Budget type not found' }, { status: 404 })
  }

  const seconds = minutes * 60
  await updateBalance(kidId, budgetTypeId, seconds)

  // Log to history
  const now = new Date()
  await db.insert(timerEvents).values({
    kidId,
    eventType: minutes > 0 ? 'bonus_added' : 'bonus_subtracted',
    budgetTypeId,
    earningTypeId: null,
    startedAt: now,
    endedAt: now,
    seconds,
  })

  const balance = await getOrCreateTodayBalance(kidId)

  // Broadcast event
  eventBroadcaster.emit({ type: 'bonus_added', kidId, budgetTypeId, minutes })

  return NextResponse.json({
    adjusted: { minutes, budgetTypeId, budgetTypeDisplayName: budgetType.displayName },
    balance: {
      typeBalances: balance.typeBalances,
    },
  })
})
