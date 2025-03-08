'use client'

import React from 'react'
import ThemeToggle from './ThemeToggle'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const Navbar = () => {
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Articles', href: '/articles' },
    { name: 'About', href: '/about' },
  ]

  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50">
      <nav className="navbar bg-base-100/90 shadow-xs backdrop-blur-lg justify-center items-center py-2 md:px-10 px-5">
        <div className="navbar-start">
          <div className="dropdown">
            <button
              aria-label="button"
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden"
            >
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
                ></path>
              </svg>
            </button>
            <ul className="menu dropdown-content menu-md z-1 mt-3 w-52 gap-2 rounded-box bg-base-100 p-2 shadow-sm">
              {navigation.map((item, index) => (
                <li key={index}>
                  <a href={item.href}>{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <Link className="btn btn-ghost text-xl" href="/">
            {' '}
            Blog
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          {navigation.map((item, index) => (
            <nav key={index} className="menu menu-horizontal">
              <a
                href={item.href}
                className={`hover:text-primary hover:bg-primary/10 transition flex py-2 px-4 rounded-md ${pathname === item.href ? 'text-primary bg-primary/10' : ''}`}
              >
                {item.name}
              </a>
            </nav>
          ))}
        </div>
        <div className="navbar-end">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}

export default Navbar
