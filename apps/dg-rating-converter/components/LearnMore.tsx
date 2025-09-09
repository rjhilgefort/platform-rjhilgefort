'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { MdClose, MdInfo } from 'react-icons/md'

const Link = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => (
  <a
    href={href}
    className="text-blue-400 hover:underline"
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
)

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-base font-semibold mb-2">{children}</h2>
)

const SectionBody = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={`text-sm text-gray-300 mb-3 ${className}`}>{children}</div>
)

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
      <div className="relative bg-gray-900 w-full max-w-lg md:max-w-xl max-h-[85vh] overflow-y-auto rounded-lg shadow-xl border border-gray-700 p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white focus:outline-none"
          aria-label="Close"
        >
          <MdClose size={16} />
        </button>

        <SectionHeader>uDisc Rating Notes</SectionHeader>
        <SectionBody>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Conversion is approximate and may vary based on course difficulty.
            </li>
            <li>
              uDisc doesn&apos;t take into account weather. This means the
              course could have played much harder (high wind).
            </li>
            <li>
              PDGA ratings take into account more statistical factors than just
              raw scores.
            </li>
          </ul>
        </SectionBody>

        <SectionHeader>Linear Formula</SectionHeader>
        <SectionBody>
          <p className="mb-1">
            <code>(uDisc × 2) + 500 = PDGA Rating</code>
          </p>
          <p className="text-gray-400 text-xs">
            This is an approximation based on community observations.
          </p>
        </SectionBody>

        <SectionBody>
          <p className="mb-2">
            A Reddit user{' '}
            <Link href="https://www.reddit.com/r/discgolf/comments/1b7s0ad/udisc_round_ratings_to_pdga_round_ratings/">
              compared lots of rounds side by side (uDisc vs PDGA)
            </Link>{' '}
            and found that uDisc ratings are approximately based on 200 being
            900 rated, 250 being 1,000 rated, and 300 being 1,100 rated.
          </p>
          <p className="mb-3">
            Another user responded to the side-by-side comparison and{' '}
            <Link href="https://www.reddit.com/r/discgolf/comments/17uhf28/my_udisc_to_pdga_chart/">
              plotted 71 ratings on a graph
            </Link>{' '}
            and found a more accurate logarithmic relationship, but concluded
            that the simpler formula above was nearly just as accurate.
            Although, uDisc ratings &lt;= 150 are less accurate with this
            formula.
          </p>
          <Image
            src="/linear-plot.jpg"
            alt="linear-plot"
            width={1170}
            height={791}
            className="rounded-lg shadow-xl max-w-full h-auto max-h-[40vh] object-contain"
          />
        </SectionBody>

        <SectionHeader>Polynomial Formula</SectionHeader>
        <SectionBody>
          <p className="mb-1">
            <p className="mb-1">
              <code>
                (-3.010639379e-7 × uDisc^4) + (2.25588648e-4 × uDisc^3) -
                (0.06630698227 × uDisc^2) + (11.08668699 × uDisc) + 36.01871726
                = PDGA Rating
              </code>
            </p>
            <p className="text-gray-400 text-xs">
              <code>R^2 ~ 0.97</code>.
            </p>
          </p>
        </SectionBody>

        <SectionBody>
          <p className="mb-2">
            You can compute PDGA rating from a UDisc rating with a 4th‑order
            polynomial with the above coefficients,{' '}
            <Link href="https://www.reddit.com/r/discgolf/comments/1nc7fun/comment/nd8szwl/">
              fit by Reddit user 1000RatedSass
            </Link>
            . This was fit to 107 data points ranging from PDGA ratings in the
            700s into the 1000s.
          </p>
          <p className="mb-3">
            This site evaluates the polynomial using{' '}
            <Link href="https://en.wikipedia.org/wiki/Horner%27s_method">
              Horner's method
            </Link>{' '}
            for numerical stability and speed. Additionally, the reverse
            calculation (PDGA to UDisc) follows a similar approach, but with
            <Link href="https://www.reddit.com/r/discgolf/comments/1nc7fun/comment/nd9lz0o/">
              coefficients from the reverse polynomial
            </Link>
            .
          </p>
          <Image
            src="/polynomial-plot.webp"
            alt="polynomial-plot"
            width={1170}
            height={791}
            className="rounded-lg shadow-xl max-w-full h-auto max-h-[40vh] object-contain"
          />
        </SectionBody>
        <SectionHeader>Reference Links</SectionHeader>
        <SectionBody className="text-xs">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <Link href="https://www.reddit.com/r/discgolf/comments/1b7s0ad/udisc_round_ratings_to_pdga_round_ratings/">
                Reddit Post: Side by side comparison of ratings
              </Link>
            </li>
            <li>
              <Link href="https://www.reddit.com/r/discgolf/comments/17uhf28/my_udisc_to_pdga_chart/">
                Reddit Post: 71 ratings plotted on a graph
              </Link>
            </li>
            <li>
              <Link href="https://www.reddit.com/r/discgolf/comments/1nc7fun/comment/nd8szwl/">
                Reddit Comment: 4th Order Polynomial coefficients
              </Link>
            </li>
          </ul>
        </SectionBody>
      </div>
    </div>
  )
}

export const LearnMore = ({
  isOpen,
  onOpen,
  onClose,
  className,
}: {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  className?: string
}) => {
  return (
    <>
      <button
        onClick={onOpen}
        className={`text-sm text-gray-400 hover:text-gray-300 flex items-center mb-2 focus:outline-none ${
          className ?? 'mx-auto'
        }`}
      >
        <MdInfo size={16} className="mr-1" aria-hidden="true" />
        <span>Learn More About This Calculator</span>
      </button>
      <LearnMoreContent isOpen={isOpen} onClose={onClose} />
    </>
  )
}
