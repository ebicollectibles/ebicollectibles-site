import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import { getDb } from '~/lib/db/client'
import { withTransaction } from '~/lib/db/transactional-client'
import { emailEvents, orders, pendingStoreCredits, storeCreditBalances, storeCreditEvents, users } from '~/lib/db/schema'
import { assertAdmin } from './admin-auth'
import { getCurrentUserId } from './customer-auth'
import { sendPendingStoreCreditEmail, sendStoreCreditEmail } from './email'

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
// unfiltered. Admin's own view (adminGetStoreCredit) gets the full detail;
// the customer gets a generic attribution instead for the two
// admin-initiated event types (issued/adjusted) — enough to say "this was
// deliberate, not a glitch" without any of the internal specifics. redeemed
// and reversed are self-explanatory from their type label alone (see
// creditEventLabel in account/orders/index.tsx), so no extra text there.
async function getStoreCreditHistory(userId: string, includeReason: boolean) {
  const db = getDb()
  return db
    .select({
      type: storeCreditEvents.type,
      amount: storeCreditEvents.amount,
      orderId: storeCreditEvents.orderId,
      // Left join, not inner — orderId is null for an admin grant/manual
      // adjustment, and a 'redeemed'/'reversed' row should still show even
      // if its order somehow got deleted (onDelete: 'set null' on
      // storeCreditEvents.orderId already handles that case at the FK
      // level; orderNo just comes back null here to match).
      orderNo: orders.orderNo,
      reason: includeReason
        ? storeCreditEvents.reason
        : sql<string | null>`case when ${storeCreditEvents.type} in ('issued', 'adjusted') then 'From EBI Collectibles' else null end`,
      // note is never included for the customer — always admin-only,
      // unlike reason above which at least has a generic customer-facing
      // fallback. There's no customer-facing equivalent for note at all.
      note: includeReason ? storeCreditEvents.note : sql<string | null>`null`,
      createdAt: storeCreditEvents.createdAt,
    })
    .from(storeCreditEvents)
    .leftJoin(orders, eq(storeCreditEvents.orderId, orders.id))
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
export async function issueOrReverseStoreCredit(tx: Tx, opts: { userId: string; amount: number; type: 'issued' | 'reversed'; orderId?: string; reason?: string; note?: string }) {
  await tx
    .insert(storeCreditBalances)
    .values({ userId: opts.userId, balance: opts.amount })
    .onConflictDoUpdate({ target: storeCreditBalances.userId, set: { balance: sql`${storeCreditBalances.balance} + ${opts.amount}`, updatedAt: new Date() } })
  await tx
    .insert(storeCreditEvents)
    .values({ userId: opts.userId, type: opts.type, amount: opts.amount, orderId: opts.orderId ?? null, reason: opts.reason ?? null, note: opts.note ?? null })
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
  // Free-text, admin-only, optional — see the note column's comment in
  // lib/db/schema.ts. Distinct from reason: reason is the standardized
  // customer-adjacent category, note is whatever extra context admin wants
  // on file that should never reach the customer under any circumstance.
  note: z.string().trim().optional(),
})

export const adminAdjustStoreCredit = createServerFn({ method: 'POST' })
  .validator(adjustSchema)
  .handler(async ({ data }) => {
    await assertAdmin()
    const note = data.note || undefined
    await withTransaction(async (tx) => {
      if (data.amount > 0) {
        await issueOrReverseStoreCredit(tx, { userId: data.userId, amount: data.amount, type: 'issued', reason: data.reason, note })
      } else {
        const deduction = Math.abs(data.amount)
        const [updated] = await tx
          .update(storeCreditBalances)
          .set({ balance: sql`${storeCreditBalances.balance} - ${deduction}`, updatedAt: new Date() })
          .where(sql`${storeCreditBalances.userId} = ${data.userId} AND ${storeCreditBalances.balance} >= ${deduction}`)
          .returning()
        if (!updated) throw new Error("Can't deduct more than the customer's current balance.")
        await tx.insert(storeCreditEvents).values({ userId: data.userId, type: 'adjusted', amount: data.amount, reason: data.reason, note: note ?? null })
      }
    })

    // Best-effort notification, only for a fresh grant — run after the
    // transaction commits so a failed/skipped send never undoes or blocks
    // the actual credit (same philosophy as sendOrderConfirmationEmail in
    // server/orders.ts).
    if (data.amount > 0) {
      const db = getDb()
      const [user] = await db.select({ email: users.email, name: users.name }).from(users).where(eq(users.id, data.userId)).limit(1)
      if (user?.email) {
        try {
          const result = await sendStoreCreditEmail({ email: user.email, name: user.name, amount: data.amount })
          await db.insert(emailEvents).values({
            orderId: null,
            email: user.email,
            type: 'store_credit_issued',
            status: result.status,
            errorMessage: result.error ?? null,
            resendId: result.resendId ?? null,
          })
        } catch (err) {
          console.error(`Failed to send store credit email to user ${data.userId}:`, err)
        }
      }
    }

    return { ok: true }
  })

export const adminGetStoreCredit = createServerFn({ method: 'GET' })
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const [balance, history] = await Promise.all([getStoreCreditBalance(data.userId), getStoreCreditHistory(data.userId, true)])
    return { balance, history }
  })

// --- Admin: grant credit against an EMAIL, for someone with no account yet ---

const issueByEmailSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
  amount: z.number().positive('Amount must be greater than zero.'),
  reason: z.string().trim().min(1, 'A reason is required.'),
  note: z.string().trim().optional(),
  orderId: z.string().optional(),
})

/**
 * If an account already exists under this email, credit lands on it
 * immediately (same path as adminAdjustStoreCredit's grant branch) and the
 * normal "you've got store credit" email goes out. Otherwise it's parked in
 * pendingStoreCredits and a different email goes out instead — one that
 * invites them to create an account with this same email, which is what
 * actually promotes the grant into spendable credit (see
 * claimPendingStoreCredit below).
 */
export const adminIssueStoreCreditByEmail = createServerFn({ method: 'POST' })
  .validator(issueByEmailSchema)
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    const note = data.note || undefined
    const [existingUser] = await db.select({ id: users.id, name: users.name }).from(users).where(sql`lower(${users.email}) = ${data.email}`).limit(1)

    if (existingUser) {
      await withTransaction(async (tx) => {
        await issueOrReverseStoreCredit(tx, { userId: existingUser.id, amount: data.amount, type: 'issued', orderId: data.orderId, reason: data.reason, note })
      })
      let status: 'sent' | 'failed' | 'skipped' = 'skipped'
      try {
        const result = await sendStoreCreditEmail({ email: data.email, name: existingUser.name, amount: data.amount })
        status = result.status
        await db.insert(emailEvents).values({ orderId: data.orderId ?? null, email: data.email, type: 'store_credit_issued', status: result.status, errorMessage: result.error ?? null, resendId: result.resendId ?? null })
      } catch (err) {
        console.error(`Failed to send store credit email to ${data.email}:`, err)
      }
      return { claimed: true as const, emailStatus: status }
    }

    await db.insert(pendingStoreCredits).values({ email: data.email, amount: data.amount, reason: data.reason, note: note ?? null, orderId: data.orderId ?? null })
    let status: 'sent' | 'failed' | 'skipped' = 'skipped'
    try {
      const result = await sendPendingStoreCreditEmail({ email: data.email, amount: data.amount })
      status = result.status
      await db.insert(emailEvents).values({ orderId: data.orderId ?? null, email: data.email, type: 'store_credit_pending', status: result.status, errorMessage: result.error ?? null, resendId: result.resendId ?? null })
    } catch (err) {
      console.error(`Failed to send pending store credit email to ${data.email}:`, err)
    }
    return { claimed: false as const, emailStatus: status }
  })

export const adminListPendingStoreCredits = createServerFn({ method: 'GET' }).handler(async () => {
  await assertAdmin()
  const db = getDb()
  return db
    .select({
      id: pendingStoreCredits.id,
      email: pendingStoreCredits.email,
      amount: pendingStoreCredits.amount,
      reason: pendingStoreCredits.reason,
      note: pendingStoreCredits.note,
      orderId: pendingStoreCredits.orderId,
      orderNo: orders.orderNo,
      createdAt: pendingStoreCredits.createdAt,
    })
    .from(pendingStoreCredits)
    .leftJoin(orders, eq(pendingStoreCredits.orderId, orders.id))
    .where(and(isNull(pendingStoreCredits.claimedAt), isNull(pendingStoreCredits.canceledAt)))
    .orderBy(desc(pendingStoreCredits.createdAt))
})

export const adminCancelPendingStoreCredit = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    const [updated] = await db
      .update(pendingStoreCredits)
      .set({ canceledAt: new Date() })
      .where(and(eq(pendingStoreCredits.id, data.id), isNull(pendingStoreCredits.claimedAt), isNull(pendingStoreCredits.canceledAt)))
      .returning()
    if (!updated) throw new Error('Already claimed or canceled.')
    return { ok: true }
  })

// --- Claim: promotes pending-by-email grants into real credit on a new/linked account ---

/**
 * Called right after a users row is created or linked for `email` (see
 * findOrCreateUserForClerkSession in customer-auth.ts) — same moment
 * linkGuestOrders claims past guest orders under that email. Safe to call
 * on every signup/link, even when there's nothing pending (no-op). Each
 * pending row is claimed in its own transaction alongside the balance
 * update, same guarded-write pattern as every other store-credit mutation.
 */
export async function claimPendingStoreCredit(db: ReturnType<typeof getDb>, userId: string, email: string) {
  const lowered = email.trim().toLowerCase()
  const pending = await db
    .select()
    .from(pendingStoreCredits)
    .where(and(sql`lower(${pendingStoreCredits.email}) = ${lowered}`, isNull(pendingStoreCredits.claimedAt), isNull(pendingStoreCredits.canceledAt)))
  if (pending.length === 0) return

  for (const row of pending) {
    await withTransaction(async (tx) => {
      // Re-check inside the transaction — if a concurrent call already
      // claimed/canceled this row, skip it instead of double-granting.
      const [claimedRow] = await tx
        .update(pendingStoreCredits)
        .set({ claimedAt: new Date(), claimedUserId: userId })
        .where(and(eq(pendingStoreCredits.id, row.id), isNull(pendingStoreCredits.claimedAt), isNull(pendingStoreCredits.canceledAt)))
        .returning()
      if (!claimedRow) return
      await issueOrReverseStoreCredit(tx, { userId, amount: row.amount, type: 'issued', orderId: row.orderId ?? undefined, reason: row.reason ?? undefined, note: row.note ?? undefined })
    })
  }
}
