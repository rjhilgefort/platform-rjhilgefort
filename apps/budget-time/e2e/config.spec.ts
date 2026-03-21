import { test, expect, enterPin } from './fixtures'

test.describe('Config / Settings', () => {
  test('settings page loads with existing config after PIN', async ({ authedPage: page }) => {
    await page.goto('/config')

    // Should show PIN prompt first
    await expect(page.getByText('Parent PIN Required')).toBeVisible()

    // Enter parent PIN
    await enterPin(page, '5678')

    // Settings page should load with kid names (in card headings)
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Jesselin' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Raelin' })).toBeVisible()

    // Budget type config sections should be visible
    await expect(page.getByText('Daily Defaults').first()).toBeVisible()
    await expect(page.getByText('Current Balance (today)').first()).toBeVisible()

    // Budget types should be shown
    await expect(page.getByText('TV').first()).toBeVisible()
    await expect(page.getByText('Games').first()).toBeVisible()
  })

  test('can edit kid budget type defaults', async ({ authedPage: page }) => {
    await page.goto('/config')
    await enterPin(page, '5678')
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

    // Find Jesselin's card and its Daily Defaults section
    const jesselinCard = page.locator('.card', { has: page.getByRole('heading', { name: 'Jesselin' }) }).first()

    // The ExpandingSlider for "Daily TV" has a label with that text and a sibling number input
    // Find the form-control div that contains label text "Daily TV"
    const dailyTvControl = jesselinCard.locator('.form-control', { hasText: 'Daily TV' }).first()
    const numberInput = dailyTvControl.locator('input[type="number"]')

    // Get current value
    const currentValue = await numberInput.inputValue()

    // Change value
    const newValue = currentValue === '60' ? '45' : '60'
    await numberInput.fill(newValue)
    // Blur to trigger onChangeEnd -> save
    await numberInput.blur()

    // Wait for auto-save
    await page.waitForTimeout(1500)

    // Verify via API
    const configRes = await page.request.get('/api/config')
    const config = await configRes.json()
    const jesselin = config.kids.find(
      (k: { name: string }) => k.name === 'Jesselin',
    )
    const tvDefault = jesselin.budgetDefaults.find(
      (bd: { budgetTypeSlug: string }) => bd.budgetTypeSlug === 'tv',
    )
    expect(tvDefault.dailyBudgetMinutes).toBe(parseInt(newValue))

    // Restore to original
    await numberInput.fill(currentValue)
    await numberInput.blur()
    await page.waitForTimeout(1500)
  })
})
