'use client'

import { getEarningIcon } from '../lib/budget-icons'
import { formatFraction } from '../lib/timer-logic'
import { TimerCard } from './TimerCard'

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
  onStart,
  disabled = false,
}: EarningTimerProps) {
  const Icon = getEarningIcon(earningType.slug, earningType.icon)

  return (
    <TimerCard
      icon={Icon}
      label={earningType.displayName}
      variant="success"
      bottomLeft={
        <span className="text-xl font-mono text-base-content/80">
          1:{formatFraction(earningType.ratioDenominator)}
        </span>
      }
      button={
        <button
          type="button"
          className="btn btn-success btn-sm"
          onClick={() => onStart(earningType.id)}
          disabled={disabled}
        >
          Start
        </button>
      }
    />
  )
}
