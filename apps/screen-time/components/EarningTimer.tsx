'use client'

import { formatTime } from '../lib/timer-logic'

interface EarningType {
  id: number
  slug: string
  displayName: string
  ratioNumerator: number
  ratioDenominator: number
}

interface EarningTimerProps {
  earningType: EarningType
  selectedBudgetTypeId: number
  isRunning: boolean
  elapsedSeconds: number
  activeBudgetTypeName: string | null
  onStart: (earningTypeId: number) => void
  onStop: () => void
  disabled?: boolean
}

export function EarningTimer({
  earningType,
  isRunning,
  elapsedSeconds,
  activeBudgetTypeName,
  onStart,
  onStop,
  disabled = false,
}: EarningTimerProps) {
  const earnedSeconds = Math.floor(
    (elapsedSeconds * earningType.ratioDenominator) / earningType.ratioNumerator
  )

  return (
    <div
      className={`card bg-success/10 border-2 ${
        isRunning ? 'timer-running border-success' : 'border-transparent'
      }`}
    >
      <div className="card-body p-4">
        <h3 className="text-sm font-medium text-success">{earningType.displayName}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-mono font-bold text-success">
            {formatTime(elapsedSeconds)}
          </span>
          {isRunning && activeBudgetTypeName && (
            <span className="text-sm text-success/70">
              = {formatTime(earnedSeconds)} {activeBudgetTypeName}
            </span>
          )}
        </div>

        <div className="mt-2">
          {isRunning ? (
            <button
              type="button"
              className="btn btn-success btn-sm w-full"
              onClick={onStop}
            >
              Done - Earn {formatTime(earnedSeconds)}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-success btn-sm w-full"
              onClick={() => onStart(earningType.id)}
              disabled={disabled}
            >
              Start
            </button>
          )}
        </div>

        {!isRunning && (
          <p className="text-xs text-base-content/50 mt-1">
            {earningType.ratioNumerator} min = {earningType.ratioDenominator} min screen
          </p>
        )}
      </div>
    </div>
  )
}
