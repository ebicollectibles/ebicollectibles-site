import { and, eq, inArray } from 'drizzle-orm'
import type { getDb } from '~/lib/db/client'
import { refundEvents } from '~/lib/db/schema'
import { commissionAfterRefunds, toCents } from '~/lib/refunds'

/** Completed refund total per order, in dollars. */
export async function completedRefundTotals(db: ReturnType<typeof getDb>, orderIds: string[]): Promise<Map<string, number>> {
  const totals = new Map<string, number>()
  if (orderIds.length === 0) return totals
  const rows = await db
    .select({ orderId: refundEvents.orderId, amount: refundEvents.amount })
    .from(refundEvents)
    .where(and(eq(refundEvents.status, 'COMPLETED'), inArray(refundEvents.orderId, orderIds)))
  for (const r of rows) {
    if (!r.orderId) continue
    totals.set(r.orderId, (totals.get(r.orderId) ?? 0) + toCents(Number(r.amount ?? 0)) / 100)
  }
  return totals
}

/**
 * One order's commission after refunds (see commissionAfterRefunds).
 * refunded: nothing left to pay. partlyRefunded: reduced, but some is still earned.
 */
export function adjustCommission(o: { affiliateCommission: number | null; subtotal: number }, refundedAmount: number) {
  const original = Number(o.affiliateCommission ?? 0)
  const commission = commissionAfterRefunds(original, Number(o.subtotal ?? 0), refundedAmount)
  const hasRefund = refundedAmount > 0
  return {
    commission,
    originalCommission: original,
    refundedAmount,
    refunded: hasRefund && toCents(refundedAmount) >= toCents(Number(o.subtotal ?? 0)),
    partlyRefunded: hasRefund && commission > 0 && commission < original,
  }
}
