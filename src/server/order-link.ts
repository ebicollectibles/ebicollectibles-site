import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { makeOrderLinkToken, verifyOrderLinkToken } from '~/lib/order-link-token'
import { customerRefundList } from '~/lib/refunds'
import { buildShipmentsByOrder } from '~/lib/shipments'
import { getCurrentUserId } from './customer-auth'

// The "View your order" link in order emails opens /orders/<id>?k=<token>:
// that one order, no sign-in needed, the way big shops' order status links
// work. See lib/order-link-token.ts for the signature.
//
// People forward these emails, so the page is view-only and shows less
// than the account order page: no payment method, phone, email or billing
// address. The order's owner, when signed in, is sent to the full account
// page instead.

const SITE_URL = 'https://ebicollectibles.com'

// ORDER_LINK_SECRET if one is set on the Worker, otherwise a key derived
// from DATABASE_URL (already a secret, present everywhere the site runs),
// separate from the unsubscribe key. Setting ORDER_LINK_SECRET later turns
// links already emailed into "sign in to see this order".
async function orderLinkSecret(): Promise<string> {
  const explicit = process.env.ORDER_LINK_SECRET
  if (explicit) return explicit
  const db = process.env.DATABASE_URL
  if (!db) throw new Error('No secret available for order links.')
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`ebi-order-link-key:v1:${db}`))
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

/** The link the order emails' "View your order" button opens. */
export async function orderViewUrl(orderId: string): Promise<string> {
  return `${SITE_URL}/orders/${orderId}?k=${await makeOrderLinkToken(orderId, await orderLinkSecret())}`
}

export const getOrderByLink = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string().uuid(), k: z.string().max(64).optional() }))
  .handler(async ({ data }) => {
    let valid = false
    try {
      valid = await verifyOrderLinkToken(data.id, data.k, await orderLinkSecret())
    } catch {
      valid = false
    }
    if (!valid) return { status: 'invalid' as const }

    const { getDb } = await import('~/lib/db/client')
    const { orders, orderItems, shipments, shipmentItems, refundEvents } = await import('~/lib/db/schema')
    const { eq, inArray } = await import('drizzle-orm')
    const db = getDb()
    const [order] = await db.select().from(orders).where(eq(orders.id, data.id)).limit(1)
    if (!order) return { status: 'invalid' as const }

    const userId = await getCurrentUserId().catch(() => null)
    if (userId && order.userId === userId) return { status: 'owner' as const, id: order.id }

    const [items, ships, refunds] = await Promise.all([
      db.select().from(orderItems).where(eq(orderItems.orderId, order.id)),
      db.select().from(shipments).where(eq(shipments.orderId, order.id)),
      db.select().from(refundEvents).where(eq(refundEvents.orderId, order.id)),
    ])
    const shipItems = ships.length ? await db.select().from(shipmentItems).where(inArray(shipmentItems.shipmentId, ships.map((s) => s.id))) : []
    const itemById = new Map(items.map((i) => [i.id, i]))
    const orderShipments = buildShipmentsByOrder(ships, shipItems, itemById).get(order.id) ?? []

    let combineWithOrderNo: number | null = null
    let combineWithOrderStatus: string | null = null
    if (order.combineWithOrderId) {
      const [anchor] = await db
        .select({ orderNo: orders.orderNo, fulfillmentStatus: orders.fulfillmentStatus })
        .from(orders)
        .where(eq(orders.id, order.combineWithOrderId))
        .limit(1)
      combineWithOrderNo = anchor?.orderNo ?? null
      combineWithOrderStatus = anchor?.fulfillmentStatus ?? null
    }

    // An account can exist under the order's email even when this order
    // was placed as a guest, so check by email too (shown as Sign in).
    let hasAccount = !!order.userId
    if (!hasAccount && order.email) {
      const { users } = await import('~/lib/db/schema')
      const { sql } = await import('drizzle-orm')
      const [u] = await db.select({ id: users.id }).from(users).where(sql`lower(${users.email}) = lower(${order.email})`).limit(1)
      hasAccount = !!u
    }

    // Listed field by field (never ...order) so nothing private rides along.
    return {
      status: 'ok' as const,
      hasAccount,
      order: {
        id: order.id,
        orderNo: order.orderNo,
        createdAt: order.createdAt,
        fulfillmentStatus: order.fulfillmentStatus,
        hasPreorder: order.hasPreorder,
        combineWithOrderId: null,
        combineWithOrderNo,
        combineWithOrderStatus,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        tax: order.tax,
        creditApplied: order.creditApplied,
        total: order.total,
        totalRefunded: refunds.filter((r) => r.status === 'COMPLETED').reduce((t, r) => t + (r.amount ?? 0), 0),
        // Date, amount and reason only (customerRefundList), no Square ids.
        refunds: customerRefundList(refunds),
        firstName: order.firstName,
        lastName: order.lastName,
        street: order.street,
        apartment: order.apartment,
        city: order.city,
        state: order.state,
        zip: order.zip,
        items: items.map((i) => ({ id: i.id, productName: i.productName, img: i.img, qty: i.qty, unitPrice: i.unitPrice })),
        shipments: orderShipments.map((s) => ({
          id: s.id,
          carrier: s.carrier,
          trackingNumber: s.trackingNumber,
          createdAt: s.createdAt,
          items: s.items.map((i) => ({ qty: i.qty, productName: i.productName })),
        })),
      },
    }
  })
