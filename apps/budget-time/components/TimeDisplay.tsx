'use client'

import { formatTimeParts } from '../lib/timer-logic'

interface TimeDisplayProps {
  seconds: number
  className?: string
  /** Size ratio for seconds (0-1), default 0.6 */
  secondsRatio?: number
}

/**
 * Displays time with smaller seconds
 */
export function TimeDisplay({ seconds, className = '', secondsRatio = 0.6 }: TimeDisplayProps) {
  const parts = formatTimeParts(seconds)

  return (
    <span className={`font-mono ${className}`}>
      {parts.main}
      <span style={{ fontSize: `${secondsRatio * 100}%` }}>:{parts.secs}</span>
    </span>
  )
}
