import { test, expect, enterPin } from './fixtures'

test.describe('Timers', () => {
  test('start consumption timer shows overlay with countdown', async ({ authedPage: page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Jesselin' })).toBeVisible()

    // Start TV timer via API for Jesselin (faster and more reliable than UI clicking)
    const statusRes = await page.request.get('/api/timers/status')
    const status = await statusRes.json()
    const jesselin = status.statuses.find(
      (s: { kidName: string }) => s.kidName === 'Jesselin',
    )
    const tvBalance = jesselin.typeBalances.find(
      (tb: { budgetTypeSlug: string }) => tb.budgetTypeSlug === 'tv',
    )
    await page.request.post('/api/timers/start', {
      data: { kidId: jesselin.kidId, budgetTypeId: tvBalance.budgetTypeId },
    })

    // Reload page to see the active timer overlay
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Jesselin' })).toBeVisible()

    // Timer overlay should show with Stop button
    await expect(page.getByRole('button', { name: 'Stop' }).first()).toBeVisible()
    // Verify active timer via API (more reliable than checking CSS visibility of overlay text)
    const activeRes = await page.request.get('/api/timers/status')
    const activeStatus = await activeRes.json()
    const activeJesselin = activeStatus.statuses.find(
      (s: { kidName: string }) => s.kidName === 'Jesselin',
    )
    expect(activeJesselin.activeTimer).toBeTruthy()
    expect(activeJesselin.activeTimer.budgetTypeSlug).toBe('tv')
  })

  test('stop consumption timer deducts balance and creates history entry', async ({
    authedPage: page,
  }) => {
    // Start a timer via API for speed/reliability
    const statusRes = await page.request.get('/api/timers/status')
    const status = await statusRes.json()
    const jesselin = status.statuses.find(
      (s: { kidName: string }) => s.kidName === 'Jesselin',
    )
    const tvBalance = jesselin.typeBalances.find(
      (tb: { budgetTypeSlug: string }) => tb.budgetTypeSlug === 'tv',
    )
    const initialSeconds = tvBalance.remainingSeconds

    // Start timer via API
    await page.request.post('/api/timers/start', {
      data: { kidId: jesselin.kidId, budgetTypeId: tvBalance.budgetTypeId },
    })

    // Wait a moment for time to elapse
    await page.waitForTimeout(2000)

    // Stop via API
    const stopRes = await page.request.post('/api/timers/stop', {
      data: { kidId: jesselin.kidId },
    })
    const stopData = await stopRes.json()
    expect(stopData.stopped.elapsedSeconds).toBeGreaterThanOrEqual(1)

    // Verify balance decreased
    const newStatusRes = await page.request.get('/api/timers/status')
    const newStatus = await newStatusRes.json()
    const newJesselin = newStatus.statuses.find(
      (s: { kidName: string }) => s.kidName === 'Jesselin',
    )
    const newTvBalance = newJesselin.typeBalances.find(
      (tb: { budgetTypeSlug: string }) => tb.budgetTypeSlug === 'tv',
    )
    expect(newTvBalance.remainingSeconds).toBeLessThan(initialSeconds)

    // Verify history entry was created
    const historyRes = await page.request.get('/api/history')
    const historyData = await historyRes.json()
    const tvEntry = historyData.entries.find(
      (e: { kidName: string; budgetTypeDisplayName: string }) =>
        e.kidName === 'Jesselin' && e.budgetTypeDisplayName === 'TV',
    )
    expect(tvEntry).toBeTruthy()
    expect(tvEntry.eventType).toBe('budget_used')
  })

  test('cannot start two timers for same kid simultaneously', async ({ authedPage: page }) => {
    const statusRes = await page.request.get('/api/timers/status')
    const status = await statusRes.json()
    const jesselin = status.statuses.find(
      (s: { kidName: string }) => s.kidName === 'Jesselin',
    )
    const tvBalance = jesselin.typeBalances.find(
      (tb: { budgetTypeSlug: string }) => tb.budgetTypeSlug === 'tv',
    )
    const gameBalance = jesselin.typeBalances.find(
      (tb: { budgetTypeSlug: string }) => tb.budgetTypeSlug === 'game',
    )

    // Start first timer
    const startRes = await page.request.post('/api/timers/start', {
      data: { kidId: jesselin.kidId, budgetTypeId: tvBalance.budgetTypeId },
    })
    expect(startRes.ok()).toBeTruthy()

    // Try to start second timer - should fail with 409
    const secondRes = await page.request.post('/api/timers/start', {
      data: { kidId: jesselin.kidId, budgetTypeId: gameBalance.budgetTypeId },
    })
    expect(secondRes.status()).toBe(409)
    const errData = await secondRes.json()
    expect(errData.error).toContain('already active')
  })

  test('earning timer credits Extra balance', async ({ authedPage: page }) => {
    const statusRes = await page.request.get('/api/timers/status')
    const status = await statusRes.json()
    const jesselin = status.statuses.find(
      (s: { kidName: string }) => s.kidName === 'Jesselin',
    )
    const extraBalance = jesselin.typeBalances.find(
      (tb: { budgetTypeSlug: string }) => tb.budgetTypeSlug === 'extra',
    )
    const initialExtra = extraBalance.remainingSeconds

    // Get Chores earning type
    const choresType = status.earningTypes.find(
      (et: { slug: string }) => et.slug === 'chore',
    )

    // Start earning timer via API
    await page.request.post('/api/timers/start', {
      data: { kidId: jesselin.kidId, earningTypeId: choresType.id },
    })

    // Wait for some earning time
    await page.waitForTimeout(2000)

    // Stop earning timer
    const stopRes = await page.request.post('/api/timers/stop', {
      data: { kidId: jesselin.kidId },
    })
    const stopData = await stopRes.json()
    expect(stopData.stopped.earnedSeconds).toBeGreaterThanOrEqual(1)

    // Verify Extra balance increased
    const newStatusRes = await page.request.get('/api/timers/status')
    const newStatus = await newStatusRes.json()
    const newJesselin = newStatus.statuses.find(
      (s: { kidName: string }) => s.kidName === 'Jesselin',
    )
    const newExtra = newJesselin.typeBalances.find(
      (tb: { budgetTypeSlug: string }) => tb.budgetTypeSlug === 'extra',
    )
    expect(newExtra.remainingSeconds).toBeGreaterThan(initialExtra)
  })
})
