import Link from 'next/link'
import Image from 'next/image'
import { phoneNumberPretty } from '../utils/const'
import { phoneNumberLink } from '../utils/const'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-base-200 text-base-content py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center md:flex-row md:justify-between md:items-center gap-6">
          <div className="flex flex-col items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src="/logo.jpeg"
                  alt="Bright Future Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-xl">
                <span className="text-accent font-bold">Bright Future</span>
              </div>
            </Link>
            <p className="text-xs mt-1 opacity-75">
              © {currentYear} Bright Future Child Enrichment
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end text-sm">
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>240 Main St, Florence, KY 41042</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Mon-Fri: 6:30 AM - 6:00 PM</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.5 5.5a1 1 0 011-1h16a1 1 0 011 1v12a1 1 0 01-1 1h-16a1 1 0 01-1-1v-12z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.5 8.5L12 15l8.5-6.5"
                />
              </svg>
              <a
                href="mailto:info@brightfuturekids.com"
                className="link link-hover"
              >
                info@brightfuturekids.com
              </a>
            </div>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 0v4m0-4h4m-4 0H8"
                />
              </svg>
              <a href={phoneNumberLink} className="link link-hover">
                {phoneNumberPretty}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
