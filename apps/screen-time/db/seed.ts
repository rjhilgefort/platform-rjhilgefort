import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { budgetTypes, earningTypes, kids, kidBudgetDefaults } from './schema'

config({ path: '.env.local' })

const main = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  const db = drizzle(pool)

  console.log('Seeding budget_types table...')
  const insertedBudgetTypes = await db
    .insert(budgetTypes)
    .values([
      { slug: 'tv', displayName: 'TV', allowCarryover: true, sortOrder: 1 },
      { slug: 'game', displayName: 'Games', allowCarryover: true, sortOrder: 2 },
    ])
    .onConflictDoNothing()
    .returning()

  console.log('Seeding earning_types table...')
  await db
    .insert(earningTypes)
    .values([
      { slug: 'chore', displayName: 'Chores', ratioNumerator: 1, ratioDenominator: 2, sortOrder: 1 },
      { slug: 'reading', displayName: 'Reading', ratioNumerator: 1, ratioDenominator: 1, sortOrder: 2 },
    ])
    .onConflictDoNothing()

  console.log('Seeding kids table...')
  const insertedKids = await db
    .insert(kids)
    .values([
      { name: 'Jesselin' },
      { name: 'Raelin' },
    ])
    .onConflictDoNothing()
    .returning()

  // Get all budget types and kids for creating defaults
  const allBudgetTypes = insertedBudgetTypes.length > 0
    ? insertedBudgetTypes
    : await db.select().from(budgetTypes)
  const allKids = insertedKids.length > 0
    ? insertedKids
    : await db.select().from(kids)

  console.log('Seeding kid_budget_defaults table...')
  const defaultsToInsert = allKids.flatMap((kid) =>
    allBudgetTypes.map((bt) => ({
      kidId: kid.id,
      budgetTypeId: bt.id,
      dailyBudgetMinutes: 60,
    }))
  )

  if (defaultsToInsert.length > 0) {
    await db
      .insert(kidBudgetDefaults)
      .values(defaultsToInsert)
      .onConflictDoNothing()
  }

  console.log('Seeding complete!')
  await pool.end()
}

main().catch(console.error)
