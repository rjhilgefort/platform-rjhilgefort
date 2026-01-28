'use client'

import { getBudgetIcon } from '../lib/budget-icons'
import { TimeDisplay } from './TimeDisplay'

interface ActiveTimerOverlayProps {
  budgetTypeSlug: string
  budgetTypeDisplayName: string
  budgetTypeIcon?: string | null
  remainingSeconds: number
  startingSeconds: number
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
  startingSeconds,
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

  // Determine color class
  const colorClass = isEarningToExtra
    ? 'text-success'
    : isExpired
      ? 'text-error'
      : isWarning
        ? 'text-warning'
        : 'text-primary'

  const progressColorClass = isEarningToExtra
    ? 'bg-success'
    : isExpired
      ? 'bg-error'
      : isWarning
        ? 'bg-warning'
        : 'bg-primary'

  const percentRemaining = startingSeconds > 0 ? Math.max(0, remainingSeconds / startingSeconds) * 100 : 0

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
      className={`h-full flex flex-col justify-between py-4 bg-base-100 ${
        isEarningToExtra ? 'bg-success/10' : ''
      }`}
    >
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Icon + Label centered */}
        <div className="flex items-center gap-3">
          <Icon size={64} className="text-base-content" />
          <p className="text-6xl text-base-content font-semibold">
            {budgetTypeDisplayName}
          </p>
        </div>

        {/* Large time display */}
        <TimeDisplay
          seconds={remainingSeconds}
          className={`text-8xl ${colorClass}`}
          secondsRatio={0.7}
        />

        {/* Progress bar */}
        <div className="w-full h-16 bg-base-300 rounded-full overflow-hidden">
          <div
            className={`h-full ${progressColorClass} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${percentRemaining}%` }}
          />
        </div>

        {/* Show available Extra time (for non-Extra budgets) */}
        {budgetTypeSlug !== 'extra' && (
          <div className={`flex items-center gap-2 ${extraRemainingSeconds > 0 ? 'text-success' : 'text-warning'}`}>
            <ExtraIcon size={24} />
            <span className="text-lg">
              then <TimeDisplay seconds={extraRemainingSeconds} className="inline text-lg" /> Extra
            </span>
          </div>
        )}
      </div>

      {/* Stop button */}
      <button
        type="button"
        className="btn btn-error w-full h-16 text-2xl mt-4"
        onClick={onStop}
        disabled={disabled}
      >
        Stop
      </button>
    </div>
  )
}
