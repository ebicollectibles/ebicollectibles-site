import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { and, asc, desc, eq, inArray, isNull, or, sql } from 'drizzle-orm'
import { getDb } from '~/lib/db/client'
import {
  authEvents,
  emailEvents,
  orderItems,
  orderStatusEvents,
  orders,
  paymentAttempts,
  productEditEvents,
  products as productsTable,
  refundEvents,
  shipmentItems,
  shipments,
  subscriberEvents,
  subscribers,
  users,
} from '~/lib/db/schema'
import { CARRIERS } from '~/lib/carriers'
import { PRODUCT_CATEGORIES, SUBCATEGORIES_BY_CATEGORY, ALL_SUBCATEGORIES } from '~/lib/products'
import { computeFulfillmentStatus, remainingQtyByItem } from '~/lib/shipments'
import { assertAdmin } from './admin-auth'
import { sendShipmentEmail } from './email'
import { overlaySquareData, searchSquareCatalogItems } from './square'
import { upsertSubscriber } from './subscribers'

// Base object (not yet refined) so adminUpdateProduct can still .extend() it
// with originalId — z.object().refine() returns a ZodEffects, which has no
// .extend(), so the subcategory-belongs-to-category check is applied
// separately to each final shape via withSubcategoryCheck below.
const productBaseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  code: z.string().min(1),
  category: z.enum(PRODUCT_CATEGORIES),
  subcategory: z.enum(ALL_SUBCATEGORIES as [string, ...string[]]),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().nullable().optional(),
  stock: z.number().int().nonnegative(),
  squareVariationId: z.string().nullable().optional(),
  img: z.string().optional(),
  imgTablet: z.string().optional(),
  imgMobile: z.string().optional(),
  imgAlt: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
  preorder: z.boolean().optional().default(false),
  placeholder: z.string().optional(),
  published: z.boolean().optional().default(true),
})

function withSubcategoryCheck<T extends z.ZodObject<z.ZodRawShape>>(schema: T) {
  return schema.refine((data) => (SUBCATEGORIES_BY_CATEGORY[data.category as keyof typeof SUBCATEGORIES_BY_CATEGORY] as string[]).includes(data.subcategory as string), {
    message: 'Subcategory does not belong to the selected category.',
    path: ['subcategory'],
  })
}

const productSchema = withSubcategoryCheck(productBaseSchema)

export const adminListProducts = createServerFn({ method: 'GET' }).handler(async () => {
  await assertAdmin()
  const db = getDb()
  const rows = await db.select().from(productsTable).orderBy(asc(productsTable.createdAt))
  return overlaySquareData(rows)
})

export const adminGetProduct = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    const [row] = await db.select().from(productsTable).where(eq(productsTable.id, data.id)).limit(1)
    if (!row) return null
    const [withLiveStock] = await overlaySquareData([row])

    const editHistory = await db
      .select({ field: productEditEvents.field, oldValue: productEditEvents.oldValue, newValue: productEditEvents.newValue, createdAt: productEditEvents.createdAt })
      .from(productEditEvents)
      .where(eq(productEditEvents.productId, data.id))
      .orderBy(desc(productEditEvents.createdAt))
      .limit(50)

    return { ...withLiveStock, editHistory }
  })

export const adminSearchSquareCatalog = createServerFn({ method: 'GET' })
  .validator(z.object({ query: z.string().optional() }))
  .handler(async ({ data }) => {
    await assertAdmin()
    return searchSquareCatalogItems(data.query)
  })

export const adminCreateProduct = createServerFn({ method: 'POST' })
  .validator(productSchema)
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    await db.insert(productsTable).values(data)
    return { ok: true }
  })

const TRACKED_EDIT_FIELDS = ['price', 'compareAtPrice', 'stock'] as const

export const adminUpdateProduct = createServerFn({ method: 'POST' })
  .validator(withSubcategoryCheck(productBaseSchema.extend({ originalId: z.string() })))
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    const { originalId, ...rest } = data

    const [before] = await db.select().from(productsTable).where(eq(productsTable.id, originalId)).limit(1)

    await db
      .update(productsTable)
      .set({ ...rest, updatedAt: new Date() })
      .where(eq(productsTable.id, originalId))

    if (before) {
      const edits = TRACKED_EDIT_FIELDS.filter((field) => before[field] !== rest[field]).map((field) => ({
        productId: originalId,
        productName: rest.name,
        field,
        oldValue: before[field] == null ? null : String(before[field]),
        newValue: rest[field] == null ? null : String(rest[field]),
      }))
      if (edits.length > 0) await db.insert(productEditEvents).values(edits)
    }

    return { ok: true }
  })

export const adminDeleteProduct = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    await db.delete(productsTable).where(eq(productsTable.id, data.id))
    return { ok: true }
  })

