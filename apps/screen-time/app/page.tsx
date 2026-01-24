'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { KidCard } from '../components/KidCard'
import { TimeUpSound } from '../components/TimeUpSound'

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
  isEarningPool: boolean
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

interface StatusResponse {
  statuses: KidStatus[]
  budgetTypes: BudgetType[]
  earningTypes: EarningType[]
  serverTime: string
}

export default function HomePage() {
  const [statuses, setStatuses] = useState<KidStatus[]>([])
  const [budgetTypes, setBudgetTypes] = useState<BudgetType[]>([])
  const [earningTypes, setEarningTypes] = useState<EarningType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const prevTimesRef = useRef<Record<number, Record<number, number>>>({})

  const fetchStatus = useCallback(async () => {
    const response = await fetch('/api/timers/status')
    if (response.ok) {
      const data: StatusResponse = await response.json()
      setStatuses(data.statuses)
      setBudgetTypes(data.budgetTypes)
      setEarningTypes(data.earningTypes)
      setError('')
    } else {
      setError('Failed to load status')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000) // Sync every 30s, client handles countdown
    return () => clearInterval(interval)
  }, [fetchStatus])

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
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
          <h1 className="text-3xl font-bold">Screen Time</h1>
          <Link href="/config" className="btn btn-outline btn-sm">
            Settings
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {statuses.map((status) => (
            <KidCard
              key={status.kidId}
              status={status}
              budgetTypes={budgetTypes}
              earningTypes={earningTypes}
              onRefresh={fetchStatus}
            />
          ))}
        </div>
      </div>

      <TimeUpSound shouldPlay={shouldPlaySound} />
    </div>
  )
}
