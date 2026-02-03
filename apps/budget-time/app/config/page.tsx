'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { TbArrowLeft } from 'react-icons/tb'
import { ExpandingSlider } from '../../components/ExpandingSlider'
import { IconPickerModal } from '../../components/IconPickerModal'
import { ProfilePictureCropModal } from '../../components/ProfilePictureCropModal'
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
  profilePicture: string | null
  budgetDefaults: BudgetDefault[]
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
  const [profilePictureCrop, setProfilePictureCrop] = useState<{
    kidId: number
    file: File
  } | null>(null)
  const [profilePictureLoading, setProfilePictureLoading] = useState<number | null>(null)
  const [resetConfirm, setResetConfirm] = useState<Set<number>>(new Set())
  const [deleteConfirm, setDeleteConfirm] = useState<Set<string>>(new Set())
  const [savedInputs, setSavedInputs] = useState<Set<string>>(new Set())
  const saveTimeouts = useRef<Record<string, NodeJS.Timeout>>({})

  // Simulate earning state
  const [simulateKidId, setSimulateKidId] = useState<number | null>(null)
  const [simulateEarningTypeId, setSimulateEarningTypeId] = useState<number | null>(null)
  const [simulateMinutes, setSimulateMinutes] = useState('')
  const [simulateLoading, setSimulateLoading] = useState(false)

  // App settings state
  const [negativeBalancePenalty, setNegativeBalancePenalty] = useState(-0.25)
  const [timezone, setTimezone] = useState('America/Denver')
  const [resetHour, setResetHour] = useState(4)

  // Sort budget types: Extra (earning pool) last, then alphabetically by name
  const sortedBudgetTypes = [...budgetTypes].sort((a, b) => {
    if (a.isEarningPool !== b.isEarningPool) return a.isEarningPool ? 1 : -1
    return a.displayName.localeCompare(b.displayName)
  })

  const handleProfilePictureSelect = (kidId: number, file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }
    setProfilePictureCrop({ kidId, file })
  }

  const handleProfilePictureSave = async (kidId: number, profilePicture: string | null) => {
    setError('')
    setProfilePictureCrop(null)
    setProfilePictureLoading(kidId)

    const response = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin,
        action: 'updateKidProfilePicture',
        kidId,
        profilePicture,
      }),
    })

    setProfilePictureLoading(null)

    if (response.ok) {
      setKids((prev) =>
        prev.map((k) =>
          k.id === kidId ? { ...k, profilePicture } : k
        )
      )
      showToast(profilePicture ? 'Profile picture updated' : 'Profile picture removed')
    } else {
      const data = await response.json()
      setError(data.error || 'Failed to update profile picture')
      if (data.error === 'Invalid PIN') {
        setPinVerified(false)
        setPin('')
      }
    }
  }

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
    // Refresh balances periodically to stay in sync with main page
    const interval = setInterval(fetchBalances, 30000)
    return () => clearInterval(interval)
  }, [])

  // Cleanup auto-save timeouts on unmount
  useEffect(() => {
    const timeouts = saveTimeouts.current
    return () => {
      Object.values(timeouts).forEach(clearTimeout)
    }
  }, [])

  const fetchConfig = async () => {
    const response = await fetch('/api/config')
    if (response.ok) {
      const data = await response.json()
      setKids(data.kids)
      setBudgetTypes(data.budgetTypes)
      setEarningTypes(data.earningTypes)
      setNegativeBalancePenalty(data.negativeBalancePenalty)
      setTimezone(data.timezone)
      setResetHour(data.resetHour)
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
    const key = `bt-${budgetTypeId}`

    // First click: show confirmation
    if (!deleteConfirm.has(key)) {
      setDeleteConfirm((prev) => new Set(prev).add(key))
      setTimeout(() => {
        setDeleteConfirm((prev) => {
          const next = new Set(prev)
          next.delete(key)
          return next
        })
      }, 5000)
      return
    }

    // Second click: execute delete
    setDeleteConfirm((prev) => {
      const next = new Set(prev)
      next.delete(key)
      return next
    })
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
    const key = `et-${earningTypeId}`

    // First click: show confirmation
    if (!deleteConfirm.has(key)) {
      setDeleteConfirm((prev) => new Set(prev).add(key))
      setTimeout(() => {
        setDeleteConfirm((prev) => {
          const next = new Set(prev)
          next.delete(key)
          return next
        })
      }, 5000)
      return
    }

    // Second click: execute delete
    setDeleteConfirm((prev) => {
      const next = new Set(prev)
      next.delete(key)
      return next
    })
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

  const updateNegativeBalancePenalty = async (value: number) => {
    setError('')

    const response = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin,
        action: 'updateNegativeBalancePenalty',
        negativeBalancePenalty: value,
      }),
    })

    if (response.ok) {
      setNegativeBalancePenalty(value)
      showToast('Penalty updated')
    } else {
      const data = await response.json()
      setError(data.error || 'Failed to update penalty')
      if (data.error === 'Invalid PIN') {
        setPinVerified(false)
        setPin('')
      }
    }
  }

  const updateTimezone = async (value: string) => {
    setError('')

    const response = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin,
        action: 'updateTimezone',
        timezone: value,
      }),
    })

    if (response.ok) {
      setTimezone(value)
      showToast('Timezone updated')
    } else {
      const data = await response.json()
      setError(data.error || 'Failed to update timezone')
      if (data.error === 'Invalid PIN') {
        setPinVerified(false)
        setPin('')
      }
    }
  }

  const updateResetHour = async (value: number) => {
    setError('')

    const response = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin,
        action: 'updateResetHour',
        resetHour: value,
      }),
    })

    if (response.ok) {
      setResetHour(value)
      showToast('Reset hour updated')
    } else {
      const data = await response.json()
      setError(data.error || 'Failed to update reset hour')
      if (data.error === 'Invalid PIN') {
        setPinVerified(false)
        setPin('')
      }
    }
  }

  const handleSimulateEarning = async () => {
    if (!simulateKidId || !simulateEarningTypeId || !simulateMinutes) return

    setSimulateLoading(true)
    setError('')

    const response = await fetch('/api/earning/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kidId: simulateKidId,
        pin,
        earningTypeId: simulateEarningTypeId,
        activityMinutes: Number(simulateMinutes),
      }),
    })

    if (response.ok) {
      const data = await response.json()
      // Update balances from response
      const newInputs: Record<number, string> = {}
      for (const tb of data.balance.typeBalances as TypeBalance[]) {
        newInputs[tb.budgetTypeId] = Math.floor(tb.remainingSeconds / 60).toString()
      }
      setBalanceInputs((prev) => ({
        ...prev,
        [simulateKidId]: newInputs,
      }))
      const kid = kids.find((k) => k.id === simulateKidId)
      showToast(`${kid?.name} earned ${data.earned.earnedMinutes} min from ${data.earned.activityMinutes} min activity`)
      // Reset form
      setSimulateMinutes('')
    } else {
      const data = await response.json()
      setError(data.error || 'Failed to simulate earning')
      if (data.error === 'Invalid PIN') {
        setPinVerified(false)
        setPin('')
      }
    }

    setSimulateLoading(false)
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
        <div className="flex items-center mb-6">
          <Link href="/" className="btn btn-outline gap-1">
            <TbArrowLeft size={20} />
            Back
          </Link>
          <h1 className="text-2xl font-bold flex-1 text-center">Settings</h1>
          <div className="btn btn-outline invisible gap-1">
            <TbArrowLeft size={20} />
            Back
          </div>
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
                <div className="flex items-center gap-4 mb-2">
                  <div className="relative">
                    {profilePictureLoading === kid.id ? (
                      <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center">
                        <span className="loading loading-spinner loading-md" />
                      </div>
                    ) : kid.profilePicture ? (
                      <img
                        src={kid.profilePicture}
                        alt={kid.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center">
                        <span className="text-2xl">{kid.name[0]}</span>
                      </div>
                    )}
                    {profilePictureLoading !== kid.id && (
                      <label className="absolute -bottom-1 -right-1 btn btn-xs btn-circle btn-primary cursor-pointer">
                        <span className="text-xs">+</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleProfilePictureSelect(kid.id, file)
                            e.target.value = ''
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="card-title">{kid.name}</h2>
                    {kid.profilePicture && profilePictureLoading !== kid.id && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs text-error -ml-2"
                        onClick={() => handleProfilePictureSave(kid.id, null)}
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                </div>

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
                  <div className="space-y-4">
                    {sortedBudgetTypes.map((bt) => {
                      const BtIcon = getIconComponent(bt.icon ?? 'TbStarFilled')
                      return (
                      <div key={bt.id} className="form-control">
                        <ExpandingSlider
                          label={
                            <span className="flex items-center gap-1">
                              <BtIcon size={16} />
                              {bt.displayName}
                            </span>
                          }
                          value={parseInt(balanceInputs[kid.id]?.[bt.id] || '0')}
                          onChange={(val) => {
                            setBalanceInputs((prev) => ({
                              ...prev,
                              [kid.id]: {
                                ...prev[kid.id],
                                [bt.id]: val.toString(),
                              },
                            }))
                          }}
                          onChangeEnd={(val) => {
                            setCurrentBalance(kid.id, bt.id, val)
                            flashSaved(`balance-${kid.id}-${bt.id}`)
                          }}
                          initialMax={120}
                          unit="min"
                          inputClassName={savedInputs.has(`balance-${kid.id}-${bt.id}`) ? 'bg-success/20' : ''}
                        />
                      </div>
                    )})}
                  </div>
                </div>

                {/* Daily Defaults Section */}
                <div className="divider text-sm">Daily Defaults</div>
                <p className="text-xs text-base-content/50 -mt-2 mb-2">
                  Added at {resetHour === 0 ? '12' : resetHour > 12 ? resetHour - 12 : resetHour} {resetHour < 12 ? 'AM' : 'PM'} each day. Unused time carries over.
                </p>

                <div className="space-y-4">
                  {[...kid.budgetDefaults].sort((a, b) => {
                    const aIsExtra = budgetTypes.find((bt) => bt.id === a.budgetTypeId)?.isEarningPool ?? false
                    const bIsExtra = budgetTypes.find((bt) => bt.id === b.budgetTypeId)?.isEarningPool ?? false
                    if (aIsExtra !== bIsExtra) return aIsExtra ? 1 : -1
                    return a.budgetTypeDisplayName.localeCompare(b.budgetTypeDisplayName)
                  }).map((bd) => {
                    const bdType = budgetTypes.find((bt) => bt.id === bd.budgetTypeId)
                    const BdIcon = getIconComponent(bdType?.icon ?? 'TbStarFilled')
                    return (
                    <div key={bd.budgetTypeId} className="form-control">
                      <ExpandingSlider
                        label={
                          <span className="flex items-center gap-1">
                            <BdIcon size={16} />
                            Daily {bd.budgetTypeDisplayName}
                          </span>
                        }
                        value={bd.dailyBudgetMinutes}
                        onChange={(val) => {
                          setKids((prev) =>
                            prev.map((k) =>
                              k.id === kid.id
                                ? {
                                    ...k,
                                    budgetDefaults: k.budgetDefaults.map((d) =>
                                      d.budgetTypeId === bd.budgetTypeId
                                        ? { ...d, dailyBudgetMinutes: val }
                                        : d
                                    ),
                                  }
                                : k
                            )
                          )
                        }}
                        onChangeEnd={(val) => {
                          updateKidBudgetDefault(kid.id, bd.budgetTypeId, val)
                          flashSaved(`kid-default-${kid.id}-${bd.budgetTypeId}`)
                        }}
                        initialMax={120}
                        unit="min"
                        inputClassName={savedInputs.has(`kid-default-${kid.id}-${bd.budgetTypeId}`) ? 'bg-success/20' : ''}
                      />
                    </div>
                  )})}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Simulate Earning Section */}
        <div className="card bg-base-100 shadow-xl mt-6">
          <div className="card-body">
            <div>
              <h2 className="card-title">Simulate Earning</h2>
              <p className="text-sm text-base-content/60">
                Manually add earned time (for when you forgot to start a timer)
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-4 mt-4 items-end">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Kid</span>
                </label>
                <select
                  className="select select-bordered"
                  value={simulateKidId ?? ''}
                  onChange={(e) => setSimulateKidId(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">Select kid...</option>
                  {kids.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Earning Type</span>
                </label>
                <select
                  className="select select-bordered"
                  value={simulateEarningTypeId ?? ''}
                  onChange={(e) => setSimulateEarningTypeId(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">Select type...</option>
                  {earningTypes.map((et) => (
                    <option key={et.id} value={et.id}>
                      {et.displayName} (1:{et.ratioDenominator})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <ExpandingSlider
                  label="Activity Minutes"
                  value={parseInt(simulateMinutes) || 0}
                  onChange={(val) => setSimulateMinutes(val.toString())}
                  initialMax={60}
                  unit="min"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-base-content/70 whitespace-nowrap">
                  {(() => {
                    if (!simulateEarningTypeId || !simulateMinutes) return ''
                    const et = earningTypes.find((t) => t.id === simulateEarningTypeId)
                    if (!et) return ''
                    const earned = Math.floor((Number(simulateMinutes) * et.ratioDenominator) / et.ratioNumerator)
                    return `→ ${earned} min`
                  })()}
                </span>
                <button
                  type="button"
                  className="btn btn-success flex-1"
                  onClick={handleSimulateEarning}
                  disabled={!simulateKidId || !simulateEarningTypeId || !simulateMinutes || simulateLoading}
                >
                  {simulateLoading ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    'Add Earned Time'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* General Settings Divider */}
        <div className="divider text-base-content/50 mt-8 mb-4">General Settings</div>

        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          {/* Negative Balance Penalty */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div>
                <h2 className="card-title">Loan Payback Penalty</h2>
                <p className="text-sm text-base-content/60">
                  When Extra balance is negative, reduce earning rates by this amount
                </p>
              </div>
              <div className="flex items-center gap-4 mt-4 flex-wrap">
                <span className="text-sm text-base-content/70">Penalty:</span>
                <button
                  type="button"
                  className="btn btn-sm btn-square bg-base-200 border-base-300"
                  onClick={() => {
                    const newValue = negativeBalancePenalty - 0.25
                    updateNegativeBalancePenalty(newValue)
                  }}
                >
                  −
                </button>
                <span className="w-16 text-center font-mono text-lg">{negativeBalancePenalty}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-square bg-base-200 border-base-300"
                  onClick={() => {
                    const newValue = Math.min(0, negativeBalancePenalty + 0.25)
                    updateNegativeBalancePenalty(newValue)
                  }}
                  disabled={negativeBalancePenalty >= 0}
                >
                  +
                </button>
                <span className="text-sm text-base-content/50">
                  (e.g. 1:2 → 1:{Math.max(0, 2 + negativeBalancePenalty).toFixed(2)})
                </span>
              </div>
            </div>
          </div>

          {/* Timezone & Reset Hour Setting */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div>
                <h2 className="card-title">Day Reset</h2>
                <p className="text-sm text-base-content/60">
                  Daily budgets reset at {resetHour === 0 ? '12' : resetHour > 12 ? resetHour - 12 : resetHour} {resetHour < 12 ? 'AM' : 'PM'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <select
                  className="select select-bordered select-sm flex-1 min-w-24"
                  value={timezone}
                  onChange={(e) => updateTimezone(e.target.value)}
                >
                  <option value="America/New_York">Eastern</option>
                  <option value="America/Chicago">Central</option>
                  <option value="America/Denver">Mountain</option>
                  <option value="America/Los_Angeles">Pacific</option>
                  <option value="America/Anchorage">Alaska</option>
                  <option value="Pacific/Honolulu">Hawaii</option>
                </select>
                <select
                  className="select select-bordered select-sm flex-1 min-w-24"
                  value={resetHour}
                  onChange={(e) => updateResetHour(Number(e.target.value))}
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
        {/* Budget Types Section */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div>
              <h2 className="card-title">Budget Types</h2>
              <p className="text-sm text-base-content/60">
                Types of budget time kids can use (TV, Games, etc.)
              </p>
            </div>
            <div className="space-y-3 mt-4">
              {sortedBudgetTypes.map((bt) => {
                const BtIcon = getIconComponent(bt.icon ?? 'TbStarFilled')
                return (
                  <div
                    key={bt.id}
                    className="flex items-center gap-3 p-3 bg-base-200 rounded-lg"
                  >
                    <button
                      type="button"
                      className="btn btn-sm btn-square bg-base-100 border-base-300"
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
                        className={`btn btn-sm ${deleteConfirm.has(`bt-${bt.id}`) ? 'btn-error' : 'btn-ghost btn-square text-error'}`}
                        onClick={() => deleteBudgetType(bt.id, bt.displayName)}
                        title="Delete"
                      >
                        {deleteConfirm.has(`bt-${bt.id}`) ? 'Sure?' : 'x'}
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
                placeholder="New budget type..."
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
                Activities that earn budget time
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
                      className="btn btn-sm btn-square bg-base-100 border-base-300"
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
                      <span className="text-sm">1:</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-square bg-base-100 border-base-300"
                        onClick={() => {
                          const newValue = Math.max(0.25, et.ratioDenominator - 0.25)
                          setEarningTypes((prev) =>
                            prev.map((t) =>
                              t.id === et.id
                                ? { ...t, ratioDenominator: newValue }
                                : t
                            )
                          )
                          updateEarningType(et.id, { ratioDenominator: newValue })
                        }}
                        disabled={et.ratioDenominator <= 0.25}
                      >
                        −
                      </button>
                      <span className={`w-10 text-center transition-colors duration-1000 ${savedInputs.has(`et-denom-${et.id}`) ? 'text-success' : ''}`}>
                        {et.ratioDenominator}
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-square bg-base-100 border-base-300"
                        onClick={() => {
                          const newValue = et.ratioDenominator + 0.25
                          setEarningTypes((prev) =>
                            prev.map((t) =>
                              t.id === et.id
                                ? { ...t, ratioDenominator: newValue }
                                : t
                            )
                          )
                          updateEarningType(et.id, { ratioDenominator: newValue })
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className={`btn btn-sm ${deleteConfirm.has(`et-${et.id}`) ? 'btn-error' : 'btn-ghost btn-square text-error'}`}
                      onClick={() => deleteEarningType(et.id, et.displayName)}
                      title="Delete"
                    >
                      {deleteConfirm.has(`et-${et.id}`) ? 'Sure?' : 'x'}
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
              Ratio: minutes of activity = minutes of budget time earned
            </p>
          </div>
        </div>
        </div>
      </div>

      {toasts.length > 0 && (
        <div className="toast toast-end toast-top pointer-events-none">
          {toasts.map((t) => (
            <button
              type="button"
              key={t.id}
              className="alert alert-success pointer-events-auto cursor-pointer"
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            >
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
            </button>
          ))}
        </div>
      )}

      <IconPickerModal
        isOpen={iconPickerTarget !== null}
        onClose={() => setIconPickerTarget(null)}
        onSelect={handleIconSelect}
        currentIcon={iconPickerTarget?.currentIcon ?? null}
      />

      <ProfilePictureCropModal
        isOpen={profilePictureCrop !== null}
        imageFile={profilePictureCrop?.file ?? null}
        onConfirm={(base64) => {
          if (profilePictureCrop) {
            handleProfilePictureSave(profilePictureCrop.kidId, base64)
          }
        }}
        onCancel={() => setProfilePictureCrop(null)}
      />
    </div>
  )
}