function groupBy<T, K>(rows: T[], key: (row: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>()
  for (const row of rows) {
    const k = key(row)
    const list = map.get(k) ?? []
    list.push(row)
    map.set(k, list)
  }
  return map
}

// Attaches each shipment's line items (with product names, for display) and
// groups the resulting shipments by order id — shared by adminListOrders and
// adminGetCustomer so the two don't drift.
function buildShipmentsByOrder(
  shipmentRows: Array<{ id: string; orderId: string; carrier: string | null; trackingNumber: string | null; createdAt: Date }>,
  shipmentItemRows: Array<{ shipmentId: string; orderItemId: string; qty: number }>,
  itemById: Map<string, { productName: string }>,
) {
  const itemsByShipment = groupBy(shipmentItemRows, (si) => si.shipmentId)
  const shipmentsWithItems = shipmentRows.map((s) => ({
    ...s,
    items: (itemsByShipment.get(s.id) ?? []).map((si) => ({
      orderItemId: si.orderItemId,
      qty: si.qty,
      productName: itemById.get(si.orderItemId)?.productName ?? 'Unknown item',
    })),
  }))
  return groupBy(shipmentsWithItems, (s) => s.orderId)
}

// Surface-level only (no items/status history/shipments/emails) — the list
// view is meant to be scannable, with everything else a click away on
// adminGetOrder. Still pulls a refund total since "this order was refunded"
// is worth flagging at a glance.
export const adminListOrders = createServerFn({ method: 'GET' }).handler(async () => {
  await assertAdmin()
  const db = getDb()
  const orderRows = await db.select().from(orders).orderBy(desc(orders.createdAt))
  const refundRows = await db
    .select({ orderId: refundEvents.orderId, amount: refundEvents.amount, status: refundEvents.status })
    .from(refundEvents)
    .where(eq(refundEvents.status, 'COMPLETED'))

  const refundedByOrder = new Map<string, number>()
  for (const r of refundRows) {
    if (!r.orderId) continue
    refundedByOrder.set(r.orderId, (refundedByOrder.get(r.orderId) ?? 0) + (r.amount ?? 0))
  }

  return orderRows.map((order) => ({ ...order, totalRefunded: refundedByOrder.get(order.id) ?? 0 }))
})

export const adminGetOrder = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    const [order] = await db.select().from(orders).where(eq(orders.id, data.id)).limit(1)
    if (!order) return null

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, data.id))
    const statusHistory = await db
      .select({ status: orderStatusEvents.status, createdAt: orderStatusEvents.createdAt })
      .from(orderStatusEvents)
      .where(eq(orderStatusEvents.orderId, data.id))
      .orderBy(asc(orderStatusEvents.createdAt))
    const refunds = await db
      .select({ amount: refundEvents.amount, status: refundEvents.status, createdAt: refundEvents.createdAt })
      .from(refundEvents)
      .where(eq(refundEvents.orderId, data.id))
      .orderBy(desc(refundEvents.createdAt))
    const emails = await db
      .select({ type: emailEvents.type, status: emailEvents.status, errorMessage: emailEvents.errorMessage, createdAt: emailEvents.createdAt })
      .from(emailEvents)
      .where(eq(emailEvents.orderId, data.id))
      .orderBy(asc(emailEvents.createdAt))
    const shipmentRows = await db.select().from(shipments).where(eq(shipments.orderId, data.id)).orderBy(asc(shipments.createdAt))
    const shipmentIds = shipmentRows.map((s) => s.id)
    const shipmentItemRows = shipmentIds.length === 0 ? [] : await db.select().from(shipmentItems).where(inArray(shipmentItems.shipmentId, shipmentIds))

    const itemById = new Map(items.map((i) => [i.id, i]))
    const orderShipments = buildShipmentsByOrder(shipmentRows, shipmentItemRows, itemById).get(data.id) ?? []

    return { ...order, items, statusHistory, refunds, emails, shipments: orderShipments }
  })

// "shipped" and "partially_shipped" are never set directly — they're always
// derived from recorded shipments (see adminCreateShipment). Admin can only
// force a cancel or revert to pending here.
export const adminUpdateOrderStatus = createServerFn({ method: 'POST' })
  .validator(z.object({ orderId: z.string(), status: z.enum(['pending', 'cancelled']) }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    await db.update(orders).set({ fulfillmentStatus: data.status }).where(eq(orders.id, data.orderId))
    await db.insert(orderStatusEvents).values({ orderId: data.orderId, status: data.status })
    return { ok: true }
  })

