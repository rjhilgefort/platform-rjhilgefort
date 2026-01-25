'use client'

import { formatTime } from '../lib/timer-logic'
import { getBudgetIcon } from '../lib/budget-icons'
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

  return (
    <div
      className={`rounded-lg border-2 px-3 py-2 ${
        isEarning
          ? 'timer-running border-success bg-success/20'
          : isRunning
            ? 'timer-running border-primary bg-base-200'
            : 'border-transparent bg-base-200'
      }`}
    >
      {/* Row 1: Icon + Label */}
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={20} className={isEarning ? 'text-success' : 'text-base-content/80'} />
        <span className={`text-lg font-medium ${isEarning ? 'text-success' : 'text-base-content/80'}`}>
          {label}
        </span>
      </div>

      {/* Row 2: Time + Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-1.5">
          <TimeDisplay
            seconds={displaySeconds}
            className={`${hasHours ? 'text-xl' : 'text-2xl'} ${
              isEarning
                ? 'text-success'
                : isExpired
                  ? 'text-error'
                  : isWarning
                    ? 'text-warning'
                    : 'text-base-content/80'
            }`}
          />
          {isExpired && extraBalance > 0 && !isEarningPool && (
            <span className="text-xs text-info whitespace-nowrap">
              ({formatTime(extraBalance)})
            </span>
          )}
        </div>

        {isRunning ? (
          <button
            type="button"
            className="btn btn-error btn-sm"
            onClick={onStop}
            disabled={disabled}
          >
            Stop
          </button>
        ) : (
          <button
            type="button"
            className={`btn btn-sm ${isEarning ? 'btn-success' : 'btn-primary'}`}
            onClick={onStart}
            disabled={disabled || isExpired}
          >
            {isExpired ? 'No Time' : 'Start'}
          </button>
        )}
      </div>
    </div>
  )
}
