// Money math for partial refunds, kept pure (no DB, no Square) so it can be
// unit tested. Everything is done in whole cents: a float subtraction like
// 37.5 - 12.3 - 25.2 does not land on exactly 0, and a refund cap has to be
// exact to the cent.

// Square refund statuses that mean no money went back to the customer.
// Everything else (PENDING, COMPLETED, or a row with no status yet) counts
// as already refunded, so a refund still settling can't be refunded twice.
const NOT_REFUNDED_STATUSES = new Set(['REJECTED', 'FAILED'])

// Square's own cap on a refund's reason field.
export const REFUND_REASON_MAX_LENGTH = 192

export function toCents(dollars: number): number {
  return Math.round(dollars * 100)
}

export function countsAsRefunded(status: string | null | undefined): boolean {
  return !NOT_REFUNDED_STATUSES.has((status ?? '').toUpperCase())
}

/**
 * What can still be refunded to the card through Square. Only the card
 * charge is refundable there: store credit applied at checkout never went
 * through Square (same amountCharged as adminCancelAndRefundOrder and the
 * refund webhook use: total - creditApplied).
 */
export function computeRefundable(
  order: { total: number; creditApplied: number },
  refunds: Array<{ amount: number | null; status: string | null }>,
) {
  const chargedCents = Math.max(0, toCents(order.total) - toCents(order.creditApplied))
  const refundedCents = refunds.filter((r) => countsAsRefunded(r.status)).reduce((t, r) => t + toCents(r.amount ?? 0), 0)
  const remainingCents = Math.max(0, chargedCents - refundedCents)
  return { chargedCents, refundedCents, remainingCents }
}

/**
 * Parses an admin-typed dollar amount ("12", "12.5", "12.50", "$12.50")
 * into cents. Rejects anything with more than two decimals, negatives,
 * zero, and non-numbers rather than rounding them into something the admin
 * did not type.
 */
export function parseRefundAmount(input: string): { cents: number } | { error: string } {
  const cleaned = input.trim().replace(/^\$/, '').replace(/,/g, '')
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return { error: 'Enter an amount in dollars, like 12.50 (at most two decimals).' }
  const [whole, frac = ''] = cleaned.split('.')
  const cents = Number(whole) * 100 + Number(frac.padEnd(2, '0'))
  if (!Number.isSafeInteger(cents) || cents <= 0) return { error: 'Enter an amount greater than $0.' }
  return { cents }
}

/** Full check for a partial refund request; returns the amount in cents or an error. */
export function validatePartialRefund(input: { amount: string; reason: string; remainingCents: number }): { cents: number; reason: string } | { error: string } {
  const parsed = parseRefundAmount(input.amount)
  if ('error' in parsed) return parsed
  if (input.remainingCents <= 0) return { error: 'Nothing left to refund on this order.' }
  if (parsed.cents > input.remainingCents) {
    return { error: `That's more than the ${centsToDollarString(input.remainingCents)} still refundable on this order.` }
  }
  const reason = input.reason.trim()
  if (!reason) return { error: 'Enter a reason. The customer sees it.' }
  if (reason.length > REFUND_REASON_MAX_LENGTH) return { error: `Keep the reason under ${REFUND_REASON_MAX_LENGTH} characters.` }
  return { cents: parsed.cents, reason }
}

export function centsToDollarString(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

// The full "Cancel & refund" action sends Square an internal reason
// ("Order #EBI-12 cancelled by admin", with a fee note when one was
// withheld). That's fine in Square but reads oddly to a customer, so it's
// shown to them as plain "Order cancelled". Any other reason (one typed in
// the partial refund form, or picked in Square's dashboard) is shown as is.
const CANCEL_TOOL_REASON = /^Order #EBI-\d+ cancelled by admin(, 5% cancellation fee withheld)?$/

/** True for a refund made by the full "Cancel & refund" action (which sends its own cancellation email). */
export function isCancellationRefund(reason: string | null | undefined): boolean {
  return CANCEL_TOOL_REASON.test(reason?.trim() ?? '')
}

export function customerRefundReason(reason: string | null | undefined): string | null {
  const trimmed = reason?.trim()
  if (!trimmed) return null
  const cancel = CANCEL_TOOL_REASON.exec(trimmed)
  if (cancel) return cancel[1] ? 'Order cancelled (5% cancellation fee withheld)' : 'Order cancelled'
  return trimmed
}

/** Completed refunds as shown to the customer: date, amount, reason only. Oldest first. */
export function customerRefundList(
  refunds: Array<{ amount: number | null; status: string | null; reason: string | null; createdAt: Date | string }>,
): Array<{ createdAt: string; amount: number; reason: string | null }> {
  return refunds
    .filter((r) => r.status === 'COMPLETED' && r.amount != null && r.amount > 0)
    .map((r) => ({ createdAt: new Date(r.createdAt).toISOString(), amount: r.amount as number, reason: customerRefundReason(r.reason) }))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

/**
 * Affiliate commission left after refunds. Commission is earned on the
 * order's item subtotal, so refunds reduce it in proportion to how much of
 * the subtotal came back: refund $10 of a $100 subtotal and the commission
 * drops 10%. Refunded money past the subtotal (shipping, tax) does not
 * reduce it further, and a refund covering the whole subtotal takes it to $0.
 */
export function commissionAfterRefunds(commission: number, subtotal: number, refunded: number): number {
  const commissionCents = toCents(commission)
  const subtotalCents = toCents(subtotal)
  const refundedCents = Math.min(Math.max(0, toCents(refunded)), subtotalCents)
  if (commissionCents <= 0 || refundedCents <= 0) return commissionCents / 100
  if (subtotalCents <= 0 || refundedCents >= subtotalCents) return 0
  return Math.round((commissionCents * (subtotalCents - refundedCents)) / subtotalCents) / 100
}
