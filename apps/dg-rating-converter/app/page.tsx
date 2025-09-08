'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { AiOutlineInfoCircle } from 'react-icons/ai'

const MIN_UDISC = 0
const MAX_UDISC = 300
const MIN_PDGA = 500
const MAX_PDGA = 1100
const DEBOUNCE_DELAY = 300 // ms

const clamp = (num: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, num))

export default function Home() {
  const initialUDisc = '175'
  const initialPdga = String(
    clamp(parseFloat(initialUDisc), MIN_UDISC, MAX_UDISC) * 2 + 500,
  )

  const [displayUDisc, setDisplayUDisc] = useState(initialUDisc)
  const [displayPdga, setDisplayPdga] = useState(initialPdga)
  const [warningMessage, setWarningMessage] = useState('')
  const [showReferences, setShowReferences] = useState(false)

  const uDiscTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pdgaTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const uDiscInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    uDiscInputRef.current?.focus()

    return () => {
      if (uDiscTimeoutRef.current) clearTimeout(uDiscTimeoutRef.current)
      if (pdgaTimeoutRef.current) clearTimeout(pdgaTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!showReferences) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowReferences(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showReferences])

  const handleUDiscInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueStr = e.target.value
    setDisplayUDisc(valueStr)

    if (uDiscTimeoutRef.current) clearTimeout(uDiscTimeoutRef.current)
    if (pdgaTimeoutRef.current) clearTimeout(pdgaTimeoutRef.current)

    uDiscTimeoutRef.current = setTimeout(() => {
      let currentWarning = ''
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
          setDisplayUDisc('')
        }
      }
      setWarningMessage(currentWarning)
    }, DEBOUNCE_DELAY)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl sm:text-[2.5rem] font-bold mb-8 max-w-2xl text-center leading-tight">
        <span className="text-orange-500">uDisc</span> to{' '}
        <span className="text-blue-400">PDGA</span> Rating Converter
      </h1>

      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl mb-8">
        <div className="flex flex-col md:flex-row items-stretch justify-between md:space-x-6 space-y-6 md:space-y-0">
          <div className="flex-1 flex justify-center items-center">
            <div className="flex items-center justify-center w-full gap-0">
              <div className="flex items-center justify-center w-16">
                <Image
                  src="/udisc-logo.webp"
                  alt="uDisc Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col items-center w-36 ml-0 sm:-ml-4">
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

          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl text-gray-500">↔</div>
          </div>

          <div className="flex-1 flex justify-center items-center">
            <div className="flex items-center justify-center w-full gap-0">
              <div className="flex items-center justify-center w-16">
                <Image
                  src="/pdga-logo.svg"
                  alt="PDGA Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col items-center w-36 ml-0 sm:-ml-4">
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
        <div className="mt-4 text-center text-warning text-xs h-4">
          {warningMessage}
        </div>
      </div>

      {/* Banner image */}
      <div className="w-full max-w-2xl mb-8 overflow-hidden rounded-lg shadow-md">
        <Image
          // src="/dg-putting-banner.webp"
          src="/dg-putting-sunset-banner.jpg"
          alt="Disc Golf Putting Banner"
          width={1200}
          height={300}
          className="w-full object-cover"
          priority
        />
      </div>

      {/* Learn More Section - trigger button and modal */}
      <div className="w-full max-w-2xl mb-8 relative">
        <button
          onClick={() => setShowReferences(!showReferences)}
          className="text-sm text-gray-400 hover:text-gray-300 flex items-center mx-auto mb-2 focus:outline-none"
        >
          <AiOutlineInfoCircle size={16} className="mr-1" aria-hidden="true" />
          <span>Learn More About This Calculator</span>
        </button>

        {showReferences && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowReferences(false)}
            />
            <div className="relative bg-gray-900 w-full max-w-lg rounded-lg shadow-xl border border-gray-700 p-6">
              <button
                onClick={() => setShowReferences(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white focus:outline-none"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="text-base font-semibold mb-3">
                uDisc to PDGA Rating Calculator Information
              </h2>
              <div className="text-sm">
                <p className="mb-2 text-gray-300">
                  This calculation uses a simple formula: (uDisc Rating × 2) +
                  500 = PDGA Rating
                </p>
                <p className="mb-3 text-gray-400 text-xs">
                  This is an approximation based on community observations.
                  Results may vary.
                </p>

                {/* Notes Section */}
                <div className="mb-4 text-xs text-gray-400">
                  <p className="mb-1">Notes:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Conversion is approximate and may vary based on course
                      difficulty
                    </li>
                    <li>
                      PDGA ratings take into account more statistical factors
                      than just raw scores
                    </li>
                    <li>
                      Different course layouts may produce different conversion
                      factors
                    </li>
                  </ul>
                </div>

                {/* Reference Links Section */}
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
