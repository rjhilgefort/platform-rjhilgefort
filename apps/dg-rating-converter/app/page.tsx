'use client'

import { Metadata } from 'next'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image' // Import Image component
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
  const [showReferences, setShowReferences] = useState(false) // State to toggle reference visibility

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      {/* Page Title */}
      <h1 className="text-[2.5rem] font-bold mb-8 max-w-2xl text-center leading-tight">
        <span className="text-orange-500">uDisc</span> to{' '}
        <span className="text-blue-400">PDGA</span> Rating Converter
      </h1>

      {/* Converter Card */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl mb-8">
        <div className="flex items-stretch justify-between space-x-6">
          {/* Centering Wrapper for uDisc Section */}
          <div className="flex-1 flex justify-center items-center">
            {/* uDisc Section Group with tighter spacing */}
            <div className="flex items-center justify-center w-full gap-0">
              {/* Logo container - more compact */}
              <div className="flex items-center justify-center w-16">
                <Image
                  src="/udisc-logo.webp"
                  alt="uDisc Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              {/* Input and label container with increased negative margin */}
              <div className="flex flex-col items-center w-36 -ml-4">
                <input
                  ref={uDiscInputRef}
                  type="number"
                  value={displayUDisc}
                  onChange={handleUDiscInputChange}
                  className="text-4xl font-bold bg-transparent border-none text-orange-500 text-center focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="---"
                />
                <div className="text-sm text-orange-500">uDisc Rating</div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl text-gray-500">↔</div>
          </div>

          {/* Centering Wrapper for PDGA Section */}
          <div className="flex-1 flex justify-center items-center">
            {/* PDGA Section Group with tighter spacing */}
            <div className="flex items-center justify-center w-full gap-0">
              {/* Logo container - more compact */}
              <div className="flex items-center justify-center w-16">
                <Image
                  src="/pdga-logo.svg"
                  alt="PDGA Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              {/* Input and label container with increased negative margin */}
              <div className="flex flex-col items-center w-36 -ml-4">
                <input
                  type="number"
                  value={displayPdga}
                  onChange={handlePdgaInputChange}
                  className="text-4xl font-bold bg-transparent border-none text-blue-400 text-center focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="---"
                />
                <div className="text-sm text-blue-400">PDGA Rating</div>
              </div>
            </div>
          </div>
        </div>
        {/* Warning Message Area */}
        <div className="mt-4 text-center text-warning text-xs h-4">
          {warningMessage}
        </div>
      </div>

      {/* Banner image */}
      <div className="w-full max-w-2xl mb-8 overflow-hidden rounded-lg shadow-md">
        <Image
          src="/dg-putting-banner.webp"
          alt="Disc Golf Putting Banner"
          width={1200}
          height={300}
          className="w-full object-cover"
          priority
        />
      </div>

      {/* Learn More Section - moved below banner */}
      <div className="w-full max-w-2xl mb-8">
        <button
          onClick={() => setShowReferences(!showReferences)}
          className="text-sm text-gray-400 hover:text-gray-300 flex items-center mx-auto mb-2 focus:outline-none"
        >
          <span>
            {showReferences
              ? 'Hide References'
              : 'Learn More About This Calculation'}
          </span>
          <svg
            className={`ml-1 w-4 h-4 transition-transform ${showReferences ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {showReferences && (
          <div className="bg-gray-800 p-4 rounded-lg text-sm animate-fadeIn">
            <p className="mb-2 text-gray-300">
              This calculation uses a simple formula: (uDisc Rating × 2) + 500 =
              PDGA Rating
            </p>
            <p className="mb-3 text-gray-400 text-xs">
              This is an approximation based on community observations. Results
              may vary.
            </p>
            <div className="text-xs text-gray-400">
              <p className="mb-1">Reference Links:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <a
                    href="https://www.reddit.com/r/discgolf/comments/s4q8kf/udisc_rating_v_pdga_rating/"
                    className="text-blue-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Reddit Discussion
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.dgcoursereview.com/forums/showthread.php?t=134867"
                    className="text-blue-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    DG Course Review Forums
                  </a>
                </li>
                {/* Add more reference links as needed */}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
