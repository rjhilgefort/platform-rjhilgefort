import cron from 'node-cron'
import { db } from '../db/client'
import { getOrCreateTodayBalance, getResetHour, getTimezone } from './balance'

let isScheduled = false

const MAX_RETRIES = 3
const BASE_DELAY_MS = 1000

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Create daily balances for all kids proactively
 */
async function createDailyBalancesForAllKids() {
  const timezone = await getTimezone()
  const resetHour = await getResetHour()

  console.log(`[cron] Running daily balance creation at reset hour ${resetHour} (${timezone})`)

  const allKids = await db.query.kids.findMany()

  for (const kid of allKids) {
    let success = false
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const balance = await getOrCreateTodayBalance(kid.id)
        console.log(`[cron] Created/verified balance for kid ${kid.id} (${kid.name}): ${balance.date}`)
        success = true
        break
      } catch (err) {
        console.error(`[cron] Attempt ${attempt + 1}/${MAX_RETRIES} failed for kid ${kid.id}:`, err)
        if (attempt < MAX_RETRIES - 1) {
          const delay = BASE_DELAY_MS * Math.pow(2, attempt)
          console.log(`[cron] Retrying in ${delay}ms...`)
          await sleep(delay)
        }
      }
    }
    if (!success) {
      console.error(`[cron] FAILED to create balance for kid ${kid.id} (${kid.name}) after ${MAX_RETRIES} attempts`)
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

  // Run immediately on startup to catch up on any missed cron runs
  console.log('[cron] Running startup balance verification...')
  await createDailyBalancesForAllKids()
}
