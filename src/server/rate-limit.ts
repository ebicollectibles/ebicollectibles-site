// Neither admin nor customer login had any brute-force protection — this
// closes that gap using data already being collected (auth_events +
// captureRequestSignals' IP). Deliberately per-IP, not per-account: locking
// out "the admin account" or "this customer's email" globally would let an
// attacker deny a real user their own login just by spamming failed
// attempts from anywhere. Skips enforcement entirely when the IP is
// unknown (local dev, or the rare request Cloudflare doesn't tag) rather
// than either no-op silently succeeding for everyone or risk lumping every
// such request into one shared bucket.

export async function isLoginRateLimited(opts: {
  type: 'login_failed' | 'admin_login_failed'
  email?: string | null
  windowMinutes?: number
  maxAttempts?: number
}): Promise<boolean> {
  const { captureRequestSignals } = await import('./request-signals')
  const signals = await captureRequestSignals()
  if (!signals.ipAddress) return false

  const { getDb } = await import('~/lib/db/client')
  const { authEvents } = await import('~/lib/db/schema')
  const { and, eq, gt, sql } = await import('drizzle-orm')
  const db = getDb()

  const windowMinutes = opts.windowMinutes ?? 15
  const maxAttempts = opts.maxAttempts ?? 8
  const since = new Date(Date.now() - windowMinutes * 60 * 1000)

  const conditions = [eq(authEvents.type, opts.type), eq(authEvents.ipAddress, signals.ipAddress), gt(authEvents.createdAt, since)]
  if (opts.email) conditions.push(eq(authEvents.email, opts.email))

  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(authEvents)
    .where(and(...conditions))
  return (row?.count ?? 0) >= maxAttempts
}
