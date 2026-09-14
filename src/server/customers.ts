import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { hashPassword, verifyPassword } from '~/lib/auth/password'
import {
  getCurrentUserId,
  setCustomerSession,
  recordAuthEvent,
  touchLastLogin,
  resendConfigured,
  sendVerificationCode,
  sendPasswordResetCode,
} from './customer-auth'
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

// Thrown verbatim (not just similar wording) so the login page can detect
// this specific case and offer a "Set a password" action instead of
// showing it as a plain error — see login.tsx.
export const GOOGLE_NO_PASSWORD_ERROR = "This account was created with Google — you haven't set a password yet."

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
    const { isLoginRateLimited } = await import('./rate-limit')
    // IP-only (not per-email, unlike login/code rate limits) — a fresh
    // account uses a new email every time by definition, so an email-scoped
    // check would never catch signup spam from one IP.
    if (await isLoginRateLimited({ type: 'signup', maxAttempts: 10, windowMinutes: 60 })) {
      throw new Error('Too many accounts created recently — try again later.')
    }

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

    const { isLoginRateLimited } = await import('./rate-limit')
    if (await isLoginRateLimited({ type: 'login_failed', email, maxAttempts: 10, windowMinutes: 15 })) {
      throw new Error('Too many failed attempts — try again in a few minutes.')
    }

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (!user) {
      await recordAuthEvent({ email, type: 'login_failed' })
      throw new Error('Incorrect email or password.')
    }
    if (!user.passwordHash) {
      await recordAuthEvent({ userId: user.id, email, type: 'login_failed' })
      throw new Error(GOOGLE_NO_PASSWORD_ERROR)
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
      // Already verified — this is a duplicate/retry of a request that
      // already succeeded (the browser already holds that response's
      // session cookie). Never grant a session here without checking the
      // code: doing so let anyone log in as any verified account just by
      // knowing its email, since data.code was never inspected on this
      // branch.
      return { ok: true }
    }

    const [pending] = await db.select().from(emailVerificationCodes).where(eq(emailVerificationCodes.userId, user.id)).limit(1)
    if (!pending) throw new Error('No verification code pending — request a new one.')
    if (pending.expiresAt.getTime() < Date.now()) throw new Error('That code expired — request a new one.')
    if (pending.attempts >= 5) throw new Error('Too many incorrect attempts — request a new code.')

    const { timingSafeEqual } = await import('~/lib/auth/password')
    if (!timingSafeEqual(pending.code, data.code.trim())) {
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

export const requestPasswordReset = createServerFn({ method: 'POST' })
  .validator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    const { getDb } = await import('~/lib/db/client')
    const { users } = await import('~/lib/db/schema')
    const { eq } = await import('drizzle-orm')
    const db = getDb()
    const email = normalizeEmail(data.email)

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (!user) throw new Error('No account found with that email.')
    // Deliberately allowed even with no passwordHash yet — a Google-only
    // account uses this same emailed-code flow to set its first password
    // (see resetPasswordWithCode below, and login.tsx's "Set a password"
    // prompt), not just to replace an existing one.

    await sendPasswordResetCode(user.id, email)
    return { ok: true }
  })

export const resetPasswordWithCode = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      email: z.string().email(),
      code: z.string().min(1),
      newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
    }),
  )
  .handler(async ({ data }) => {
    const { getDb } = await import('~/lib/db/client')
    const { users, passwordResetCodes } = await import('~/lib/db/schema')
    const { eq } = await import('drizzle-orm')
    const db = getDb()
    const email = normalizeEmail(data.email)

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (!user) throw new Error('Account not found.')

    const [pending] = await db.select().from(passwordResetCodes).where(eq(passwordResetCodes.userId, user.id)).limit(1)
    if (!pending) throw new Error('No reset code pending — request a new one.')
    if (pending.expiresAt.getTime() < Date.now()) throw new Error('That code expired — request a new one.')
    if (pending.attempts >= 5) throw new Error('Too many incorrect attempts — request a new code.')

    const { timingSafeEqual } = await import('~/lib/auth/password')
    if (!timingSafeEqual(pending.code, data.code.trim())) {
      await db
        .update(passwordResetCodes)
        .set({ attempts: pending.attempts + 1 })
        .where(eq(passwordResetCodes.userId, user.id))
      throw new Error('Incorrect code.')
    }

    const isFirstPassword = !user.passwordHash
    const passwordHash = await hashPassword(data.newPassword)
    await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, user.id))
    await db.delete(passwordResetCodes).where(eq(passwordResetCodes.userId, user.id))
    await setCustomerSession(user.id)
    await recordAuthEvent({ userId: user.id, email, type: isFirstPassword ? 'password_set' : 'password_reset' })
    await touchLastLogin(user.id)
    return { ok: true }
  })

export const resendPasswordResetCode = createServerFn({ method: 'POST' })
  .validator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    const { getDb } = await import('~/lib/db/client')
    const { users } = await import('~/lib/db/schema')
    const { eq } = await import('drizzle-orm')
    const db = getDb()
    const email = normalizeEmail(data.email)

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (!user) throw new Error('Account not found.')
    // Same reasoning as requestPasswordReset above — a Google-only account
    // can resend its "set a password" code the same as anyone resending a
    // reset code.

    await sendPasswordResetCode(user.id, email)
    return { ok: true }
  })

// For a logged-in customer setting their first password (currently only
// reachable from a Google-only account, via the profile page) — no emailed
// code needed here, unlike requestPasswordReset/resetPasswordWithCode:
// the active session already proves who they are, so this would just be a
// pointless extra round trip for someone who's already sitting in their
// own account.
export const setPassword = createServerFn({ method: 'POST' })
  .validator(z.object({ newPassword: z.string().min(8, 'Password must be at least 8 characters.') }))
  .handler(async ({ data }) => {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('Not logged in.')

    const { getDb } = await import('~/lib/db/client')
    const { users } = await import('~/lib/db/schema')
    const { eq } = await import('drizzle-orm')
    const db = getDb()

    const [user] = await db.select({ passwordHash: users.passwordHash }).from(users).where(eq(users.id, userId)).limit(1)
    if (!user) throw new Error('Not logged in.')
    // Deliberately narrow: only for setting a *first* password. Changing an
    // existing one this easily — no current-password confirmation, just an
    // active session — would let anyone who hijacks a session (30-day
    // cookie) lock the real owner out permanently. A Google-only account
    // has no such password to protect yet, so there's nothing to lock
    // someone out of here.
    if (user.passwordHash) throw new Error('This account already has a password set.')

    const passwordHash = await hashPassword(data.newPassword)
    await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, userId))
    await recordAuthEvent({ userId, type: 'password_set' })
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

export const getMyOrder = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('Not logged in.')

    const { getDb } = await import('~/lib/db/client')
    const { orderItems, orders } = await import('~/lib/db/schema')
    const { eq } = await import('drizzle-orm')
    const db = getDb()

    const [order] = await db.select().from(orders).where(eq(orders.id, data.id)).limit(1)
    if (!order || order.userId !== userId) return null

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, data.id))
    return { ...order, items }
  })
