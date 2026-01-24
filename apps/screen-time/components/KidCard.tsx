'use client'

import { useState } from 'react'
import { CountdownTimer } from './CountdownTimer'
import { EarningTimer } from './EarningTimer'
import { BonusModal } from './BonusModal'

interface TypeBalance {
  budgetTypeId: number
  budgetTypeSlug: string
  budgetTypeDisplayName: string
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
  sortOrder: number
}

interface EarningType {
  id: number
  slug: string
  displayName: string
  ratioNumerator: number
  ratioDenominator: number
  sortOrder: number
}

interface KidStatus {
  kidId: number
  kidName: string
  typeBalances: TypeBalance[]
  activeTimer: {
    budgetTypeId: number
    budgetTypeSlug: string
    budgetTypeDisplayName: string
    earningTypeId: number | null
    earningTypeSlug: string | null
    earningTypeDisplayName: string | null
    startedAt: string
    elapsedSeconds: number
  } | null
}

interface KidCardProps {
  status: KidStatus
  budgetTypes: BudgetType[]
  earningTypes: EarningType[]
  onRefresh: () => void
}

export function KidCard({ status, budgetTypes, earningTypes, onRefresh }: KidCardProps) {
  const [showBonus, setShowBonus] = useState(false)
  const [loading, setLoading] = useState(false)

  const hasActiveTimer = status.activeTimer !== null
  const isEarningTimer = status.activeTimer?.earningTypeId != null
  const extraBalance = status.typeBalances.find((tb) => tb.isEarningPool)?.remainingSeconds ?? 0

  // Calculate pending earned seconds when earning timer is running
  const activeEarningType = isEarningTimer
    ? earningTypes.find((et) => et.id === status.activeTimer?.earningTypeId)
    : null
  const pendingEarnedSeconds = activeEarningType
    ? Math.floor(
        ((status.activeTimer?.elapsedSeconds ?? 0) * activeEarningType.ratioDenominator) /
          activeEarningType.ratioNumerator
      )
    : 0

  const startTimer = async (budgetTypeId: number | null, earningTypeId?: number) => {
    setLoading(true)
    await fetch('/api/timers/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kidId: status.kidId,
        budgetTypeId: budgetTypeId ?? undefined,
        earningTypeId: earningTypeId ?? null,
      }),
    })
    setLoading(false)
    onRefresh()
  }

  const stopTimer = async () => {
    setLoading(true)
    await fetch('/api/timers/stop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kidId: status.kidId }),
    })
    setLoading(false)
    onRefresh()
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h2 className="card-title text-2xl">{status.kidName}</h2>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setShowBonus(true)}
            title="Add bonus time"
          >
            +
          </button>
        </div>

        {/* Budget Type Timers (Screen Time) */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {status.typeBalances.map((tb) => {
            const isThisTimerRunning =
              status.activeTimer?.budgetTypeId === tb.budgetTypeId && !isEarningTimer
            return (
              <CountdownTimer
                key={tb.budgetTypeId}
                budgetTypeId={tb.budgetTypeId}
                isEarningPool={tb.isEarningPool}
                label={tb.budgetTypeDisplayName}
                remainingSeconds={tb.remainingSeconds}
                isRunning={isThisTimerRunning}
                isEarning={tb.isEarningPool && isEarningTimer}
                onStart={() => startTimer(tb.budgetTypeId)}
                onStop={stopTimer}
                disabled={loading || (hasActiveTimer && !isThisTimerRunning)}
                extraBalance={tb.isEarningPool ? 0 : extraBalance}
                pendingEarnedSeconds={tb.isEarningPool ? pendingEarnedSeconds : 0}
              />
            )
          })}
        </div>

        {/* Earn Time Section */}
        <div className="divider text-xs text-base-content/50">Earn Time → Extra</div>

        {/* Earning Timers */}
        <div className="grid grid-cols-2 gap-3">
          {earningTypes.map((et) => {
            const isThisEarningRunning =
              status.activeTimer?.earningTypeId === et.id
            return (
              <EarningTimer
                key={et.id}
                earningType={et}
                isRunning={isThisEarningRunning}
                elapsedSeconds={isThisEarningRunning ? status.activeTimer?.elapsedSeconds ?? 0 : 0}
                onStart={(earningTypeId) => startTimer(null, earningTypeId)}
                onStop={stopTimer}
                disabled={loading || (hasActiveTimer && !isThisEarningRunning)}
              />
            )
          })}
        </div>
      </div>

      <BonusModal
        kidId={status.kidId}
        kidName={status.kidName}
        budgetTypes={budgetTypes}
        isOpen={showBonus}
        onClose={() => setShowBonus(false)}
        onSuccess={onRefresh}
      />
    </div>
  )
}
