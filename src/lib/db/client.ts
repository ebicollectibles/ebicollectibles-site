import { neon } from '@neondatabase/serverless'
import type { NeonQueryFunction, NeonQueryPromise } from '@neondatabase/serverless'
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

// --- RLS-scoped reads (customer-facing) ---
//
// drizzle-orm's neon-http driver has no .transaction() support (it throws
// "No transactions support in neon-http driver"), so customer-scoped reads
// go through the raw @neondatabase/serverless sql.transaction() instead —
// it batches several statements into one non-interactive Postgres
// transaction over a single HTTP call. That matters here specifically
// because set_config(..., true) is transaction-local: it would be
// discarded before a second, separate HTTP call ever saw it. Bypasses
// Drizzle's schema mapping (raw snake_case columns back), so results are
// converted below instead.
type CustomerSql = NeonQueryFunction<false, false>

let _customerSql: CustomerSql | null = null

function getCustomerSql(): CustomerSql {
  if (_customerSql) return _customerSql
  const connectionString = process.env.CUSTOMER_DATABASE_URL
  if (!connectionString) {
    throw new Error('CUSTOMER_DATABASE_URL is not set. See scripts/rls-setup.sql and .env.example.')
  }
  _customerSql = neon(connectionString)
  return _customerSql
}

function toCamelRow(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(row)) {
    out[key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase())] = value
  }
  return out
}

// numeric/decimal columns come back from the raw driver as strings (full
// Postgres numeric precision doesn't fit safely in a JS number) — Drizzle's
// schema declares these with `mode: 'number'` and converts them for every
// other query path in the app, so these raw reads convert the same fields
// by hand to match what the rest of the app expects.
const NUMERIC_FIELDS = new Set(['subtotal', 'shippingCost', 'tax', 'total', 'creditApplied', 'unitPrice'])

function coerceNumerics(row: Record<string, unknown>): Record<string, unknown> {
  for (const field of NUMERIC_FIELDS) {
    if (row[field] != null) row[field] = Number(row[field])
  }
  return row
}

function mapRows<T>(rows: Record<string, unknown>[]): T[] {
  return rows.map((row) => coerceNumerics(toCamelRow(row))) as T[]
}

/**
 * Runs `statements` (each built from the `sql` tagged template passed into
 * the callback) as one RLS-scoped transaction: `app.user_id` is set first,
 * then every statement after it runs with that value visible to the
 * customer_select_own_* policies from scripts/rls-setup.sql. Returns the
 * per-statement row arrays, camelCased and with known numeric fields
 * converted back to JS numbers.
 */
export async function getCustomerScopedRows(
  userId: string,
  buildStatements: (sql: CustomerSql) => NeonQueryPromise<false, false, Record<string, unknown>[]>[],
) {
  const sql = getCustomerSql()
  const results = await sql.transaction([sql`select set_config('app.user_id', ${userId}, true)`, ...buildStatements(sql)])
  return results.slice(1).map((rows) => mapRows(rows as Record<string, unknown>[]))
}
