'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FaPhone } from 'react-icons/fa'
import { phoneNumberLink, phoneNumberPretty } from '../utils/const'
import { usePathname, useRouter } from 'next/navigation'

const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()

  const scrollToPrograms = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    if (pathname === '/') {
      const programsSection = document.getElementById('programs-section')
      if (programsSection) {
        programsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    } else {
      router.push('/#programs-section')
    }
  }

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
              <a href="#programs-section" onClick={scrollToPrograms}>
                Programs
              </a>
            </li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost flex items-center gap-2">
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
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <a href="#programs-section" onClick={scrollToPrograms}>
              Programs
            </a>
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
