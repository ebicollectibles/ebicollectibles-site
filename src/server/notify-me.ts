import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { and, eq } from 'drizzle-orm'
import { getDb } from '~/lib/db/client'
import { notifyMeEvents, notifyMeSignups, products, users } from '~/lib/db/schema'
import { getCurrentUserId } from './customer-auth'

// Whether the *currently signed-in* customer (if any) is already on the
// list for this product — never takes a userId from the client, same
// reasoning as getMySubscriptionStatus in subscribers.ts. loggedIn:false
// lets the button show "log in to get notified" instead of a broken toggle.
export const getMyNotifyMeStatus = createServerFn({ method: 'GET' })
  .validator(z.object({ productId: z.string() }))
  .handler(async ({ data }): Promise<{ loggedIn: boolean; signedUp: boolean }> => {
    const userId = await getCurrentUserId()
    if (!userId) return { loggedIn: false, signedUp: false }

    const db = getDb()
    const [row] = await db
      .select({ id: notifyMeSignups.id })
      .from(notifyMeSignups)
      .where(and(eq(notifyMeSignups.userId, userId), eq(notifyMeSignups.productId, data.productId)))
      .limit(1)
    return { loggedIn: true, signedUp: !!row }
  })

export const notifyMeSignUp = createServerFn({ method: 'POST' })
  .validator(z.object({ productId: z.string() }))
  .handler(async ({ data }) => {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('Log in to get notified.')

    const db = getDb()
    // onConflictDoNothing: signing up twice (double-click, two tabs) is a
    // silent no-op rather than an error, same as the store-credit-style
    // idempotent-upsert pattern used elsewhere. .returning() tells us
    // whether a row was actually inserted, so a no-op signup doesn't log a
    // duplicate 'signed_up' event.
    const [inserted] = await db
      .insert(notifyMeSignups)
      .values({ userId, productId: data.productId })
      .onConflictDoNothing()
      .returning({ id: notifyMeSignups.id })
    if (inserted) {
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
