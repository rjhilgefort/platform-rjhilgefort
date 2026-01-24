'use client'

import { formatTime } from '../lib/timer-logic'
import { getEarningIcon } from '../lib/budget-icons'

interface EarningType {
  id: number
  slug: string
  displayName: string
  ratioNumerator: number
  ratioDenominator: number
  icon: string | null
}

interface EarningTimerProps {
  earningType: EarningType
  isRunning: boolean
  elapsedSeconds: number
  onStart: (earningTypeId: number) => void
  onStop: () => void
  disabled?: boolean
}

export function EarningTimer({
  earningType,
  isRunning,
  elapsedSeconds,
  onStart,
  onStop,
  disabled = false,
}: EarningTimerProps) {
  const Icon = getEarningIcon(earningType.slug, earningType.icon)
  return (
    <div
      className={`card bg-success/10 border-2 ${
        isRunning ? 'timer-running border-success' : 'border-transparent'
      }`}
    >
      <div className="card-body p-4">
        <div className="flex items-center gap-2">
          <Icon size={isRunning ? 20 : 28} className="text-success" />
          <h3 className={`font-medium text-success ${isRunning ? 'text-sm' : 'text-xl'}`}>
            {earningType.displayName}
          </h3>
        </div>
        {isRunning && (
          <span className="text-3xl font-mono font-bold text-success">
            {formatTime(elapsedSeconds)}
          </span>
        )}

        <div className="mt-2">
          {isRunning ? (
            <button
              type="button"
              className="btn btn-success btn-sm w-full"
              onClick={onStop}
              disabled={disabled}
            >
              Done
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

        <p className="text-xs text-base-content/50 mt-1">
          {earningType.ratioNumerator} min = {earningType.ratioDenominator} min
        </p>
      </div>
    </div>
  )
}
