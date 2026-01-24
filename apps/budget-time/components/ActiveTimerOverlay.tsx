'use client'

import { getBudgetIcon } from '../lib/budget-icons'
import { formatTime } from '../lib/timer-logic'

interface ActiveTimerOverlayProps {
  budgetTypeSlug: string
  budgetTypeDisplayName: string
  budgetTypeIcon?: string | null
  remainingSeconds: number
  isEarningToExtra: boolean
  onStop: () => void
  disabled?: boolean
}

export function ActiveTimerOverlay({
  budgetTypeSlug,
  budgetTypeDisplayName,
  budgetTypeIcon,
  remainingSeconds,
  isEarningToExtra,
  onStop,
  disabled = false,
}: ActiveTimerOverlayProps) {
  const Icon = getBudgetIcon(budgetTypeSlug, budgetTypeIcon)
  const isWarning = remainingSeconds <= 300 && remainingSeconds > 0
  const isExpired = remainingSeconds <= 0

  return (
    <div
      className={`h-full flex flex-col items-center justify-between py-4 bg-base-100 ${
        isEarningToExtra ? 'bg-success/10' : ''
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <Icon
          size={220}
          className={`${
            isEarningToExtra
              ? 'text-success'
              : isExpired
                ? 'text-error'
                : 'text-primary'
          } animate-pulse`}
        />
        <p className="text-3xl text-base-content/70 font-medium">
          {budgetTypeDisplayName}
        </p>
      </div>

      <div
        className={`text-8xl font-mono font-bold ${
          isEarningToExtra
            ? 'text-success'
            : isExpired
              ? 'text-error'
              : isWarning
                ? 'text-warning'
                : 'text-base-content'
        }`}
      >
        {formatTime(remainingSeconds)}
      </div>

      <button
        type="button"
        className="btn btn-error w-full h-20 text-2xl"
        onClick={onStop}
        disabled={disabled}
      >
        Stop
      </button>
    </div>
  )
}
