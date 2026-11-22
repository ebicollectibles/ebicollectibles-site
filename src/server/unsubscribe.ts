import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { makeUnsubscribeToken, readUnsubscribeToken } from '~/lib/unsubscribe-token'

// Unsubscribe for list emails (restock and new release emails): the signed
// link in each email's footer opens /unsubscribe, and Gmail/Yahoo's own
// one-click button POSTs to /api/unsubscribe (RFC 8058, see server.ts).
// Both end in the same subscriber update the admin Unsubscribe button makes.

const SITE_URL = 'https://ebicollectibles.com'

// UNSUBSCRIBE_SECRET if one is set on the Worker. Otherwise a key derived
// from DATABASE_URL, which is already a secret and present everywhere the
// site runs, so links work without extra setup. Setting UNSUBSCRIBE_SECRET
// later would invalidate links already sent, so set it before the first
// list email or not at all.
async function unsubscribeSecret(): Promise<string> {
  const explicit = process.env.UNSUBSCRIBE_SECRET
  if (explicit) return explicit
  const db = process.env.DATABASE_URL
  if (!db) throw new Error('No secret available for unsubscribe links.')
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`ebi-unsubscribe-key:v1:${db}`))
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

export async function unsubscribeToken(email: string): Promise<string> {
  return makeUnsubscribeToken(email, await unsubscribeSecret())
}

export async function emailFromUnsubscribeToken(token: string | null | undefined): Promise<string | null> {
  try {
    return await readUnsubscribeToken(token, await unsubscribeSecret())
  } catch {
    return null
  }
}

/** Page link for the email footer. */
export async function unsubscribePageUrl(email: string): Promise<string> {
  return `${SITE_URL}/unsubscribe?t=${encodeURIComponent(await unsubscribeToken(email))}`
}

/** One-click endpoint for the List-Unsubscribe header. */
export async function oneClickUnsubscribeUrl(email: string): Promise<string> {
  return `${SITE_URL}/api/unsubscribe?t=${encodeURIComponent(await unsubscribeToken(email))}`
}

async function setUnsubscribed(email: string): Promise<void> {
  const { getDb } = await import('~/lib/db/client')
  const { subscribers, subscriberEvents } = await import('~/lib/db/schema')
  const { and, eq, isNull, sql } = await import('drizzle-orm')
  const db = getDb()
  const [row] = await db
    .update(subscribers)
    .set({ unsubscribedAt: sql`now()` })
    .where(and(eq(subscribers.email, email), isNull(subscribers.unsubscribedAt)))
    .returning({ id: subscribers.id })
  if (row) await db.insert(subscriberEvents).values({ email, type: 'unsubscribed', source: 'unsubscribe-link' })
}

async function isSubscribed(email: string): Promise<boolean> {
  const { getDb } = await import('~/lib/db/client')
  const { subscribers } = await import('~/lib/db/schema')
  const { and, eq, isNull } = await import('drizzle-orm')
  const [row] = await getDb()
    .select({ id: subscribers.id })
    .from(subscribers)
    .where(and(eq(subscribers.email, email), isNull(subscribers.unsubscribedAt)))
    .limit(1)
  return !!row
}

const tokenInput = z.object({ token: z.string().max(600) })

// What the /unsubscribe page shows before anything changes. Opening the
// link never unsubscribes on its own: email security scanners open every
// link in an email, and would otherwise unsubscribe people by accident.
export const getUnsubscribeState = createServerFn({ method: 'GET' })
  .validator(tokenInput)
  .handler(async ({ data }) => {
    const email = await emailFromUnsubscribeToken(data.token)
    if (!email) return { valid: false as const }
    return { valid: true as const, email, subscribed: await isSubscribed(email) }
  })

export const unsubscribeWithToken = createServerFn({ method: 'POST' })
  .validator(tokenInput)
  .handler(async ({ data }) => {
    const email = await emailFromUnsubscribeToken(data.token)
    if (!email) throw new Error('This unsubscribe link is not valid.')
    await setUnsubscribed(email)
    return { ok: true }
  })

export const resubscribeWithToken = createServerFn({ method: 'POST' })
  .validator(tokenInput)
  .handler(async ({ data }) => {
    const email = await emailFromUnsubscribeToken(data.token)
    if (!email) throw new Error('This link is not valid.')
    const { getDb } = await import('~/lib/db/client')
    const { upsertSubscriber } = await import('./subscribers')
    await upsertSubscriber(getDb(), email, 'unsubscribe-page')
    return { ok: true }
  })

// Gmail and Yahoo's own "Unsubscribe" button (RFC 8058 one-click): a POST
// with body "List-Unsubscribe=One-Click". 200 when done (also when already
// unsubscribed), 400 for a token that doesn't verify, which changes nothing.
export async function handleOneClickUnsubscribe(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get('t')
  const email = await emailFromUnsubscribeToken(token)
  if (email) await setUnsubscribed(email)
  return new Response(email ? 'Unsubscribed' : 'Invalid link', { status: email ? 200 : 400, headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
