import { format, subHours } from 'date-fns'

/**
 * Get the "screen time date" which resets at 4 AM
 * e.g. at 2 AM on Jan 2nd, the screen time date is still Jan 1st
 */
export function getScreenTimeDate(now: Date = new Date()): string {
  const adjusted = subHours(now, 4)
  return format(adjusted, 'yyyy-MM-dd')
}

/**
 * Get the previous screen time date
 */
export function getPreviousScreenTimeDate(now: Date = new Date()): string {
  const adjusted = subHours(now, 4 + 24)
  return format(adjusted, 'yyyy-MM-dd')
}
