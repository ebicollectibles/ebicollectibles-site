import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { hashPassword, verifyPassword } from '~/lib/auth/password'
import { getCurrentUserId, setCustomerSession, recordAuthEvent, touchLastLogin, resendConfigured, sendVerificationCode } from './customer-auth'
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
    await recordAuthEvent({ userId: user.id, email, type: 'signup' })

    if (resendConfigured()) {
      await sendVerificationCode(user.id, email)
      return { verificationRequired: true, email }
    }

    // Resend isn't configured (local dev) — no way to deliver a code, so
    // skip verification rather than leave the account permanently stuck.
    await db.update(users).set({ emailVerifiedAt: new Date() }).where(eq(users.id, user.id))
    await setCustomerSession(user.id)
    await touchLastLogin(user.id)
    return { verificationRequired: false, email }
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
      await recordAuthEvent({ email, type: 'login_failed' })
      throw new Error('Incorrect email or password.')
    }
    if (!user.passwordHash) {
      await recordAuthEvent({ userId: user.id, email, type: 'login_failed' })
      throw new Error('This account uses Google sign-in — continue with Google instead.')
    }
    const valid = await verifyPassword(data.password, user.passwordHash)
    if (!valid) {
      await recordAuthEvent({ userId: user.id, email, type: 'login_failed' })
      throw new Error('Incorrect email or password.')
    }

    if (!user.emailVerifiedAt && resendConfigured()) {
      await sendVerificationCode(user.id, email)
      return { verificationRequired: true, email }
    }

    await setCustomerSession(user.id)
    await recordAuthEvent({ userId: user.id, email, type: 'login' })
    await touchLastLogin(user.id)
    return { verificationRequired: false, email }
  })

export const verifyEmailCode = createServerFn({ method: 'POST' })
  .validator(z.object({ email: z.string().email(), code: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getDb } = await import('~/lib/db/client')
    const { users, emailVerificationCodes } = await import('~/lib/db/schema')
    const { eq } = await import('drizzle-orm')
    const db = getDb()
    const email = normalizeEmail(data.email)

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (!user) throw new Error('Account not found.')

    if (user.emailVerifiedAt) {
      await setCustomerSession(user.id)
      await touchLastLogin(user.id)
      return { ok: true }
    }

    const [pending] = await db.select().from(emailVerificationCodes).where(eq(emailVerificationCodes.userId, user.id)).limit(1)
    if (!pending) throw new Error('No verification code pending — request a new one.')
    if (pending.expiresAt.getTime() < Date.now()) throw new Error('That code expired — request a new one.')
    if (pending.attempts >= 5) throw new Error('Too many incorrect attempts — request a new code.')

    if (pending.code !== data.code.trim()) {
      await db
        .update(emailVerificationCodes)
        .set({ attempts: pending.attempts + 1 })
        .where(eq(emailVerificationCodes.userId, user.id))
      throw new Error('Incorrect code.')
    }

    await db.update(users).set({ emailVerifiedAt: new Date() }).where(eq(users.id, user.id))
    await db.delete(emailVerificationCodes).where(eq(emailVerificationCodes.userId, user.id))
    await setCustomerSession(user.id)
    await recordAuthEvent({ userId: user.id, email, type: 'email_verified' })
    await touchLastLogin(user.id)
    return { ok: true }
  })

export const resendVerificationCode = createServerFn({ method: 'POST' })
  .validator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    const { getDb } = await import('~/lib/db/client')
    const { users } = await import('~/lib/db/schema')
    const { eq } = await import('drizzle-orm')
    const db = getDb()
    const email = normalizeEmail(data.email)

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (!user) throw new Error('Account not found.')
    if (user.emailVerifiedAt) return { ok: true }

    await sendVerificationCode(user.id, email)
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
