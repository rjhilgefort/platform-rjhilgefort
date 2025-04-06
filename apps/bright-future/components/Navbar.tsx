import Link from 'next/link'
import { FaPhone } from 'react-icons/fa'
import { phoneNumberLink, phoneNumberPretty } from '../utils/const'

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <a>Programs</a>
              <ul className="p-2">
                <li>
                  <Link href="/programs/infants">Infants</Link>
                </li>
                <li>
                  <Link href="/programs/toddlers">Toddlers</Link>
                </li>
                <li>
                  <Link href="/programs/preschool">Preschool</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">
          <span className="text-primary font-bold">Bright</span>
          <span className="text-secondary">Future</span>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <details>
              <summary>Programs</summary>
              <ul className="p-2 bg-base-100 z-10">
                <li>
                  <Link href="/programs/infants">Infants</Link>
                </li>
                <li>
                  <Link href="/programs/toddlers">Toddlers</Link>
                </li>
                <li>
                  <Link href="/programs/preschool">Preschool</Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <Link href="/about">About Us</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <a
          href={phoneNumberLink}
          className="btn btn-primary flex items-center gap-2"
        >
          <FaPhone className="h-4 w-4" />
          {phoneNumberPretty}
        </a>
      </div>
    </div>
  )
}

export default Navbar
