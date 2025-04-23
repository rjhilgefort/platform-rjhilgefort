'use client'

import { Metadata } from 'next'
import { useState } from 'react'
// Assuming Card is not needed anymore based on the new design
// import { Card } from '@repo/ui/card'

export default function Home() {
  // Placeholder state - update with actual conversion logic
  const [uDiscRating, setUDiscRating] = useState('950') // Example uDisc Rating
  const [pdgaRating, setPdgaRating] = useState('1000') // Example PDGA Rating (result)
  const inputLabel = 'uDisc Rating'
  const outputLabel = 'PDGA Rating'
  const [lastUpdated, setLastUpdated] = useState('Updated 38 minutes ago') // Keep or remove as needed

  // TODO: Add conversion logic here
  // Example: Update pdgaRating when uDiscRating changes
  // useEffect(() => {
  //   const convertedRating = convertUDiscToPdga(Number(uDiscRating));
  //   setPdgaRating(String(convertedRating));
  // }, [uDiscRating]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between space-x-6">
          {/* Input Section */}
          <div className="flex flex-col items-center text-center flex-1">
            <input
              type="number" // Changed type to number
              value={uDiscRating}
              onChange={(e) => setUDiscRating(e.target.value)} // Update state
              className="text-4xl font-bold mb-2 bg-transparent border-none text-white text-center focus:outline-none w-full"
              // Consider adding inputmode="numeric" pattern="[0-9]*" for mobile
            />
            {/* Changed button to div for label */}
            <div className="text-sm text-gray-400 mt-1">{inputLabel}</div>
          </div>

          {/* Arrow and Update Info */}
          <div className="flex flex-col items-center">
            <div className="text-4xl text-gray-500 mb-1">→</div>
            <div className="text-xs text-gray-500 whitespace-nowrap">
              {lastUpdated}
            </div>
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
