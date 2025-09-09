'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { GiDiscGolfBasket } from 'react-icons/gi'
import {
  MdRocketLaunch,
  MdArrowBack,
  MdArrowForward,
  MdArrowDropDown,
} from 'react-icons/md'
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
import { pdgaFromUdiscPolynomial } from '../utils/pdgaFromUdiscPolynomial'
import { udiscFromPdgaPolynomial } from '../utils/udiscFromPdgaPolynomial'

export default function Home() {
  // const initialUDisc = '175'
  // const initialPdga = String(
  //   clamp(parseFloat(initialUDisc), MIN_UDISC, MAX_UDISC) * 2 + 500,
  // )

  const [displayUDisc, setDisplayUDisc] = useState('')
  const [displayPdga, setDisplayPdga] = useState('')
  const [warningMessage, setWarningMessage] = useState('')
  const [showReferences, setShowReferences] = useState(false)
  const [formula, setFormula] = useState<'linear' | 'poly'>('poly')
  const [lastEdited, setLastEdited] = useState<null | 'udisc' | 'pdga'>(null)

  const uDiscTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pdgaTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const uDiscInputRef = useRef<HTMLInputElement | null>(null)
  const pdgaInputRef = useRef<HTMLInputElement | null>(null)
  const dropdownTriggerRef = useRef<HTMLDivElement | null>(null)

  // Effect: initialize formula from URL or localStorage
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const q = params.get('formula')
      const fromQuery = q === 'linear' || q === 'poly' ? q : null
      const fromStorage =
        (localStorage.getItem('formula') as 'linear' | 'poly' | null) || null
      const initial = fromQuery ?? fromStorage ?? 'poly'
      if (initial !== formula) setFormula(initial)
      if (!fromQuery) {
        params.set('formula', initial)
        const newUrl = `${window.location.pathname}?${params.toString()}`
        window.history.replaceState({}, '', newUrl)
      }
    } catch {
      // ignore: URL/localStorage may be unavailable
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    setLastEdited('udisc')

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
            currentWarning = `uDisc Rating outside ${UDISC_MIN}-${UDISC_MAX} range. Calculation uses nearest limit.`
          }
          const converter =
            formula === 'poly' ? pdgaFromUdiscPolynomial : pdgaFromUdiscSimple
          pipe(numValue, converter, (x) => String(x), setDisplayPdga)
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
    setLastEdited('pdga')

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
            currentWarning = `PDGA Rating outside ${PDGA_MIN}-${PDGA_MAX} range. Calculation uses nearest limit.`
          }
          const converter =
            formula === 'poly' ? udiscFromPdgaPolynomial : udiscFromPdgaSimple
          pipe(numValue, converter, (x) => String(x), setDisplayUDisc)
        } else {
          setDisplayUDisc('')
        }
      }
      setWarningMessage(currentWarning)
    }, DEBOUNCE_DELAY)
  }

  const handleFormulaChange = (next: 'linear' | 'poly') => {
    if (next === formula) return
    setFormula(next)
    try {
      localStorage.setItem('formula', next)
      const params = new URLSearchParams(window.location.search)
      params.set('formula', next)
      const newUrl = `${window.location.pathname}?${params.toString()}`
      window.history.replaceState({}, '', newUrl)
    } catch {
      // ignore: URL/localStorage may be unavailable
    }

    // Recalculate immediately from last edited side
    if (lastEdited === 'udisc') {
      if (displayUDisc !== '' && !isNaN(parseFloat(displayUDisc))) {
        const n = parseFloat(displayUDisc)
        const converter =
          next === 'poly' ? pdgaFromUdiscPolynomial : pdgaFromUdiscSimple
        setDisplayPdga(String(converter(n)))
      }
    } else if (lastEdited === 'pdga') {
      if (displayPdga !== '' && !isNaN(parseFloat(displayPdga))) {
        const n = parseFloat(displayPdga)
        const converter =
          next === 'poly' ? udiscFromPdgaPolynomial : udiscFromPdgaSimple
        setDisplayUDisc(String(converter(n)))
      }
    }
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

          <div className="flex flex-col items-center justify-center my-2 md:my-0">
            <div className="flex items-center justify-center gap-0 mb-2 md:mb-0">
              <MdArrowBack
                className="pointer-events-none text-gray-400 text-2xl sm:text-3xl -mr-1.5"
                aria-hidden="true"
              />
              <div className="dropdown dropdown-center w-[10ch] sm:w-[11ch]">
                <div
                  tabIndex={0}
                  role="button"
                  ref={dropdownTriggerRef}
                  className="btn btn-sm md:btn-md w-full rounded-md bg-gray-400 border border-gray-400 text-gray-800 hover:bg-white hover:border-white shadow-none min-h-0 h-auto px-3 py-1 relative"
                >
                  <span>{formula === 'poly' ? 'Polynomial' : 'Linear'}</span>
                  <MdArrowDropDown
                    className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-gray-700 text-base md:text-lg"
                    aria-hidden="true"
                  />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-gray-800 text-gray-200 rounded-md z-10 mt-1 w-full p-1 border border-gray-700 shadow-xl"
                >
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        handleFormulaChange('linear')
                        // close dropdown by removing focus
                        requestAnimationFrame(() => {
                          const active =
                            document.activeElement as HTMLElement | null
                          if (active) active.blur()
                          dropdownTriggerRef.current?.blur()
                        })
                      }}
                      className={`rounded px-2 ${
                        formula === 'linear'
                          ? 'bg-gray-400 text-gray-800'
                          : 'hover:bg-gray-700 text-gray-200'
                      }`}
                    >
                      Linear
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        handleFormulaChange('poly')
                        requestAnimationFrame(() => {
                          const active =
                            document.activeElement as HTMLElement | null
                          if (active) active.blur()
                          dropdownTriggerRef.current?.blur()
                        })
                      }}
                      className={`rounded px-2 ${
                        formula === 'poly'
                          ? 'bg-gray-400 text-gray-800'
                          : 'hover:bg-gray-700 text-gray-200'
                      }`}
                    >
                      Polynomial
                    </button>
                  </li>
                </ul>
              </div>
              <MdArrowForward
                className="pointer-events-none text-gray-400 text-2xl sm:text-3xl -ml-2"
                aria-hidden="true"
              />
            </div>
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
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between w-full gap-2">
          <LearnMore
            isOpen={showReferences}
            onOpen={() => setShowReferences(true)}
            onClose={() => setShowReferences(false)}
            className="mx-auto sm:mx-0"
          />
          <GiDiscGolfBasket
            className="mr-1 hidden sm:inline"
            aria-hidden="true"
          />
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <MdRocketLaunch className="mr-1" />
            Built By
            <a
              href="https://www.pdga.com/player/306677"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 hover:cursor-pointer underline underline-offset-2 hover:underline"
            >
              Rob Hilgefort #306677
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
