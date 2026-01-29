import { NextResponse } from 'next/server'
import { eq, desc, isNotNull, and, lt } from 'drizzle-orm'
import { db } from '../../../db/client'
import { timerEvents, budgetTypes, earningTypes } from '../../../db/schema'
import { validateParentPin } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

interface HistoryEntry {
  id: number
  kidId: number
  kidName: string
  eventType: string
  budgetTypeId: number
  budgetTypeDisplayName: string
  budgetTypeIcon: string | null
  earningTypeId: number | null
  earningTypeDisplayName: string | null
  earningTypeIcon: string | null
  startedAt: string | null
  endedAt: string | null
  seconds: number
  createdAt: string | null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const kidIdParam = searchParams.get('kidId')
  const limitParam = searchParams.get('limit')
  const cursorParam = searchParams.get('cursor')

  const limit = Math.min(parseInt(limitParam ?? '50', 10), 100)
  const cursor = cursorParam ? parseInt(cursorParam, 10) : null

  // Get all kids for the filter dropdown
  const allKids = await db.query.kids.findMany({
    orderBy: (k, { asc }) => asc(k.name),
  })

  // Build query conditions
  const conditions = [isNotNull(timerEvents.endedAt)]

  if (kidIdParam) {
    const kidId = parseInt(kidIdParam, 10)
    conditions.push(eq(timerEvents.kidId, kidId))
  }

  if (cursor) {
    conditions.push(lt(timerEvents.id, cursor))
  }

  // Get history entries
  const entries = await db.query.timerEvents.findMany({
    where: and(...conditions),
    orderBy: [desc(timerEvents.endedAt), desc(timerEvents.id)],
    limit: limit + 1, // Fetch one extra to check for more
  })

  const hasMore = entries.length > limit
  const resultEntries = hasMore ? entries.slice(0, limit) : entries
  const nextCursor = hasMore && resultEntries.length > 0
    ? resultEntries[resultEntries.length - 1]?.id
    : null

  // Enrich entries with related data
  const enrichedEntries: HistoryEntry[] = await Promise.all(
    resultEntries.map(async (entry) => {
      const kid = allKids.find((k) => k.id === entry.kidId)
      const budgetType = await db.query.budgetTypes.findFirst({
        where: eq(budgetTypes.id, entry.budgetTypeId),
      })
      let earningType = null
      if (entry.earningTypeId) {
        earningType = await db.query.earningTypes.findFirst({
          where: eq(earningTypes.id, entry.earningTypeId),
        })
      }

      return {
        id: entry.id,
        kidId: entry.kidId,
        kidName: kid?.name ?? 'Unknown',
        eventType: entry.eventType,
        budgetTypeId: entry.budgetTypeId,
        budgetTypeDisplayName: budgetType?.displayName ?? 'Unknown',
        budgetTypeIcon: budgetType?.icon ?? null,
        earningTypeId: entry.earningTypeId,
        earningTypeDisplayName: earningType?.displayName ?? null,
        earningTypeIcon: earningType?.icon ?? null,
        startedAt: entry.startedAt?.toISOString() ?? null,
        endedAt: entry.endedAt?.toISOString() ?? null,
        seconds: entry.seconds,
        createdAt: entry.createdAt?.toISOString() ?? null,
      }
    })
  )

  return NextResponse.json({
    entries: enrichedEntries,
    kids: allKids.map((k) => ({ id: k.id, name: k.name })),
    pagination: {
      hasMore,
      nextCursor,
    },
  })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, endedAt, pin } = body

  if (!id || !endedAt || !pin) {
    return NextResponse.json(
      { error: 'id, endedAt, and pin are required' },
      { status: 400 }
    )
  }

  // Validate PIN
  const isValidPin = await validateParentPin(pin)
  if (!isValidPin) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 403 })
  }

  // Find the entry
  const entry = await db.query.timerEvents.findFirst({
    where: eq(timerEvents.id, id),
  })

  if (!entry) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
  }

  if (!entry.startedAt) {
    return NextResponse.json(
      { error: 'Cannot edit entry without start time' },
      { status: 400 }
    )
  }

  const newEndedAt = new Date(endedAt)
  if (newEndedAt <= entry.startedAt) {
    return NextResponse.json(
      { error: 'End time must be after start time' },
      { status: 400 }
    )
  }

  // Calculate new duration in seconds
  const elapsedSeconds = Math.floor(
    (newEndedAt.getTime() - entry.startedAt.getTime()) / 1000
  )

  let newSeconds = elapsedSeconds

  // For earned events, apply the earning ratio
  if (entry.eventType === 'earned' && entry.earningTypeId) {
    const earningType = await db.query.earningTypes.findFirst({
      where: eq(earningTypes.id, entry.earningTypeId),
    })
    if (earningType) {
      // earned_seconds = floor(elapsed * denominator / numerator)
      newSeconds = Math.floor(
        (elapsedSeconds * earningType.ratioDenominator) / earningType.ratioNumerator
      )
    }
  }

  // Update the entry
  await db
    .update(timerEvents)
    .set({
      endedAt: newEndedAt,
      seconds: newSeconds,
    })
    .where(eq(timerEvents.id, id))

  // Note: This does NOT update the balance - that would require recalculating
  // all subsequent entries. For now, editing is for record-keeping only.
  // A future enhancement could add balance recalculation.

  return NextResponse.json({ success: true, newSeconds })
}
