import { cookies } from 'next/headers'

const AUTH_COOKIE_NAME = 'budgettime_auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function validateFamilyPin(pin: string): Promise<boolean> {
  return pin === process.env.FAMILY_PIN
}

export async function validateParentPin(pin: string): Promise<boolean> {
  return pin === process.env.PARENT_PIN
}

export async function setAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, 'authenticated', {
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
  return cookie?.value === 'authenticated'
}
