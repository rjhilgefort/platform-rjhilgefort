import { Metadata } from 'next'
import { Card } from '@repo/ui/card'

export const metadata: Metadata = {
  title: 'Blank',
  description: 'Blank',
}

export default function Home() {
  return (
    <div className="w-full">
      <h1>Hello, Bergen Meadow!</h1>
    </div>
  )
}
