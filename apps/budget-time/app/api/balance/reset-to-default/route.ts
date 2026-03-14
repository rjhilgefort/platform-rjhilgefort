import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import * as Schema from 'effect/Schema'
import { db } from '../../../../db/client'
import { kids, kidBudgetDefaults } from '../../../../db/schema'
import { validateParentPin } from '../../../../lib/auth'
import { setBalance, getOrCreateTodayBalance } from '../../../../lib/balance'
import { eventBroadcaster } from '../../../../lib/events'
import { apiHandler, parseBody } from '../../../../lib/api-utils'

const ResetToDefaultBody = Schema.Struct({
  kidId: Schema.Number,
  pin: Schema.String,
})

export const POST = apiHandler(async (request: Request) => {
  const body = await request.json()
  const parsed = parseBody(ResetToDefaultBody, body)
  if (!parsed.success) return parsed.response

  const { kidId, pin } = parsed.data

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

  // Broadcast event
  eventBroadcaster.emit({ type: 'balances_reset', kidId })

  return NextResponse.json({
    balance: {
      typeBalances: balance.typeBalances,
    },
  })
})
