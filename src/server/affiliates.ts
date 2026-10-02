// Checkout-time affiliate attribution — see orders.ts's placeOrder, which is
// the only caller. Deliberately not a createServerFn: this never runs on
// its own, only as part of placing an order, so it's a plain function
// taking already-validated values rather than its own client-callable RPC
// endpoint with its own input surface to defend.
//
// Admin-facing affiliate CRUD (list/create/update/mark-paid) lives in
// server/admin.ts, alongside every other admin-only table in this app.

/**
 * Resolves the ebi_ref cookie (if any) to an affiliate to credit this order
 * to, or null if there's nothing to attribute. Two abuse guards baked in:
 * - Only active affiliates match — a deactivated or unknown code is a
 *   silent no-op, never a checkout error.
 * - An affiliate can't credit their own purchase: if the checkout email
 *   matches the affiliate's own email (case-insensitive), this returns
 *   null. Doesn't stop someone from using a different email to self-refer,
 *   but that requires an actual paid order to exist either way, and admin
 *   reviews payouts before sending real money — this catches the naive
 *   case for free, not meant to be cryptographically airtight.
 */
export async function resolveAffiliateAttribution(
  refCode: string | undefined,
  checkoutEmail: string,
): Promise<{ affiliateId: string; commissionRate: number } | null> {
  if (!refCode) return null
  const code = refCode.trim().toLowerCase()
  if (!code) return null

  const { getDb } = await import('~/lib/db/client')
  const { affiliates } = await import('~/lib/db/schema')
  const { and, eq } = await import('drizzle-orm')
  const db = getDb()

  const [affiliate] = await db
    .select({ id: affiliates.id, email: affiliates.email, commissionRate: affiliates.commissionRate })
    .from(affiliates)
    .where(and(eq(affiliates.code, code), eq(affiliates.active, true)))
    .limit(1)
  if (!affiliate) return null

  if (affiliate.email && affiliate.email.toLowerCase() === checkoutEmail.trim().toLowerCase()) {
    return null
  }

  return { affiliateId: affiliate.id, commissionRate: affiliate.commissionRate }
}

/** Rounds to the cent, same convention as every other money calc in this app (see order-math.ts). */
export function computeAffiliateCommission(subtotal: number, commissionRate: number): number {
  return Math.round(subtotal * (commissionRate / 100) * 100) / 100
}
