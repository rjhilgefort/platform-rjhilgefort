'use client'

import { getBudgetIcon } from '../lib/budget-icons'
import { TimeDisplay } from './TimeDisplay'

interface ActiveTimerOverlayProps {
  budgetTypeSlug: string
  budgetTypeDisplayName: string
  budgetTypeIcon?: string | null
  remainingSeconds: number
  isEarningToExtra: boolean
  isUsingExtraTime?: boolean
  extraRemainingSeconds?: number
  extraTypeIcon?: string | null
  onStop: () => void
  disabled?: boolean
}

export function ActiveTimerOverlay({
  budgetTypeSlug,
  budgetTypeDisplayName,
  budgetTypeIcon,
  remainingSeconds,
  isEarningToExtra,
  isUsingExtraTime = false,
  extraRemainingSeconds = 0,
  extraTypeIcon,
  onStop,
  disabled = false,
}: ActiveTimerOverlayProps) {
  const Icon = getBudgetIcon(budgetTypeSlug, budgetTypeIcon)
  const ExtraIcon = getBudgetIcon('extra', extraTypeIcon)
  const isWarning = remainingSeconds <= 300 && remainingSeconds > 0
  const isExpired = remainingSeconds <= 0
  const extraIsWarning = extraRemainingSeconds <= 300 && extraRemainingSeconds > 0
  const extraIsNegative = extraRemainingSeconds < 0

  // When using Extra time, show a different layout
  if (isUsingExtraTime) {
    return (
      <div className="h-full flex flex-col items-center justify-between py-4 bg-warning/10">
        {/* Original budget - crossed out */}
        <div className="flex items-center gap-4 opacity-60">
          <Icon size={64} className="text-base-content/50" />
          <span className="text-3xl text-base-content/50 line-through font-medium">
            {budgetTypeDisplayName}: 0:00
          </span>
        </div>

        {/* Extra time - prominent */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <ExtraIcon size={60} className={`${extraIsNegative ? 'text-error' : 'text-warning'} animate-pulse`} />
            <span className={`text-3xl font-semibold ${extraIsNegative ? 'text-error' : 'text-warning'}`}>
              Using Extra Time
            </span>
          </div>
          <TimeDisplay
            seconds={extraRemainingSeconds}
            className={`text-8xl ${
              extraIsNegative ? 'text-error' : extraIsWarning ? 'text-error' : 'text-warning'
            }`}
          />
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

      <TimeDisplay
        seconds={remainingSeconds}
        className={`text-8xl ${
          isEarningToExtra
            ? 'text-success'
            : isExpired
              ? 'text-error'
              : isWarning
                ? 'text-warning'
                : 'text-base-content'
        }`}
      />

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
