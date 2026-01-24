import { format, subHours } from 'date-fns'

/**
 * Get the "budget date" which resets at 4 AM
 * e.g. at 2 AM on Jan 2nd, the budget date is still Jan 1st
 */
export function getBudgetDate(now: Date = new Date()): string {
  const adjusted = subHours(now, 4)
  return format(adjusted, 'yyyy-MM-dd')
}

/**
 * Get the previous budget date
 */
export function getPreviousBudgetDate(now: Date = new Date()): string {
  const adjusted = subHours(now, 4 + 24)
  return format(adjusted, 'yyyy-MM-dd')
}
