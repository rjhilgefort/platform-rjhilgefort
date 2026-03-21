import { test, expect, enterPin } from './fixtures'

test.describe('Authentication', () => {
  test('correct PIN redirects to home', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Budget Time' })).toBeVisible()

    await enterPin(page, '1234')

    // Should redirect to home and show kid card titles
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { name: 'Jesselin' })).toBeVisible()
  })

  test('wrong PIN stays on login with error', async ({ page }) => {
    await page.goto('/login')

    await enterPin(page, '9999')

    // Should show error and remain on login
    await expect(page.getByText('Incorrect PIN')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('unauthenticated access redirects to /login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/login')
  })

  test('logout from settings works', async ({ authedPage: page }) => {
    await page.goto('/config')

    // Enter parent PIN to access config
    await enterPin(page, '5678')
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

    // Click logout
    await page.getByRole('button', { name: 'Log Out' }).click()

    await expect(page).toHaveURL('/login')

    // Verify we can't access home anymore
    await page.goto('/')
    await expect(page).toHaveURL('/login')
  })
})
