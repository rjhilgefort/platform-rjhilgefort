'use client'

import { useState } from 'react'
import { KidCard } from './KidCard'

interface TypeBalance {
  budgetTypeId: number
  budgetTypeSlug: string
  budgetTypeDisplayName: string
  budgetTypeIcon: string | null
  remainingSeconds: number
  carryoverSeconds: number
  allowCarryover: boolean
  isEarningPool: boolean
}

interface BudgetType {
  id: number
  slug: string
  displayName: string
  allowCarryover: boolean
  isEarningPool: boolean
  icon: string | null
}

interface EarningType {
  id: number
  slug: string
  displayName: string
  ratioNumerator: number
  ratioDenominator: number
  icon: string | null
}

interface KidStatus {
  kidId: number
  kidName: string
  profilePicture: string | null
  typeBalances: TypeBalance[]
  activeTimer: {
    budgetTypeId: number
    budgetTypeSlug: string
    budgetTypeDisplayName: string
    budgetTypeIcon: string | null
    earningTypeId: number | null
    earningTypeSlug: string | null
    earningTypeDisplayName: string | null
    earningTypeIcon: string | null
    startedAt: string
    elapsedSeconds: number
  } | null
}

interface KidAccordionProps {
  statuses: KidStatus[]
  budgetTypes: BudgetType[]
  earningTypes: EarningType[]
  negativeBalancePenalty: number
  onRefresh: () => void
}

export function KidAccordion({
  statuses,
  budgetTypes,
  earningTypes,
  negativeBalancePenalty,
  onRefresh,
}: KidAccordionProps) {
  // Auto-expand kid with active timer, otherwise first kid
  const activeKidId = statuses.find((s) => s.activeTimer)?.kidId ?? statuses[0]?.kidId
  const [expandedKidId, setExpandedKidId] = useState<number | null>(activeKidId ?? null)
  const [bonusKidId, setBonusKidId] = useState<number | null>(null)

  const handleToggle = (kidId: number) => {
    setExpandedKidId(expandedKidId === kidId ? null : kidId)
  }

  const handleBonusClick = (e: React.MouseEvent, kidId: number) => {
    e.preventDefault()
    e.stopPropagation()
    setBonusKidId(kidId)
  }

  return (
    <div className="space-y-2">
      {statuses.map((status) => {
        const isExpanded = expandedKidId === status.kidId
        const hasActiveTimer = status.activeTimer !== null

        return (
          <div key={status.kidId} className="collapse collapse-arrow bg-base-100 shadow-xl">
            <input
              type="checkbox"
              checked={isExpanded}
              onChange={() => handleToggle(status.kidId)}
            />
            <div className="collapse-title text-2xl font-semibold flex items-center gap-2 pr-12">
              {status.kidName}
              {hasActiveTimer && (
                <span className="badge badge-primary badge-sm animate-pulse">Active</span>
              )}
              <button
                type="button"
                className="ml-auto btn btn-ghost btn-sm text-xl font-bold leading-none px-2"
                onClick={(e) => handleBonusClick(e, status.kidId)}
                title="Adjust time"
              >
                +/-
              </button>
            </div>
            <div className="collapse-content">
              {isExpanded && (
                <KidCard
                  status={status}
                  budgetTypes={budgetTypes}
                  earningTypes={earningTypes}
                  negativeBalancePenalty={negativeBalancePenalty}
                  onRefresh={onRefresh}
                  embedded
                  showBonus={bonusKidId === status.kidId}
                  onBonusClose={() => setBonusKidId(null)}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
