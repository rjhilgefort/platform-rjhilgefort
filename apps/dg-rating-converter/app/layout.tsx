import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://dgratingconverter.com'),
  title: {
    default: 'uDisc to PDGA Rating Converter',
    template: '%s | Disc Golf Rating Converter',
  },
  description:
    'Convert between uDisc and PDGA disc golf ratings instantly. Choose polynomial or linear formulas.',
  keywords: [
    'disc golf rating converter',
    'udisc rating',
    'pdga rating',
    'udisc to pdga',
    'pdga to udisc',
  ],
  openGraph: {
    title: 'uDisc ↔︎ PDGA Disc Golf Rating Converter',
    description:
      'Switch between uDisc and PDGA ratings using polynomial or linear formulas and understand how your disc golf rounds translate.',
    url: 'https://dgratingconverter.com',
    siteName: 'Disc Golf Rating Converter',
    images: [
      {
        url: 'https://dgratingconverter.com/dg-putting-sunset-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Disc golf putting at sunset',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'uDisc ↔︎ PDGA Disc Golf Rating Converter',
    description:
      'Translate disc golf ratings between uDisc and PDGA with polynomial or linear formulas to compare your performance.',
    images: ['https://dgratingconverter.com/dg-putting-sunset-banner.jpg'],
  },
  alternates: {
    canonical: 'https://dgratingconverter.com/',
  },
}

const inter = Outfit({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gray-900 text-white min-h-screen overflow-x-hidden`}
      >
        {children}
      </body>
      <GoogleAnalytics gaId="G-00JMBSQ79Q" />
    </html>
  )
}
