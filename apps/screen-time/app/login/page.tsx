'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + digit)
      setError(false)
    }
  }

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1))
    setError(false)
  }

  const handleClear = () => {
    setPin('')
    setError(false)
  }

  const handleSubmit = async () => {
    if (pin.length !== 4) return

    setLoading(true)
    setError(false)

    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })

    setLoading(false)

    if (response.ok) {
      router.push('/')
      router.refresh()
    } else {
      setError(true)
      setPin('')
    }
  }

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫']

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card bg-base-100 shadow-xl w-full max-w-sm">
        <div className="card-body items-center">
          <h1 className="card-title text-2xl mb-4">Screen Time</h1>

          {/* PIN Display */}
          <div
            className={`flex gap-3 mb-6 ${error ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 ${
                  pin.length > i
                    ? error
                      ? 'bg-error border-error'
                      : 'bg-primary border-primary'
                    : 'border-base-300'
                }`}
              />
            ))}
          </div>

          {error && <p className="text-error text-sm mb-4">Incorrect PIN</p>}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
            {digits.map((digit) => (
              <button
                key={digit}
                type="button"
                className={`btn btn-lg ${
                  digit === 'C' || digit === '⌫'
                    ? 'btn-ghost'
                    : 'btn-neutral'
                }`}
                onClick={() => {
                  if (digit === 'C') handleClear()
                  else if (digit === '⌫') handleBackspace()
                  else handleDigit(digit)
                }}
                disabled={loading}
              >
                {digit}
              </button>
            ))}
          </div>

          {/* Enter Button */}
          <button
            type="button"
            className="btn btn-primary btn-wide mt-4"
            onClick={handleSubmit}
            disabled={pin.length !== 4 || loading}
          >
            {loading ? <span className="loading loading-spinner" /> : 'Enter'}
          </button>
        </div>
      </div>
    </div>
  )
}
