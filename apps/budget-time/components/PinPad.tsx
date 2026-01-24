'use client'

import { useState, useEffect, ReactNode } from 'react'

interface PinPadProps {
  onSubmit: (pin: string) => Promise<boolean>
  onCancel?: () => void
  cancelLabel?: ReactNode
  title?: string
  error?: string
  disabled?: boolean
}

export function PinPad({
  onSubmit,
  onCancel,
  cancelLabel = 'Cancel',
  title = 'Enter PIN',
  error: externalError,
  disabled = false,
}: PinPadProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)
  const [shake, setShake] = useState(false)

  const displayError = externalError || error

  useEffect(() => {
    if (displayError) {
      setShake(true)
      const timer = setTimeout(() => setShake(false), 500)
      return () => clearTimeout(timer)
    }
  }, [displayError])

  const handleDigit = async (digit: string) => {
    if (pin.length >= 4 || checking || disabled) return

    setError('')
    const newPin = pin + digit
    setPin(newPin)

    if (newPin.length === 4) {
      setChecking(true)
      const success = await onSubmit(newPin)
      setChecking(false)
      if (!success) {
        setError('Incorrect PIN')
        setPin('')
      }
    }
  }

  const handleBackspace = () => {
    if (checking || disabled) return
    setError('')
    setPin((p) => p.slice(0, -1))
  }

  const isDisabled = checking || disabled

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4">{title}</h1>

      {/* PIN dots */}
      <div className={`flex gap-3 mb-4 ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-colors ${
              pin.length > i
                ? displayError
                  ? 'bg-error border-error'
                  : 'bg-primary border-primary'
                : 'border-base-300'
            }`}
          />
        ))}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3 w-72">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'].map(
          (digit, i) =>
            digit ? (
              digit === 'back' ? (
                pin.length === 0 && onCancel ? (
                  <button
                    key="cancel"
                    type="button"
                    className="btn btn-lg btn-ghost"
                    onClick={onCancel}
                    disabled={isDisabled}
                  >
                    {cancelLabel}
                  </button>
                ) : (
                  <button
                    key="backspace"
                    type="button"
                    className="btn btn-lg btn-neutral"
                    onClick={handleBackspace}
                    disabled={isDisabled}
                  >
                    ⌫
                  </button>
                )
              ) : (
                <button
                  key={digit}
                  type="button"
                  className="btn btn-lg btn-neutral"
                  onClick={() => handleDigit(digit)}
                  disabled={isDisabled}
                >
                  {digit}
                </button>
              )
            ) : (
              <div key={i} />
            )
        )}
      </div>

      {checking && (
        <span className="loading loading-spinner loading-sm mt-4" />
      )}

      {displayError && pin.length === 0 && (
        <p className="text-error text-sm mt-4">{displayError}</p>
      )}
    </div>
  )
}
