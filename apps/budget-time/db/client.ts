import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, { schema })

// Type that works for both the main db client and transaction objects
type TxParam = Parameters<(typeof db)['transaction']>[0]
type TxClient = Parameters<TxParam>[0]
export type DbClient = typeof db | TxClient
