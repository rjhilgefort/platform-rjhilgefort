import { NextResponse } from 'next/server'
import { validateFamilyPin, setAuthCookie, clearAuthCookie } from '../../../lib/auth'

export async function POST(request: Request) {
  const { pin } = await request.json()

  if (!pin || typeof pin !== 'string') {
    return NextResponse.json({ error: 'PIN required' }, { status: 400 })
  }

  const isValid = await validateFamilyPin(pin)

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
  }

  await setAuthCookie()
  return NextResponse.json({ success: true })
}

export async function DELETE() {
  await clearAuthCookie()
  return NextResponse.json({ success: true })
}
