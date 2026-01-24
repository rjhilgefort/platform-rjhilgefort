'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { IconPickerModal } from '../../components/IconPickerModal'
import { PinPad } from '../../components/PinPad'
import { getIconComponent } from '../../lib/icon-registry'

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
  const [iconPickerTarget, setIconPickerTarget] = useState<{
    type: 'budget' | 'earning'
    id: number
    currentIcon: string | null
  } | null>(null)
  const [resetConfirm, setResetConfirm] = useState<Set<number>>(new Set())
  const [savedInputs, setSavedInputs] = useState<Set<string>>(new Set())
  const saveTimeouts = useRef<Record<string, NodeJS.Timeout>>({})

  const flashSaved = (key: string) => {
    setSavedInputs((prev) => new Set(prev).add(key))
    setTimeout(() => {
      setSavedInputs((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }, 1000)
  }

  const scheduleAutoSave = (key: string, saveFn: () => void) => {
    if (saveTimeouts.current[key]) {
      clearTimeout(saveTimeouts.current[key])
    }
    saveTimeouts.current[key] = setTimeout(() => {
      saveFn()
      flashSaved(key)
      delete saveTimeouts.current[key]
    }, 5000)
  }

  const cancelAutoSave = (key: string) => {
    if (saveTimeouts.current[key]) {
      clearTimeout(saveTimeouts.current[key])
      delete saveTimeouts.current[key]
    }
  }

  useEffect(() => {
    fetchConfig()
    fetchBalances()
  }, [])

  // Cleanup auto-save timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(saveTimeouts.current).forEach(clearTimeout)
    }
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
      showToast('Saved')
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
      showToast('Saved')
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

  const updateBudgetType = async (
    budgetTypeId: number,
    updates: Partial<BudgetType>
  ) => {
    setError('')

    const response = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin,
        action: 'updateBudgetType',
        budgetTypeId,
        ...updates,
      }),
    })

    if (response.ok) {
      fetchConfig()
      showToast('Saved')
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

  const handleIconSelect = async (iconName: string) => {
    if (!iconPickerTarget) return

    if (iconPickerTarget.type === 'budget') {
      await updateBudgetType(iconPickerTarget.id, { icon: iconName })
    } else {
      await updateEarningType(iconPickerTarget.id, { icon: iconName })
    }
    setIconPickerTarget(null)
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

  const resetToDefault = async (kidId: number) => {
    const buttonKey = `reset-${kidId}`
    if (disabledButtons.has(buttonKey)) return

    // First click: show confirmation
    if (!resetConfirm.has(kidId)) {
      setResetConfirm((prev) => new Set(prev).add(kidId))
      setTimeout(() => {
        setResetConfirm((prev) => {
          const next = new Set(prev)
          next.delete(kidId)
          return next
        })
      }, 5000)
      return
    }

    // Second click: execute reset
    setResetConfirm((prev) => {
      const next = new Set(prev)
      next.delete(kidId)
      return next
    })
    setDisabledButtons((prev) => new Set(prev).add(buttonKey))
    setError('')

    const response = await fetch('/api/balance/reset-to-default', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kidId, pin }),
    })

    if (response.ok) {
      const data = await response.json()
      const newInputs: Record<number, string> = {}
      for (const tb of data.balance.typeBalances as TypeBalance[]) {
        newInputs[tb.budgetTypeId] = Math.floor(tb.remainingSeconds / 60).toString()
      }
      setBalanceInputs((prev) => ({
        ...prev,
        [kidId]: newInputs,
      }))
      const kid = kids.find((k) => k.id === kidId)
      showToast(`${kid?.name}'s balances reset to defaults`)
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
      setError(data.error || 'Failed to reset')
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
    const handlePinSubmit = async (enteredPin: string): Promise<boolean> => {
      const response = await fetch('/api/auth/validate-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: enteredPin }),
      })
      const data = await response.json()
      if (data.valid) {
        setPin(enteredPin)
        setPinVerified(true)
        return true
      }
      return false
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
        <div className="card bg-base-100 shadow-xl w-full max-w-sm">
          <div className="card-body items-center">
            <PinPad
              title="Parent PIN Required"
              onSubmit={handlePinSubmit}
              onCancel={() => window.location.href = '/'}
              cancelLabel="Cancel"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-5xl mx-auto">
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
        <div className="grid md:grid-cols-2 gap-6">
          {kids.map((kid) => (
            <div key={kid.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{kid.name}</h2>

                {/* Current Balance Section */}
                <div className="bg-base-200 rounded-lg p-4 mt-2">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold">
                      Current Balance (today)
                    </h3>
                    <button
                      type="button"
                      className={`btn btn-xs ${resetConfirm.has(kid.id) ? 'btn-error' : 'btn-ghost'}`}
                      disabled={disabledButtons.has(`reset-${kid.id}`)}
                      onClick={() => resetToDefault(kid.id)}
                    >
                      {resetConfirm.has(kid.id) ? 'Are you sure?' : 'Reset to Default'}
                    </button>
                  </div>
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
                        className={`input input-bordered transition-colors duration-1000 ${savedInputs.has(`kid-default-${kid.id}-${bd.budgetTypeId}`) ? 'bg-success/20' : ''}`}
                        value={bd.dailyBudgetMinutes}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value) || 0
                          setKids((prev) =>
                            prev.map((k) =>
                              k.id === kid.id
                                ? {
                                    ...k,
                                    budgetDefaults: k.budgetDefaults.map((d) =>
                                      d.budgetTypeId === bd.budgetTypeId
                                        ? { ...d, dailyBudgetMinutes: newValue }
                                        : d
                                    ),
                                  }
                                : k
                            )
                          )
                          scheduleAutoSave(`kid-default-${kid.id}-${bd.budgetTypeId}`, () =>
                            updateKidBudgetDefault(kid.id, bd.budgetTypeId, newValue)
                          )
                        }}
                        onBlur={() => {
                          cancelAutoSave(`kid-default-${kid.id}-${bd.budgetTypeId}`)
                          updateKidBudgetDefault(
                            kid.id,
                            bd.budgetTypeId,
                            bd.dailyBudgetMinutes
                          )
                          flashSaved(`kid-default-${kid.id}-${bd.budgetTypeId}`)
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* General Settings Divider */}
        <div className="divider text-base-content/50 mt-8 mb-4">General Settings</div>

        <div className="grid lg:grid-cols-2 gap-4">
        {/* Budget Types Section */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div>
              <h2 className="card-title">Screen Time Types</h2>
              <p className="text-sm text-base-content/60">
                Types of screen time kids can use (TV, Games, etc.)
              </p>
            </div>
            <div className="space-y-3 mt-4">
              {budgetTypes.map((bt) => {
                const BtIcon = getIconComponent(bt.icon ?? 'TbStarFilled')
                return (
                  <div
                    key={bt.id}
                    className="flex items-center gap-3 p-3 bg-base-200 rounded-lg"
                  >
                    <button
                      type="button"
                      className="btn btn-outline btn-sm btn-square"
                      onClick={() =>
                        setIconPickerTarget({
                          type: 'budget',
                          id: bt.id,
                          currentIcon: bt.icon,
                        })
                      }
                      title="Change icon"
                    >
                      <BtIcon size={20} />
                    </button>
                    <input
                      type="text"
                      className={`input input-bordered input-sm flex-1 transition-colors duration-1000 ${savedInputs.has(`bt-name-${bt.id}`) ? 'bg-success/20' : ''}`}
                      value={bt.displayName}
                      onChange={(e) => {
                        const newValue = e.target.value
                        setBudgetTypes((prev) =>
                          prev.map((t) =>
                            t.id === bt.id ? { ...t, displayName: newValue } : t
                          )
                        )
                        scheduleAutoSave(`bt-name-${bt.id}`, () =>
                          updateBudgetType(bt.id, { displayName: newValue })
                        )
                      }}
                      onBlur={() => {
                        cancelAutoSave(`bt-name-${bt.id}`)
                        updateBudgetType(bt.id, { displayName: bt.displayName })
                        flashSaved(`bt-name-${bt.id}`)
                      }}
                    />
                    {bt.isEarningPool ? (
                      <div className="tooltip tooltip-left" data-tip="This is the earning pool and cannot be deleted">
                        <span className="btn btn-ghost btn-sm btn-square text-base-content/30 cursor-help">
                          ?
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm btn-square text-error"
                        onClick={() => deleteBudgetType(bt.id, bt.displayName)}
                        title="Delete"
                      >
                        x
                      </button>
                    )}
                  </div>
                )
              })}
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
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div>
              <h2 className="card-title">Earning Types</h2>
              <p className="text-sm text-base-content/60">
                Activities that earn screen time
              </p>
            </div>
            <div className="space-y-3 mt-4">
              {earningTypes.map((et) => {
                const EtIcon = getIconComponent(et.icon ?? 'TbStarsFilled')
                return (
                  <div
                    key={et.id}
                    className="flex items-center gap-3 p-3 bg-base-200 rounded-lg"
                  >
                    <button
                      type="button"
                      className="btn btn-outline btn-sm btn-square"
                      onClick={() =>
                        setIconPickerTarget({
                          type: 'earning',
                          id: et.id,
                          currentIcon: et.icon,
                        })
                      }
                      title="Change icon"
                    >
                      <EtIcon size={20} />
                    </button>
                    <input
                      type="text"
                      className={`input input-bordered input-sm flex-1 transition-colors duration-1000 ${savedInputs.has(`et-name-${et.id}`) ? 'bg-success/20' : ''}`}
                      value={et.displayName}
                      onChange={(e) => {
                        const newValue = e.target.value
                        setEarningTypes((prev) =>
                          prev.map((t) =>
                            t.id === et.id ? { ...t, displayName: newValue } : t
                          )
                        )
                        scheduleAutoSave(`et-name-${et.id}`, () =>
                          updateEarningType(et.id, { displayName: newValue })
                        )
                      }}
                      onBlur={() => {
                        cancelAutoSave(`et-name-${et.id}`)
                        updateEarningType(et.id, { displayName: et.displayName })
                        flashSaved(`et-name-${et.id}`)
                      }}
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        className={`input input-bordered input-sm w-16 transition-colors duration-1000 ${savedInputs.has(`et-num-${et.id}`) ? 'bg-success/20' : ''}`}
                        value={et.ratioNumerator}
                        min={0.1}
                        step={0.1}
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value) || 1
                          setEarningTypes((prev) =>
                            prev.map((t) =>
                              t.id === et.id
                                ? { ...t, ratioNumerator: newValue }
                                : t
                            )
                          )
                          scheduleAutoSave(`et-num-${et.id}`, () =>
                            updateEarningType(et.id, { ratioNumerator: newValue })
                          )
                        }}
                        onBlur={() => {
                          cancelAutoSave(`et-num-${et.id}`)
                          updateEarningType(et.id, {
                            ratioNumerator: et.ratioNumerator,
                          })
                          flashSaved(`et-num-${et.id}`)
                        }}
                      />
                      <span className="text-sm">:</span>
                      <input
                        type="number"
                        className={`input input-bordered input-sm w-16 transition-colors duration-1000 ${savedInputs.has(`et-denom-${et.id}`) ? 'bg-success/20' : ''}`}
                        value={et.ratioDenominator}
                        min={0.1}
                        step={0.1}
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value) || 1
                          setEarningTypes((prev) =>
                            prev.map((t) =>
                              t.id === et.id
                                ? { ...t, ratioDenominator: newValue }
                                : t
                            )
                          )
                          scheduleAutoSave(`et-denom-${et.id}`, () =>
                            updateEarningType(et.id, { ratioDenominator: newValue })
                          )
                        }}
                        onBlur={() => {
                          cancelAutoSave(`et-denom-${et.id}`)
                          updateEarningType(et.id, {
                            ratioDenominator: et.ratioDenominator,
                          })
                          flashSaved(`et-denom-${et.id}`)
                        }}
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
                )
              })}
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

      <IconPickerModal
        isOpen={iconPickerTarget !== null}
        onClose={() => setIconPickerTarget(null)}
        onSelect={handleIconSelect}
        currentIcon={iconPickerTarget?.currentIcon ?? null}
      />
    </div>
  )
}
