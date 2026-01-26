'use client'

import { useEffect, useState } from 'react'

/**
 * Client-side countdown hook that calculates remaining time locally.
 * Uses interval to force re-renders, calculates value directly from props.
 */
export function useCountdown(
  startedAt: string | null,
  baseSeconds: number,
  isRunning: boolean,
  allowNegative = false
): number {
  const [, setTick] = useState(0)

  useEffect(() => {
    if (!isRunning || !startedAt) return

    const interval = setInterval(() => {
      setTick((t) => t + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [startedAt, isRunning])

  if (!isRunning || !startedAt) {
    return baseSeconds
  }

  const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
  const remaining = baseSeconds - elapsed
  return allowNegative ? remaining : Math.max(0, remaining)
}

/**
 * Client-side elapsed time hook (counts up from startedAt).
 * For earning timers that track time spent.
 */
export function useElapsed(startedAt: string | null, isRunning: boolean): number {
  const [, setTick] = useState(0)

  useEffect(() => {
    if (!isRunning || !startedAt) return

    const interval = setInterval(() => {
      setTick((t) => t + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [startedAt, isRunning])

  if (!isRunning || !startedAt) {
    return 0
  }

  return Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
}
