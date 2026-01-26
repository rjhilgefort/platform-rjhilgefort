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
  extraBalance: number
  negativeBalancePenalty: number
}

export function EarningTimer({
  earningType,
  onStart,
  disabled = false,
  extraBalance,
  negativeBalancePenalty,
}: EarningTimerProps) {
  const Icon = getEarningIcon(earningType.slug, earningType.icon)
  const isPenaltyActive = extraBalance < 0 && negativeBalancePenalty !== 0
  const effectiveDenom = isPenaltyActive
    ? earningType.ratioDenominator + negativeBalancePenalty
    : earningType.ratioDenominator

  return (
    <TimerCard
      icon={Icon}
      label={earningType.displayName}
      variant="success"
      bottomLeft={
        isPenaltyActive ? (
          <span className="text-xl">
            <span className="line-through text-base-content/50">1:<Fraction value={earningType.ratioDenominator} /></span>
            {' '}
            <span className="text-error">
              1:{effectiveDenom <= 0 ? '0' : <Fraction value={effectiveDenom} />}
            </span>
          </span>
        ) : (
          <span className="text-xl text-base-content/80">
            1:<Fraction value={earningType.ratioDenominator} />
          </span>
        )
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
