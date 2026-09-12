// One-time pre-launch cleanup: deletes every row of test data accumulated
// while building the site — fake products, test orders/payments, test
// customer accounts, test subscribers — and resets the order counter back
// to #1 so the first real order after launch is order #1. Leaves the
// schema, admin password, and Square/env config untouched.
//
// Same target/confirmation pattern as migrate-target.mjs and
// update-product-image-paths.ts: `npx tsx scripts/wipe-test-data.ts dev` or
// `prod`. Confirmation is required for BOTH targets (not just prod) since
// this is unusually destructive — there is no undo without a DB backup.
import { config } from 'dotenv'
import { existsSync } from 'node:fs'
import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import {
  authEvents,
  emailEvents,
  emailVerificationCodes,
  orderCounters,
  orderItems,
  orderStatusEvents,
  orders,
  passwordResetCodes,
  paymentAttempts,
  productEditEvents,
  products,
  refundEvents,
  shipmentItems,
  shipments,
  subscriberEvents,
  subscribers,
  users,
} from '../src/lib/db/schema'

const target = process.argv[2] // 'dev' or 'prod'
if (target !== 'dev' && target !== 'prod') {
  console.error('Usage: npx tsx scripts/wipe-test-data.ts <dev|prod>')
  process.exit(1)
}
const envFile = `.env.${target}`
const label = target.toUpperCase()

if (!existsSync(envFile)) {
  console.error(`\n${envFile} not found — see README-DEPLOY.md "Database" section.\n`)
  process.exit(1)
}
config({ path: envFile, override: true })
if (!process.env.DATABASE_URL) {
  console.error(`${envFile} exists but has no DATABASE_URL line in it.`)
  process.exit(1)
}

const host = new URL(process.env.DATABASE_URL).host

console.log(`\n⚠️  This will PERMANENTLY DELETE all products, orders, payment records,`)
console.log(`customer accounts, and subscribers on ${label} (${host}).`)
console.log(`There is no undo without a database backup.\n`)
const rl = readline.createInterface({ input: stdin, output: stdout })
const answer = await rl.question(`Type "wipe ${target}" to continue: `)
rl.close()
if (answer.trim().toLowerCase() !== `wipe ${target}`) {
  console.log('Cancelled — nothing was changed.')
  process.exit(0)
}

const sql = postgres(process.env.DATABASE_URL)
const db = drizzle(sql, {
  schema: {
    authEvents,
    emailEvents,
    emailVerificationCodes,
    orderCounters,
    orderItems,
    orderStatusEvents,
    orders,
    passwordResetCodes,
    paymentAttempts,
    productEditEvents,
    products,
    refundEvents,
    shipmentItems,
    shipments,
    subscriberEvents,
    subscribers,
    users,
  },
})

// Children before parents throughout, regardless of each FK's own onDelete
// behavior (some are 'set null', which would otherwise leave orphaned rows
// behind instead of actually deleting them).
async function wipe(name: string, table: any) {
  const result = await db.delete(table).returning()
  console.log(`✓ ${name}: ${result.length} row(s) deleted`)
}

await wipe('shipment_items', shipmentItems)
await wipe('shipments', shipments)
await wipe('order_status_events', orderStatusEvents)
await wipe('refund_events', refundEvents)
await wipe('email_events', emailEvents)
await wipe('order_items', orderItems)
await wipe('payment_attempts', paymentAttempts)
await wipe('orders', orders)
await wipe('product_edit_events', productEditEvents)
await wipe('products', products)
await wipe('email_verification_codes', emailVerificationCodes)
await wipe('password_reset_codes', passwordResetCodes)
await wipe('auth_events', authEvents)
await wipe('users', users)
await wipe('subscriber_events', subscriberEvents)
await wipe('subscribers', subscribers)

await db.update(orderCounters).set({ nextOrderNo: 1 }).where(eq(orderCounters.id, 'main'))
console.log('✓ order_counters: reset to #1')

await sql.end()
console.log(`\nDone. ${label} is now a clean slate — re-add real products from the admin panel.`)
