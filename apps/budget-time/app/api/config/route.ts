import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import * as Schema from 'effect/Schema'
import { db } from '../../../db/client'
import { budgetTypes, earningTypes, kidBudgetDefaults, kids } from '../../../db/schema'
import { getNegativeBalancePenalty, getTimezone, getResetHour, setAppSetting } from '../../../lib/balance'
import { validateParentPin } from '../../../lib/auth'
import { apiHandler, apiHandlerNoArgs, parseBody, NullableNumber, NullableString, NullableBoolean } from '../../../lib/api-utils'

export const dynamic = 'force-dynamic'

export const GET = apiHandlerNoArgs(async () => {
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
  const timezone = await getTimezone()
  const resetHour = await getResetHour()

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
      profilePicture: kid.profilePicture,
      budgetDefaults,
    }
  })

  return NextResponse.json({
    kids: kidsWithDefaults,
    budgetTypes: allBudgetTypes,
    earningTypes: allEarningTypes,
    negativeBalancePenalty,
    timezone,
    resetHour,
  })
})

// The PUT route uses an action-based dispatch pattern.
// We validate pin + action at the top level, then validate action-specific fields inline.
const ConfigPutBase = Schema.Struct({
  pin: Schema.String,
  action: Schema.String,
})

export const PUT = apiHandler(async (request: Request) => {
  const body = await request.json()
  const baseParsed = parseBody(ConfigPutBase, body)
  if (!baseParsed.success) return baseParsed.response

  const { pin, action } = baseParsed.data

  const isValid = await validateParentPin(pin)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
  }

  switch (action) {
    case 'updateKidBudgetDefault': {
      const schema = Schema.Struct({
        kidId: Schema.Number,
        budgetTypeId: Schema.Number,
        dailyBudgetMinutes: Schema.Number,
      })
      const parsed = parseBody(schema, body)
      if (!parsed.success) return parsed.response

      const { kidId, budgetTypeId, dailyBudgetMinutes } = parsed.data

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
      const schema = Schema.Struct({
        slug: Schema.String,
        displayName: Schema.String,
        allowCarryover: Schema.optional(NullableBoolean),
        icon: Schema.optional(NullableString),
      })
      const parsed = parseBody(schema, body)
      if (!parsed.success) return parsed.response

      const { slug, displayName, allowCarryover, icon } = parsed.data

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
      const schema = Schema.Struct({
        budgetTypeId: Schema.Number,
        displayName: Schema.optional(NullableString),
        allowCarryover: Schema.optional(NullableBoolean),
        icon: Schema.optional(NullableString),
      })
      const parsed = parseBody(schema, body)
      if (!parsed.success) return parsed.response

      const { budgetTypeId, displayName, allowCarryover, icon } = parsed.data

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
      const schema = Schema.Struct({
        budgetTypeId: Schema.Number,
      })
      const parsed = parseBody(schema, body)
      if (!parsed.success) return parsed.response

      const { budgetTypeId } = parsed.data

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
      const schema = Schema.Struct({
        slug: Schema.String,
        displayName: Schema.String,
        ratioNumerator: Schema.optional(NullableNumber),
        ratioDenominator: Schema.optional(NullableNumber),
        icon: Schema.optional(NullableString),
      })
      const parsed = parseBody(schema, body)
      if (!parsed.success) return parsed.response

      const { slug, displayName, ratioNumerator, ratioDenominator, icon } = parsed.data

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
      const schema = Schema.Struct({
        earningTypeId: Schema.Number,
        displayName: Schema.optional(NullableString),
        ratioNumerator: Schema.optional(NullableNumber),
        ratioDenominator: Schema.optional(NullableNumber),
        icon: Schema.optional(NullableString),
      })
      const parsed = parseBody(schema, body)
      if (!parsed.success) return parsed.response

      const { earningTypeId, displayName, ratioNumerator, ratioDenominator, icon } = parsed.data

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
      const schema = Schema.Struct({
        earningTypeId: Schema.Number,
      })
      const parsed = parseBody(schema, body)
      if (!parsed.success) return parsed.response

      const { earningTypeId } = parsed.data

      await db.delete(earningTypes).where(eq(earningTypes.id, earningTypeId))
      return NextResponse.json({ success: true })
    }

    case 'updateNegativeBalancePenalty': {
      const schema = Schema.Struct({
        negativeBalancePenalty: Schema.Number,
      })
      const parsed = parseBody(schema, body)
      if (!parsed.success) return parsed.response

      const { negativeBalancePenalty } = parsed.data

      if (negativeBalancePenalty > 0) {
        return NextResponse.json(
          { error: 'Penalty must be negative or zero' },
          { status: 400 }
        )
      }

      await setAppSetting('negativeBalancePenalty', negativeBalancePenalty.toString())
      return NextResponse.json({ negativeBalancePenalty })
    }

    case 'updateTimezone': {
      const schema = Schema.Struct({
        timezone: Schema.String,
      })
      const parsed = parseBody(schema, body)
      if (!parsed.success) return parsed.response

      const { timezone } = parsed.data

      await setAppSetting('timezone', timezone)
      return NextResponse.json({ timezone })
    }

    case 'updateResetHour': {
      const schema = Schema.Struct({
        resetHour: Schema.Number,
      })
      const parsed = parseBody(schema, body)
      if (!parsed.success) return parsed.response

      const { resetHour } = parsed.data

      if (resetHour < 0 || resetHour > 23) {
        return NextResponse.json(
          { error: 'resetHour must be a number between 0 and 23' },
          { status: 400 }
        )
      }

      await setAppSetting('resetHour', resetHour.toString())
      return NextResponse.json({ resetHour })
    }

    case 'updateKidProfilePicture': {
      const schema = Schema.Struct({
        kidId: Schema.Number,
        profilePicture: Schema.optional(NullableString),
      })
      const parsed = parseBody(schema, body)
      if (!parsed.success) return parsed.response

      const { kidId, profilePicture } = parsed.data

      // Validate base64 image format if provided
      if (profilePicture && !profilePicture.startsWith('data:image/')) {
        return NextResponse.json(
          { error: 'Invalid image format - must be a data URL' },
          { status: 400 }
        )
      }

      await db
        .update(kids)
        .set({ profilePicture: profilePicture ?? null })
        .where(eq(kids.id, kidId))

      return NextResponse.json({ success: true })
    }

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }
})
