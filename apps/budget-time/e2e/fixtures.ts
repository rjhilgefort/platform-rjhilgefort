import { test as base, type Page } from '@playwright/test'

/**
 * Authenticate by calling POST /api/auth with the family PIN,
 * then applying the returned Set-Cookie to the browser context.
 */
async function authenticate(page: Page) {
  const response = await page.request.post('/api/auth', {
    data: { pin: '1234' },
  })
  const cookies = response.headers()['set-cookie']
  if (!cookies) throw new Error('No Set-Cookie returned from /api/auth')

  // Parse Set-Cookie header into cookie object
  const parts = cookies.split(';').map((s) => s.trim())
  const [nameValue] = parts
  if (!nameValue) throw new Error('Invalid Set-Cookie header')
  const eqIdx = nameValue.indexOf('=')
  const name = nameValue.slice(0, eqIdx)
  const value = nameValue.slice(eqIdx + 1)

  await page.context().addCookies([
    {
      name,
      value,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ])
}

/** Stop any active timers for all kids via API. Silently fails if unauthenticated. */
async function stopAllTimers(page: Page) {
  try {
    const statusRes = await page.request.get('/api/timers/status')
    const contentType = statusRes.headers()['content-type'] ?? ''
    if (!statusRes.ok() || !contentType.includes('application/json')) return
    const status = await statusRes.json()
    for (const kid of status.statuses ?? []) {
      if (kid.activeTimer) {
        await page.request.post('/api/timers/stop', {
          data: { kidId: kid.kidId },
        })
      }
    }
  } catch {
    // Ignore - may be logged out
  }
}

/** Enter a 4-digit PIN on the PinPad component. */
export async function enterPin(page: Page, pin: string) {
  for (const digit of pin) {
    await page.getByRole('button', { name: digit, exact: true }).click()
  }
}

export const test = base.extend<{ authedPage: Page }>({
  authedPage: async ({ page }, use) => {
    await authenticate(page)
    await stopAllTimers(page)
    await use(page)
    // Cleanup: stop any timers started during test
    await stopAllTimers(page)
  },
})

export { expect } from '@playwright/test'
