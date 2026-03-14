import { cookies } from 'next/headers'
import crypto from 'crypto'

const AUTH_COOKIE_NAME = 'budgettime_auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days
const AUTH_VALUE = 'authenticated'

function getSigningSecret(): string {
  return process.env.COOKIE_SECRET || process.env.FAMILY_PIN || 'fallback-secret'
}

function signValue(value: string): string {
  const hmac = crypto.createHmac('sha256', getSigningSecret())
  hmac.update(value)
  return `${value}.${hmac.digest('hex')}`
}

function verifySignedValue(signedValue: string): boolean {
  const lastDot = signedValue.lastIndexOf('.')
  if (lastDot === -1) return false
  const value = signedValue.slice(0, lastDot)
  const signature = signedValue.slice(lastDot + 1)

  const hmac = crypto.createHmac('sha256', getSigningSecret())
  hmac.update(value)
  const expected = hmac.digest('hex')

  if (signature.length !== expected.length) return false
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) && value === AUTH_VALUE
}

function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

export async function validateFamilyPin(pin: string): Promise<boolean> {
  const expected = process.env.FAMILY_PIN || ''
  return timingSafeCompare(pin, expected)
}

export async function validateParentPin(pin: string): Promise<boolean> {
  const expected = process.env.PARENT_PIN || ''
  return timingSafeCompare(pin, expected)
}

export async function setAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, signValue(AUTH_VALUE), {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(AUTH_COOKIE_NAME)
  if (!cookie?.value) return false
  return verifySignedValue(cookie.value)
}
