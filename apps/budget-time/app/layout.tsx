import type { Metadata, Viewport } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Budget Time',
  description: 'Manage time budgets for Jesselin & Raelin',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Budget Time',
  },
}

export const viewport: Viewport = {
  themeColor: '#22c55e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="bumblebee">
      <body className={outfit.className}>{children}</body>
      <GoogleAnalytics gaId="TODO" />
    </html>
  )
}
