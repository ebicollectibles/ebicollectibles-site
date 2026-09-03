import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import { inArray } from 'drizzle-orm'
import postgres from 'postgres'
import { products, orderCounters } from '../src/lib/db/schema'

// Retired products — no longer sold, so drop these specific rows every time
// this script runs. Listed by id (not "anything outside SEED_PRODUCTS") so
// this can never delete a product added later through the admin panel.
const RETIRED_PRODUCT_IDS = ['tera', 'glory', 'partner', 'eevee', 'moon', 'prism', 'storage', 'peace', 'light']

const SEED_PRODUCTS = [
  {
    id: 'gem6',
    name: 'Gem Pack Vol. 6 — Pokémon Booster Box',
    code: 'CBB6C',
    type: 'Booster box',
    price: 34.95,
    stock: 22,
    img: '/assets/gem-vol6.png',
  },
  {
    id: 'gem5',
    name: 'Gem Pack Vol. 5 — Pokémon Booster Box',
    code: 'CBB5C',
    type: 'Booster box',
    price: 32.95,
    stock: 4,
    img: '/assets/gem-vol5.png',
  },
  {
    id: 'gem4',
    name: 'Gem Pack Vol. 4 — Pokémon Booster Box',
    code: 'CBB4C',
    type: 'Booster box',
    price: 29.95,
    stock: 0,
    img: '/assets/gem-vol4.png',
  },
]

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL is not set')

  const client = postgres(connectionString, { prepare: false })
  const db = drizzle(client)

  for (const p of SEED_PRODUCTS) {
    await db
      .insert(products)
      .values(p)
      .onConflictDoUpdate({
        target: products.id,
        set: { ...p, updatedAt: new Date() },
      })
  }

  await db
    .insert(orderCounters)
    .values({ id: 'main', nextOrderNo: 40218 })
    .onConflictDoNothing({ target: orderCounters.id })

  const deleted = await db
    .delete(products)
    .where(inArray(products.id, RETIRED_PRODUCT_IDS))
    .returning({ id: products.id })

  console.log(`Seeded ${SEED_PRODUCTS.length} products. Removed ${deleted.length} retired product(s).`)
  await client.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
