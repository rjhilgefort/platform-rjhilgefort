import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '../../../db/client'
import { budgetTypes, earningTypes, kidBudgetDefaults } from '../../../db/schema'
import { getNegativeBalancePenalty, setAppSetting } from '../../../lib/balance'
import { validateParentPin } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const allKids = await db.query.kids.findMany({
    orderBy: (kids, { asc }) => asc(kids.id),
  })
  const allBudgetTypes = await db.query.budgetTypes.findMany({
    orderBy: (bt, { asc }) => asc(bt.displayName),
  })
  const allEarningTypes = await db.query.earningTypes.findMany({
    orderBy: (et, { asc }) => asc(et.displayName),
  })
  const allKidBudgetDefaults = await db.query.kidBudgetDefaults.findMany()
  const negativeBalancePenalty = await getNegativeBalancePenalty()

  // Build kid objects with budget defaults
  const kidsWithDefaults = allKids.map((kid) => {
    const defaults = allKidBudgetDefaults.filter((d) => d.kidId === kid.id)
    const budgetDefaults = allBudgetTypes.map((bt) => {
      const d = defaults.find((def) => def.budgetTypeId === bt.id)
      return {
        budgetTypeId: bt.id,
        budgetTypeSlug: bt.slug,
        budgetTypeDisplayName: bt.displayName,
        dailyBudgetMinutes: d?.dailyBudgetMinutes ?? 60,
      }
    })
    return {
      id: kid.id,
      name: kid.name,
      budgetDefaults,
    }
  })

  return NextResponse.json({
    kids: kidsWithDefaults,
    budgetTypes: allBudgetTypes,
    earningTypes: allEarningTypes,
    negativeBalancePenalty,
  })
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { pin, action } = body

  if (!pin) {
    return NextResponse.json({ error: 'pin required' }, { status: 400 })
  }

  const isValid = await validateParentPin(pin)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
  }

  switch (action) {
    case 'updateKidBudgetDefault': {
      const { kidId, budgetTypeId, dailyBudgetMinutes } = body
      if (!kidId || !budgetTypeId || typeof dailyBudgetMinutes !== 'number') {
        return NextResponse.json(
          { error: 'kidId, budgetTypeId, and dailyBudgetMinutes required' },
          { status: 400 }
        )
      }

      // Upsert kid budget default
      const existing = await db.query.kidBudgetDefaults.findFirst({
        where: (kbd, { and, eq }) =>
          and(eq(kbd.kidId, kidId), eq(kbd.budgetTypeId, budgetTypeId)),
      })

      if (existing) {
        await db
          .update(kidBudgetDefaults)
          .set({ dailyBudgetMinutes })
          .where(eq(kidBudgetDefaults.id, existing.id))
      } else {
        await db.insert(kidBudgetDefaults).values({
          kidId,
          budgetTypeId,
          dailyBudgetMinutes,
        })
      }

      return NextResponse.json({ success: true })
    }

    case 'createBudgetType': {
      const { slug, displayName, allowCarryover, icon } = body
      if (!slug || !displayName) {
        return NextResponse.json(
          { error: 'slug and displayName required' },
          { status: 400 }
        )
      }

      const [newBudgetType] = await db
        .insert(budgetTypes)
        .values({
          slug,
          displayName,
          allowCarryover: allowCarryover ?? true,
          icon: icon ?? 'TbStarFilled',
        })
        .returning()

      // Create defaults for all kids
      const allKids = await db.query.kids.findMany()
      if (allKids.length > 0 && newBudgetType) {
        await db.insert(kidBudgetDefaults).values(
          allKids.map((kid) => ({
            kidId: kid.id,
            budgetTypeId: newBudgetType.id,
            dailyBudgetMinutes: 60,
          }))
        )
      }

      return NextResponse.json({ budgetType: newBudgetType })
    }

    case 'updateBudgetType': {
      const { budgetTypeId, displayName, allowCarryover, icon } = body
      if (!budgetTypeId) {
        return NextResponse.json({ error: 'budgetTypeId required' }, { status: 400 })
      }

      const updates: Record<string, boolean | string> = {}
      if (typeof displayName === 'string') updates.displayName = displayName
      if (typeof allowCarryover === 'boolean') updates.allowCarryover = allowCarryover
      if (typeof icon === 'string') updates.icon = icon

      if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
      }

      const [updated] = await db
        .update(budgetTypes)
        .set(updates)
        .where(eq(budgetTypes.id, budgetTypeId))
        .returning()

      return NextResponse.json({ budgetType: updated })
    }

    case 'deleteBudgetType': {
      const { budgetTypeId } = body
      if (!budgetTypeId) {
        return NextResponse.json({ error: 'budgetTypeId required' }, { status: 400 })
      }

      // Check if this is the protected earning pool budget type
      const budgetTypeToDelete = await db.query.budgetTypes.findFirst({
        where: eq(budgetTypes.id, budgetTypeId),
      })
      if (budgetTypeToDelete?.isEarningPool) {
        return NextResponse.json(
          { error: 'Cannot delete the earning pool budget type' },
          { status: 400 }
        )
      }

      await db.delete(budgetTypes).where(eq(budgetTypes.id, budgetTypeId))
      return NextResponse.json({ success: true })
    }

    case 'createEarningType': {
      const { slug, displayName, ratioNumerator, ratioDenominator, icon } = body
      if (!slug || !displayName) {
        return NextResponse.json(
          { error: 'slug and displayName required' },
          { status: 400 }
        )
      }

      const [newEarningType] = await db
        .insert(earningTypes)
        .values({
          slug,
          displayName,
          ratioNumerator: ratioNumerator ?? 1,
          ratioDenominator: ratioDenominator ?? 1,
          icon: icon ?? 'TbStarsFilled',
        })
        .returning()

      return NextResponse.json({ earningType: newEarningType })
    }

    case 'updateEarningType': {
      const { earningTypeId, displayName, ratioNumerator, ratioDenominator, icon } = body
      if (!earningTypeId) {
        return NextResponse.json({ error: 'earningTypeId required' }, { status: 400 })
      }

      const updates: Record<string, string | number> = {}
      if (typeof displayName === 'string') updates.displayName = displayName
      if (typeof ratioNumerator === 'number') updates.ratioNumerator = ratioNumerator
      if (typeof ratioDenominator === 'number') updates.ratioDenominator = ratioDenominator
      if (typeof icon === 'string') updates.icon = icon

      if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
      }

      const [updated] = await db
        .update(earningTypes)
        .set(updates)
        .where(eq(earningTypes.id, earningTypeId))
        .returning()

      return NextResponse.json({ earningType: updated })
    }

    case 'deleteEarningType': {
      const { earningTypeId } = body
      if (!earningTypeId) {
        return NextResponse.json({ error: 'earningTypeId required' }, { status: 400 })
      }

      await db.delete(earningTypes).where(eq(earningTypes.id, earningTypeId))
      return NextResponse.json({ success: true })
    }

    case 'updateNegativeBalancePenalty': {
      const { negativeBalancePenalty } = body
      if (typeof negativeBalancePenalty !== 'number') {
        return NextResponse.json(
          { error: 'negativeBalancePenalty required and must be a number' },
          { status: 400 }
        )
      }
      if (negativeBalancePenalty > 0) {
        return NextResponse.json(
          { error: 'Penalty must be negative or zero' },
          { status: 400 }
        )
      }

      await setAppSetting('negativeBalancePenalty', negativeBalancePenalty.toString())
      return NextResponse.json({ negativeBalancePenalty })
    }

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }
}
