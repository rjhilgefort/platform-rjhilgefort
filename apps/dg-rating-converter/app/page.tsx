'use client'

import { Metadata } from 'next'
import { useState, useCallback } from 'react'
// Assuming Card is not needed anymore based on the new design
// import { Card } from '@repo/ui/card'

// Constants for limits
const MIN_UDISC = 0
const MAX_UDISC = 300
const MIN_PDGA = MIN_UDISC * 2 + 500 // 500
const MAX_PDGA = MAX_UDISC * 2 + 500 // 1100

export default function Home() {
  const initialUDisc = '175'
  const initialPdga = String(parseFloat(initialUDisc) * 2 + 500) // Calculate initial PDGA

  const [uDiscRating, setUDiscRating] = useState(initialUDisc)
  const [pdgaRating, setPdgaRating] = useState(initialPdga)
  const inputLabel = 'uDisc Rating'
  const outputLabel = 'PDGA Rating'
  // const [lastUpdated, setLastUpdated] = useState('Updated 38 minutes ago') // Removed state

  // Handler for uDisc input changes
  const handleUDiscChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const valueStr = e.target.value

      if (valueStr === '') {
        setUDiscRating('')
        setPdgaRating('')
        return
      }

      const numValue = parseFloat(valueStr)

      // Only update if it's a potentially valid number or sign
      if (!isNaN(numValue)) {
        const clampedUDisc = Math.max(MIN_UDISC, Math.min(MAX_UDISC, numValue))
        const calculatedPdga = clampedUDisc * 2 + 500
        setUDiscRating(String(clampedUDisc))
        setPdgaRating(String(calculatedPdga))
      } else if (
        valueStr === '-' ||
        valueStr === '+' ||
        valueStr.endsWith('.')
      ) {
        // Allow intermediate states but clear the other field
        setUDiscRating(valueStr)
        setPdgaRating('')
      }
      // Ignore other invalid inputs
    },
    [],
  )

  // Handler for PDGA input changes
  const handlePdgaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const valueStr = e.target.value

      if (valueStr === '') {
        setUDiscRating('')
        setPdgaRating('')
        return
      }

      const numValue = parseFloat(valueStr)

      if (!isNaN(numValue)) {
        const clampedPdga = Math.max(MIN_PDGA, Math.min(MAX_PDGA, numValue))
        const calculatedUDisc = (clampedPdga - 500) / 2
        // Ensure calculated uDisc respects its own bounds if clamping PDGA caused rounding issues
        const finalUDisc = Math.max(
          MIN_UDISC,
          Math.min(MAX_UDISC, calculatedUDisc),
        )
        setPdgaRating(String(clampedPdga))
        setUDiscRating(String(finalUDisc))
      } else if (
        valueStr === '-' ||
        valueStr === '+' ||
        valueStr.endsWith('.')
      ) {
        // Allow intermediate states but clear the other field
        setPdgaRating(valueStr)
        setUDiscRating('')
      }
      // Ignore other invalid inputs
    },
    [],
  )

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between space-x-6">
          {/* Input Section */}
          <div className="flex flex-col items-center text-center flex-1">
            <input
              type="number"
              value={uDiscRating}
              onChange={handleUDiscChange} // Use new handler
              className="text-4xl font-bold mb-2 bg-transparent border-none text-white text-center focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="---" // Add placeholder for empty state
            />
            <div className="text-sm text-gray-400 mt-1">{inputLabel}</div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center">
            <div className="text-4xl text-gray-500 mb-1">→</div>
          </div>

          {/* Output Section - Now an Input */}
          <div className="flex flex-col items-center text-center flex-1">
            <input
              type="number"
              value={pdgaRating}
              onChange={handlePdgaChange} // Use new handler
              className="text-4xl font-bold mb-2 bg-transparent border-none text-white text-center focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="---" // Add placeholder for empty state
            />
            <div className="text-sm text-gray-400 mt-1">{outputLabel}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
