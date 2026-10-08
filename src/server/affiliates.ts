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
 * productRates holds each product that has its own commission rate — null
 * means that product inherits commissionRate (the default); see
 * computeAffiliateCommission for how restrictToScopedProducts changes what
 * happens to a product that ISN'T in this list.
 */
export async function resolveAffiliateAttribution(
  refCode: string | undefined,
  checkoutEmail: string,
): Promise<{
  affiliateId: string
  commissionRate: number
  restrictToScopedProducts: boolean
  productRates: Array<{ productId: string; commissionRate: number | null }>
} | null> {
  if (!refCode) return null
  const code = refCode.trim().toLowerCase()
  if (!code) return null

  const { getDb } = await import('~/lib/db/client')
  const { affiliates, affiliateProducts, affiliateContacts } = await import('~/lib/db/schema')
  const { and, eq } = await import('drizzle-orm')
  const db = getDb()

  const [affiliate] = await db
    .select({ id: affiliates.id, email: affiliates.email, commissionRate: affiliates.commissionRate, restrictToScopedProducts: affiliates.restrictToScopedProducts })
    .from(affiliates)
    .where(and(eq(affiliates.code, code), eq(affiliates.active, true)))
    .limit(1)
  if (!affiliate) return null

  const normalizedCheckoutEmail = checkoutEmail.trim().toLowerCase()
  if (affiliate.email && affiliate.email.toLowerCase() === normalizedCheckoutEmail) {
    return null
  }
  // Same guard, extended to every account that can see this affiliate's own
  // dashboard (see affiliateContacts in schema.ts) — any of them crediting
  // their own purchase is the same self-referral affiliate.email already
  // blocked above.
  const [contactMatch] = await db
    .select({ email: affiliateContacts.email })
    .from(affiliateContacts)
    .where(and(eq(affiliateContacts.affiliateId, affiliate.id), eq(affiliateContacts.email, normalizedCheckoutEmail)))
    .limit(1)
  if (contactMatch) return null

  const productRates = await db
    .select({ productId: affiliateProducts.productId, commissionRate: affiliateProducts.commissionRate })
    .from(affiliateProducts)
    .where(eq(affiliateProducts.affiliateId, affiliate.id))

  return {
    affiliateId: affiliate.id,
    commissionRate: affiliate.commissionRate,
    restrictToScopedProducts: affiliate.restrictToScopedProducts,
    productRates,
  }
}

/**
 * Commission = rate x the commissionable subtotal, rounded to the cent
 * (same convention as every other money calc in this app, see
 * order-math.ts).
 *
 * - restrictToScopedProducts false (the common case): every line earns
 *   commission — its own rate from productRates if it has one, else
 *   defaultCommissionRate. A listed override (including 0, "this one item
 *   earns nothing") never affects any other product.
 * - restrictToScopedProducts true: ONLY lines listed in productRates earn
 *   anything (at their own rate, or defaultCommissionRate if unset) — a
 *   referred customer who buys something else entirely earns nothing on
 *   that portion. For an affiliate paid to promote one exact item and
 *   nothing else.
 */
export function computeAffiliateCommission(
  lineDetails: Array<{ productId: string; unitPrice: number; qty: number }>,
  defaultCommissionRate: number,
  restrictToScopedProducts: boolean,
  productRates: Array<{ productId: string; commissionRate: number | null }>,
): number {
  const rateByProduct = new Map(productRates.map((p) => [p.productId, p.commissionRate ?? defaultCommissionRate]))
  const commission = lineDetails.reduce((sum, l) => {
    const rate = rateByProduct.has(l.productId) ? rateByProduct.get(l.productId)! : restrictToScopedProducts ? null : defaultCommissionRate
    return rate == null ? sum : sum + l.unitPrice * l.qty * (rate / 100)
  }, 0)
  return Math.round(commission * 100) / 100
}
