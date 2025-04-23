import { Metadata } from 'next'
import { Card } from '@repo/ui/card'

export const metadata: Metadata = {
  title: 'Blank',
  description: 'Blank',
}

export default function Home() {
  return (
    <div className="w-full">
      <h1>Blank</h1>
      <Card title="Card Title" href="https://example.com">
        <p>Card Content</p>
      </Card>
    </div>
  )
}
