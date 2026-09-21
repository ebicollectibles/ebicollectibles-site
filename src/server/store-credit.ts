import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { desc, eq, sql } from 'drizzle-orm'
import { getDb } from '~/lib/db/client'
import { withTransaction } from '~/lib/db/transactional-client'
import { storeCreditBalances, storeCreditEvents } from '~/lib/db/schema'
import { assertAdmin } from './admin-auth'
import { getCurrentUserId } from './customer-auth'

type Tx = Parameters<Parameters<typeof withTransaction>[0]>[0]

// Balance lives in its own fast-path column (storeCreditBalances), updated
// atomically alongside an append-only ledger row (storeCreditEvents) — same
// two-table relationship as products.stock + productEditEvents. Never
// recomputed by summing events on every read; the events table exists for
// the audit trail (account page history, admin visibility), not as the
// balance's source of truth day to day.

/** Plain read, no locking — for previews (checkout, account page) where a stale-by-a-few-seconds number is fine. The authoritative check is always the guarded UPDATE in redeemStoreCredit below. */
export async function getStoreCreditBalance(userId: string): Promise<number> {
  const db = getDb()
  const [row] = await db.select({ balance: storeCreditBalances.balance }).from(storeCreditBalances).where(eq(storeCreditBalances.userId, userId)).limit(1)
  return row?.balance ?? 0
}

// includeReason is false for the customer-facing history (see
// getMyStoreCredit) — the reason picked from the admin dropdown (e.g.
// "Damaged or defective item", or whatever detail was typed for "Other") is
// bookkeeping for the store, not something to put in front of the customer
// unfiltered. Admin's own view (adminGetStoreCredit) gets the full detail.
async function getStoreCreditHistory(userId: string, includeReason: boolean) {
  const db = getDb()
  return db
    .select({
      type: storeCreditEvents.type,
      amount: storeCreditEvents.amount,
      orderId: storeCreditEvents.orderId,
      reason: includeReason ? storeCreditEvents.reason : sql<string | null>`null`,
      createdAt: storeCreditEvents.createdAt,
    })
    .from(storeCreditEvents)
    .where(eq(storeCreditEvents.userId, userId))
    .orderBy(desc(storeCreditEvents.createdAt))
    .limit(100)
}

// Redemption itself is NOT here — placeOrder needs the guarded balance
// decrement to happen before the order row exists (so a failed Square
// charge still rolls the decrement back), but the ledger row needs the
// order's id, which doesn't exist until after. That two-step sequencing is
// specific to placeOrder's transaction shape, so it's inlined there
// (server/orders.ts), same as how stock's own guarded decrement is inlined
// rather than pulled into products.ts.

/** amount must be > 0. Used both for a fresh admin grant and for restoring credit after a refund (no order-id ordering problem here — the order already exists in both cases). */
export async function issueOrReverseStoreCredit(tx: Tx, opts: { userId: string; amount: number; type: 'issued' | 'reversed'; orderId?: string; reason?: string }) {
  await tx
    .insert(storeCreditBalances)
    .values({ userId: opts.userId, balance: opts.amount })
    .onConflictDoUpdate({ target: storeCreditBalances.userId, set: { balance: sql`${storeCreditBalances.balance} + ${opts.amount}`, updatedAt: new Date() } })
  await tx.insert(storeCreditEvents).values({ userId: opts.userId, type: opts.type, amount: opts.amount, orderId: opts.orderId ?? null, reason: opts.reason ?? null })
}

// --- Customer-facing: account page balance + history ---

export const getMyStoreCredit = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await getCurrentUserId()
  if (!userId) return { balance: 0, history: [] }
  const [balance, history] = await Promise.all([getStoreCreditBalance(userId), getStoreCreditHistory(userId, false)])
  return { balance, history }
})

// --- Admin: issue credit or correct a mistake (signed amount) ---

const adjustSchema = z.object({
  userId: z.string(),
  // Positive: issue new credit (or restore some after a partial refund).
  // Negative: correct a mistaken grant. Never zero — nothing to record.
  amount: z.number().refine((n) => n !== 0, 'Amount cannot be zero.'),
  reason: z.string().trim().min(1, 'A reason is required.'),
})

export const adminAdjustStoreCredit = createServerFn({ method: 'POST' })
  .validator(adjustSchema)
  .handler(async ({ data }) => {
    await assertAdmin()
    await withTransaction(async (tx) => {
      if (data.amount > 0) {
        await issueOrReverseStoreCredit(tx, { userId: data.userId, amount: data.amount, type: 'issued', reason: data.reason })
      } else {
        const deduction = Math.abs(data.amount)
        const [updated] = await tx
          .update(storeCreditBalances)
          .set({ balance: sql`${storeCreditBalances.balance} - ${deduction}`, updatedAt: new Date() })
          .where(sql`${storeCreditBalances.userId} = ${data.userId} AND ${storeCreditBalances.balance} >= ${deduction}`)
          .returning()
        if (!updated) throw new Error("Can't deduct more than the customer's current balance.")
        await tx.insert(storeCreditEvents).values({ userId: data.userId, type: 'adjusted', amount: data.amount, reason: data.reason })
      }
    })
    return { ok: true }
  })

export const adminGetStoreCredit = createServerFn({ method: 'GET' })
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const [balance, history] = await Promise.all([getStoreCreditBalance(data.userId), getStoreCreditHistory(data.userId, true)])
    return { balance, history }
  })
