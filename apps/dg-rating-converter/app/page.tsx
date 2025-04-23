'use client'

import { Metadata } from 'next'
import { useState } from 'react'
// Assuming Card is not needed anymore based on the new design
// import { Card } from '@repo/ui/card'

export default function Home() {
  // Placeholder state - you'll replace this with actual logic later
  const [inputValue, setInputValue] = useState('5 btc')
  const [outputValue, setOutputValue] = useState('$465,504.64')
  const [inputUnit, setInputUnit] = useState('Bitcoins')
  const [outputUnit, setOutputUnit] = useState('American Dollars')
  const [lastUpdated, setLastUpdated] = useState('Updated 38 minutes ago')

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between space-x-6">
          {/* Input Section */}
          <div className="flex flex-col items-center text-center flex-1">
            <div className="text-4xl font-bold mb-2">{inputValue}</div>
            <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm py-1 px-4 rounded">
              {inputUnit}
            </button>
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
            <div className="text-4xl font-bold mb-2">{outputValue}</div>
            <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm py-1 px-4 rounded">
              {outputUnit}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
