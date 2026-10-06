import { createServerFn } from '@tanstack/react-start'
import { and, desc, eq, inArray } from 'drizzle-orm'
import { getDb } from '~/lib/db/client'
import { affiliateContacts, affiliates, orders, refundEvents } from '~/lib/db/schema'
import type { AffiliateDashboardData } from '~/components/AffiliateDashboard'
import { getCurrentCustomer } from './customer-auth'

/**
 * The dashboard's numbers for one already-known affiliate — shared between
 * getMyAffiliate below (resolves which affiliate from the logged-in
 * customer's email) and admin's adminGetAffiliateDashboard (admin already
 * knows the id), so both ultimately render from the exact same query
 * rather than two hand-kept-in-sync copies.
 */
export async function buildAffiliateDashboard(affiliateId: string): Promise<AffiliateDashboardData | null> {
  const db = getDb()
  const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.id, affiliateId)).limit(1)
  if (!affiliate) return null

  const orderRows = await db
    .select({
      id: orders.id,
      orderNo: orders.orderNo,
      createdAt: orders.createdAt,
      subtotal: orders.subtotal,
      affiliateCommission: orders.affiliateCommission,
      affiliateCommissionPaidAt: orders.affiliateCommissionPaidAt,
    })
    .from(orders)
    .where(eq(orders.affiliateId, affiliate.id))
    .orderBy(desc(orders.createdAt))

  // Same rule as adminListAffiliates' owed total — a refunded order never
  // counts toward what's still owed.
  const refundedIds =
    orderRows.length === 0
      ? []
      : await db
          .select({ orderId: refundEvents.orderId })
          .from(refundEvents)
          .where(and(eq(refundEvents.status, 'COMPLETED'), inArray(refundEvents.orderId, orderRows.map((o) => o.id))))
  const refundedSet = new Set(refundedIds.map((r) => r.orderId))

  let totalCommission = 0
  let paidCommission = 0
  let owedCommission = 0
  const orderSummaries = orderRows.map((o) => {
    const commission = Number(o.affiliateCommission ?? 0)
    const refunded = refundedSet.has(o.id)
    const paid = !!o.affiliateCommissionPaidAt
    totalCommission += commission
    if (paid) paidCommission += commission
    else if (!refunded) owedCommission += commission
    return { orderNo: o.orderNo, createdAt: o.createdAt, subtotal: o.subtotal, commission, paid, refunded }
  })

  return {
    code: affiliate.code,
    name: affiliate.name,
    commissionRate: affiliate.commissionRate,
    orderCount: orderRows.length,
    totalCommission: Math.round(totalCommission * 100) / 100,
    paidCommission: Math.round(paidCommission * 100) / 100,
    owedCommission: Math.round(owedCommission * 100) / 100,
    orders: orderSummaries,
  }
}

/**
 * Cheap existence check for the header's "Affiliate" nav link — same
 * matching rule as getMyAffiliate below, without pulling every attributed
 * order just to decide whether to show a link.
 */
export const hasMyAffiliate = createServerFn({ method: 'GET' }).handler(async () => {
  const customer = await getCurrentCustomer()
  if (!customer) return false
  const email = customer.email.trim().toLowerCase()

  const db = getDb()
  const [viaContact] = await db.select({ affiliateId: affiliateContacts.affiliateId }).from(affiliateContacts).where(eq(affiliateContacts.email, email)).limit(1)
  if (viaContact) return true
  const [viaEmail] = await db.select({ id: affiliates.id }).from(affiliates).where(eq(affiliates.email, email)).limit(1)
  return !!viaEmail
})

/**
 * Resolves the logged-in customer's own affiliate record, if any, by
 * matching their account email against affiliateContacts — the same
 * accounts allowed to see this dashboard can also be two or more people at
 * the same affiliate (e.g. co-owners), each with their own site login — or
 * the affiliate's own legacy email field, for one created before that
 * table existed. Returns null for anyone who isn't registered as (or on)
 * any affiliate — the account page hides the "Affiliate" nav link entirely
 * in that case (see isAffiliateUser in __root.tsx), so this is a defensive
 * fallback, not the primary gate.
 *
 * Deliberately exposes only this affiliate's own numbers — no other
 * customer's name, email, or address, and no per-order product detail —
 * same privacy bar as everything else under /account.
 */
export const getMyAffiliate = createServerFn({ method: 'GET' }).handler(async () => {
  const customer = await getCurrentCustomer()
  if (!customer) return null
  const email = customer.email.trim().toLowerCase()

  const db = getDb()
  const [viaContact] = await db
    .select({ affiliateId: affiliateContacts.affiliateId })
    .from(affiliateContacts)
    .where(eq(affiliateContacts.email, email))
    .limit(1)

  const [affiliate] = viaContact
    ? await db.select({ id: affiliates.id }).from(affiliates).where(eq(affiliates.id, viaContact.affiliateId)).limit(1)
    : await db.select({ id: affiliates.id }).from(affiliates).where(eq(affiliates.email, email)).limit(1)
  if (!affiliate) return null

  return buildAffiliateDashboard(affiliate.id)
})
