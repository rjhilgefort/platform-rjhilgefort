'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { TbArrowLeft, TbPencil, TbX, TbCheck } from 'react-icons/tb'
import { PinPad } from '../../components/PinPad'
import { formatTime } from '../../lib/timer-logic'
import { getIconComponent } from '../../lib/icon-registry'

interface HistoryEntry {
  id: number
  kidId: number
  kidName: string
  eventType: string
  budgetTypeId: number
  budgetTypeDisplayName: string
  budgetTypeIcon: string | null
  earningTypeId: number | null
  earningTypeDisplayName: string | null
  earningTypeIcon: string | null
  startedAt: string | null
  endedAt: string | null
  seconds: number
  createdAt: string | null
}

interface Kid {
  id: number
  name: string
}

interface DayGroup {
  label: string
  date: string
  entries: HistoryEntry[]
}

function formatDayLabel(dateStr: string): string {
  // dateStr is YYYY-MM-DD in local time
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year ?? 0, (month ?? 1) - 1, day)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.getTime() === today.getTime()) {
    return 'Today'
  }
  if (date.getTime() === yesterday.getTime()) {
    return 'Yesterday'
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatTimeOfDay(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function groupByDay(entries: HistoryEntry[]): DayGroup[] {
  const groups: Map<string, HistoryEntry[]> = new Map()

  for (const entry of entries) {
    if (!entry.endedAt) continue
    const date = new Date(entry.endedAt)
    // Use local date for grouping (YYYY-MM-DD in local timezone)
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const existing = groups.get(dateKey)
    if (existing) {
      existing.push(entry)
    } else {
      groups.set(dateKey, [entry])
    }
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a)) // Days: most recent first
    .map(([date, dayEntries]) => ({
      label: formatDayLabel(date),
      date,
      // Sort entries within day: most recent first
      entries: dayEntries.sort((a, b) => {
        const aTime = a.endedAt ? new Date(a.endedAt).getTime() : 0
        const bTime = b.endedAt ? new Date(b.endedAt).getTime() : 0
        return bTime - aTime
      }),
    }))
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [kids, setKids] = useState<Kid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedKidId, setSelectedKidId] = useState<number | null>(null)
  const [nextCursor, setNextCursor] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showPinPad, setShowPinPad] = useState(false)
  const [pendingEditId, setPendingEditId] = useState<number | null>(null)
  const [editEndTime, setEditEndTime] = useState('')
  const [saving, setSaving] = useState(false)
  const [verifiedPin, setVerifiedPin] = useState<string | null>(null)

  const fetchHistory = useCallback(
    async (cursor?: number | null) => {
      const params = new URLSearchParams()
      if (selectedKidId) params.set('kidId', selectedKidId.toString())
      if (cursor) params.set('cursor', cursor.toString())
      params.set('limit', '50')

      const response = await fetch(`/api/history?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to load history')
      }
      return response.json()
    },
    [selectedKidId]
  )

  const loadInitial = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchHistory()
      setEntries(data.entries)
      setKids(data.kids)
      setHasMore(data.pagination.hasMore)
      setNextCursor(data.pagination.nextCursor)
    } catch {
      setError('Failed to load history')
    } finally {
      setLoading(false)
    }
  }, [fetchHistory])

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return
    setLoadingMore(true)
    try {
      const data = await fetchHistory(nextCursor)
      setEntries((prev) => [...prev, ...data.entries])
      setHasMore(data.pagination.hasMore)
      setNextCursor(data.pagination.nextCursor)
    } catch {
      setError('Failed to load more')
    } finally {
      setLoadingMore(false)
    }
  }, [fetchHistory, hasMore, loadingMore, nextCursor])

  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  const handleEditClick = (id: number) => {
    if (verifiedPin) {
      // Already verified, go straight to edit
      startEditing(id)
    } else {
      // Need PIN verification
      setPendingEditId(id)
      setShowPinPad(true)
    }
  }

  const handlePinSubmit = async (pin: string): Promise<boolean> => {
    const response = await fetch('/api/auth/validate-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })
    const data = await response.json()
    if (data.valid && pendingEditId) {
      setVerifiedPin(pin)
      setShowPinPad(false)
      startEditing(pendingEditId)
      setPendingEditId(null)
      return true
    }
    return false
  }

  const startEditing = (id: number) => {
    const entry = entries.find((e) => e.id === id)
    if (!entry?.endedAt) return
    setEditingId(id)
    // Format for datetime-local input
    const date = new Date(entry.endedAt)
    const localIso = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    setEditEndTime(localIso)
  }

  const handleSaveEdit = async () => {
    if (!editingId || !verifiedPin) return
    setSaving(true)
    try {
      const response = await fetch('/api/history', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          endedAt: new Date(editEndTime).toISOString(),
          pin: verifiedPin,
        }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Failed to save')
      }
      // Refresh the list
      await loadInitial()
      setEditingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditEndTime('')
  }

  const dayGroups = groupByDay(entries)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (showPinPad) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
        <div className="card bg-base-100 shadow-xl p-6">
          <PinPad
            title="Enter Parent PIN"
            onSubmit={handlePinSubmit}
            onCancel={() => {
              setShowPinPad(false)
              setPendingEditId(null)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="btn btn-ghost btn-sm">
              <TbArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">Timer History</h1>
          </div>

          {/* Kid filter */}
          <select
            className="select select-bordered select-sm"
            value={selectedKidId ?? ''}
            onChange={(e) => {
              const val = e.target.value
              setSelectedKidId(val ? parseInt(val, 10) : null)
            }}
          >
            <option value="">All Kids</option>
            {kids.map((kid) => (
              <option key={kid.id} value={kid.id}>
                {kid.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
            <button type="button" className="btn btn-sm" onClick={loadInitial}>
              Retry
            </button>
          </div>
        )}

        {/* History list */}
        {dayGroups.length === 0 ? (
          <div className="text-center py-12 text-base-content/50">
            No history entries yet
          </div>
        ) : (
          <div className="space-y-6">
            {dayGroups.map((group) => (
              <div key={group.date}>
                {/* Day header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-base-300" />
                  <span className="text-sm font-medium text-base-content/70">
                    {group.label}
                  </span>
                  <div className="h-px flex-1 bg-base-300" />
                </div>

                {/* Day entries */}
                <div className="space-y-2">
                  {group.entries.map((entry) => {
                    const isEditing = editingId === entry.id
                    const isEarning = entry.eventType === 'earned'
                    const Icon = entry.budgetTypeIcon
                      ? getIconComponent(entry.budgetTypeIcon)
                      : null

                    return (
                      <div
                        key={entry.id}
                        className="card bg-base-100 shadow-sm p-3"
                      >
                        <div className="flex items-center gap-3">
                          {/* Icon */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isEarning ? 'bg-success/20' : 'bg-error/20'
                            }`}
                          >
                            {Icon ? (
                              <Icon
                                className={`w-5 h-5 ${
                                  isEarning ? 'text-success' : 'text-error'
                                }`}
                              />
                            ) : (
                              <span
                                className={`text-lg ${
                                  isEarning ? 'text-success' : 'text-error'
                                }`}
                              >
                                {isEarning ? '+' : '-'}
                              </span>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{entry.kidName}</span>
                              <span className="text-base-content/50">-</span>
                              <span
                                className={
                                  isEarning ? 'text-success' : 'text-error'
                                }
                              >
                                {isEarning ? 'Earned' : 'Used'}
                              </span>
                            </div>
                            <div className="text-sm text-base-content/60">
                              {entry.endedAt && formatTimeOfDay(entry.endedAt)}
                              {' • '}
                              {entry.budgetTypeDisplayName}
                              {entry.earningTypeDisplayName &&
                                ` via ${entry.earningTypeDisplayName}`}
                            </div>
                          </div>

                          {/* Time / Edit */}
                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <>
                                <input
                                  type="datetime-local"
                                  className="input input-bordered input-sm w-48"
                                  value={editEndTime}
                                  onChange={(e) => setEditEndTime(e.target.value)}
                                />
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-sm btn-square"
                                  onClick={cancelEdit}
                                  disabled={saving}
                                >
                                  <TbX className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm btn-square"
                                  onClick={handleSaveEdit}
                                  disabled={saving}
                                >
                                  {saving ? (
                                    <span className="loading loading-spinner loading-xs" />
                                  ) : (
                                    <TbCheck className="w-4 h-4" />
                                  )}
                                </button>
                              </>
                            ) : (
                              <>
                                <span
                                  className={`font-mono text-lg ${
                                    isEarning ? 'text-success' : 'text-error'
                                  }`}
                                >
                                  {isEarning ? '+' : '-'}
                                  {formatTime(entry.seconds)}
                                </span>
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-sm btn-square"
                                  onClick={() => handleEditClick(entry.id)}
                                >
                                  <TbPencil className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center mt-6">
            <button
              type="button"
              className="btn btn-outline"
              onClick={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
