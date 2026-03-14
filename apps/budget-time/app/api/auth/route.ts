import { NextResponse } from 'next/server'
import * as Schema from 'effect/Schema'
import { validateFamilyPin, setAuthCookie, clearAuthCookie } from '../../../lib/auth'
import { apiHandler, apiHandlerNoArgs, parseBody } from '../../../lib/api-utils'

const AuthBody = Schema.Struct({
  pin: Schema.String,
})

export const POST = apiHandler(async (request: Request) => {
  const body = await request.json()
  const parsed = parseBody(AuthBody, body)
  if (!parsed.success) return parsed.response

  const { pin } = parsed.data

  const isValid = await validateFamilyPin(pin)

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
  }

  await setAuthCookie()
  return NextResponse.json({ success: true })
})

export const DELETE = apiHandlerNoArgs(async () => {
  await clearAuthCookie()
  return NextResponse.json({ success: true })
})
