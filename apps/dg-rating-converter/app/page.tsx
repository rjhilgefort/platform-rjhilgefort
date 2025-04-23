'use client'

import { Metadata } from 'next'
import { useState, useEffect } from 'react'
// Assuming Card is not needed anymore based on the new design
// import { Card } from '@repo/ui/card'

export default function Home() {
  // Placeholder state - update with actual conversion logic
  const [uDiscRating, setUDiscRating] = useState('950') // Example uDisc Rating
  const [pdgaRating, setPdgaRating] = useState('') // Initialize as empty or calculation placeholder
  const inputLabel = 'uDisc Rating'
  const outputLabel = 'PDGA Rating'
  // const [lastUpdated, setLastUpdated] = useState('Updated 38 minutes ago') // Removed state

  // Conversion logic effect
  useEffect(() => {
    const ratingNum = parseFloat(uDiscRating) // Parse input to float

    if (!isNaN(ratingNum)) {
      // Check if parsing was successful
      const calculatedPdgaRating = ratingNum * 2 + 500
      // Optional: round the result if needed
      // setPdgaRating(String(Math.round(calculatedPdgaRating)));
      setPdgaRating(String(calculatedPdgaRating))
    } else {
      setPdgaRating('') // Set to empty string or '--' if input is invalid
    }
  }, [uDiscRating]) // Re-run effect when uDiscRating changes

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between space-x-6">
          {/* Input Section */}
          <div className="flex flex-col items-center text-center flex-1">
            <input
              type="number" // Changed type to number
              value={uDiscRating}
              onChange={(e) => {
                const value = e.target.value
                // Allow empty string to clear the input
                if (value === '') {
                  setUDiscRating('')
                  return
                }
                const numValue = parseFloat(value)

                // Check if it's a valid number before applying limits
                if (!isNaN(numValue)) {
                  if (numValue < 0) {
                    setUDiscRating('0') // Set to min value
                  } else if (numValue > 300) {
                    setUDiscRating('300') // Set to max value
                  } else {
                    setUDiscRating(value) // Update normally within range [0, 300]
                  }
                } else {
                  // Optional: Handle cases where input is not strictly a number (e.g., partial input like '-')
                  // For now, only update state if it's potentially a valid number or empty
                  if (value === '-' || value === '+') {
                    // Allow typing sign initially
                    setUDiscRating(value)
                  } else {
                    // Or perhaps setUDiscRating(uDiscRating); to revert invalid input
                  }
                }
              }} // Update state with min/max value checks
              className="text-4xl font-bold mb-2 bg-transparent border-none text-white text-center focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              // Consider adding inputmode="numeric" pattern="[0-9]*" for mobile
            />
            {/* Changed button to div for label */}
            <div className="text-sm text-gray-400 mt-1">{inputLabel}</div>
          </div>

          {/* Arrow and Update Info */}
          <div className="flex flex-col items-center">
            <div className="text-4xl text-gray-500 mb-1">→</div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col items-center text-center flex-1">
            {/* Display calculated PDGA rating */}
            <div className="text-4xl font-bold mb-2">{pdgaRating}</div>
            {/* Changed button to div for label */}
            <div className="text-sm text-gray-400 mt-1">{outputLabel}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
