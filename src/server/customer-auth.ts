import { createServerFn, createServerOnlyFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'

/**
 * Server-only helper for other server functions (e.g. placeOrder) to tag an
 * order with the logged-in customer, if any. Resolves Clerk's session to
 * our own users.id via the clerkUserId column. The common case is a plain
 * lookup (the row was already created by syncClerkUser right after
 * sign-in) — but falls back to finding/creating it here too, so a Clerk
 * session that somehow never got synced (an interrupted sign-in, a stale
 * session from before this linking existed, etc.) is self-healing instead
 * of leaving someone stuck signed into Clerk with no way to reach their
 * account or account pages.
 */
export const getCurrentUserId = createServerOnlyFn(async (): Promise<string | null> => {
  const { auth } = await import('@clerk/tanstack-react-start/server')
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) return null
  const { getDb } = await import('~/lib/db/client')
  const { users } = await import('~/lib/db/schema')
  const { eq } = await import('drizzle-orm')
  const db = getDb()
  const [row] = await db.select({ id: users.id }).from(users).where(eq(users.clerkUserId, clerkUserId)).limit(1)
  if (row) return row.id
  return findOrCreateUserForClerkSession(clerkUserId)
})

export const getCurrentCustomer = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await getCurrentUserId()
  if (!userId) return null
  const { getCustomerScopedRows } = await import('~/lib/db/client')
  const [userRows] = await getCustomerScopedRows(userId, (sql) => [sql`select id, email, name from users where id = ${userId} limit 1`])
  return (userRows[0] as { id: string; email: string; name: string | null } | undefined) ?? null
})

/** Redirects to the login page — use in route `beforeLoad` for account pages. */
export async function requireCustomer() {
  if (!(await getCurrentCustomer())) {
    throw redirect({ to: '/account/login' })
  }
}

/**
 * Finds or creates the users row for a given Clerk session. Looked up by
 * clerkUserId first; a case-insensitive email match links a pre-existing
 * guest-order account (or a pre-migration account) instead of creating a
 * duplicate. A brand-new row also claims any past guest orders under that
 * email, same as the old signup flow did. Shared by syncClerkUser (the
 * explicit post-sign-in call) and getCurrentUserId's self-healing fallback
 * above — kept out of the hot path there (this does a Clerk API call plus
 * writes) by only ever being reached once per session that actually needs
 * linking; every call after that hits the plain lookup instead.
 */
async function findOrCreateUserForClerkSession(clerkUserId: string): Promise<string> {
  const { getDb } = await import('~/lib/db/client')
  const { users } = await import('~/lib/db/schema')
  const { eq, sql } = await import('drizzle-orm')
  const db = getDb()

  const [byClerkId] = await db.select({ id: users.id }).from(users).where(eq(users.clerkUserId, clerkUserId)).limit(1)
  if (byClerkId) return byClerkId.id

  const { clerkClient } = await import('@clerk/tanstack-react-start/server')
  const clerkUser = await clerkClient().users.getUser(clerkUserId)
  const primaryEmail =
    clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress
  if (!primaryEmail) throw new Error('This account has no email address.')
  const email = primaryEmail.toLowerCase()
  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null

  const [byEmail] = await db.select({ id: users.id }).from(users).where(sql`lower(${users.email}) = ${email}`).limit(1)
  if (byEmail) {
    await db.update(users).set({ clerkUserId }).where(eq(users.id, byEmail.id))
    return byEmail.id
  }

  const [created] = await db.insert(users).values({ clerkUserId, email, name, emailVerifiedAt: new Date() }).returning({ id: users.id })
  const { linkGuestOrders } = await import('./customers')
  await linkGuestOrders(db, created.id, email)
  await recordAuthEvent({ userId: created.id, email, type: 'signup' })
  return created.id
}

/** Called client-side right after Clerk's setActive() resolves on sign-in or sign-up. */
export const syncClerkUser = createServerFn({ method: 'POST' }).handler(async () => {
  const { auth } = await import('@clerk/tanstack-react-start/server')
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) throw new Error('Not signed in.')
  const id = await findOrCreateUserForClerkSession(clerkUserId)
  await touchLastLogin(id)
  return { id }
})

// --- Lightweight auth/security event log — see schema.ts's authEvents comment. ---

export type AuthEventType =
  | 'signup'
  | 'login'
  | 'login_failed'
  | 'google_link'
  | 'password_reset'
  | 'email_verified'
  | 'admin_login'
  | 'admin_login_failed'
  | 'verification_code_sent'
  | 'password_reset_code_sent'
  // A Google-only account setting its first password — distinct from
  // password_reset (which implies one already existed).
  | 'password_set'

export async function recordAuthEvent(opts: { userId?: string | null; email?: string | null; type: AuthEventType }) {
  const { getDb } = await import('~/lib/db/client')
  const { authEvents } = await import('~/lib/db/schema')
  const { captureRequestSignals } = await import('./request-signals')
  const signals = await captureRequestSignals()
  const db = getDb()
  await db.insert(authEvents).values({
    userId: opts.userId ?? null,
    email: opts.email ?? null,
    type: opts.type,
    ipAddress: signals.ipAddress,
    asn: signals.asn,
    asOrganization: signals.asOrganization,
    country: signals.country,
  })
}

export async function touchLastLogin(userId: string) {
  const { getDb } = await import('~/lib/db/client')
  const { users } = await import('~/lib/db/schema')
  const { eq } = await import('drizzle-orm')
  const db = getDb()
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, userId))
}
