import { GoogleAnalytics } from '@next/third-parties/google'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://stephanie.hilgefort.me'),
  title: 'Stephanie Hilgefort, MBA | Senior Brand Manager',
  description:
    'Strategic brand and media leader with 10+ years of experience driving growth for Fortune 500 brands at Procter & Gamble, Fifth Third Bank, and leading agencies.',
  keywords: [
    'Brand Manager',
    'Media Planner',
    'Marketing',
    'P&G',
    'Procter & Gamble',
    'Cincinnati',
    'MBA',
  ],
  authors: [{ name: 'Stephanie Hilgefort' }],
  openGraph: {
    title: 'Stephanie Hilgefort, MBA | Senior Brand Manager',
    description:
      'Strategic brand and media leader with 10+ years of experience driving growth for Fortune 500 brands.',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Stephanie Hilgefort, MBA - Senior Brand Manager',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stephanie Hilgefort, MBA | Senior Brand Manager',
    description:
      'Strategic brand and media leader with 10+ years of experience driving growth for Fortune 500 brands.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="corporate">
      <body className={`${inter.className} bg-base-100`}>{children}</body>
      <GoogleAnalytics gaId="G-96WLD78W0P" />
    </html>
  )
}
