import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="footer md:px-10 px-5 py-4 border-t border-base-300 flex flex-col lg:flex-row justify-between items-center">
      <p>Copyright © {new Date().getFullYear()}</p>

      {/* <nav className="md:place-self-center md:justify-self-end">
        <div className="grid grid-flow-col gap-4">
          <ul className="menu menu-horizontal px-1 gap-5 md:text-lg font-semibold">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/blog">Articles</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </div>
      </nav> */}

      <div className="contact-info">
        <p>
          Contact:{' '}
          <a
            href="mailto:ally.hilgefort@gmail.com"
            className="text-primary hover:underline"
          >
            ally.hilgefort@gmail.com
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
