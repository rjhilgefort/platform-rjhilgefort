import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '../../../../db/client'
import { kids, earningTypes, timerHistory } from '../../../../db/schema'
import { validateParentPin } from '../../../../lib/auth'
import { updateBalance, getOrCreateTodayBalance, getEarningPoolBudgetType } from '../../../../lib/balance'
import { calculateEarnings } from '../../../../lib/timer-logic'

export async function POST(request: Request) {
  const body = await request.json()
  const kidId = Number(body.kidId)
  const pin = body.pin
  const earningTypeId = Number(body.earningTypeId)
  const activityMinutes = Number(body.activityMinutes)

  if (!kidId || !pin || !earningTypeId || !activityMinutes) {
    return NextResponse.json(
      { error: 'kidId, pin, earningTypeId, and activityMinutes required' },
      { status: 400 }
    )
  }

  if (activityMinutes <= 0) {
    return NextResponse.json(
      { error: 'activityMinutes must be positive' },
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

  const earningType = await db.query.earningTypes.findFirst({
    where: eq(earningTypes.id, earningTypeId),
  })

  if (!earningType) {
    return NextResponse.json({ error: 'Earning type not found' }, { status: 404 })
  }

  const earningPool = await getEarningPoolBudgetType()
  if (!earningPool) {
    return NextResponse.json({ error: 'No earning pool configured' }, { status: 500 })
  }

  // Calculate earned seconds using the ratio
  const activitySeconds = activityMinutes * 60
  const earnedSeconds = calculateEarnings(activitySeconds, earningType)

  try {
    // Add earned time to the Extra balance
    await updateBalance(kidId, earningPool.id, earnedSeconds)

    // Log to history
    await db.insert(timerHistory).values({
      kidId,
      eventType: 'simulated_earned',
      budgetTypeId: earningPool.id,
      earningTypeId,
      seconds: earnedSeconds,
    })
  } catch (err) {
    console.error('Failed to update balance:', err)
    return NextResponse.json({ error: 'Failed to save earned time' }, { status: 500 })
  }

  const balance = await getOrCreateTodayBalance(kidId)
  const earnedMinutes = Math.floor(earnedSeconds / 60)

  return NextResponse.json({
    earned: {
      activityMinutes,
      earnedMinutes,
      earningTypeDisplayName: earningType.displayName,
      ratioNumerator: earningType.ratioNumerator,
      ratioDenominator: earningType.ratioDenominator,
    },
    balance: {
      typeBalances: balance.typeBalances,
    },
  })
}
