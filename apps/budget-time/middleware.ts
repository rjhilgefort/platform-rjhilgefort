import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/api/auth']

function getSigningSecret(): string {
  return process.env.COOKIE_SECRET || process.env.FAMILY_PIN || 'fallback-secret'
}

async function verifySignedValueEdge(signedValue: string): Promise<boolean> {
  const lastDot = signedValue.lastIndexOf('.')
  if (lastDot === -1) return false
  const value = signedValue.slice(0, lastDot)
  const signature = signedValue.slice(lastDot + 1)

  const secret = getSigningSecret()
  const encoder = new TextEncoder()
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await globalThis.crypto.subtle.sign('HMAC', key, encoder.encode(value))
  const expected = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  if (signature.length !== expected.length) return false
  // Constant-time compare for edge runtime
  let mismatch = 0
  for (let i = 0; i < signature.length; i++) {
    mismatch |= signature.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return mismatch === 0 && value === 'authenticated'
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check for auth cookie
  const authCookie = request.cookies.get('budgettime_auth')

  if (!authCookie?.value || !(await verifySignedValueEdge(authCookie.value))) {
    // Redirect to login
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
