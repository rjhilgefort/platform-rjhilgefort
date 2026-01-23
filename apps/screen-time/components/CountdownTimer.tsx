'use client'

import { formatTime } from '../lib/timer-logic'

interface CountdownTimerProps {
  budgetTypeId: number
  label: string
  remainingSeconds: number
  isRunning: boolean
  onStart: () => void
  onStop: () => void
  disabled?: boolean
}

export function CountdownTimer({
  label,
  remainingSeconds,
  isRunning,
  onStart,
  onStop,
  disabled = false,
}: CountdownTimerProps) {
  const isWarning = remainingSeconds <= 300 && remainingSeconds > 0
  const isExpired = remainingSeconds <= 0

  return (
    <div
      className={`card bg-base-200 border-2 ${
        isRunning ? 'timer-running border-primary' : 'border-transparent'
      }`}
    >
      <div className="card-body p-4">
        <h3 className="text-sm font-medium text-base-content/70">{label}</h3>
        <div
          className={`text-3xl font-mono font-bold ${
            isExpired
              ? 'text-error'
              : isWarning
                ? 'text-warning'
                : 'text-base-content'
          }`}
        >
          {formatTime(remainingSeconds)}
        </div>
        <div className="mt-2">
          {isRunning ? (
            <button
              type="button"
              className="btn btn-error btn-sm w-full"
              onClick={onStop}
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
      </div>
    </div>
  )
}
