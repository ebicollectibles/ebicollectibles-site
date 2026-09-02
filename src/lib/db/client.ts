import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Cloudflare Workers must not reuse a raw TCP socket across separate
// requests (each request can land on a different isolate, or find the
// previous one's socket already torn down) — that's what was causing
// intermittent "works on retry" query failures with a cached postgres.js
// connection. Neon's HTTP driver is stateless per query (plain fetch under
// the hood), which sidesteps that whole class of bug and is what Neon
// recommends for serverless/edge runtimes. Local tooling (migrate/seed)
// still uses a normal Postgres connection since those run on a real
// machine, not inside a Worker — see drizzle.config.ts / scripts/seed.ts.
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function getDb() {
  if (_db) return _db

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Copy .env.example to .env and point it at a Postgres database (see README-DEPLOY.md).',
    )
  }

  const sql = neon(connectionString)
  _db = drizzle(sql, { schema })
  return _db
}
