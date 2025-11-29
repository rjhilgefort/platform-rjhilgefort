import { GoogleAnalytics } from '@next/third-parties/google'
import { Outfit } from 'next/font/google'
import Link from 'next/link'
import type { Metadata } from 'next'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Proof & Pour | Cincinnati Bourbon Tasting Events',
  description: 'Private bourbon tasting events in Cincinnati. Expert-hosted tastings for corporate events, special occasions, and bourbon enthusiasts. Book your exclusive bourbon experience today.',
  keywords: 'bourbon tasting Cincinnati, private bourbon events Cincinnati, bourbon host, whiskey tasting events, corporate bourbon tastings',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en">
      <body className={outfit.className}>
        <nav className="navbar bg-base-100 shadow-lg">
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/education">Education</Link></li>
                <li><Link href="/recipes">Recipes</Link></li>
                <li><Link href="/shop">Shop</Link></li>
                <li><Link href="/content">Content</Link></li>
                <li><Link href="/partnerships">Work With Me</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <Link href="/" className="btn btn-ghost text-xl flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo/logo.svg"
                alt="Proof & Pour Logo"
                className="w-10 h-10"
              />
              <span>Proof & Pour</span>
            </Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/education">Education</Link></li>
              <li><Link href="/recipes">Recipes</Link></li>
              <li><Link href="/shop">Shop</Link></li>
              <li><Link href="/content">Content</Link></li>
              <li><Link href="/partnerships">Work With Me</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="navbar-end">
            <Link href="/contact" className="btn btn-primary">Book Event</Link>
          </div>
        </nav>

        <main className="min-h-screen">{children}</main>

        <footer className="footer footer-center p-10 bg-base-200 text-base-content">
          <nav className="grid grid-flow-col gap-4">
            <Link href="/about" className="link link-hover">About</Link>
            <Link href="/contact" className="link link-hover">Contact</Link>
            <Link href="/partnerships" className="link link-hover">Partnerships</Link>
          </nav>
          <nav>
            <div className="grid grid-flow-col gap-4">
              <a href="https://twitter.com/proofandpour" target="_blank" rel="noopener noreferrer" className="link">
                Twitter
              </a>
              <a href="https://instagram.com/proofandpour" target="_blank" rel="noopener noreferrer" className="link">
                Instagram
              </a>
              <a href="https://youtube.com/@proofandpour" target="_blank" rel="noopener noreferrer" className="link">
                YouTube
              </a>
            </div>
          </nav>
          <aside>
            <p>Copyright © {new Date().getFullYear()} - Proof & Pour | Cincinnati Bourbon Tasting Events</p>
          </aside>
        </footer>

        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  )
}
