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
 *
 * scopedProductIds is the set this affiliate is restricted to (e.g.
 * someone paid to post about one specific item on Discord) — empty means
 * unscoped, commission on the whole order, same as before product scoping
 * existed.
 */
export async function resolveAffiliateAttribution(
  refCode: string | undefined,
  checkoutEmail: string,
): Promise<{ affiliateId: string; commissionRate: number; scopedProductIds: string[] } | null> {
  if (!refCode) return null
  const code = refCode.trim().toLowerCase()
  if (!code) return null

  const { getDb } = await import('~/lib/db/client')
  const { affiliates, affiliateProducts } = await import('~/lib/db/schema')
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

  const scopedRows = await db.select({ productId: affiliateProducts.productId }).from(affiliateProducts).where(eq(affiliateProducts.affiliateId, affiliate.id))

  return { affiliateId: affiliate.id, commissionRate: affiliate.commissionRate, scopedProductIds: scopedRows.map((r) => r.productId) }
}

/**
 * Commission = rate x the commissionable subtotal, rounded to the cent
 * (same convention as every other money calc in this app, see
 * order-math.ts). Unscoped affiliates (scopedProductIds empty) commission
 * on the full order subtotal; a scoped affiliate only commissions on the
 * lines matching their assigned product(s) — a referred customer who buys
 * something else entirely earns them nothing on that portion.
 */
export function computeAffiliateCommission(
  lineDetails: Array<{ productId: string; unitPrice: number; qty: number }>,
  commissionRate: number,
  scopedProductIds: string[],
): number {
  const scoped = new Set(scopedProductIds)
  const commissionableSubtotal =
    scoped.size === 0 ? lineDetails.reduce((sum, l) => sum + l.unitPrice * l.qty, 0) : lineDetails.filter((l) => scoped.has(l.productId)).reduce((sum, l) => sum + l.unitPrice * l.qty, 0)
  return Math.round(commissionableSubtotal * (commissionRate / 100) * 100) / 100
}
