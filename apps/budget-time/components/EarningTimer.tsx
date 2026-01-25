'use client'

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
  onStart,
  onStop,
  disabled = false,
}: EarningTimerProps) {
  const Icon = getEarningIcon(earningType.slug, earningType.icon)

  return (
    <div className="rounded-lg border-2 border-transparent bg-success/10 px-3 py-2">
      {/* Row 1: Icon + Label */}
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={20} className="text-base-content/80" />
        <span className="text-lg font-medium text-base-content/80">
          {earningType.displayName}
        </span>
      </div>

      {/* Row 2: Ratio + Button */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-2xl font-mono text-base-content/80">
          {earningType.ratioNumerator}:{earningType.ratioDenominator}
        </span>

        <button
          type="button"
          className="btn btn-success btn-sm"
          onClick={() => onStart(earningType.id)}
          disabled={disabled}
        >
          Start
        </button>
      </div>
    </div>
  )
}
