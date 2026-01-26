'use client'

import { useState, useRef, useEffect } from 'react'
import { CountdownTimer } from './CountdownTimer'
import { EarningTimer } from './EarningTimer'
import { BonusModal } from './BonusModal'
import { ActiveTimerOverlay } from './ActiveTimerOverlay'
import { PinPad } from './PinPad'
import { useCountdown, useElapsed } from '../hooks/useCountdown'
import { formatTime } from '../lib/timer-logic'
import { Fraction } from './Fraction'
import { getBudgetIcon, getEarningIcon } from '../lib/budget-icons'
import { TimeDisplay } from './TimeDisplay'

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
  embedded?: boolean
}

export function KidCard({ status, budgetTypes, earningTypes, onRefresh, embedded = false }: KidCardProps) {
  const [showBonus, setShowBonus] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pendingEarningTypeId, setPendingEarningTypeId] = useState<number | null>(null)
  const [pinError, setPinError] = useState('')

  const hasActiveTimer = status.activeTimer !== null
  const isEarningTimer = status.activeTimer?.earningTypeId != null
  const activeBudgetTimer = hasActiveTimer && !isEarningTimer ? status.activeTimer : null
  const activeEarningTimer = hasActiveTimer && isEarningTimer ? status.activeTimer : null
  const sortedTypeBalances = [...status.typeBalances].sort((a, b) => {
    if (a.isEarningPool !== b.isEarningPool) return Number(a.isEarningPool) - Number(b.isEarningPool)
    return a.budgetTypeDisplayName.localeCompare(b.budgetTypeDisplayName)
  })
  const sortedEarningTypes = [...earningTypes].sort((a, b) => a.displayName.localeCompare(b.displayName))
  const extraTypeBalance = status.typeBalances.find((tb) => tb.isEarningPool)
  const extraBalance = extraTypeBalance?.remainingSeconds ?? 0

  // Client-side countdown for active budget timer
  const activeTimerBalance = activeBudgetTimer
    ? status.typeBalances.find((tb) => tb.budgetTypeId === activeBudgetTimer.budgetTypeId)
    : null

  // Cache original budget AND Extra balance at timer start to prevent flicker on server polls.
  // Once overflow starts, server returns remainingSeconds=0, so we'd lose the original values.
  const timerCacheRef = useRef<{ startedAt: string; budgetSeconds: number; extraSeconds: number } | null>(null)
  const calculatedBaseSeconds = activeTimerBalance
    ? activeTimerBalance.remainingSeconds + (status.activeTimer?.elapsedSeconds ?? 0)
    : 0

  // Update cache when timer starts or changes
  useEffect(() => {
    if (activeBudgetTimer) {
      // Only set cache if this is a new timer (different startedAt)
      if (timerCacheRef.current?.startedAt !== activeBudgetTimer.startedAt) {
        timerCacheRef.current = {
          startedAt: activeBudgetTimer.startedAt,
          budgetSeconds: calculatedBaseSeconds,
          extraSeconds: extraBalance,
        }
      }
    } else {
      timerCacheRef.current = null
    }
  }, [activeBudgetTimer?.startedAt, calculatedBaseSeconds, extraBalance])

  // Use cached values if available, otherwise use calculated
  const timerCache = timerCacheRef.current
  const activeTimerBaseSeconds =
    timerCache && timerCache.startedAt === activeBudgetTimer?.startedAt
      ? timerCache.budgetSeconds
      : calculatedBaseSeconds
  const cachedExtraSeconds =
    timerCache && timerCache.startedAt === activeBudgetTimer?.startedAt
      ? timerCache.extraSeconds
      : extraBalance

  const activeTimerCountdown = useCountdown(
    activeBudgetTimer?.startedAt ?? null,
    activeTimerBaseSeconds,
    activeBudgetTimer !== null,
    activeTimerBalance?.isEarningPool ?? false
  )

  // Track overflow into Extra time (when original budget depleted)
  const activeTimerElapsed = useElapsed(
    activeBudgetTimer?.startedAt ?? null,
    activeBudgetTimer !== null
  )
  const isUsingExtraTime = activeBudgetTimer !== null &&
    !activeTimerBalance?.isEarningPool &&
    activeTimerElapsed > activeTimerBaseSeconds
  const overflowSeconds = isUsingExtraTime
    ? activeTimerElapsed - activeTimerBaseSeconds
    : 0

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

  const handleEarningPinSubmit = async (pin: string): Promise<boolean> => {
    if (pendingEarningTypeId === null) return false

    const response = await fetch('/api/auth/validate-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })
    const data = await response.json()

    if (data.valid) {
      setPinError('')
      setPendingEarningTypeId(null)
      await startTimer(null, pendingEarningTypeId)
      return true
    } else {
      setPinError('Invalid PIN')
      return false
    }
  }

  const handleEarningPinCancel = () => {
    setPendingEarningTypeId(null)
    setPinError('')
  }

  return (
    <div className={embedded ? '' : 'card bg-base-100 shadow-xl h-full flex flex-col'}>
      <div className={embedded ? '' : 'card-body flex-1 flex flex-col'}>
        {!embedded && (
          <div className="flex justify-between items-center">
            <h2 className="card-title text-2xl">{status.kidName}</h2>
            <button
              type="button"
              className="btn btn-ghost text-2xl font-bold leading-none"
              onClick={() => setShowBonus(true)}
              title="Adjust time"
            >
              +/-
            </button>
          </div>
        )}
        {embedded && (
          <div className="flex justify-end mb-2">
            <button
              type="button"
              className="btn btn-ghost text-xl font-bold leading-none"
              onClick={() => setShowBonus(true)}
              title="Adjust time"
            >
              +/-
            </button>
          </div>
        )}

        <div className="relative flex-1">
          {/* Normal grid - always rendered to preserve height, invisible when timer active */}
          <div className={activeBudgetTimer || isEarningTimer ? 'invisible' : ''}>
            {/* Budget Type Timers */}
            <div className="grid grid-cols-2 gap-3">
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
              {sortedEarningTypes.map((et) => {
                const isThisEarningRunning =
                  status.activeTimer?.earningTypeId === et.id
                return (
                  <EarningTimer
                    key={et.id}
                    earningType={et}
                    isRunning={isThisEarningRunning}
                    elapsedSeconds={isThisEarningRunning ? earningElapsed : 0}
                    onStart={(earningTypeId) => setPendingEarningTypeId(earningTypeId)}
                    onStop={stopTimer}
                    disabled={loading || (hasActiveTimer && !isThisEarningRunning)}
                  />
                )
              })}
            </div>
          </div>

          {/* Timer overlay - absolutely positioned on top when active */}
          {activeBudgetTimer && (
            <div className="absolute inset-0">
              <ActiveTimerOverlay
                budgetTypeSlug={activeBudgetTimer.budgetTypeSlug}
                budgetTypeDisplayName={activeBudgetTimer.budgetTypeDisplayName}
                budgetTypeIcon={activeBudgetTimer.budgetTypeIcon}
                remainingSeconds={activeTimerCountdown}
                startingSeconds={activeTimerBaseSeconds}
                isEarningToExtra={false}
                isUsingExtraTime={isUsingExtraTime}
                extraRemainingSeconds={cachedExtraSeconds - overflowSeconds}
                extraTypeIcon={extraTypeBalance?.budgetTypeIcon}
                onStop={stopTimer}
                disabled={loading}
              />
            </div>
          )}

          {/* Earning timer layout - icon+label inline, time below */}
          {activeEarningTimer && activeEarningType && (() => {
            const extraBudgetType = status.typeBalances.find((tb) => tb.isEarningPool)
            const ExtraIcon = getBudgetIcon('extra', extraBudgetType?.budgetTypeIcon)
            const EarningIcon = getEarningIcon(activeEarningType.slug, activeEarningType.icon)
            return (
              <div className="absolute inset-0 flex flex-col py-4">
                {/* Extra section */}
                <div className="flex flex-col items-center justify-center gap-1 bg-success/10 rounded-lg py-4">
                  <div className="flex items-center gap-3">
                    <ExtraIcon size={48} className="text-base-content/80" />
                    <p className="text-4xl text-base-content/80 font-semibold">Extra</p>
                  </div>
                  <TimeDisplay
                    seconds={extraBalance + pendingEarnedSeconds}
                    className="text-7xl text-success"
                    secondsRatio={0.7}
                  />
                  <p className="text-xl text-success/70">
                    +{formatTime(pendingEarnedSeconds)} earned
                  </p>
                </div>

                {/* Divider */}
                <div className="divider text-xs text-base-content/50 my-1">Earn Time → Extra</div>

                {/* Earning activity section */}
                <div className="flex flex-col items-center justify-center gap-1 bg-success/10 rounded-lg py-4">
                  <div className="flex items-center gap-3">
                    <EarningIcon size={48} className="text-base-content/80" />
                    <p className="text-4xl text-base-content/80 font-semibold">
                      {activeEarningType.displayName}
                    </p>
                  </div>
                  <TimeDisplay
                    seconds={earningElapsed}
                    className="text-7xl text-success"
                    secondsRatio={0.7}
                  />
                  <p className="text-xl text-base-content/50">
                    1 min = <Fraction value={activeEarningType.ratioDenominator} /> min extra
                  </p>
                </div>

                {/* Done button - outside the boxes */}
                <button
                  type="button"
                  className="btn btn-success w-full h-16 text-2xl mt-4"
                  onClick={stopTimer}
                  disabled={loading}
                >
                  Done
                </button>
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

      {/* PIN pad for starting earning timer */}
      {pendingEarningTypeId !== null && (
        <dialog className="modal modal-open">
          <div className="modal-box w-80">
            <PinPad
              title={`Start ${earningTypes.find((et) => et.id === pendingEarningTypeId)?.displayName ?? 'Earning'}`}
              onSubmit={handleEarningPinSubmit}
              onCancel={handleEarningPinCancel}
              cancelLabel="Cancel"
              error={pinError}
            />
          </div>
          <div className="modal-backdrop" onClick={handleEarningPinCancel} />
        </dialog>
      )}
    </div>
  )
}
