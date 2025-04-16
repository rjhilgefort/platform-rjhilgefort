import { GoogleAnalytics } from '@next/third-parties/google'
import { Outfit } from 'next/font/google'
import './globals.css'

const inter = Outfit({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <GoogleAnalytics gaId="G-1R9Y5C3ZME" />
    </html>
  )
}
