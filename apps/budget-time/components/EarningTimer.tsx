'use client'

import { getEarningIcon } from '../lib/budget-icons'
import { Fraction } from './Fraction'
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
        <span className="text-xl text-base-content/80">
          1:<Fraction value={earningType.ratioDenominator} />
        </span>
      }
      button={
        <button
          type="button"
          className="btn btn-success btn-sm px-6"
          onClick={() => onStart(earningType.id)}
          disabled={disabled}
        >
          Start
        </button>
      }
    />
  )
}
