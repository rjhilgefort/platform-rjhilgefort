'use client'

import React from 'react'
import { Array } from 'effect'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FaBars, FaEnvelope } from 'react-icons/fa6'

type NavigationItem = {
  name: string
  href: string
}

const Navbar = () => {
  const navigation: Array<NavigationItem> = [
    { name: 'Home', href: '/' },
    // { name: 'Articles', href: '/articles' },
    // { name: 'About', href: '/about' },
    { name: 'EPRD Forum', href: '/eprd-forum' },
    { name: '04/26 Forum', href: '/0426-forum' },
    { name: 'Bergen Meadow Update', href: '/bergen-meadow-update' },
  ]

  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50">
      <nav className="navbar bg-base-100/90 shadow-xs backdrop-blur-lg justify-center items-center py-2 md:px-10 px-5">
        <div className="navbar-start">
          <div className="dropdown">
            {Array.isNonEmptyArray(navigation) && (
              <button
                aria-label="button"
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <FaBars />
              </button>
            )}
            <ul className="menu dropdown-content menu-md z-1 mt-3 w-52 gap-2 rounded-box bg-base-100 p-2 shadow-sm">
              {navigation.map((item, index) => (
                <li key={index}>
                  <a href={item.href}>{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <Link className="btn btn-ghost text-xl" href="/">
            <Image src="/images/sun-icon.png" alt="" width={20} height={20} />
            Ally Hilgefort
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
          <a href="mailto:ally.hilgefort@gmail.com" className="btn btn-primary">
            <FaEnvelope /> Reach Out!
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
