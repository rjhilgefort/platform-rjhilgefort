'use client'

import { useEffect } from 'react'
import { AiOutlineInfoCircle } from 'react-icons/ai'

const LearnMoreContent = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-900 w-full max-w-lg rounded-lg shadow-xl border border-gray-700 p-6">
        <button
          onClick={onClose}
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
            This calculation uses a simple formula: (uDisc Rating × 2) + 500 =
            PDGA Rating
          </p>
          <p className="mb-3 text-gray-400 text-xs">
            This is an approximation based on community observations. Results
            may vary.
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
                PDGA ratings take into account more statistical factors than
                just raw scores
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
  )
}

export const LearnMore = ({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}) => {
  return (
    <>
      <button
        onClick={onOpen}
        className="text-sm text-gray-400 hover:text-gray-300 flex items-center mx-auto mb-2 focus:outline-none"
      >
        <AiOutlineInfoCircle size={16} className="mr-1" aria-hidden="true" />
        <span>Learn More About This Calculator</span>
      </button>
      <LearnMoreContent isOpen={isOpen} onClose={onClose} />
    </>
  )
}
