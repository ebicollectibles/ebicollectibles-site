import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { hashPassword, verifyPassword } from '~/lib/auth/password'
import { getCurrentUserId, setCustomerSession } from './customer-auth'
import type { getDb } from '~/lib/db/client'

// Db/schema imports are dynamic (not top-level) throughout this file —
// same reasoning as admin-auth.ts/customer-auth.ts: keeps the Postgres
// driver out of the client bundle. A top-level import here was pulling
// `postgres`/`drizzle-orm/postgres-js` into the browser bundle in dev
// (crashing with "Buffer is not defined", a Node-only global) even though
// every actual DB call only ever happens inside a server-only handler body.

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** Claims any guest orders placed under this email before the account existed. Also used by google-auth.ts. */
export async function linkGuestOrders(db: ReturnType<typeof getDb>, userId: string, email: string) {
  const { orders } = await import('~/lib/db/schema')
  const { and, isNull, sql } = await import('drizzle-orm')
  await db
    .update(orders)
    .set({ userId })
    .where(and(sql`lower(${orders.email}) = ${email}`, isNull(orders.userId)))
}

export const customerSignup = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      email: z.string().email(),
      password: z.string().min(8, 'Password must be at least 8 characters.'),
      name: z.string().optional().default(''),
    }),
  )
  .handler(async ({ data }) => {
    const { getDb } = await import('~/lib/db/client')
    const { users } = await import('~/lib/db/schema')
    const { eq } = await import('drizzle-orm')
    const db = getDb()
    const email = normalizeEmail(data.email)

    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1)
    if (existing) {
      throw new Error('An account with this email already exists — log in instead.')
    }

    const passwordHash = await hashPassword(data.password)
    const [user] = await db
      .insert(users)
      .values({ email, passwordHash, name: data.name || null })
      .returning({ id: users.id })

    await linkGuestOrders(db, user.id, email)
    await setCustomerSession(user.id)
    return { ok: true }
  })

export const customerLogin = createServerFn({ method: 'POST' })
  .validator(z.object({ email: z.string().email(), password: z.string() }))
  .handler(async ({ data }) => {
    const { getDb } = await import('~/lib/db/client')
    const { users } = await import('~/lib/db/schema')
    const { eq } = await import('drizzle-orm')
    const db = getDb()
    const email = normalizeEmail(data.email)

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (!user) {
      throw new Error('Incorrect email or password.')
    }
    if (!user.passwordHash) {
      throw new Error('This account uses Google sign-in — continue with Google instead.')
    }
    const valid = await verifyPassword(data.password, user.passwordHash)
    if (!valid) {
      throw new Error('Incorrect email or password.')
    }

    await setCustomerSession(user.id)
    return { ok: true }
  })

export const getMyOrders = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('Not logged in.')

  const { getDb } = await import('~/lib/db/client')
  const { orderItems, orders } = await import('~/lib/db/schema')
  const { desc, eq, inArray } = await import('drizzle-orm')
  const db = getDb()

  const orderRows = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt))
  const itemRows =
    orderRows.length === 0
      ? []
      : await db
          .select()
          .from(orderItems)
          .where(
            inArray(
              orderItems.orderId,
              orderRows.map((o) => o.id),
            ),
          )
  const itemsByOrder = new Map<string, typeof itemRows>()
  for (const item of itemRows) {
    const list = itemsByOrder.get(item.orderId) ?? []
    list.push(item)
    itemsByOrder.set(item.orderId, list)
  }
  return orderRows.map((order) => ({ ...order, items: itemsByOrder.get(order.id) ?? [] }))
})
