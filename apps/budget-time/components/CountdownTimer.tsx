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
  const isWarning = displaySeconds <= 300 && displaySeconds > 0
  const isExpired = displaySeconds <= 0

  return (
    <div
      className={`card border-2 ${
        isEarning
          ? 'timer-running border-success bg-success/20'
          : isRunning
            ? 'timer-running border-primary bg-base-200'
            : 'border-transparent bg-base-200'
      }`}
    >
      <div className="card-body p-4">
        <div className="flex items-center gap-2">
          <Icon size={20} className={isEarning ? 'text-success' : 'text-base-content/70'} />
          <h3 className={`text-sm font-medium ${isEarning ? 'text-success' : 'text-base-content/70'}`}>
            {label}
          </h3>
        </div>
        <TimeDisplay
          seconds={displaySeconds}
          className={`text-3xl ${
            isEarning
              ? 'text-success'
              : isExpired
                ? 'text-error'
                : isWarning
                  ? 'text-warning'
                  : 'text-base-content'
          }`}
        />
        <div className="mt-2">
          {isRunning ? (
            <button
              type="button"
              className="btn btn-error btn-sm w-full"
              onClick={onStop}
              disabled={disabled}
            >
              Stop
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm w-full"
              onClick={onStart}
              disabled={disabled || isExpired}
            >
              {isExpired ? 'No Time' : 'Start'}
            </button>
          )}
        </div>
        {isExpired && extraBalance > 0 && !isEarningPool && (
          <p className="text-xs text-info mt-2">
            💡 {formatTime(extraBalance)} in Extra
          </p>
        )}
      </div>
    </div>
  )
}
