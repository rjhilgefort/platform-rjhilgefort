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

interface KidTabsProps {
  statuses: KidStatus[]
  budgetTypes: BudgetType[]
  earningTypes: EarningType[]
  negativeBalancePenalty: number
  onRefresh: () => void
}

export function KidTabs({
  statuses,
  budgetTypes,
  earningTypes,
  negativeBalancePenalty,
  onRefresh,
}: KidTabsProps) {
  // Auto-select kid with active timer, otherwise first kid
  const defaultKidId = statuses.find((s) => s.activeTimer)?.kidId ?? statuses[0]?.kidId ?? 0
  const [selectedKidId, setSelectedKidId] = useState<number>(defaultKidId)
  const [bonusKidId, setBonusKidId] = useState<number | null>(null)

  const selectedStatus = statuses.find((s) => s.kidId === selectedKidId)

  return (
    <div className="flex flex-col gap-4">
      {/* Tab bar */}
      <div className="flex gap-2 bg-base-100 p-2 rounded-lg shadow-xl">
        {statuses.map((status) => {
          const isSelected = selectedKidId === status.kidId
          const hasActiveTimer = status.activeTimer !== null

          return (
            <button
              key={status.kidId}
              type="button"
              onClick={() => setSelectedKidId(status.kidId)}
              className={`flex-1 btn ${isSelected ? 'btn-primary' : 'btn-ghost'} flex flex-col h-auto py-2 gap-0`}
            >
              <span className="text-lg font-semibold">{status.kidName}</span>
              {hasActiveTimer && (
                <span className="badge badge-xs badge-secondary animate-pulse">Active</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected kid content */}
      {selectedStatus && (
        <div className="bg-base-100 rounded-lg shadow-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              {selectedStatus.profilePicture ? (
                <img
                  src={selectedStatus.profilePicture}
                  alt={selectedStatus.kidName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center">
                  <span className="text-2xl">{selectedStatus.kidName[0]}</span>
                </div>
              )}
              <h2 className="text-2xl font-semibold">{selectedStatus.kidName}</h2>
            </div>
            <button
              type="button"
              className="btn btn-ghost text-xl font-bold leading-none px-2"
              onClick={() => setBonusKidId(selectedStatus.kidId)}
              title="Adjust time"
            >
              +/-
            </button>
          </div>
          <KidCard
            status={selectedStatus}
            budgetTypes={budgetTypes}
            earningTypes={earningTypes}
            negativeBalancePenalty={negativeBalancePenalty}
            onRefresh={onRefresh}
            embedded
            showBonus={bonusKidId === selectedStatus.kidId}
            onBonusClose={() => setBonusKidId(null)}
          />
        </div>
      )}
    </div>
  )
}
