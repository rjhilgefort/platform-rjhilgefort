'use client'

import { FaBars, FaLinkedin, FaFileArrowDown } from 'react-icons/fa6'
import { profile } from '../data/resume'

type NavItem = {
  name: string
  href: string
}

const navItems: Array<NavItem> = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Skills', href: '#skills' },
  { name: 'Education', href: '#education' },
  { name: 'Volunteering', href: '#volunteering' },
]

const Navbar = () => {
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-50">
      <nav className="navbar bg-base-100/95 shadow-sm backdrop-blur-lg justify-center items-center py-2 md:px-10 px-5">
        <div className="navbar-start">
          <div className="dropdown">
            <button
              aria-label="Open menu"
              tabIndex={0}
              className="btn btn-ghost lg:hidden"
            >
              <FaBars className="text-lg" />
            </button>
            <ul className="menu dropdown-content menu-md z-10 mt-3 w-52 gap-1 rounded-box bg-base-100 p-2 shadow-lg">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="btn btn-ghost text-xl font-semibold"
          >
            {profile.name}
          </a>
        </div>

        <div className="navbar-center hidden lg:flex">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className="hover:text-primary hover:bg-primary/10 transition py-2 px-4 rounded-md"
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="navbar-end gap-2">
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin className="text-lg" />
          </a>
          <a href="/resume.pdf" download className="btn btn-primary btn-sm">
            <FaFileArrowDown />
            <span className="hidden sm:inline">Resume</span>
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
