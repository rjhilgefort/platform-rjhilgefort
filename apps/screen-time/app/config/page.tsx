'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface BudgetDefault {
  budgetTypeId: number
  budgetTypeSlug: string
  budgetTypeDisplayName: string
  dailyBudgetMinutes: number
}

interface KidConfig {
  id: number
  name: string
  budgetDefaults: BudgetDefault[]
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

interface TypeBalance {
  budgetTypeId: number
  budgetTypeSlug: string
  budgetTypeDisplayName: string
  remainingSeconds: number
}

interface StatusData {
  kidId: number
  typeBalances: TypeBalance[]
}

export default function ConfigPage() {
  const [kids, setKids] = useState<KidConfig[]>([])
  const [budgetTypes, setBudgetTypes] = useState<BudgetType[]>([])
  const [earningTypes, setEarningTypes] = useState<EarningType[]>([])
  const [balanceInputs, setBalanceInputs] = useState<
    Record<number, Record<number, string>>
  >({})
  const [loading, setLoading] = useState(true)
  const [pin, setPin] = useState('')
  const [pinVerified, setPinVerified] = useState(false)
  const [error, setError] = useState('')
  const [toasts, setToasts] = useState<{ message: string; id: number }[]>([])
  const [disabledButtons, setDisabledButtons] = useState<Set<string>>(new Set())
  const [newBudgetTypeName, setNewBudgetTypeName] = useState('')
  const [newEarningTypeName, setNewEarningTypeName] = useState('')

  useEffect(() => {
    fetchConfig()
    fetchBalances()
  }, [])

  const fetchConfig = async () => {
    const response = await fetch('/api/config')
    if (response.ok) {
      const data = await response.json()
      setKids(data.kids)
      setBudgetTypes(data.budgetTypes)
      setEarningTypes(data.earningTypes)
    }
    setLoading(false)
  }

  const fetchBalances = async () => {
    const response = await fetch('/api/timers/status')
    if (response.ok) {
      const data = await response.json()
      const inputMap: Record<number, Record<number, string>> = {}
      for (const status of data.statuses as StatusData[]) {
        inputMap[status.kidId] = {}
        for (const tb of status.typeBalances) {
          inputMap[status.kidId]![tb.budgetTypeId] = Math.floor(
            tb.remainingSeconds / 60
          ).toString()
        }
      }
      setBalanceInputs(inputMap)
    }
  }

  const handlePinSubmit = () => {
    if (pin.length === 4) {
      setPinVerified(true)
    }
  }

  const showToast = (message: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { message, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }

  const updateKidBudgetDefault = async (
    kidId: number,
    budgetTypeId: number,
    dailyBudgetMinutes: number
  ) => {
    setError('')

    const response = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin,
        action: 'updateKidBudgetDefault',
        kidId,
        budgetTypeId,
        dailyBudgetMinutes,
      }),
    })

    if (response.ok) {
      fetchConfig()
    } else {
      const data = await response.json()
      setError(data.error || 'Failed to save')
      if (data.error === 'Invalid PIN') {
        setPinVerified(false)
        setPin('')
      }
    }
  }

  const updateEarningType = async (
    earningTypeId: number,
    updates: Partial<EarningType>
  ) => {
    setError('')

    const response = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin,
        action: 'updateEarningType',
        earningTypeId,
        ...updates,
      }),
    })

    if (response.ok) {
      fetchConfig()
    } else {
      const data = await response.json()
      setError(data.error || 'Failed to save')
      if (data.error === 'Invalid PIN') {
        setPinVerified(false)
        setPin('')
      }
    }
  }

  const createBudgetType = async () => {
    if (!newBudgetTypeName.trim()) return
    setError('')

    const slug = newBudgetTypeName.toLowerCase().replace(/\s+/g, '-')
    const response = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin,
        action: 'createBudgetType',
        slug,
        displayName: newBudgetTypeName.trim(),
      }),
    })

    if (response.ok) {
      setNewBudgetTypeName('')
      fetchConfig()
      fetchBalances()
      showToast(`Added "${newBudgetTypeName.trim()}"`)
    } else {
      const data = await response.json()
      setError(data.error || 'Failed to create')
      if (data.error === 'Invalid PIN') {
        setPinVerified(false)
        setPin('')
      }
    }
  }

  const updateBudgetType = async (budgetTypeId: number, displayName: string) => {
    setError('')

    const response = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin,
        action: 'updateBudgetType',
        budgetTypeId,
        displayName,
      }),
    })

    if (response.ok) {
      fetchConfig()
    } else {
      const data = await response.json()
      setError(data.error || 'Failed to update')
      if (data.error === 'Invalid PIN') {
        setPinVerified(false)
        setPin('')
      }
    }
  }

  const deleteBudgetType = async (budgetTypeId: number, name: string) => {
    if (!confirm(`Delete "${name}"? This will remove all related balances.`)) return
    setError('')

    const response = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin,
        action: 'deleteBudgetType',
        budgetTypeId,
      }),
    })

    if (response.ok) {
      fetchConfig()
      fetchBalances()
      showToast(`Deleted "${name}"`)
    } else {
      const data = await response.json()
      setError(data.error || 'Failed to delete')
      if (data.error === 'Invalid PIN') {
        setPinVerified(false)
        setPin('')
      }
    }
  }

  const createEarningType = async () => {
    if (!newEarningTypeName.trim()) return
    setError('')

    const slug = newEarningTypeName.toLowerCase().replace(/\s+/g, '-')
    const response = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin,
        action: 'createEarningType',
        slug,
        displayName: newEarningTypeName.trim(),
        ratioNumerator: 1,
        ratioDenominator: 1,
      }),
    })

    if (response.ok) {
      setNewEarningTypeName('')
      fetchConfig()
      showToast(`Added "${newEarningTypeName.trim()}"`)
    } else {
      const data = await response.json()
      setError(data.error || 'Failed to create')
      if (data.error === 'Invalid PIN') {
        setPinVerified(false)
        setPin('')
      }
    }
  }

  const deleteEarningType = async (earningTypeId: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    setError('')

    const response = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin,
        action: 'deleteEarningType',
        earningTypeId,
      }),
    })

    if (response.ok) {
      fetchConfig()
      showToast(`Deleted "${name}"`)
    } else {
      const data = await response.json()
      setError(data.error || 'Failed to delete')
      if (data.error === 'Invalid PIN') {
        setPinVerified(false)
        setPin('')
      }
    }
  }

  const setCurrentBalance = async (
    kidId: number,
    budgetTypeId: number,
    minutes: number
  ) => {
    const buttonKey = `${kidId}-${budgetTypeId}`
    if (disabledButtons.has(buttonKey)) return

    setDisabledButtons((prev) => new Set(prev).add(buttonKey))
    setError('')

    const response = await fetch('/api/balance/set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kidId, pin, budgetTypeId, minutes }),
    })

    if (response.ok) {
      const data = await response.json()
      // Update balance inputs from response
      const newInputs: Record<number, string> = {}
      for (const tb of data.balance.typeBalances as TypeBalance[]) {
        newInputs[tb.budgetTypeId] = Math.floor(tb.remainingSeconds / 60).toString()
      }
      setBalanceInputs((prev) => ({
        ...prev,
        [kidId]: newInputs,
      }))
      const kid = kids.find((k) => k.id === kidId)
      const bt = budgetTypes.find((b) => b.id === budgetTypeId)
      showToast(`${kid?.name}'s ${bt?.displayName} set to ${minutes} min`)
      setTimeout(() => {
        setDisabledButtons((prev) => {
          const next = new Set(prev)
          next.delete(buttonKey)
          return next
        })
      }, 5000)
    } else {
      setDisabledButtons((prev) => {
        const next = new Set(prev)
        next.delete(buttonKey)
        return next
      })
      const data = await response.json()
      setError(data.error || 'Failed to save')
      if (data.error === 'Invalid PIN') {
        setPinVerified(false)
        setPin('')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (!pinVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
        <div className="card bg-base-100 shadow-xl w-full max-w-sm">
          <div className="card-body items-center">
            <h1 className="card-title text-xl mb-4">Parent PIN Required</h1>

            <div className="flex gap-3 mb-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 ${
                    pin.length > i
                      ? 'bg-primary border-primary'
                      : 'border-base-300'
                  }`}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(
                (digit, i) =>
                  digit ? (
                    <button
                      key={digit}
                      type="button"
                      className="btn btn-neutral"
                      onClick={() => {
                        if (digit === '⌫') setPin((p) => p.slice(0, -1))
                        else if (pin.length < 4) setPin((p) => p + digit)
                      }}
                    >
                      {digit}
                    </button>
                  ) : (
                    <div key={i} />
                  )
              )}
            </div>

            <button
              type="button"
              className="btn btn-primary btn-wide mt-4"
              onClick={handlePinSubmit}
              disabled={pin.length !== 4}
            >
              Enter
            </button>

            <Link href="/" className="btn btn-ghost btn-sm mt-2">
              Back
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <Link href="/" className="btn btn-ghost btn-sm">
            Back
          </Link>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {/* Kid Settings */}
        <div className="space-y-6">
          {kids.map((kid) => (
            <div key={kid.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{kid.name}</h2>

                {/* Current Balance Section */}
                <div className="bg-base-200 rounded-lg p-4 mt-2">
                  <h3 className="text-sm font-semibold mb-3">
                    Current Balance (today)
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {budgetTypes.map((bt) => (
                      <div key={bt.id} className="form-control">
                        <label className="label">
                          <span className="label-text">{bt.displayName} (min)</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            className="input input-bordered input-sm flex-1"
                            value={balanceInputs[kid.id]?.[bt.id] ?? ''}
                            onChange={(e) =>
                              setBalanceInputs((prev) => ({
                                ...prev,
                                [kid.id]: {
                                  ...prev[kid.id],
                                  [bt.id]: e.target.value,
                                },
                              }))
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            disabled={disabledButtons.has(`${kid.id}-${bt.id}`)}
                            onClick={() =>
                              setCurrentBalance(
                                kid.id,
                                bt.id,
                                parseInt(balanceInputs[kid.id]?.[bt.id] || '0')
                              )
                            }
                          >
                            Set
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Daily Defaults Section */}
                <div className="divider text-sm">Daily Defaults</div>

                <div className="grid grid-cols-2 gap-4">
                  {kid.budgetDefaults.map((bd) => (
                    <div key={bd.budgetTypeId} className="form-control">
                      <label className="label">
                        <span className="label-text">
                          Daily {bd.budgetTypeDisplayName} (min)
                        </span>
                      </label>
                      <input
                        type="number"
                        className="input input-bordered"
                        value={bd.dailyBudgetMinutes}
                        onChange={(e) =>
                          setKids((prev) =>
                            prev.map((k) =>
                              k.id === kid.id
                                ? {
                                    ...k,
                                    budgetDefaults: k.budgetDefaults.map((d) =>
                                      d.budgetTypeId === bd.budgetTypeId
                                        ? {
                                            ...d,
                                            dailyBudgetMinutes:
                                              parseInt(e.target.value) || 0,
                                          }
                                        : d
                                    ),
                                  }
                                : k
                            )
                          )
                        }
                        onBlur={() =>
                          updateKidBudgetDefault(
                            kid.id,
                            bd.budgetTypeId,
                            bd.dailyBudgetMinutes
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Budget Types Section */}
        <div className="card bg-base-100 shadow-xl mt-6">
          <div className="card-body">
            <h2 className="card-title">Screen Time Types</h2>
            <p className="text-sm text-base-content/60">
              Types of screen time kids can use (TV, Games, etc.)
            </p>

            <div className="space-y-3 mt-4">
              {budgetTypes.map((bt) => (
                <div
                  key={bt.id}
                  className="flex items-center gap-3 p-3 bg-base-200 rounded-lg"
                >
                  <input
                    type="text"
                    className="input input-bordered input-sm flex-1"
                    value={bt.displayName}
                    onChange={(e) =>
                      setBudgetTypes((prev) =>
                        prev.map((t) =>
                          t.id === bt.id ? { ...t, displayName: e.target.value } : t
                        )
                      )
                    }
                    onBlur={() => updateBudgetType(bt.id, bt.displayName)}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-square text-error"
                    onClick={() => deleteBudgetType(bt.id, bt.displayName)}
                    title="Delete"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <input
                type="text"
                className="input input-bordered input-sm flex-1"
                placeholder="New screen time type..."
                value={newBudgetTypeName}
                onChange={(e) => setNewBudgetTypeName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createBudgetType()}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={createBudgetType}
                disabled={!newBudgetTypeName.trim()}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Earning Types Section */}
        <div className="card bg-base-100 shadow-xl mt-6">
          <div className="card-body">
            <h2 className="card-title">Earning Types</h2>
            <p className="text-sm text-base-content/60">
              Activities that earn screen time
            </p>

            <div className="space-y-3 mt-4">
              {earningTypes.map((et) => (
                <div
                  key={et.id}
                  className="flex items-center gap-3 p-3 bg-base-200 rounded-lg"
                >
                  <input
                    type="text"
                    className="input input-bordered input-sm flex-1"
                    value={et.displayName}
                    onChange={(e) =>
                      setEarningTypes((prev) =>
                        prev.map((t) =>
                          t.id === et.id ? { ...t, displayName: e.target.value } : t
                        )
                      )
                    }
                    onBlur={() =>
                      updateEarningType(et.id, { displayName: et.displayName })
                    }
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      className="input input-bordered input-sm w-14"
                      value={et.ratioNumerator}
                      min={1}
                      onChange={(e) =>
                        setEarningTypes((prev) =>
                          prev.map((t) =>
                            t.id === et.id
                              ? { ...t, ratioNumerator: parseInt(e.target.value) || 1 }
                              : t
                          )
                        )
                      }
                      onBlur={() =>
                        updateEarningType(et.id, {
                          ratioNumerator: et.ratioNumerator,
                        })
                      }
                    />
                    <span className="text-sm">:</span>
                    <input
                      type="number"
                      className="input input-bordered input-sm w-14"
                      value={et.ratioDenominator}
                      min={1}
                      onChange={(e) =>
                        setEarningTypes((prev) =>
                          prev.map((t) =>
                            t.id === et.id
                              ? {
                                  ...t,
                                  ratioDenominator: parseInt(e.target.value) || 1,
                                }
                              : t
                          )
                        )
                      }
                      onBlur={() =>
                        updateEarningType(et.id, {
                          ratioDenominator: et.ratioDenominator,
                        })
                      }
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-square text-error"
                    onClick={() => deleteEarningType(et.id, et.displayName)}
                    title="Delete"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <input
                type="text"
                className="input input-bordered input-sm flex-1"
                placeholder="New earning type..."
                value={newEarningTypeName}
                onChange={(e) => setNewEarningTypeName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createEarningType()}
              />
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={createEarningType}
                disabled={!newEarningTypeName.trim()}
              >
                Add
              </button>
            </div>

            <p className="text-xs text-base-content/50 mt-2">
              Ratio: minutes of activity = minutes of screen time earned
            </p>
          </div>
        </div>
      </div>

      {toasts.length > 0 && (
        <div className="toast toast-end toast-top">
          {toasts.map((t) => (
            <div key={t.id} className="alert alert-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{t.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
