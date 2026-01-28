import cron from 'node-cron'
import { db } from '../db/client'
import { getOrCreateTodayBalance, getResetHour, getTimezone } from './balance'

let isScheduled = false

/**
 * Create daily balances for all kids proactively
 */
async function createDailyBalancesForAllKids() {
  const timezone = await getTimezone()
  const resetHour = await getResetHour()

  console.log(`[cron] Running daily balance creation at reset hour ${resetHour} (${timezone})`)

  const allKids = await db.query.kids.findMany()

  for (const kid of allKids) {
    try {
      const balance = await getOrCreateTodayBalance(kid.id)
      console.log(`[cron] Created/verified balance for kid ${kid.id} (${kid.name}): ${balance.date}`)
    } catch (err) {
      console.error(`[cron] Failed to create balance for kid ${kid.id}:`, err)
    }
  }

  console.log(`[cron] Daily balance creation complete for ${allKids.length} kids`)
}

/**
 * Schedule the daily balance creation cron job
 * Runs at the configured reset hour every day
 */
export async function scheduleDailyBalanceCron() {
  if (isScheduled) {
    console.log('[cron] Daily balance cron already scheduled, skipping')
    return
  }

  const resetHour = await getResetHour()
  const timezone = await getTimezone()

  // Cron expression: "0 <hour> * * *" = at minute 0 of the reset hour, every day
  const cronExpression = `0 ${resetHour} * * *`

  cron.schedule(cronExpression, async () => {
    await createDailyBalancesForAllKids()
  }, {
    timezone,
  })

  isScheduled = true
  console.log(`[cron] Scheduled daily balance creation at ${resetHour}:00 (${timezone})`)
}