export const adminCreateShipment = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      orderId: z.string(),
      carrier: z.enum(CARRIERS).nullable().optional(),
      trackingNumber: z.string().trim().nullable().optional(),
      items: z.array(z.object({ orderItemId: z.string(), qty: z.number().int().positive() })).min(1),
    }),
  )
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()

    const [order] = await db.select().from(orders).where(eq(orders.id, data.orderId)).limit(1)
    if (!order) throw new Error('Order not found.')

    const allItems = await db.select().from(orderItems).where(eq(orderItems.orderId, data.orderId))
    const itemById = new Map(allItems.map((i) => [i.id, i]))

    const priorShipments = await db.select({ id: shipments.id }).from(shipments).where(eq(shipments.orderId, data.orderId))
    const priorShipmentIds = priorShipments.map((s) => s.id)
    const priorShipmentItemRows =
      priorShipmentIds.length === 0 ? [] : await db.select().from(shipmentItems).where(inArray(shipmentItems.shipmentId, priorShipmentIds))
    const priorShippedItems = priorShipmentItemRows.map((si) => ({ orderItemId: si.orderItemId, qty: si.qty }))

    const remaining = remainingQtyByItem(allItems, priorShippedItems)
    for (const line of data.items) {
      const item = itemById.get(line.orderItemId)
      if (!item) throw new Error('One of the selected items does not belong to this order.')
      const available = remaining.get(line.orderItemId) ?? 0
      if (line.qty > available) throw new Error(`Only ${available} of "${item.productName}" remain to be shipped.`)
    }

    const carrier = data.carrier || null
    const trackingNumber = data.trackingNumber || null

    const [shipment] = await db.insert(shipments).values({ orderId: data.orderId, carrier, trackingNumber }).returning()
    await db.insert(shipmentItems).values(data.items.map((line) => ({ shipmentId: shipment.id, orderItemId: line.orderItemId, qty: line.qty })))

    const newStatus = computeFulfillmentStatus(allItems, [...priorShippedItems, ...data.items])
    await db.update(orders).set({ fulfillmentStatus: newStatus }).where(eq(orders.id, data.orderId))
    await db.insert(orderStatusEvents).values({ orderId: data.orderId, status: newStatus })

    // Best-effort: email the customer about this specific shipment — only
    // the items/quantities actually in it, not the whole order — since a
    // failed/skipped send shouldn't block the shipment record itself.
    try {
      const shippedLines = data.items.map((line) => {
        const item = itemById.get(line.orderItemId)!
        return { productName: item.productName, qty: line.qty, unitPrice: item.unitPrice, img: item.img }
      })
      const sendResult = await sendShipmentEmail({
        orderNo: order.orderNo,
        email: order.email,
        firstName: order.firstName,
        street: order.street,
        apartment: order.apartment,
        city: order.city,
        state: order.state,
        zip: order.zip,
        carrier,
        trackingNumber,
        isFinalShipment: newStatus === 'shipped',
        items: shippedLines,
      })
      await db.insert(emailEvents).values({
        orderId: order.id,
        email: order.email,
        type: 'shipment_notice',
        status: sendResult.status,
        errorMessage: sendResult.error ?? null,
      })
    } catch (err) {
      console.error(`Failed to send shipment email for order ${order.orderNo}:`, err)
    }

    return { ok: true, status: newStatus }
  })

export const adminListPaymentFailures = createServerFn({ method: 'GET' }).handler(async () => {
  await assertAdmin()
  const db = getDb()
  return db
    .select({ id: paymentAttempts.id, email: paymentAttempts.email, amount: paymentAttempts.amount, errorMessage: paymentAttempts.errorMessage, createdAt: paymentAttempts.createdAt })
    .from(paymentAttempts)
    .orderBy(desc(paymentAttempts.createdAt))
    .limit(30)
})

export const adminListCustomers = createServerFn({ method: 'GET' }).handler(async () => {
  await assertAdmin()
  const db = getDb()
  const customerRows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      hasPassword: sql<boolean>`${users.passwordHash} is not null`,
      hasGoogle: sql<boolean>`${users.googleId} is not null`,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))

  const counts = await db
    .select({ userId: orders.userId, count: sql<number>`count(*)::int` })
    .from(orders)
    .where(sql`${orders.userId} is not null`)
    .groupBy(orders.userId)
  const countByUser = new Map(counts.map((c) => [c.userId, c.count]))

  return customerRows.map((c) => ({ ...c, orderCount: countByUser.get(c.id) ?? 0 }))
})

export const adminListSubscribers = createServerFn({ method: 'GET' }).handler(async () => {
  await assertAdmin()
  const db = getDb()
  return db
    .select({
      id: subscribers.id,
      email: subscribers.email,
      source: subscribers.source,
      subscribedAt: subscribers.subscribedAt,
      unsubscribedAt: subscribers.unsubscribedAt,
      createdAt: subscribers.createdAt,
    })
    .from(subscribers)
    .orderBy(desc(subscribers.subscribedAt))
})

