import { createServerFn, createServerOnlyFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'

// Admin access is gated on Clerk's own session (same instance customers use
// — see customer-auth.ts) plus a privateMetadata.isAdmin flag set on the
// specific Clerk user(s) who should have it. That flag is set by hand in
// the Clerk dashboard (Users -> the admin's account -> Metadata), not by
// any code path here — there's no self-service "become an admin" flow.
const checkIsAdmin = createServerOnlyFn(async (): Promise<boolean> => {
  const { auth, clerkClient } = await import('@clerk/tanstack-react-start/server')
  const { userId } = await auth()
  if (!userId) return false
  const user = await clerkClient().users.getUser(userId)
  return user.privateMetadata?.isAdmin === true
})

/** Throws a plain error — use inside admin server functions (product/order mutations). */
export async function assertAdmin() {
  if (!(await checkIsAdmin())) {
    throw new Error('Unauthorized — please log in as an admin.')
  }
}

export const isAdminAuthenticated = createServerFn({ method: 'GET' }).handler(async () => {
  return checkIsAdmin()
})

/**
 * Redirects to the login page — use in route `beforeLoad` for admin pages.
 * Goes through the `isAdminAuthenticated` server function (not checkIsAdmin
 * directly) because `beforeLoad` also runs on the client during
 * client-side navigation.
 */
export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw redirect({ to: '/admin/login' })
  }
}

/**
 * Called once, client-side, right after admin/login.tsx's Clerk sign-in
 * succeeds — Clerk itself only proves *who* signed in, not that they're
 * allowed in the admin panel, so this is the actual authorization check.
 * The login page signs the session back out again if this rejects, rather
 * than leaving a non-admin Clerk session sitting on the admin login page.
 */
export const verifyAdminAccess = createServerFn({ method: 'POST' }).handler(async () => {
  const { recordAuthEvent } = await import('./customer-auth')
  if (!(await checkIsAdmin())) {
    await recordAuthEvent({ type: 'admin_login_failed' })
    throw new Error('This account is not authorized for admin access.')
  }
  await recordAuthEvent({ type: 'admin_login' })
  return { ok: true }
})
