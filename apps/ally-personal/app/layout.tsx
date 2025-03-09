import { GoogleAnalytics } from '@next/third-parties/google'
import { Outfit } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const inter = Outfit({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-6HZJF1Z64C" />
    </html>
  )
}
