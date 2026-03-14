import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import * as Schema from 'effect/Schema'
import { db } from '../../../../db/client'
import { kids, budgetTypes } from '../../../../db/schema'
import { validateParentPin } from '../../../../lib/auth'
import { setBalance, getOrCreateTodayBalance } from '../../../../lib/balance'
import { eventBroadcaster } from '../../../../lib/events'
import { apiHandler, parseBody } from '../../../../lib/api-utils'

const SetBalanceBody = Schema.Struct({
  kidId: Schema.Number,
  pin: Schema.String,
  budgetTypeId: Schema.Number,
  minutes: Schema.Number,
})

export const POST = apiHandler(async (request: Request) => {
  const body = await request.json()
  const parsed = parseBody(SetBalanceBody, body)
  if (!parsed.success) return parsed.response

  const { kidId, pin, budgetTypeId, minutes } = parsed.data

  const isValid = await validateParentPin(pin)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
  }

  const kid = await db.query.kids.findFirst({
    where: eq(kids.id, kidId),
  })

  if (!kid) {
    return NextResponse.json({ error: 'Kid not found' }, { status: 404 })
  }

  const budgetType = await db.query.budgetTypes.findFirst({
    where: eq(budgetTypes.id, budgetTypeId),
  })

  if (!budgetType) {
    return NextResponse.json({ error: 'Budget type not found' }, { status: 404 })
  }

  const seconds = minutes * 60
  await setBalance(kidId, budgetTypeId, seconds)

  const balance = await getOrCreateTodayBalance(kidId)
  const typeBalance = balance.typeBalances.find((tb) => tb.budgetTypeId === budgetTypeId)

  // Broadcast event
  eventBroadcaster.emit({
    type: 'balance_updated',
    kidId,
    budgetTypeId,
    remainingSeconds: typeBalance?.remainingSeconds ?? seconds,
  })

  return NextResponse.json({
    balance: {
      typeBalances: balance.typeBalances,
    },
  })
})
