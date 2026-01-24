import { NextResponse } from 'next/server'
import { validateParentPin } from '../../../../lib/auth'

export async function POST(request: Request) {
  const { pin } = await request.json()

  if (!pin || typeof pin !== 'string') {
    return NextResponse.json({ valid: false }, { status: 400 })
  }

  const isValid = await validateParentPin(pin)
  return NextResponse.json({ valid: isValid })
}
