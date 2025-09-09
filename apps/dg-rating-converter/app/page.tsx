'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { GiDiscGolfBasket } from 'react-icons/gi'
import { MdRocketLaunch } from 'react-icons/md'
import { pipe } from 'effect'
import { LearnMore } from '../components/LearnMore'
import {
  UDISC_MIN,
  UDISC_MAX,
  PDGA_MIN,
  PDGA_MAX,
  DEBOUNCE_DELAY,
} from '../utils/const'
import { pdgaFromUdiscSimple } from '../utils/pdgaFromUdiscSimple'
import { udiscFromPdgaSimple } from '../utils/udiscFromPdgaSimple'

export default function Home() {
  // const initialUDisc = '175'
  // const initialPdga = String(
  //   clamp(parseFloat(initialUDisc), MIN_UDISC, MAX_UDISC) * 2 + 500,
  // )

  const [displayUDisc, setDisplayUDisc] = useState('')
  const [displayPdga, setDisplayPdga] = useState('')
  const [warningMessage, setWarningMessage] = useState('')
  const [showReferences, setShowReferences] = useState(false)

  const uDiscTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pdgaTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const uDiscInputRef = useRef<HTMLInputElement | null>(null)
  const pdgaInputRef = useRef<HTMLInputElement | null>(null)

  const blockInvalidCharKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
      e.preventDefault()
    }
  }

  const handlePasteSanitize = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text')
    if (!/^\d*\.?\d*$/.test(text)) {
      e.preventDefault()
    }
  }

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    otherRef: React.RefObject<HTMLInputElement | null>,
  ) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      otherRef.current?.focus()
      return
    }
    blockInvalidCharKeys(e)
  }

  useEffect(() => {
    uDiscInputRef.current?.focus()

    return () => {
      if (uDiscTimeoutRef.current) clearTimeout(uDiscTimeoutRef.current)
      if (pdgaTimeoutRef.current) clearTimeout(pdgaTimeoutRef.current)
    }
  }, [])

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
          if (numValue < UDISC_MIN || numValue > UDISC_MAX) {
            currentWarning =
              'uDisc Rating outside 0-300 range. Calculation uses nearest limit.'
          }
          pipe(numValue, pdgaFromUdiscSimple, (x) => String(x), setDisplayPdga)
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
          if (numValue < PDGA_MIN || numValue > PDGA_MAX) {
            currentWarning =
              'PDGA Rating outside 500-1100 range. Calculation uses nearest limit.'
          }
          pipe(numValue, udiscFromPdgaSimple, (x) => String(x), setDisplayUDisc)
        } else {
          setDisplayUDisc('')
        }
      }
      setWarningMessage(currentWarning)
    }, DEBOUNCE_DELAY)
  }

  return (
    <div className="flex flex-col items-center justify-start md:justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl sm:text-[2.5rem] font-bold mb-6 max-w-2xl text-center leading-tight">
        <span className="text-orange-500">uDisc</span> to{' '}
        <span className="text-blue-400">PDGA</span>{' '}
        <br className="block sm:hidden" />
        Rating Converter
      </h1>

      <div className="bg-gray-800 p-4 rounded-lg shadow-xl w-full max-w-2xl mb-6">
        <div className="h-4" aria-hidden="true" />
        <div className="flex flex-col md:flex-row items-stretch justify-between md:space-x-6 space-y-3 md:space-y-0">
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
                  autoFocus
                  ref={uDiscInputRef}
                  type="number"
                  inputMode="decimal"
                  value={displayUDisc}
                  onChange={handleUDiscInputChange}
                  onKeyDown={(e) => handleInputKeyDown(e, pdgaInputRef)}
                  onPaste={handlePasteSanitize}
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
                  ref={pdgaInputRef}
                  type="number"
                  inputMode="decimal"
                  value={displayPdga}
                  onChange={handlePdgaInputChange}
                  onKeyDown={(e) => handleInputKeyDown(e, uDiscInputRef)}
                  onPaste={handlePasteSanitize}
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

      <div className="w-full max-w-2xl mb-5 overflow-hidden rounded-lg shadow-md">
        <Image
          src="/dg-putting-sunset-banner.jpg"
          alt="Disc Golf Putting Banner"
          width={1200}
          height={300}
          className="w-full object-cover"
          priority
        />
      </div>

      <div className="w-full max-w-2xl mb-8 relative">
        <div className="flex items-center justify-between w-full">
          <LearnMore
            isOpen={showReferences}
            onOpen={() => setShowReferences(true)}
            onClose={() => setShowReferences(false)}
            className="ml-0"
          />
          <GiDiscGolfBasket className="mr-1" />
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <MdRocketLaunch className="mr-1" />
            Built By
            <a
              href="https://www.pdga.com/player/306677"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-300"
            >
              Rob Hilgefort #306677
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
