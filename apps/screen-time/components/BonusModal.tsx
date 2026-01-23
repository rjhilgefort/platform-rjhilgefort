'use client'

import { useState } from 'react'

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
  const [pin, setPin] = useState('')
  const [selectedBudgetTypeId, setSelectedBudgetTypeId] = useState<number>(
    budgetTypes[0]?.id ?? 0
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const presets = [5, 10, 15, 30]

  const handleAddBonus = async (minutes: number) => {
    if (pin.length !== 4) {
      setError('Enter 4-digit PIN')
      return
    }

    setLoading(true)
    setError('')

    const response = await fetch('/api/bonus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kidId,
        pin,
        minutes,
        budgetTypeId: selectedBudgetTypeId,
      }),
    })

    setLoading(false)

    if (response.ok) {
      setPin('')
      onSuccess()
      onClose()
    } else {
      const data = await response.json()
      setError(data.error || 'Failed to add bonus')
    }
  }

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + digit)
      setError('')
    }
  }

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1))
  }

  const handleClose = () => {
    setPin('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  const selectedBudgetType = budgetTypes.find((bt) => bt.id === selectedBudgetTypeId)

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

        {/* PIN Display */}
        <div className="flex gap-3 justify-center mb-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 ${
                pin.length > i ? 'bg-primary border-primary' : 'border-base-300'
              }`}
            />
          ))}
        </div>

        {error && <p className="text-error text-sm text-center mb-4">{error}</p>}

        {/* Mini Keypad */}
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(
            (digit, i) =>
              digit ? (
                <button
                  key={digit}
                  type="button"
                  className="btn btn-neutral btn-sm"
                  onClick={() =>
                    digit === '⌫' ? handleBackspace() : handleDigit(digit)
                  }
                  disabled={loading}
                >
                  {digit}
                </button>
              ) : (
                <div key={i} />
              )
          )}
        </div>

        {/* Preset Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {presets.map((minutes) => (
            <button
              key={minutes}
              type="button"
              className="btn btn-success"
              onClick={() => handleAddBonus(minutes)}
              disabled={loading || pin.length !== 4}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                `+${minutes} min ${selectedBudgetType?.displayName ?? ''}`
              )}
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
