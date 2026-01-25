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
 * Calculate remaining time for a budget type, accounting for active timer if running.
 * Handles overflow: non-Extra budgets clamp at 0, Extra absorbs overflow (can go negative).
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
    // Non-Extra budgets clamp at 0, Extra (isEarningPool) can go negative
    if (typeBalance.isEarningPool) {
      return baseRemaining - elapsed
    }
    return Math.max(0, baseRemaining - elapsed)
  }

  // Check if another budget is overflowing into Extra (this budget is Extra, and another is being consumed)
  if (
    typeBalance.isEarningPool &&
    activeTimer &&
    !activeTimer.earningTypeId &&
    activeTimer.budgetTypeId !== budgetTypeId
  ) {
    const activeBudget = balance.typeBalances.find((tb) => tb.budgetTypeId === activeTimer.budgetTypeId)
    if (activeBudget && !activeBudget.isEarningPool) {
      const elapsed = calculateElapsedSeconds(activeTimer.startedAt, now)
      const overflow = Math.max(0, elapsed - activeBudget.remainingSeconds)
      return baseRemaining - overflow
    }
  }

  return baseRemaining
}

/**
 * Calculate earned budget time from earning activity using earning type ratio
 */
export function calculateEarnings(
  elapsedSeconds: number,
  earningType: EarningType
): number {
  // ratio: numerator:denominator means numerator min activity = denominator min budget
  // e.g. 1:2 means 1 min chores = 2 min budget time
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

export interface TimeParts {
  prefix: string
  hours: number
  minutes: number
  seconds: number
  hasHours: boolean
  /** Main part (hours:minutes or just minutes) */
  main: string
  /** Seconds with leading zero */
  secs: string
}

/**
 * Parse seconds into parts for custom rendering
 */
export function formatTimeParts(seconds: number): TimeParts {
  const absSeconds = Math.abs(Math.floor(seconds))
  const hours = Math.floor(absSeconds / 3600)
  const minutes = Math.floor((absSeconds % 3600) / 60)
  const secs = absSeconds % 60
  const prefix = seconds < 0 ? '-' : ''
  const hasHours = hours > 0

  const main = hasHours
    ? `${prefix}${hours}:${minutes.toString().padStart(2, '0')}`
    : `${prefix}${minutes}`

  return {
    prefix,
    hours,
    minutes,
    seconds: secs,
    hasHours,
    main,
    secs: secs.toString().padStart(2, '0'),
  }
}

/**
 * Format a decimal number as a fraction string.
 * Supports quarter increments: 0.25 → ¼, 0.5 → ½, 0.75 → ¾
 * e.g. 1.25 → "1¼", 2.5 → "2½", 3 → "3"
 */
export function formatFraction(value: number): string {
  const whole = Math.floor(value)
  const decimal = value - whole

  // Round to nearest 0.25 to handle floating point imprecision
  const roundedDecimal = Math.round(decimal * 4) / 4

  let fractionPart = ''
  if (roundedDecimal === 0.25) fractionPart = '¼'
  else if (roundedDecimal === 0.5) fractionPart = '½'
  else if (roundedDecimal === 0.75) fractionPart = '¾'

  if (whole === 0 && fractionPart) return fractionPart
  if (fractionPart) return `${whole}${fractionPart}`
  return whole.toString()
}
