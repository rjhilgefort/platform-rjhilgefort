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
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [pinError, setPinError] = useState('')
  const [selectedBudgetTypeId, setSelectedBudgetTypeId] = useState<number>(
    budgetTypes[0]?.id ?? 0
  )
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ minutes: number; type: string } | null>(null)

  const presets = [5, 10, 15, 30]

  const handlePinSubmit = async (pin: string): Promise<boolean> => {
    const response = await fetch('/api/auth/validate-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })
    const data = await response.json()

    if (data.valid) {
      setIsUnlocked(true)
      setPinError('')
      return true
    } else {
      setPinError('Invalid PIN')
      return false
    }
  }

  const handleAdjustTime = async (minutes: number) => {
    setLoading(true)
    setFeedback(null)

    const response = await fetch('/api/bonus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kidId,
        minutes,
        budgetTypeId: selectedBudgetTypeId,
      }),
    })

    setLoading(false)

    if (response.ok) {
      const selectedType = budgetTypes.find((bt) => bt.id === selectedBudgetTypeId)
      setFeedback({ minutes, type: selectedType?.displayName ?? '' })
      onSuccess()
      // Clear feedback after 2 seconds
      setTimeout(() => setFeedback(null), 2000)
    }
  }

  const handleClose = () => {
    setIsUnlocked(false)
    setPinError('')
    setFeedback(null)
    onClose()
  }

  if (!isOpen) return null

  // Show PIN pad first if not unlocked
  if (!isUnlocked) {
    return (
      <dialog className="modal modal-open">
        <div className="modal-box w-80">
          <PinPad
            title={`Adjust Time for ${kidName}`}
            onSubmit={handlePinSubmit}
            onCancel={handleClose}
            cancelLabel="Cancel"
            error={pinError}
          />
        </div>
        <div className="modal-backdrop" onClick={handleClose} />
      </dialog>
    )
  }

  // Unlocked - show add/subtract UI
  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Adjust Time for {kidName}</h3>

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
              disabled={loading}
            >
              {bt.displayName}
            </button>
          ))}
        </div>

        {/* Add Time Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          {presets.map((minutes) => (
            <button
              key={minutes}
              type="button"
              className="btn btn-success"
              onClick={() => handleAdjustTime(minutes)}
              disabled={loading}
            >
              +{minutes}
            </button>
          ))}
        </div>

        {/* Subtract Time Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {presets.map((minutes) => (
            <button
              key={minutes}
              type="button"
              className="btn btn-error"
              onClick={() => handleAdjustTime(-minutes)}
              disabled={loading}
            >
              -{minutes}
            </button>
          ))}
        </div>

        <div className="modal-action">
          <button type="button" className="btn" onClick={handleClose}>
            Done
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={handleClose} />

      {/* Toast notification */}
      {feedback && (
        <div className="toast toast-top toast-end z-50">
          <div className={`alert ${feedback.minutes > 0 ? 'alert-success' : 'alert-warning'}`}>
            {feedback.minutes > 0 ? '+' : ''}{feedback.minutes} min {feedback.type}
          </div>
        </div>
      )}
    </dialog>
  )
}
