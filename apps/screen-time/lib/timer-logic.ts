import { ActiveTimer, EarningType } from '../db/schema'
import { TypeBalance, FullDailyBalance } from './balance'

export interface TimerState {
  kidId: number
  kidName: string
  typeBalances: TypeBalance[]
  activeTimer: {
    budgetTypeId: number
    budgetTypeSlug: string
    budgetTypeDisplayName: string
    earningTypeId: number | null
    earningTypeSlug: string | null
    earningTypeDisplayName: string | null
    startedAt: Date
    elapsedSeconds: number
  } | null
}

/**
 * Calculate elapsed seconds from a timer's start time
 */
export function calculateElapsedSeconds(startedAt: Date, now: Date = new Date()): number {
  return Math.floor((now.getTime() - startedAt.getTime()) / 1000)
}

/**
 * Calculate remaining time for a budget type, accounting for active timer if running
 */
export function calculateRemainingTime(
  balance: FullDailyBalance,
  activeTimer: ActiveTimer | null,
  budgetTypeId: number,
  now: Date = new Date()
): number {
  const typeBalance = balance.typeBalances.find((tb) => tb.budgetTypeId === budgetTypeId)
  if (!typeBalance) return 0

  const baseRemaining = typeBalance.remainingSeconds

  // Only subtract if this is a consumption timer (no earningTypeId) for this budget type
  if (activeTimer && activeTimer.budgetTypeId === budgetTypeId && !activeTimer.earningTypeId) {
    const elapsed = calculateElapsedSeconds(activeTimer.startedAt, now)
    return Math.max(0, baseRemaining - elapsed)
  }

  return baseRemaining
}

/**
 * Calculate earned screen time from earning activity using earning type ratio
 */
export function calculateEarnings(
  elapsedSeconds: number,
  earningType: EarningType
): number {
  // ratio: numerator:denominator means numerator min activity = denominator min screen
  // e.g. 1:2 means 1 min chores = 2 min screen time
  return Math.floor((elapsedSeconds * earningType.ratioDenominator) / earningType.ratioNumerator)
}

/**
 * Format seconds as MM:SS or HH:MM:SS
 */
export function formatTime(seconds: number): string {
  const absSeconds = Math.abs(Math.floor(seconds))
  const hours = Math.floor(absSeconds / 3600)
  const minutes = Math.floor((absSeconds % 3600) / 60)
  const secs = absSeconds % 60

  const prefix = seconds < 0 ? '-' : ''

  if (hours > 0) {
    return `${prefix}${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${prefix}${minutes}:${secs.toString().padStart(2, '0')}`
}
