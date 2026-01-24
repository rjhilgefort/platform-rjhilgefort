'use client'

import { useState } from 'react'
import { CountdownTimer } from './CountdownTimer'
import { EarningTimer } from './EarningTimer'
import { BonusModal } from './BonusModal'
import { ActiveTimerOverlay } from './ActiveTimerOverlay'
import { useCountdown, useElapsed } from '../hooks/useCountdown'
import { formatTime } from '../lib/timer-logic'
import { getBudgetIcon, getEarningIcon } from '../lib/budget-icons'

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
  sortOrder: number
  icon: string | null
}

interface EarningType {
  id: number
  slug: string
  displayName: string
  ratioNumerator: number
  ratioDenominator: number
  sortOrder: number
  icon: string | null
}

interface KidStatus {
  kidId: number
  kidName: string
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
  const activeScreenTimer = hasActiveTimer && !isEarningTimer ? status.activeTimer : null
  const activeEarningTimer = hasActiveTimer && isEarningTimer ? status.activeTimer : null
  const sortedTypeBalances = [...status.typeBalances].sort((a, b) => Number(a.isEarningPool) - Number(b.isEarningPool))
  const extraBalance = status.typeBalances.find((tb) => tb.isEarningPool)?.remainingSeconds ?? 0

  // Client-side countdown for active screen timer
  const activeTimerBalance = activeScreenTimer
    ? status.typeBalances.find((tb) => tb.budgetTypeId === activeScreenTimer.budgetTypeId)
    : null
  const activeTimerBaseSeconds = activeTimerBalance
    ? activeTimerBalance.remainingSeconds + (status.activeTimer?.elapsedSeconds ?? 0)
    : 0
  const activeTimerCountdown = useCountdown(
    activeScreenTimer?.startedAt ?? null,
    activeTimerBaseSeconds,
    activeScreenTimer !== null
  )

  // Client-side elapsed for earning timer
  const earningElapsed = useElapsed(
    activeEarningTimer?.startedAt ?? null,
    activeEarningTimer !== null
  )

  // Calculate pending earned seconds when earning timer is running
  const activeEarningType = isEarningTimer
    ? earningTypes.find((et) => et.id === status.activeTimer?.earningTypeId)
    : null
  const pendingEarnedSeconds = activeEarningType
    ? Math.floor((earningElapsed * activeEarningType.ratioDenominator) / activeEarningType.ratioNumerator)
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
    <div className="card bg-base-100 shadow-xl h-full flex flex-col">
      <div className="card-body flex-1 flex flex-col">
        <div className="flex justify-between items-center">
          <h2 className="card-title text-2xl">{status.kidName}</h2>
          <button
            type="button"
            className="btn btn-ghost text-3xl font-bold leading-none"
            onClick={() => setShowBonus(true)}
            title="Add bonus time"
          >
            +
          </button>
        </div>

        <div className="relative flex-1">
          {/* Normal grid - always rendered to preserve height, invisible when timer active */}
          <div className={activeScreenTimer || isEarningTimer ? 'invisible' : ''}>
            {/* Budget Type Timers (Screen Time) */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {sortedTypeBalances.map((tb) => {
                const isThisTimerRunning =
                  status.activeTimer?.budgetTypeId === tb.budgetTypeId && !isEarningTimer
                const displaySeconds = isThisTimerRunning ? activeTimerCountdown : tb.remainingSeconds
                return (
                  <CountdownTimer
                    key={tb.budgetTypeId}
                    budgetTypeId={tb.budgetTypeId}
                    budgetTypeSlug={tb.budgetTypeSlug}
                    isEarningPool={tb.isEarningPool}
                    label={tb.budgetTypeDisplayName}
                    icon={tb.budgetTypeIcon}
                    remainingSeconds={displaySeconds}
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
                    elapsedSeconds={isThisEarningRunning ? earningElapsed : 0}
                    onStart={(earningTypeId) => startTimer(null, earningTypeId)}
                    onStop={stopTimer}
                    disabled={loading || (hasActiveTimer && !isThisEarningRunning)}
                  />
                )
              })}
            </div>
          </div>

          {/* Timer overlay - absolutely positioned on top when active */}
          {activeScreenTimer && (
            <div className="absolute inset-0">
              <ActiveTimerOverlay
                budgetTypeSlug={activeScreenTimer.budgetTypeSlug}
                budgetTypeDisplayName={activeScreenTimer.budgetTypeDisplayName}
                budgetTypeIcon={activeScreenTimer.budgetTypeIcon}
                remainingSeconds={activeTimerCountdown}
                isEarningToExtra={false}
                onStop={stopTimer}
                disabled={loading}
              />
            </div>
          )}

          {/* Earning timer layout - enlarged Extra + divider + enlarged earning timer */}
          {activeEarningTimer && activeEarningType && (() => {
            const extraBudgetType = status.typeBalances.find((tb) => tb.isEarningPool)
            const ExtraIcon = getBudgetIcon('extra', extraBudgetType?.budgetTypeIcon)
            const EarningIcon = getEarningIcon(activeEarningType.slug, activeEarningType.icon)
            return (
              <div className="absolute inset-0 flex flex-col">
                {/* Enlarged Extra timer */}
                <div className="flex-1 flex flex-col items-center justify-center bg-success/10 rounded-lg p-4">
                  <ExtraIcon size={120} className="text-success animate-pulse" />
                  <p className="text-2xl text-success font-medium mt-1">Extra</p>
                  <div className="text-7xl font-mono font-bold text-success">
                    {formatTime(extraBalance + pendingEarnedSeconds)}
                  </div>
                  <p className="text-base text-success/70 mt-1">
                    +{formatTime(pendingEarnedSeconds)} earned
                  </p>
                </div>

                {/* Divider */}
                <div className="divider text-xs text-base-content/50 my-1">Earn Time → Extra</div>

                {/* Enlarged earning timer */}
                <div className="flex-1 flex flex-col items-center justify-center bg-success/10 rounded-lg p-4">
                  <EarningIcon size={120} className="text-success animate-pulse" />
                  <p className="text-2xl text-success font-medium mt-1">
                    {activeEarningType.displayName}
                  </p>
                  <div className="text-7xl font-mono font-bold text-success">
                    {formatTime(earningElapsed)}
                  </div>
                  <p className="text-base text-base-content/50 mt-1">
                    {activeEarningType.ratioNumerator} min = {activeEarningType.ratioDenominator} min extra
                  </p>
                  <button
                    type="button"
                    className="btn btn-success btn-lg w-full mt-3"
                    onClick={stopTimer}
                    disabled={loading}
                  >
                    Done
                  </button>
                </div>
              </div>
            )
          })()}
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
