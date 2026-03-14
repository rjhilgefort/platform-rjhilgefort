import { NextResponse } from 'next/server'
import { db } from '../../../db/client'
import { getOrCreateTodayBalance, getAllBudgetTypes } from '../../../lib/balance'
import { apiHandlerNoArgs } from '../../../lib/api-utils'

export const dynamic = 'force-dynamic'

export const GET = apiHandlerNoArgs(async () => {
  const allKids = await db.query.kids.findMany({
    orderBy: (kids, { asc }) => asc(kids.id),
  })
  const allBudgetTypes = await getAllBudgetTypes()

  const balances = await Promise.all(
    allKids.map(async (kid) => {
      const balance = await getOrCreateTodayBalance(kid.id)
      return {
        kidId: kid.id,
        kidName: kid.name,
        typeBalances: balance.typeBalances,
      }
    })
  )

  return NextResponse.json({ balances, budgetTypes: allBudgetTypes })
})
