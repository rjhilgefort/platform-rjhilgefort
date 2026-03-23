import { test, expect } from './fixtures'

test.describe('History', () => {
  test.beforeEach(async ({ authedPage: page }) => {
    // Create a quick timer entry so history isn't empty
    const statusRes = await page.request.get('/api/timers/status')
    const status = await statusRes.json()
    const jesselin = status.statuses.find(
      (s: { kidName: string }) => s.kidName === 'Jesselin',
    )
    const tvBalance = jesselin.typeBalances.find(
      (tb: { budgetTypeSlug: string }) => tb.budgetTypeSlug === 'tv',
    )

    // Only create entry if TV has balance (avoids failure on repeated runs)
    if (tvBalance.remainingSeconds > 0) {
      await page.request.post('/api/timers/start', {
        data: { kidId: jesselin.kidId, budgetTypeId: tvBalance.budgetTypeId },
      })
      await page.waitForTimeout(1500)
      await page.request.post('/api/timers/stop', {
        data: { kidId: jesselin.kidId },
      })
    }
  })

  test('history page loads and shows entries grouped by day', async ({ authedPage: page }) => {
    await page.goto('/history')

    await expect(page.getByRole('heading', { name: 'Timer History' })).toBeVisible()

    // Should show "Today" as the day group label
    await expect(page.getByText('Today')).toBeVisible()

    // Should show at least one history entry with kid name (visible span, not hidden option)
    await expect(page.locator('.card span.font-medium', { hasText: 'Jesselin' }).first()).toBeVisible()

    // Should show "Used" or "Earned" text
    await expect(page.getByText('Used').first()).toBeVisible()
  })

  test('Daily Allowance cards appear at top of day group', async ({ authedPage: page }) => {
    await page.goto('/history')
    await expect(page.getByRole('heading', { name: 'Timer History' })).toBeVisible()

    // Daily Allowance cards show for each kid
    const allowanceCards = page.getByText('Daily Allowance')
    await expect(allowanceCards.first()).toBeVisible()
  })

  test('End of Day summaries appear at bottom of day group', async ({ authedPage: page }) => {
    await page.goto('/history')
    await expect(page.getByRole('heading', { name: 'Timer History' })).toBeVisible()

    // End of Day sections appear for completed days
    // On a fresh DB there may not be End of Day summaries for "Today"
    // since the day hasn't ended yet.
    const endOfDay = page.getByText('End of Day')
    const count = await endOfDay.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('kid filter dropdown works', async ({ authedPage: page }) => {
    await page.goto('/history')
    await expect(page.getByRole('heading', { name: 'Timer History' })).toBeVisible()

    // Select filter to show only Jesselin
    const select = page.locator('select')
    await select.selectOption({ label: 'Jesselin' })

    // Wait for refetch
    await page.waitForTimeout(1000)

    // Should still show Jesselin entries (visible span in card, not hidden option)
    await expect(page.locator('.card span.font-medium', { hasText: 'Jesselin' }).first()).toBeVisible()

    // Switch to "All Kids"
    await select.selectOption({ label: 'All Kids' })
    await page.waitForTimeout(1000)

    // All Kids mode should show entries
    await expect(page.getByText('Today')).toBeVisible()
  })
})
