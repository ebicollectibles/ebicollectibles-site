import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { products, orderCounters } from '../src/lib/db/schema'

// Retired category — no longer sold, so drop any leftover rows every time
// this script runs (not just skip seeding new ones).
const RETIRED_TYPES = ['Single pack']

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
  {
    id: 'tera',
    name: 'Terastal Gathering — Pokémon Booster Box',
    code: 'CSV9.5C',
    type: 'Booster box',
    price: 94.95,
    stock: 11,
    placeholder: 'product shot / sealed box front',
  },
  {
    id: 'glory',
    name: 'Chasing Glory Together — Battle Box',
    code: 'CSV10C',
    type: 'Special box',
    price: 109.95,
    stock: 30,
    preorder: true,
    placeholder: 'product shot / battle box',
  },
  {
    id: 'partner',
    name: '30th Anniversary First Partner Set Vol. 3',
    code: 'CPS3C',
    type: 'Special box',
    price: 16.95,
    stock: 48,
    placeholder: 'product shot / card set',
  },
  {
    id: 'eevee',
    name: 'Dream Painting Eevee Figure Mystery Box',
    code: 'CSV9.5C',
    type: 'Figures',
    price: 34.95,
    stock: 7,
    placeholder: 'product shot / figure box',
  },
  {
    id: 'moon',
    name: 'Mid-Autumn Festival Exclusive Gift Box',
    code: 'CGB2C',
    type: 'Special box',
    price: 39.95,
    stock: 3,
    placeholder: 'product shot / gift box',
  },
  {
    id: 'prism',
    name: 'Stellar Prism — Pokémon Booster Box',
    code: 'CSV8C',
    type: 'Booster box',
    price: 69.95,
    stock: 15,
    placeholder: 'product shot / sealed box front',
  },
  {
    id: 'storage',
    name: 'Crystal Gathering Storage Box (Random)',
    code: 'CGA1C',
    type: 'Figures',
    price: 23.95,
    stock: 19,
    placeholder: 'product shot / storage box',
  },
  {
    id: 'peace',
    name: 'Poképeace Nap Series Blind Box',
    code: 'PP-NAP',
    type: 'Figures',
    price: 11.95,
    stock: 62,
    placeholder: 'product shot / blind box',
  },
  {
    id: 'light',
    name: 'Hollybox Light-Up Figure — Random',
    code: 'HB-LF1',
    type: 'Figures',
    price: 22.95,
    stock: 0,
    placeholder: 'product shot / figure',
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

  let retired = 0
  for (const type of RETIRED_TYPES) {
    const deleted = await db.delete(products).where(eq(products.type, type)).returning({ id: products.id })
    retired += deleted.length
  }

  console.log(`Seeded ${SEED_PRODUCTS.length} products. Removed ${retired} retired-category product(s).`)
  await client.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
