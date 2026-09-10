// One-off: repoints gem6/gem5/gem4's `img` column from the old oversized
// PNGs (1.6-3.4MB each) to the newly-optimized JPEGs (~90-330KB, same visual
// quality) added alongside them in public/assets. Only touches rows still
// pointing at the old .png path — safe to re-run, and won't clobber a photo
// you've since changed via the admin panel to something else entirely.
// Same target/confirmation pattern as migrate-target.mjs: `node
// scripts/update-product-image-paths.mjs dev` or `prod`.
import { config } from 'dotenv'
import { existsSync } from 'node:fs'
import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { drizzle } from 'drizzle-orm/postgres-js'
import { eq, and } from 'drizzle-orm'
import postgres from 'postgres'
import { products } from '../src/lib/db/schema'

const target = process.argv[2] // 'dev' or 'prod'
if (target !== 'dev' && target !== 'prod') {
  console.error('Usage: node scripts/update-product-image-paths.mjs <dev|prod>')
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

const REPOINTS = [
  { id: 'gem6', from: '/assets/gem-vol6.png', to: '/assets/gem-vol6.jpg' },
  { id: 'gem5', from: '/assets/gem-vol5.png', to: '/assets/gem-vol5.jpg' },
  { id: 'gem4', from: '/assets/gem-vol4.png', to: '/assets/gem-vol4.jpg' },
]

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

const sql = postgres(process.env.DATABASE_URL)
const db = drizzle(sql, { schema: { products } })

for (const { id, from, to } of REPOINTS) {
  const result = await db
    .update(products)
    .set({ img: to, updatedAt: new Date() })
    .where(and(eq(products.id, id), eq(products.img, from)))
    .returning({ id: products.id })
  console.log(result.length > 0 ? `✓ ${id}: ${from} -> ${to}` : `- ${id}: skipped (img isn't "${from}" anymore)`)
}

await sql.end()
console.log('\nDone. The old .png files can be deleted from public/assets once you\'ve confirmed the new images look right on the live site.')
