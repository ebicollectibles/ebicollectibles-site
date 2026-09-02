import { createServerFn, createServerOnlyFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { z } from 'zod'

interface AdminSessionData {
  isAdmin?: boolean
}

// Everything that touches @tanstack/react-start/server is wrapped in
// createServerOnlyFn so the bundler strips it (and this import) out of the
// client build entirely — required for the Cloudflare Workers build to pass,
// since that import is denied in any client-reachable chunk.
const readAdminSession = createServerOnlyFn(async (): Promise<boolean> => {
  const { getSession } = await import('@tanstack/react-start/server')
  const session = await getSession<AdminSessionData>(sessionConfig())
  return session.data.isAdmin === true
})

const writeAdminSession = createServerOnlyFn(async (isAdmin: boolean): Promise<void> => {
  if (isAdmin) {
    const { updateSession } = await import('@tanstack/react-start/server')
    await updateSession<AdminSessionData>(sessionConfig(), { isAdmin: true })
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
    name: 'ebi_admin',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  }
}

/** Throws a plain error — use inside admin server functions (product/order mutations). */
export async function assertAdmin() {
  if (!(await readAdminSession())) {
    throw new Error('Unauthorized — please log in as an admin.')
  }
}

export const isAdminAuthenticated = createServerFn({ method: 'GET' }).handler(async () => {
  return readAdminSession()
})

/**
 * Redirects to the login page — use in route `beforeLoad` for admin pages.
 * Goes through the `isAdminAuthenticated` server function (not the session
 * helpers directly) because `beforeLoad` also runs on the client during
 * client-side navigation.
 */
export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw redirect({ to: '/admin/login' })
  }
}

export const adminLogin = createServerFn({ method: 'POST' })
  .validator(z.object({ password: z.string() }))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD
    if (!expected) throw new Error('ADMIN_PASSWORD is not set on the server.')
    if (data.password !== expected) {
      throw new Error('Incorrect password.')
    }
    await writeAdminSession(true)
    return { ok: true }
  })

export const adminLogout = createServerFn({ method: 'POST' }).handler(async () => {
  await writeAdminSession(false)
  return { ok: true }
})
