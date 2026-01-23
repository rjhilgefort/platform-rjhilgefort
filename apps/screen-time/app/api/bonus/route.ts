import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '../../../db/client'
import { kids, timerHistory, budgetTypes } from '../../../db/schema'
import { validateParentPin } from '../../../lib/auth'
import { updateBalance, getOrCreateTodayBalance } from '../../../lib/balance'

export async function POST(request: Request) {
  const { kidId, pin, minutes, budgetTypeId } = await request.json()

  if (!kidId || !pin || !minutes || !budgetTypeId) {
    return NextResponse.json(
      { error: 'kidId, pin, minutes, and budgetTypeId required' },
      { status: 400 }
    )
  }

  if (typeof minutes !== 'number' || minutes <= 0) {
    return NextResponse.json(
      { error: 'minutes must be a positive number' },
      { status: 400 }
    )
  }

  // Validate parent PIN
  const isValid = await validateParentPin(pin)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
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
  await db.insert(timerHistory).values({
    kidId,
    eventType: 'bonus_added',
    budgetTypeId,
    earningTypeId: null,
    seconds,
  })

  const balance = await getOrCreateTodayBalance(kidId)

  return NextResponse.json({
    added: { minutes, budgetTypeId, budgetTypeDisplayName: budgetType.displayName },
    balance: {
      typeBalances: balance.typeBalances,
    },
  })
}
