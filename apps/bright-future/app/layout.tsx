import { GoogleAnalytics } from '@next/third-parties/google'
import { Outfit } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './globals.css'

const inter = Outfit({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="bumblebee">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        <GoogleAnalytics gaId="TODO" />
      </body>
    </html>
  )
}
