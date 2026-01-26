'use client'

import { useRouter } from 'next/navigation'
import { PinPad } from '../../components/PinPad'
import { AppIcon } from '../../components/AppIcon'

export default function LoginPage() {
  const router = useRouter()

  const handleSubmit = async (pin: string): Promise<boolean> => {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })

    if (response.ok) {
      router.push('/')
      router.refresh()
      return true
    }
    return false
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card bg-base-100 shadow-xl w-full max-w-sm">
        <div className="card-body items-center">
          <div className="flex flex-col items-center gap-2 mb-4">
            <AppIcon size={64} />
            <h1 className="text-2xl font-bold">Budget Time</h1>
          </div>
          <PinPad onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}
