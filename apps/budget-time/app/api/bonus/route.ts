import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '../../../db/client'
import { kids, timerEvents, budgetTypes } from '../../../db/schema'
import { updateBalance, getOrCreateTodayBalance } from '../../../lib/balance'

export async function POST(request: Request) {
  const { kidId, minutes, budgetTypeId } = await request.json()

  if (!kidId || minutes === undefined || !budgetTypeId) {
    return NextResponse.json(
      { error: 'kidId, minutes, and budgetTypeId required' },
      { status: 400 }
    )
  }

  if (typeof minutes !== 'number' || minutes === 0) {
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

  return NextResponse.json({
    adjusted: { minutes, budgetTypeId, budgetTypeDisplayName: budgetType.displayName },
    balance: {
      typeBalances: balance.typeBalances,
    },
  })
}
