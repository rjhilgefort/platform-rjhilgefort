'use client'

import { useState } from 'react'
import { PinPad } from './PinPad'

interface BudgetType {
  id: number
  slug: string
  displayName: string
}

interface BonusModalProps {
  kidId: number
  kidName: string
  budgetTypes: BudgetType[]
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function BonusModal({
  kidId,
  kidName,
  budgetTypes,
  isOpen,
  onClose,
  onSuccess,
}: BonusModalProps) {
  const [selectedBudgetTypeId, setSelectedBudgetTypeId] = useState<number>(
    budgetTypes[0]?.id ?? 0
  )
  const [pendingMinutes, setPendingMinutes] = useState<number | null>(null)
  const [error, setError] = useState('')

  const presets = [5, 10, 15, 30]

  const handlePinSubmit = async (pin: string): Promise<boolean> => {
    if (pendingMinutes === null) return false

    const response = await fetch('/api/bonus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kidId,
        pin,
        minutes: pendingMinutes,
        budgetTypeId: selectedBudgetTypeId,
      }),
    })

    if (response.ok) {
      setPendingMinutes(null)
      setError('')
      onSuccess()
      onClose()
      return true
    } else {
      const data = await response.json()
      setError(data.error || 'Failed to add bonus')
      return false
    }
  }

  const handleClose = () => {
    setPendingMinutes(null)
    setError('')
    onClose()
  }

  const handleBack = () => {
    setPendingMinutes(null)
    setError('')
  }

  if (!isOpen) return null

  const selectedBudgetType = budgetTypes.find((bt) => bt.id === selectedBudgetTypeId)

  // Show PIN pad if minutes selected
  if (pendingMinutes !== null) {
    return (
      <dialog className="modal modal-open">
        <div className="modal-box w-80">
          <PinPad
            title={`+${pendingMinutes} min ${selectedBudgetType?.displayName ?? ''}`}
            onSubmit={handlePinSubmit}
            onCancel={handleBack}
            cancelLabel="Back"
            error={error}
          />
        </div>
        <div className="modal-backdrop" onClick={handleClose} />
      </dialog>
    )
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Bonus Time for {kidName}</h3>

        {/* Budget Type Selection */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {budgetTypes.map((bt) => (
            <button
              key={bt.id}
              type="button"
              className={`btn flex-1 ${
                selectedBudgetTypeId === bt.id ? 'btn-primary' : 'btn-ghost'
              }`}
              onClick={() => setSelectedBudgetTypeId(bt.id)}
            >
              {bt.displayName}
            </button>
          ))}
        </div>

        {/* Preset Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {presets.map((minutes) => (
            <button
              key={minutes}
              type="button"
              className="btn btn-success"
              onClick={() => setPendingMinutes(minutes)}
            >
              +{minutes} min
            </button>
          ))}
        </div>

        <div className="modal-action">
          <button type="button" className="btn" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={handleClose} />
    </dialog>
  )
}
