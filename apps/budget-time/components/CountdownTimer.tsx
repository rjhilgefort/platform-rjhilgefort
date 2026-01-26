'use client'

import { formatTime } from '../lib/timer-logic'
import { getBudgetIcon } from '../lib/budget-icons'
import { TimerCard } from './TimerCard'
import { TimeDisplay } from './TimeDisplay'

interface CountdownTimerProps {
  budgetTypeId: number
  budgetTypeSlug: string
  isEarningPool: boolean
  label: string
  icon: string | null
  remainingSeconds: number
  isRunning: boolean
  isEarning?: boolean
  onStart: () => void
  onStop: () => void
  disabled?: boolean
  extraBalance?: number
  pendingEarnedSeconds?: number
}

export function CountdownTimer({
  budgetTypeSlug,
  isEarningPool,
  label,
  icon,
  remainingSeconds,
  isRunning,
  isEarning = false,
  onStart,
  onStop,
  disabled = false,
  extraBalance = 0,
  pendingEarnedSeconds = 0,
}: CountdownTimerProps) {
  const Icon = getBudgetIcon(budgetTypeSlug, icon)
  const displaySeconds = remainingSeconds + pendingEarnedSeconds
  const hasHours = Math.abs(displaySeconds) >= 3600
  const isWarning = displaySeconds <= 300 && displaySeconds > 0
  const isExpired = displaySeconds <= 0
  const canStart = !isExpired || isEarningPool

  const timeColor = isEarning
    ? 'text-success'
    : isExpired
      ? 'text-error'
      : isWarning
        ? 'text-warning'
        : 'text-base-content/80'

  return (
    <TimerCard
      icon={Icon}
      label={label}
      variant={isEarning ? 'success' : 'warning'}
      borderColor={isRunning && !isEarning ? 'primary' : undefined}
      bottomLeft={
        <>
          <TimeDisplay
            seconds={displaySeconds}
            className={`text-xl ${timeColor}`}
          />
          {isExpired && extraBalance > 0 && !isEarningPool && (
            <span className="text-xs text-info whitespace-nowrap">
              ({formatTime(extraBalance)})
            </span>
          )}
        </>
      }
      button={
        isRunning ? (
          <button
            type="button"
            className="btn btn-error btn-sm px-6"
            onClick={onStop}
            disabled={disabled}
          >
            Stop
          </button>
        ) : (
          <button
            type="button"
            className={`btn btn-sm px-6 ${isEarning ? 'btn-success' : 'btn-primary'}`}
            onClick={onStart}
            disabled={disabled || !canStart}
          >
            {canStart ? 'Start' : 'No Time'}
          </button>
        )
      }
    />
  )
}