// Full subscribe/unsubscribe/resubscribe history across every email — this
// is what answers "did they leave and come back, and when," not just the
// current state adminListSubscribers returns.
export const adminListSubscriberEvents = createServerFn({ method: 'GET' }).handler(async () => {
  await assertAdmin()
  const db = getDb()
  return db
    .select({ id: subscriberEvents.id, email: subscriberEvents.email, type: subscriberEvents.type, source: subscriberEvents.source, createdAt: subscriberEvents.createdAt })
    .from(subscriberEvents)
    .orderBy(desc(subscriberEvents.createdAt))
})

export const adminUnsubscribe = createServerFn({ method: 'POST' })
  .validator(z.object({ email: z.string() }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    const [row] = await db
      .update(subscribers)
      .set({ unsubscribedAt: sql`now()` })
      .where(and(eq(subscribers.email, data.email), isNull(subscribers.unsubscribedAt)))
      .returning({ id: subscribers.id })
    if (row) {
      await db.insert(subscriberEvents).values({ email: data.email, type: 'unsubscribed', source: null })
    }
    return { ok: true }
  })

export const adminResubscribe = createServerFn({ method: 'POST' })
  .validator(z.object({ email: z.string() }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    await upsertSubscriber(db, data.email, 'admin')
    return { ok: true }
  })

export const adminGetCustomer = createServerFn({ method: 'GET' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    const [customer] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        hasPassword: sql<boolean>`${users.passwordHash} is not null`,
        hasGoogle: sql<boolean>`${users.googleId} is not null`,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, data.id))
      .limit(1)
    if (!customer) return null

    const authEventRows = await db
      .select({ type: authEvents.type, createdAt: authEvents.createdAt })
      .from(authEvents)
      .where(eq(authEvents.userId, data.id))
      .orderBy(desc(authEvents.createdAt))
      .limit(50)

    const failedPayments = await db
      .select({ amount: paymentAttempts.amount, errorMessage: paymentAttempts.errorMessage, createdAt: paymentAttempts.createdAt })
      .from(paymentAttempts)
      .where(or(eq(paymentAttempts.userId, data.id), eq(paymentAttempts.email, customer.email)))
      .orderBy(desc(paymentAttempts.createdAt))
      .limit(50)

    const events = [
      ...authEventRows.map((e) => ({ type: e.type, createdAt: e.createdAt, detail: null as string | null })),
      ...failedPayments.map((p) => ({ type: 'payment_failed', createdAt: p.createdAt, detail: p.errorMessage })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const orderRows = await db.select().from(orders).where(eq(orders.userId, data.id)).orderBy(desc(orders.createdAt))
    const orderIds = orderRows.map((o) => o.id)
    const itemRows = orderIds.length === 0 ? [] : await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))
    const statusRows =
      orderIds.length === 0
        ? []
        : await db
            .select({ orderId: orderStatusEvents.orderId, status: orderStatusEvents.status, createdAt: orderStatusEvents.createdAt })
            .from(orderStatusEvents)
            .where(inArray(orderStatusEvents.orderId, orderIds))
            .orderBy(asc(orderStatusEvents.createdAt))
    const emailRows =
      orderIds.length === 0
        ? []
        : await db
            .select({ orderId: emailEvents.orderId, type: emailEvents.type, status: emailEvents.status, errorMessage: emailEvents.errorMessage, createdAt: emailEvents.createdAt })
            .from(emailEvents)
            .where(inArray(emailEvents.orderId, orderIds))
            .orderBy(asc(emailEvents.createdAt))
    const shipmentRows = orderIds.length === 0 ? [] : await db.select().from(shipments).where(inArray(shipments.orderId, orderIds)).orderBy(asc(shipments.createdAt))
    const shipmentIds = shipmentRows.map((s) => s.id)
    const shipmentItemRows = shipmentIds.length === 0 ? [] : await db.select().from(shipmentItems).where(inArray(shipmentItems.shipmentId, shipmentIds))

    const itemsByOrder = groupBy(itemRows, (i) => i.orderId)
    const statusByOrder = groupBy(statusRows, (s) => s.orderId)
    const emailsByOrder = groupBy(emailRows.filter((e) => e.orderId), (e) => e.orderId as string)
    const itemById = new Map(itemRows.map((i) => [i.id, i]))
    const shipmentsByOrder = buildShipmentsByOrder(shipmentRows, shipmentItemRows, itemById)

    return {
      customer,
      orders: orderRows.map((order) => ({
        ...order,
        items: itemsByOrder.get(order.id) ?? [],
        statusHistory: statusByOrder.get(order.id) ?? [],
        emails: emailsByOrder.get(order.id) ?? [],
        shipments: shipmentsByOrder.get(order.id) ?? [],
      })),
      events,
    }
  })
