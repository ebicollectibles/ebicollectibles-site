import { Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'
import * as schema from './schema'

/**
 * neon-http (client.ts) can't do multi-statement transactions — each query
 * is a stateless HTTP call. Placing an order needs an atomic
 * stock-decrement + order + order_items insert, so this opens a real
 * (WebSocket-based) connection scoped to a single request, runs one
 * transaction, and closes it. Never cache/reuse this across requests —
 * same reasoning as the raw-TCP issue this whole file exists to avoid.
 */
type Db = ReturnType<typeof drizzle<typeof schema>>
type Tx = Parameters<Db['transaction']>[0] extends (tx: infer T) => any ? T : never

export async function withTransaction<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Copy .env.example to .env and point it at a Postgres database (see README-DEPLOY.md).',
    )
  }

  const pool = new Pool({ connectionString })
  const db = drizzle(pool, { schema })
  try {
    return await db.transaction(fn)
  } finally {
    await pool.end()
  }
}
