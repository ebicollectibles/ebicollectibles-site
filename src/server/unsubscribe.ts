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

// Which email an unsubscribe came from: a short campaign name added to the
// footer links (e.g. "aura-seeker-preorder") and saved on the unsubscribe
// event (subscriber_events.utm_campaign), so admin can see which emails make
// people leave. Not part of the signed token, so it only labels, never
// grants anything.
export const CAMPAIGN_RE = /^[a-z0-9][a-z0-9-]{0,63}$/
const campaignQuery = (campaign?: string) => (campaign && CAMPAIGN_RE.test(campaign) ? `&c=${campaign}` : '')
export const campaignInput = z.string().regex(CAMPAIGN_RE).optional().catch(undefined)

/** "Update preferences" link for the email footer. */
export async function preferencesPageUrl(email: string, campaign?: string): Promise<string> {
  return `${SITE_URL}/email-preferences?t=${encodeURIComponent(await unsubscribeToken(email))}${campaignQuery(campaign)}`
}

/** Page link for the email footer. */
export async function unsubscribePageUrl(email: string, campaign?: string): Promise<string> {
  return `${SITE_URL}/unsubscribe?t=${encodeURIComponent(await unsubscribeToken(email))}${campaignQuery(campaign)}`
}

/** One-click endpoint for the List-Unsubscribe header. */
export async function oneClickUnsubscribeUrl(email: string, campaign?: string): Promise<string> {
  return `${SITE_URL}/api/unsubscribe?t=${encodeURIComponent(await unsubscribeToken(email))}${campaignQuery(campaign)}`
}

// Unsubscribe from everything list-like: the email list and every product
// alert still waiting. Order and shipping emails aren't affected.
async function setUnsubscribed(email: string, campaign?: string): Promise<void> {
  await leaveList(email, 'unsubscribe-link', campaign)
  await cancelPendingNotifyMe(email)
}

/** Just the email list (new releases and restocks); product alerts stay. */
async function leaveList(email: string, source: string, campaign?: string): Promise<void> {
  const { getDb } = await import('~/lib/db/client')
  const { subscribers, subscriberEvents } = await import('~/lib/db/schema')
  const { and, eq, isNull, sql } = await import('drizzle-orm')
  const db = getDb()
  const [row] = await db
    .update(subscribers)
    .set({ unsubscribedAt: sql`now()` })
    .where(and(eq(subscribers.email, email), isNull(subscribers.unsubscribedAt)))
    .returning({ id: subscribers.id })
  if (row) await db.insert(subscriberEvents).values({ email, type: 'unsubscribed', source, utmCampaign: campaign ?? null })
}

// Notify-me alerts carry the same Unsubscribe link, so unsubscribing also
// cancels every alert this address is still waiting on (logged as
// 'canceled', the same as cancelling on the product page). Alerts already
// sent are history and stay as they are.
async function pendingNotifyMe(email: string) {
  const { getDb } = await import('~/lib/db/client')
  const { notifyMeSignups, users, products } = await import('~/lib/db/schema')
  const { and, eq, isNull, sql } = await import('drizzle-orm')
  return getDb()
    .select({ id: notifyMeSignups.id, userId: notifyMeSignups.userId, productId: notifyMeSignups.productId, productName: products.name, img: products.img })
    .from(notifyMeSignups)
    .innerJoin(users, eq(notifyMeSignups.userId, users.id))
    .innerJoin(products, eq(notifyMeSignups.productId, products.id))
    .where(and(sql`lower(${users.email}) = lower(${email})`, isNull(notifyMeSignups.notifiedAt)))
}

async function cancelPendingNotifyMe(email: string): Promise<void> {
  const { getDb } = await import('~/lib/db/client')
  const { notifyMeSignups, notifyMeEvents } = await import('~/lib/db/schema')
  const { inArray } = await import('drizzle-orm')
  const pending = await pendingNotifyMe(email)
  if (!pending.length) return
  const db = getDb()
  await db.delete(notifyMeSignups).where(inArray(notifyMeSignups.id, pending.map((p) => p.id)))
  await db.insert(notifyMeEvents).values(pending.map((p) => ({ userId: p.userId, email, productId: p.productId, productName: p.productName, type: 'canceled' })))
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
  return !!row || (await pendingNotifyMe(email)).length > 0
}

const tokenInput = z.object({ token: z.string().max(600), c: campaignInput })

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
    await setUnsubscribed(email, data.c)
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
  const url = new URL(request.url)
  const email = await emailFromUnsubscribeToken(url.searchParams.get('t'))
  const c = url.searchParams.get('c') ?? undefined
  if (email) await setUnsubscribed(email, c && CAMPAIGN_RE.test(c) ? c : undefined)
  return new Response(email ? 'Unsubscribed' : 'Invalid link', { status: email ? 200 : 400, headers: { 'content-type': 'text/plain; charset=utf-8' } })
}

// --- Email preferences page (/email-preferences) ---
// Same signed token as the Unsubscribe link, so it opens without signing in
// and only ever shows or changes the address it was made for.

async function isOnList(email: string): Promise<boolean> {
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

async function preferencesFor(email: string) {
  const [list, alerts] = await Promise.all([isOnList(email), pendingNotifyMe(email)])
  return {
    valid: true as const,
    email,
    list,
    alerts: alerts.map((a) => ({ id: a.id, productId: a.productId, productName: a.productName, img: a.img })),
  }
}

export const getEmailPreferences = createServerFn({ method: 'GET' })
  .validator(tokenInput)
  .handler(async ({ data }) => {
    const email = await emailFromUnsubscribeToken(data.token)
    if (!email) return { valid: false as const }
    return preferencesFor(email)
  })

export const setListPreference = createServerFn({ method: 'POST' })
  .validator(tokenInput.extend({ on: z.boolean() }))
  .handler(async ({ data }) => {
    const email = await emailFromUnsubscribeToken(data.token)
    if (!email) throw new Error('This link is not valid.')
    if (data.on) {
      const { getDb } = await import('~/lib/db/client')
      const { upsertSubscriber } = await import('./subscribers')
      await upsertSubscriber(getDb(), email, 'preferences-page')
    } else {
      await leaveList(email, 'preferences-page', data.c)
    }
    return preferencesFor(email)
  })

export const removeAlertWithToken = createServerFn({ method: 'POST' })
  .validator(tokenInput.extend({ signupId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const email = await emailFromUnsubscribeToken(data.token)
    if (!email) throw new Error('This link is not valid.')
    // Only an alert that belongs to this token's address.
    const alert = (await pendingNotifyMe(email)).find((a) => a.id === data.signupId)
    if (alert) {
      const { getDb } = await import('~/lib/db/client')
      const { notifyMeSignups, notifyMeEvents } = await import('~/lib/db/schema')
      const { eq } = await import('drizzle-orm')
      const db = getDb()
      await db.delete(notifyMeSignups).where(eq(notifyMeSignups.id, alert.id))
      await db.insert(notifyMeEvents).values({ userId: alert.userId, email, productId: alert.productId, productName: alert.productName, type: 'canceled' })
    }
    return preferencesFor(email)
  })

export const unsubscribeAllWithToken = createServerFn({ method: 'POST' })
  .validator(tokenInput)
  .handler(async ({ data }) => {
    const email = await emailFromUnsubscribeToken(data.token)
    if (!email) throw new Error('This link is not valid.')
    await setUnsubscribed(email, data.c)
    return preferencesFor(email)
  })
