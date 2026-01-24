import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '../../../../db/client'
import { kids, kidBudgetDefaults } from '../../../../db/schema'
import { validateParentPin } from '../../../../lib/auth'
import { setBalance, getOrCreateTodayBalance } from '../../../../lib/balance'

export async function POST(request: Request) {
  const { kidId, pin } = await request.json()

  if (!kidId || !pin) {
    return NextResponse.json(
      { error: 'kidId and pin required' },
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

  // Get kid's budget defaults
  const defaults = await db.query.kidBudgetDefaults.findMany({
    where: eq(kidBudgetDefaults.kidId, kidId),
  })

  // Also get all budget types to handle any without explicit defaults
  const allBudgetTypes = await db.query.budgetTypes.findMany()

  // Reset each budget type to its default (skip earning pool)
  for (const bt of allBudgetTypes) {
    if (bt.isEarningPool) continue
    const defaultConfig = defaults.find((d) => d.budgetTypeId === bt.id)
    const defaultMinutes = defaultConfig?.dailyBudgetMinutes ?? 60
    await setBalance(kidId, bt.id, defaultMinutes * 60)
  }

  const balance = await getOrCreateTodayBalance(kidId)

  return NextResponse.json({
    balance: {
      typeBalances: balance.typeBalances,
    },
  })
}
