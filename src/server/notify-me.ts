import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { and, eq, isNotNull } from 'drizzle-orm'
import { getDb } from '~/lib/db/client'
import { notifyMeEvents, notifyMeSignups, products, users } from '~/lib/db/schema'
import { getCurrentUserId } from './customer-auth'

// Whether the *currently signed-in* customer (if any) is already on the
// list for this product — never takes a userId from the client, same
// reasoning as getMySubscriptionStatus in subscribers.ts. loggedIn:false
// lets the button show "log in to get notified" instead of a broken toggle.
// alreadyNotified distinguishes "signed up, still waiting" from "signed up,
// already got the one-shot alert" — the row survives being notified (see
// notifyMeSignUp), so without this the button would wrongly keep claiming
// "we'll email you" for a restock that already happened and won't repeat.
export const getMyNotifyMeStatus = createServerFn({ method: 'GET' })
  .validator(z.object({ productId: z.string() }))
  .handler(async ({ data }): Promise<{ loggedIn: boolean; signedUp: boolean; alreadyNotified: boolean }> => {
    const userId = await getCurrentUserId()
    if (!userId) return { loggedIn: false, signedUp: false, alreadyNotified: false }

    const db = getDb()
    const [row] = await db
      .select({ notifiedAt: notifyMeSignups.notifiedAt })
      .from(notifyMeSignups)
      .where(and(eq(notifyMeSignups.userId, userId), eq(notifyMeSignups.productId, data.productId)))
      .limit(1)
    if (!row) return { loggedIn: true, signedUp: false, alreadyNotified: false }
    return { loggedIn: true, signedUp: !row.notifiedAt, alreadyNotified: !!row.notifiedAt }
  })

export const notifyMeSignUp = createServerFn({ method: 'POST' })
  .validator(z.object({ productId: z.string() }))
  .handler(async ({ data }) => {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('Log in to get notified.')

    const db = getDb()
    // A brand-new signup inserts a row. Signing up again after already
    // being notified once (the product's back for another round) re-arms
    // that same row by clearing notifiedAt — the `where` only matches an
    // already-notified row, so double-clicking while still pending stays a
    // true no-op (same idempotent behavior as before, just via
    // onConflictDoUpdate instead of onConflictDoNothing). .returning()
    // tells us whether an insert or a real re-arm happened, so a no-op
    // doesn't log a duplicate 'signed_up' event.
    const [upserted] = await db
      .insert(notifyMeSignups)
      .values({ userId, productId: data.productId })
      .onConflictDoUpdate({
        target: [notifyMeSignups.userId, notifyMeSignups.productId],
        set: { notifiedAt: null },
        where: isNotNull(notifyMeSignups.notifiedAt),
      })
      .returning({ id: notifyMeSignups.id })
    if (upserted) {
      const [user] = await db.select({ email: users.email }).from(users).where(eq(users.id, userId)).limit(1)
      const [product] = await db.select({ name: products.name }).from(products).where(eq(products.id, data.productId)).limit(1)
      if (user && product) {
        await db.insert(notifyMeEvents).values({ userId, email: user.email, productId: data.productId, productName: product.name, type: 'signed_up' })
      }
    }
    return { ok: true }
  })

export const notifyMeCancel = createServerFn({ method: 'POST' })
  .validator(z.object({ productId: z.string() }))
  .handler(async ({ data }) => {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('Log in required.')

    const db = getDb()
    const [deleted] = await db
      .delete(notifyMeSignups)
      .where(and(eq(notifyMeSignups.userId, userId), eq(notifyMeSignups.productId, data.productId)))
      .returning({ id: notifyMeSignups.id })
    if (deleted) {
      const [user] = await db.select({ email: users.email }).from(users).where(eq(users.id, userId)).limit(1)
      const [product] = await db.select({ name: products.name }).from(products).where(eq(products.id, data.productId)).limit(1)
      if (user && product) {
        await db.insert(notifyMeEvents).values({ userId, email: user.email, productId: data.productId, productName: product.name, type: 'canceled' })
      }
    }
    return { ok: true }
  })
