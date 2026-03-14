import { NextResponse } from 'next/server'
import * as Schema from 'effect/Schema'
import { validateParentPin } from '../../../../lib/auth'
import { apiHandler, parseBody } from '../../../../lib/api-utils'

const ValidatePinBody = Schema.Struct({
  pin: Schema.String,
})

export const POST = apiHandler(async (request: Request) => {
  const body = await request.json()
  const parsed = parseBody(ValidatePinBody, body)
  if (!parsed.success) return parsed.response

  const { pin } = parsed.data

  const isValid = await validateParentPin(pin)
  return NextResponse.json({ valid: isValid })
})
