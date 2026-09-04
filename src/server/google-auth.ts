// Plain OAuth 2.0 authorization-code flow against Google's endpoints — no
// SDK, same pattern as square.ts/email.ts. The ID token is decoded without
// signature verification because we fetch it ourselves directly from
// Google's token endpoint over HTTPS (not received from the client, where
// it could be tampered with) — the transport itself is the trust boundary.

import { createServerFn, createServerOnlyFn } from '@tanstack/react-start'
import { z } from 'zod'
import { linkGuestOrders } from './customers'
import { setCustomerSession, recordAuthEvent, touchLastLogin } from './customer-auth'

// Db/schema imports below are dynamic (not top-level) — same reasoning as
// customer-auth.ts: a top-level import here was pulling the Postgres driver
// into the dev client bundle (crashing on Node-only globals) even though
// every DB call only ever happens inside a server-only function body.

function googleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI
  return { clientId, clientSecret, redirectUri }
}

export function googleSignInConfigured(): boolean {
  const { clientId, clientSecret, redirectUri } = googleConfig()
  return !!(clientId && clientSecret && redirectUri)
}

export function buildGoogleAuthUrl(state: string): string {
  const { clientId, redirectUri } = googleConfig()
  if (!clientId || !redirectUri) throw new Error('Google sign-in is not configured.')

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

interface GoogleIdTokenPayload {
  sub: string
  email: string
  email_verified: boolean
  name?: string
}

async function exchangeGoogleCode(code: string): Promise<GoogleIdTokenPayload> {
  const { clientId, clientSecret, redirectUri } = googleConfig()
  if (!clientId || !clientSecret || !redirectUri) throw new Error('Google sign-in is not configured.')

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || !json?.id_token) {
    throw new Error(json?.error_description || 'Failed to sign in with Google.')
  }

  const payloadB64 = json.id_token.split('.')[1]
  const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')))
  return payload as GoogleIdTokenPayload
}

/** Server-only: exchanges the OAuth code, finds-or-creates the user, links guest orders, and writes the session. */
export async function handleGoogleCallback(code: string): Promise<void> {
  const payload = await exchangeGoogleCode(code)
  if (!payload.email_verified) {
    throw new Error('Your Google account email is not verified — cannot sign in.')
  }
  const email = payload.email.trim().toLowerCase()

  const { getDb } = await import('~/lib/db/client')
  const { users } = await import('~/lib/db/schema')
  const { eq } = await import('drizzle-orm')
  const db = getDb()
  const [byGoogleId] = await db.select().from(users).where(eq(users.googleId, payload.sub)).limit(1)
  if (byGoogleId) {
    await setCustomerSession(byGoogleId.id)
    await recordAuthEvent({ userId: byGoogleId.id, email, type: 'login' })
    await touchLastLogin(byGoogleId.id)
    return
  }

  const [byEmail] = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (byEmail) {
    // Existing password-based account with the same (Google-verified) email — link the two.
    await db.update(users).set({ googleId: payload.sub, updatedAt: new Date() }).where(eq(users.id, byEmail.id))
    await setCustomerSession(byEmail.id)
    await recordAuthEvent({ userId: byEmail.id, email, type: 'google_link' })
    await touchLastLogin(byEmail.id)
    return
  }

  const [created] = await db
    .insert(users)
    .values({ email, googleId: payload.sub, name: payload.name || null })
    .returning({ id: users.id })
  await linkGuestOrders(db, created.id, email)
  await setCustomerSession(created.id)
  await recordAuthEvent({ userId: created.id, email, type: 'signup' })
  await touchLastLogin(created.id)
}

// --- CSRF state, short-lived cookie between /auth/google/start and the callback ---

interface OAuthStateData {
  state?: string
}

function oauthStateSessionConfig() {
  const password = process.env.SESSION_SECRET
  if (!password || password.length < 32) {
    throw new Error('SESSION_SECRET must be set to a random string of at least 32 characters (see .env.example).')
  }
  return { password, name: 'ebi_oauth_state', maxAge: 60 * 10 }
}

const readOAuthState = createServerOnlyFn(async (): Promise<string | null> => {
  const { getSession } = await import('@tanstack/react-start/server')
  const session = await getSession<OAuthStateData>(oauthStateSessionConfig())
  return session.data.state ?? null
})

const writeOAuthState = createServerOnlyFn(async (state: string | null): Promise<void> => {
  if (state) {
    const { updateSession } = await import('@tanstack/react-start/server')
    await updateSession<OAuthStateData>(oauthStateSessionConfig(), { state })
  } else {
    const { clearSession } = await import('@tanstack/react-start/server')
    await clearSession(oauthStateSessionConfig())
  }
})

export const startGoogleAuth = createServerFn({ method: 'GET' }).handler(async () => {
  if (!googleSignInConfigured()) {
    throw new Error('Google sign-in is not configured.')
  }
  const state = crypto.randomUUID()
  await writeOAuthState(state)
  return { url: buildGoogleAuthUrl(state) }
})

export const completeGoogleAuth = createServerFn({ method: 'GET' })
  .validator(z.object({ code: z.string(), state: z.string() }))
  .handler(async ({ data }) => {
    const expected = await readOAuthState()
    await writeOAuthState(null)
    if (!expected || expected !== data.state) {
      throw new Error('Sign-in session expired — please try again.')
    }
    await handleGoogleCallback(data.code)
    return { ok: true }
  })
