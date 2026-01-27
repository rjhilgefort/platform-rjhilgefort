import { format, subHours } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

/**
 * Get the "budget date" which resets at the configured hour in the user's timezone
 * e.g. with resetHour=4, at 2 AM on Jan 2nd, the budget date is still Jan 1st
 */
export function getBudgetDate(timezone: string, resetHour: number, now: Date = new Date()): string {
  const zonedTime = toZonedTime(now, timezone)
  const adjusted = subHours(zonedTime, resetHour)
  return format(adjusted, 'yyyy-MM-dd')
}

/**
 * Get the previous budget date
 */
export function getPreviousBudgetDate(timezone: string, resetHour: number, now: Date = new Date()): string {
  const zonedTime = toZonedTime(now, timezone)
  const adjusted = subHours(zonedTime, resetHour + 24)
  return format(adjusted, 'yyyy-MM-dd')
}
