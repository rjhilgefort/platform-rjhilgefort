'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { KidCard } from '../components/KidCard'
import { KidTabs } from '../components/KidTabs'
import { TimeUpSound } from '../components/TimeUpSound'
import { AppIcon } from '../components/AppIcon'
import { useServerEvents } from '../hooks/useServerEvents'

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

interface StatusResponse {
  statuses: KidStatus[]
  budgetTypes: BudgetType[]
  earningTypes: EarningType[]
  negativeBalancePenalty: number
  serverTime: string
}

export default function HomePage() {
  const [data, setData] = useState<StatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const prevTimesRef = useRef<Record<number, Record<number, number>>>({})

  const fetchStatus = useCallback(async () => {
    const response = await fetch('/api/timers/status')
    if (response.ok) {
      const responseData: StatusResponse = await response.json()
      setData(responseData)
      setError('')
    } else {
      setError('Failed to load status')
    }
    setLoading(false)
  }, [])

  // Subscribe to real-time updates via SSE
  useServerEvents(useCallback((event) => {
    // Refetch on any state-changing event
    if (event.type !== 'connected' && event.type !== 'ping') {
      fetchStatus()
    }
  }, [fetchStatus]))

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000) // Backup sync every 30s
    return () => clearInterval(interval)
  }, [fetchStatus])

  const statuses = data?.statuses ?? []
  const budgetTypes = data?.budgetTypes ?? []
  const earningTypes = data?.earningTypes ?? []
  const negativeBalancePenalty = data?.negativeBalancePenalty ?? 0

  // Track when any timer hits zero
  const shouldPlaySound = statuses.some((status) => {
    const prev = prevTimesRef.current[status.kidId]
    if (!prev) return false
    return status.typeBalances.some((tb) => {
      const prevTime = prev[tb.budgetTypeId]
      return prevTime !== undefined && prevTime > 0 && tb.remainingSeconds <= 0
    })
  })

  // Update previous times after checking
  useEffect(() => {
    const newPrev: Record<number, Record<number, number>> = {}
    statuses.forEach((s) => {
      newPrev[s.kidId] = {}
      s.typeBalances.forEach((tb) => {
        newPrev[s.kidId]![tb.budgetTypeId] = tb.remainingSeconds
      })
    })
    prevTimesRef.current = newPrev
  }, [statuses])

  // Show loading until we have data
  if (loading || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 gap-4">
        <div className="flex items-center gap-3">
          <AppIcon size={40} />
          <h1 className="text-3xl font-bold">Budget Time</h1>
        </div>
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (statuses.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 gap-4">
        <div className="flex items-center gap-3">
          <AppIcon size={40} />
          <h1 className="text-3xl font-bold">Budget Time</h1>
        </div>
        <div className="text-center">
          <p className="text-lg mb-4">No kids configured</p>
          <Link href="/config" className="btn btn-primary">Go to Settings</Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 gap-4">
        <div className="flex items-center gap-3">
          <AppIcon size={40} />
          <h1 className="text-3xl font-bold">Budget Time</h1>
        </div>
        <div className="alert alert-error">
          <span>{error}</span>
          <button type="button" className="btn btn-sm" onClick={fetchStatus}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <AppIcon size={40} />
            <h1 className="text-3xl font-bold">Budget Time</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/history" className="btn btn-outline btn-sm">
              History
            </Link>
            <Link href="/config" className="btn btn-outline btn-sm">
              Settings
            </Link>
          </div>
        </div>

        {/* Mobile: Tabs view */}
        <div className="md:hidden">
          <KidTabs
            statuses={statuses}
            budgetTypes={budgetTypes}
            earningTypes={earningTypes}
            negativeBalancePenalty={negativeBalancePenalty}
            onRefresh={fetchStatus}
          />
        </div>

        {/* Desktop: Grid view */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {statuses.map((status) => (
            <KidCard
              key={status.kidId}
              status={status}
              budgetTypes={budgetTypes}
              earningTypes={earningTypes}
              negativeBalancePenalty={negativeBalancePenalty}
              onRefresh={fetchStatus}
            />
          ))}
        </div>
      </div>

      <TimeUpSound shouldPlay={shouldPlaySound} />
    </div>
  )
}
