import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '../../../../db/client'
import { kids, budgetTypes } from '../../../../db/schema'
import { validateParentPin } from '../../../../lib/auth'
import { setBalance, getOrCreateTodayBalance } from '../../../../lib/balance'
import { eventBroadcaster } from '../../../../lib/events'

export async function POST(request: Request) {
  const { kidId, pin, budgetTypeId, minutes } = await request.json()

  if (!kidId || !pin || !budgetTypeId || typeof minutes !== 'number') {
    return NextResponse.json(
      { error: 'kidId, pin, budgetTypeId, and minutes required' },
      { status: 400 }
    )
  }

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
}
