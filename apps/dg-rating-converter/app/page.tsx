'use client'

import { Metadata } from 'next'
import { useState, useRef, useEffect } from 'react'
// Assuming Card is not needed anymore based on the new design
// import { Card } from '@repo/ui/card'

// Constants for limits
const MIN_UDISC = 0
const MAX_UDISC = 300
const MIN_PDGA = MIN_UDISC * 2 + 500 // 500
const MAX_PDGA = MAX_UDISC * 2 + 500 // 1100
const DEBOUNCE_DELAY = 300 // ms

// Helper to clamp numbers
const clamp = (num: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, num))

export default function Home() {
  const initialUDisc = '175'
  const initialPdga = String(
    clamp(parseFloat(initialUDisc), MIN_UDISC, MAX_UDISC) * 2 + 500,
  ) // Calculate initial PDGA

  // State for the displayed values in inputs
  const [displayUDisc, setDisplayUDisc] = useState(initialUDisc)
  const [displayPdga, setDisplayPdga] = useState(initialPdga)
  const [warningMessage, setWarningMessage] = useState('') // State for warning message

  const inputLabel = 'uDisc Rating'
  const outputLabel = 'PDGA Rating'
  // const [lastUpdated, setLastUpdated] = useState('Updated 38 minutes ago') // Removed state

  // Refs for debounce timers
  const uDiscTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pdgaTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  // Ref for autofocus
  const uDiscInputRef = useRef<HTMLInputElement | null>(null)

  // Cleanup timeouts on unmount
  useEffect(() => {
    // Autofocus the uDisc input on initial mount
    uDiscInputRef.current?.focus()

    // Cleanup function for timeouts
    return () => {
      if (uDiscTimeoutRef.current) clearTimeout(uDiscTimeoutRef.current)
      if (pdgaTimeoutRef.current) clearTimeout(pdgaTimeoutRef.current)
    }
  }, []) // Empty dependency array ensures this runs only once on mount

  // Handler for uDisc input changes with debounce
  const handleUDiscInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueStr = e.target.value
    setDisplayUDisc(valueStr) // Update display immediately

    // Clear existing timers
    if (uDiscTimeoutRef.current) clearTimeout(uDiscTimeoutRef.current)
    if (pdgaTimeoutRef.current) clearTimeout(pdgaTimeoutRef.current)

    uDiscTimeoutRef.current = setTimeout(() => {
      let currentWarning = '' // Warning for this update
      if (valueStr === '') {
        setDisplayPdga('')
      } else {
        const numValue = parseFloat(valueStr)
        if (!isNaN(numValue)) {
          if (numValue < MIN_UDISC || numValue > MAX_UDISC) {
            currentWarning =
              'uDisc Rating outside 0-300 range. Calculation uses nearest limit.'
          }
          const clampedUDisc = clamp(numValue, MIN_UDISC, MAX_UDISC)
          const calculatedPdga = clampedUDisc * 2 + 500
          setDisplayPdga(String(calculatedPdga))
        } else {
          // Handle invalid number input (e.g., '-', '1.2.3')
          setDisplayPdga('')
        }
      }
      setWarningMessage(currentWarning) // Update the warning state
    }, DEBOUNCE_DELAY)
  }

  // Handler for PDGA input changes with debounce
  const handlePdgaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueStr = e.target.value
    setDisplayPdga(valueStr) // Update display immediately

    // Clear existing timers
    if (uDiscTimeoutRef.current) clearTimeout(uDiscTimeoutRef.current)
    if (pdgaTimeoutRef.current) clearTimeout(pdgaTimeoutRef.current)

    pdgaTimeoutRef.current = setTimeout(() => {
      let currentWarning = '' // Warning for this update
      if (valueStr === '') {
        setDisplayUDisc('')
      } else {
        const numValue = parseFloat(valueStr)
        if (!isNaN(numValue)) {
          if (numValue < MIN_PDGA || numValue > MAX_PDGA) {
            currentWarning =
              'PDGA Rating outside 500-1100 range. Calculation uses nearest limit.'
          }
          const clampedPdga = clamp(numValue, MIN_PDGA, MAX_PDGA)
          const calculatedUDisc = (clampedPdga - 500) / 2
          setDisplayUDisc(String(calculatedUDisc))
        } else {
          // Handle invalid number input
          setDisplayUDisc('')
        }
      }
      setWarningMessage(currentWarning) // Update the warning state
    }, DEBOUNCE_DELAY)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between space-x-6">
          {/* Input Section */}
          <div className="flex flex-col items-center text-center flex-1">
            <input
              ref={uDiscInputRef} // Attach ref for autofocus
              type="number"
              value={displayUDisc} // Bind to display state
              onChange={handleUDiscInputChange} // Use debounced handler
              className="text-4xl font-bold mb-2 bg-transparent border-none text-white text-center focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="---" // Add placeholder for empty state
            />
            <div className="text-sm text-gray-400 mt-1">{inputLabel}</div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center">
            <div className="text-4xl text-gray-500 mb-1">↔</div>
          </div>

          {/* Output Section - Now an Input */}
          <div className="flex flex-col items-center text-center flex-1">
            <input
              type="number"
              value={displayPdga} // Bind to display state
              onChange={handlePdgaInputChange} // Use debounced handler
              className="text-4xl font-bold mb-2 bg-transparent border-none text-white text-center focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="---" // Add placeholder for empty state
            />
            <div className="text-sm text-gray-400 mt-1">{outputLabel}</div>
          </div>
        </div>
        {/* Warning Message Area */}
        <div className="mt-4 text-center text-yellow-500 text-xs h-4">
          {warningMessage}
        </div>
      </div>
    </div>
  )
}
