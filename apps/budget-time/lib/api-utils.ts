import { NextResponse } from 'next/server'
import * as Schema from 'effect/Schema'
import { TreeFormatter } from 'effect/ParseResult'

/**
 * Parse and validate request JSON against an Effect Schema.
 * Returns { success: true, data } or { success: false, response: NextResponse }
 */
export function parseBody<A, I>(
  schema: Schema.Schema<A, I>,
  body: unknown
): { success: true; data: A } | { success: false; response: NextResponse } {
  const result = Schema.decodeUnknownEither(schema)(body)
  if (result._tag === 'Left') {
    const errors = TreeFormatter.formatErrorSync(result.left)
    return {
      success: false,
      response: NextResponse.json({ error: 'Invalid request', details: errors }, { status: 400 }),
    }
  }
  return { success: true, data: result.right }
}

/**
 * Wrap an API handler with try-catch that returns clean 500s
 */
export function apiHandler(
  handler: (request: Request) => Promise<NextResponse>
): (request: Request) => Promise<NextResponse> {
  return async (request: Request) => {
    try {
      return await handler(request)
    } catch (error) {
      console.error('[api]', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

/**
 * Wrap a no-args API handler (GET/DELETE with no request param needed)
 */
export function apiHandlerNoArgs(
  handler: () => Promise<NextResponse>
): () => Promise<NextResponse> {
  return async () => {
    try {
      return await handler()
    } catch (error) {
      console.error('[api]', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}
