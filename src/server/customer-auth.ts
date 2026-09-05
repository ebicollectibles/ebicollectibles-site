import { createServerFn, createServerOnlyFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'

interface CustomerSessionData {
  userId?: string
}

// Same pattern as admin-auth.ts: wrapped in createServerOnlyFn so the
// bundler strips the server-only import out of the client build.
const readCustomerSession = createServerOnlyFn(async (): Promise<string | null> => {
  const { getSession } = await import('@tanstack/react-start/server')
  const session = await getSession<CustomerSessionData>(sessionConfig())
  return session.data.userId ?? null
})

const writeCustomerSession = createServerOnlyFn(async (userId: string | null): Promise<void> => {
  if (userId) {
    const { updateSession } = await import('@tanstack/react-start/server')
    await updateSession<CustomerSessionData>(sessionConfig(), { userId })
  } else {
    const { clearSession } = await import('@tanstack/react-start/server')
    await clearSession(sessionConfig())
  }
})

function sessionConfig() {
  const password = process.env.SESSION_SECRET
  if (!password || password.length < 32) {
    throw new Error('SESSION_SECRET must be set to a random string of at least 32 characters (see .env.example).')
  }
  return {
    password,
    name: 'ebi_customer',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  }
}

/** Server-only helper for other server functions (e.g. placeOrder) to tag an order with the logged-in customer, if any. */
export const getCurrentUserId = readCustomerSession

export const getCurrentCustomer = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await readCustomerSession()
  if (!userId) return null
  const { getDb } = await import('~/lib/db/client')
  const { users } = await import('~/lib/db/schema')
  const { eq } = await import('drizzle-orm')
  const db = getDb()
  const [user] = await db.select({ id: users.id, email: users.email, name: users.name }).from(users).where(eq(users.id, userId)).limit(1)
  return user ?? null
})

/** Redirects to the login page — use in route `beforeLoad` for account pages. */
export async function requireCustomer() {
  if (!(await getCurrentCustomer())) {
    throw redirect({ to: '/account/login' })
  }
}

export const customerLogout = createServerFn({ method: 'POST' }).handler(async () => {
  await writeCustomerSession(null)
  return { ok: true }
})

export const setCustomerSession = writeCustomerSession

// --- Lightweight auth/security event log — see schema.ts's authEvents comment. ---

export type AuthEventType = 'signup' | 'login' | 'login_failed' | 'google_link' | 'password_reset' | 'email_verified'

export async function recordAuthEvent(opts: { userId?: string | null; email?: string | null; type: AuthEventType }) {
  const { getDb } = await import('~/lib/db/client')
  const { authEvents } = await import('~/lib/db/schema')
  const db = getDb()
  await db.insert(authEvents).values({ userId: opts.userId ?? null, email: opts.email ?? null, type: opts.type })
}

export async function touchLastLogin(userId: string) {
  const { getDb } = await import('~/lib/db/client')
  const { users } = await import('~/lib/db/schema')
  const { eq } = await import('drizzle-orm')
  const db = getDb()
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, userId))
}

// --- Email verification codes ---

/** False in local dev when Resend isn't configured — signup/login skip verification entirely rather than leave someone stuck with no way to receive a code. */
export function resendConfigured(): boolean {
  return !!(process.env.RESEND_API_KEY && process.env.ORDER_FROM_EMAIL)
}

function generateVerificationCode(): string {
  const bytes = new Uint32Array(1)
  crypto.getRandomValues(bytes)
  return String(bytes[0] % 1_000_000).padStart(6, '0')
}

/** Generates a fresh 6-digit code (replacing any pending one), emails it, and lets a send failure propagate — unlike order-confirmation email, there's no fallback way to deliver this. */
export async function sendVerificationCode(userId: string, email: string) {
  const { getDb } = await import('~/lib/db/client')
  const { emailVerificationCodes } = await import('~/lib/db/schema')
  const db = getDb()
  const code = generateVerificationCode()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
  await db
    .insert(emailVerificationCodes)
    .values({ userId, code, expiresAt, attempts: 0 })
    .onConflictDoUpdate({ target: emailVerificationCodes.userId, set: { code, expiresAt, attempts: 0 } })

  const { sendVerificationCodeEmail } = await import('./email')
  await sendVerificationCodeEmail({ email, code })
}
