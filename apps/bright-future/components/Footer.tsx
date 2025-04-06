import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-base-200 text-base-content py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div className="max-w-xs">
            <Link href="/" className="flex items-baseline">
              <span className="text-xl font-bold text-primary">Bright</span>
              <span className="text-xl text-secondary">Future</span>
            </Link>
            <p className="mt-2 text-sm">
              Nurturing minds and hearts since 2010.
            </p>
            <p className="text-xs mt-1 opacity-75">
              © {currentYear} Bright Future Early Learning Center
            </p>
          </div>

          <div className="flex flex-col md:items-end text-sm">
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
              <span>123 Learning Lane, Anytown, ST 12345</span>
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
                href="mailto:info@brightfuture.com"
                className="link link-hover"
              >
                info@brightfuture.com
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
              <a href="tel:+15551234567" className="link link-hover">
                (555) 123-4567
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
