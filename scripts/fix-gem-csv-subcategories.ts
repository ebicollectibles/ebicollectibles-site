// One-off: "Gem Series" and "CSV Series" used to be subcategories — they're
// free-form tags now (see ProductSubcategory in src/lib/products.ts), since
// they're really collection/series names rather than a product type, and
// they don't exist as subcategories anymore. Any product still
// subcategorized this way needs fixing before its admin edit page works
// right (the subcategory dropdown won't have a matching option otherwise).
//
// Moves the old subcategory value into tags and reassigns subcategory to
// "Booster Box". Run this AFTER migration 0032 (adds the tags column).
// Safe to re-run: once a row's subcategory becomes "Booster Box" it no
// longer matches the WHERE clause, so it's never touched twice.
// Same target/confirmation pattern as update-product-image-paths.ts:
// `npx tsx scripts/fix-gem-csv-subcategories.ts <dev|prod>`.
import { config } from 'dotenv'
import { existsSync } from 'node:fs'
import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { drizzle } from 'drizzle-orm/postgres-js'
import { inArray, sql } from 'drizzle-orm'
import postgres from 'postgres'
import { products } from '../src/lib/db/schema'

const target = process.argv[2] // 'dev' or 'prod'
if (target !== 'dev' && target !== 'prod') {
  console.error('Usage: npx tsx scripts/fix-gem-csv-subcategories.ts <dev|prod>')
  process.exit(1)
}
const envFile = `.env.${target}`

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

if (target === 'prod') {
  console.log(`\n⚠️  This will update PRODUCTION: ${host}\n`)
  const rl = readline.createInterface({ input: stdin, output: stdout })
  const answer = await rl.question('Type "yes" to continue: ')
  rl.close()
  if (answer.trim().toLowerCase() !== 'yes') {
    console.log('Cancelled — nothing was changed.')
    process.exit(0)
  }
} else {
  console.log(`\nUpdating DEV: ${host}\n`)
}

const sqlClient = postgres(process.env.DATABASE_URL)
const db = drizzle(sqlClient, { schema: { products } })

const result = await db
  .update(products)
  .set({
    tags: sql`array_append(${products.tags}, ${products.subcategory})`,
    subcategory: 'Booster Box',
    updatedAt: new Date(),
  })
  .where(inArray(products.subcategory, ['Gem Series', 'CSV Series']))
  .returning({ id: products.id, name: products.name })

if (result.length === 0) {
  console.log('Nothing to fix — no products are still subcategorized "Gem Series" or "CSV Series".')
} else {
  console.log(`Fixed ${result.length} product${result.length === 1 ? '' : 's'}:`)
  for (const p of result) console.log(`  ✓ ${p.name} (${p.id}) — subcategory set to "Booster Box", old value added as a tag`)
}

await sqlClient.end()
