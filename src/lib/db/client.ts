import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Lazily created — Cloudflare Workers only expose env vars during the request
// lifecycle, so this must never run at module load time (see nitro.config.ts /
// deployment notes for how DATABASE_URL is provided in each environment).
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function getDb() {
  if (_db) return _db

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Copy .env.example to .env and point it at a Postgres database (see README-DEPLOY.md).',
    )
  }

  const client = postgres(connectionString, { prepare: false })
  _db = drizzle(client, { schema })
  return _db
}
