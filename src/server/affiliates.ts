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
 * scopedProducts is the set this affiliate is restricted to (e.g. someone
 * paid to post about one specific item on Discord) — empty means unscoped,
 * commission on the whole order at commissionRate, same as before product
 * scoping existed. Each scoped product's own commissionRate (set in admin)
 * overrides the affiliate's default for just that product when set; null
 * means inherit the default — see computeAffiliateCommission.
 */
export async function resolveAffiliateAttribution(
  refCode: string | undefined,
  checkoutEmail: string,
): Promise<{
  affiliateId: string
  commissionRate: number
  scopedProducts: Array<{ productId: string; commissionRate: number | null }>
} | null> {
  if (!refCode) return null
  const code = refCode.trim().toLowerCase()
  if (!code) return null

  const { getDb } = await import('~/lib/db/client')
  const { affiliates, affiliateProducts, affiliateContacts } = await import('~/lib/db/schema')
  const { and, eq } = await import('drizzle-orm')
  const db = getDb()

  const [affiliate] = await db
    .select({ id: affiliates.id, email: affiliates.email, commissionRate: affiliates.commissionRate })
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

  const scopedRows = await db
    .select({ productId: affiliateProducts.productId, commissionRate: affiliateProducts.commissionRate })
    .from(affiliateProducts)
    .where(eq(affiliateProducts.affiliateId, affiliate.id))

  return { affiliateId: affiliate.id, commissionRate: affiliate.commissionRate, scopedProducts: scopedRows }
}

/**
 * Commission = rate x the commissionable subtotal, rounded to the cent
 * (same convention as every other money calc in this app, see
 * order-math.ts). Unscoped affiliates (scopedProducts empty) commission
 * the whole order at defaultCommissionRate; a scoped affiliate only
 * commissions the lines matching their assigned product(s), each at its
 * own override rate if set, else defaultCommissionRate — a referred
 * customer who buys something else entirely earns them nothing on that
 * portion, and a scoped product overridden to 0% earns nothing on
 * purpose.
 */
export function computeAffiliateCommission(
  lineDetails: Array<{ productId: string; unitPrice: number; qty: number }>,
  defaultCommissionRate: number,
  scopedProducts: Array<{ productId: string; commissionRate: number | null }>,
): number {
  if (scopedProducts.length === 0) {
    const subtotal = lineDetails.reduce((sum, l) => sum + l.unitPrice * l.qty, 0)
    return Math.round(subtotal * (defaultCommissionRate / 100) * 100) / 100
  }
  const rateByProduct = new Map(scopedProducts.map((p) => [p.productId, p.commissionRate ?? defaultCommissionRate]))
  const commission = lineDetails.reduce((sum, l) => {
    const rate = rateByProduct.get(l.productId)
    return rate == null ? sum : sum + l.unitPrice * l.qty * (rate / 100)
  }, 0)
  return Math.round(commission * 100) / 100
}
