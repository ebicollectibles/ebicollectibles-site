import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { and, asc, desc, eq, inArray, isNotNull, isNull, notInArray, or, sql } from 'drizzle-orm'
import { getDb } from '~/lib/db/client'
import {
  authEvents,
  emailEvents,
  marketplaceOrderItems,
  marketplaceOrders,
  marketplaceShipmentItems,
  marketplaceShipments,
  orderItems,
  orderStatusEvents,
  orders,
  paymentAttempts,
  productEditEvents,
  products as productsTable,
  refundEvents,
  shipmentItems,
  shipments,
  storeCreditBalances,
  subscriberEvents,
  subscribers,
  users,
} from '~/lib/db/schema'
import { CARRIERS } from '~/lib/carriers'
import { PRODUCT_CATEGORIES, SUBCATEGORIES_BY_CATEGORY, ALL_SUBCATEGORIES, isValidGtin13, GOOGLE_CONDITIONS } from '~/lib/products'
import { buildShipmentsByOrder, computeFulfillmentStatus, groupBy, remainingQtyByItem } from '~/lib/shipments'
import { assertAdmin } from './admin-auth'
import { sendMarketplaceShipmentEmail, sendShipmentEmail, sendShippingDelayEmail, type EmailSendResult } from './email'
import { getSquareCatalogImages, overlaySquareData, searchMarketplaceOrders, searchSquareCatalogItems } from './square'
import { upsertSubscriber } from './subscribers'

// Base object (not yet refined) so adminUpdateProduct can still .extend() it
// with originalId — z.object().refine() returns a ZodEffects, which has no
// .extend(), so the subcategory-belongs-to-category check is applied
// separately to each final shape via withSubcategoryCheck below.
const productBaseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
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
  tags: z.array(z.string()).optional().default([]),
  bestSellingRank: z.number().int().nullable().optional(),
  newAndUpcomingRank: z.number().int().nullable().optional(),
  hideFromBestSelling: z.boolean().optional().default(false),
  hideFromNewAndUpcoming: z.boolean().optional().default(false),
  description: z.string().optional(),
  preorder: z.boolean().optional().default(false),
  shipsWithDelay: z.boolean().optional().default(false),
  comingSoon: z.boolean().optional().default(false),
  placeholder: z.string().optional(),
  published: z.boolean().optional().default(true),
  gtin: z
    .string()
    .trim()
    .refine(isValidGtin13, 'Must be a valid 13-digit GTIN (correct check digit).')
    .nullable()
    .optional(),
  brand: z.string().trim().optional(),
  condition: z.enum(GOOGLE_CONDITIONS).nullable().optional(),
  googleProductCategory: z.string().trim().optional(),
  weightLb: z.number().positive().nullable().optional(),
  variantGroupId: z.string().trim().optional(),
  variantLabel: z.string().trim().optional(),
  variantSortOrder: z.number().int().nullable().optional(),
  hideFromShopGrid: z.boolean().optional().default(false),
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

const RANK_COLUMNS = {
  bestSellingRank: productsTable.bestSellingRank,
  newAndUpcomingRank: productsTable.newAndUpcomingRank,
} as const

// Saves the admin's curated Best Selling / New & Upcoming list: orderedIds
// is the *complete* membership + order of that list (Shopify-style manual
// collection, not the whole catalog) — every id gets rewritten to its
// 1-based position, and any product previously ranked for this field but
// no longer in orderedIds (removed in the admin UI) has its rank cleared
// back to null, i.e. unfeatured. A full rewrite of the set (not a
// diff/shift) is what makes "drag one item, everything between its old and
// new spot shifts" work for free.
export const adminSetProductRanks = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      field: z.enum(['bestSellingRank', 'newAndUpcomingRank']),
      orderedIds: z.array(z.string()),
    }),
  )
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()
    const column = RANK_COLUMNS[data.field]

    const clearWhere =
      data.orderedIds.length > 0
        ? and(isNotNull(column), notInArray(productsTable.id, data.orderedIds))
        : isNotNull(column)
    await db.update(productsTable).set({ [data.field]: null }).where(clearWhere)

    for (let i = 0; i < data.orderedIds.length; i++) {
      await db
        .update(productsTable)
        .set({ [data.field]: i + 1, updatedAt: new Date() })
        .where(eq(productsTable.id, data.orderedIds[i]))
    }
    return { ok: true }
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
    try {
      await db.insert(productsTable).values(data)
    } catch (err: any) {
      // '23505' = Postgres unique_violation — id is the product's slug and
      // primary key, so this only ever means someone already used it
      // (typically from cloning another product's form values and
      // forgetting to change the id). Surface that plainly instead of the
      // raw SQL error.
      if (err?.code === '23505') {
        throw new Error(`"${data.id}" is already in use by another product — choose a different ID.`)
      }
      throw err
    }
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

    try {
      await db
        .update(productsTable)
        .set({ ...rest, updatedAt: new Date() })
        .where(eq(productsTable.id, originalId))
    } catch (err: any) {
      // Same failure mode as adminCreateProduct — here it means the id/slug
      // was changed to one another product already uses.
      if (err?.code === '23505') {
        throw new Error(`"${rest.id}" is already in use by another product — choose a different ID.`)
      }
      throw err
    }

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
  // Item names per order — just enough to filter/display "orders containing
  // this product" on the list page (e.g. picking out everyone still waiting
  // on one specific item to send a delay notice), not the full line items.
  const itemRows = await db.select({ orderId: orderItems.orderId, productName: orderItems.productName }).from(orderItems)

  const refundedByOrder = new Map<string, number>()
  for (const r of refundRows) {
    if (!r.orderId) continue
    refundedByOrder.set(r.orderId, (refundedByOrder.get(r.orderId) ?? 0) + (r.amount ?? 0))
  }
  const itemNamesByOrder = groupBy(itemRows, (i) => i.orderId)

  return orderRows.map((order) => ({
    ...order,
    totalRefunded: refundedByOrder.get(order.id) ?? 0,
    itemNames: (itemNamesByOrder.get(order.id) ?? []).map((i) => i.productName),
  }))
})

export const adminSendDelayNotice = createServerFn({ method: 'POST' })
  .validator(z.object({ orderIds: z.array(z.string()).min(1), message: z.string().trim().min(1) }))
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()

    const orderRows = await db.select().from(orders).where(inArray(orders.id, data.orderIds))
    const itemRows = await db.select().from(orderItems).where(inArray(orderItems.orderId, data.orderIds))
    const itemsByOrder = groupBy(itemRows, (i) => i.orderId)

    const results: { orderId: string; orderNo: number; status: EmailSendResult['status'] }[] = []
    for (const order of orderRows) {
      const items = (itemsByOrder.get(order.id) ?? []).map((i) => ({
        productName: i.productName,
        qty: i.qty,
        unitPrice: i.unitPrice,
        img: i.img,
      }))
      let sendResult: EmailSendResult
      try {
        sendResult = await sendShippingDelayEmail({
          orderNo: order.orderNo,
          orderId: order.id,
          email: order.email,
          firstName: order.firstName,
          message: data.message,
          items,
        })
      } catch (err) {
        console.error(`Failed to send delay email for order ${order.orderNo}:`, err)
        sendResult = { status: 'failed', error: err instanceof Error ? err.message : String(err) }
      }
      await db.insert(emailEvents).values({
        orderId: order.id,
        email: order.email,
        type: 'shipping_delay',
        status: sendResult.status,
        errorMessage: sendResult.error ?? null,
      })
      results.push({ orderId: order.id, orderNo: order.orderNo, status: sendResult.status })
    }

    return { results }
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
        lastName: order.lastName,
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

// Same idea as adminSendMarketplaceShipmentTest — sends the real email
// through the real pipeline (images, formatting, and all) to an address
// admin picks, previewing whichever items/qty are currently staged in the
// ship form, but never writes anything (no shipment record, no order row
// change, no email_events row, doesn't count as "sent").
export const adminSendShipmentTest = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      orderId: z.string(),
      testEmail: z.string().email(),
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
    const isFinalShipment = computeFulfillmentStatus(allItems, [...priorShippedItems, ...data.items]) === 'shipped'

    const sendResult = await sendShipmentEmail({
      orderNo: order.orderNo,
      email: data.testEmail,
      firstName: order.firstName,
      lastName: order.lastName,
      street: order.street,
      apartment: order.apartment,
      city: order.city,
      state: order.state,
      zip: order.zip,
      carrier: data.carrier || null,
      trackingNumber: data.trackingNumber?.trim() || null,
      isFinalShipment,
      items: data.items.map((line) => {
        const item = itemById.get(line.orderItemId)
        if (!item) throw new Error('One of the selected items does not belong to this order.')
        return { productName: item.productName, qty: line.qty, unitPrice: item.unitPrice, img: item.img }
      }),
    })

    if (sendResult.status !== 'sent') throw new Error(sendResult.error || `Test send ${sendResult.status}.`)
    return { ok: true }
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

export const adminListSecurityEvents = createServerFn({ method: 'GET' }).handler(async () => {
  await assertAdmin()
  const db = getDb()
  return db
    .select({
      id: authEvents.id,
      type: authEvents.type,
      email: authEvents.email,
      ipAddress: authEvents.ipAddress,
      asOrganization: authEvents.asOrganization,
      country: authEvents.country,
      createdAt: authEvents.createdAt,
    })
    .from(authEvents)
    .orderBy(desc(authEvents.createdAt))
    .limit(100)
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

  const balances = await db.select({ userId: storeCreditBalances.userId, balance: storeCreditBalances.balance }).from(storeCreditBalances)
  const balanceByUser = new Map(balances.map((b) => [b.userId, b.balance]))

  return customerRows.map((c) => ({ ...c, orderCount: countByUser.get(c.id) ?? 0, creditBalance: balanceByUser.get(c.id) ?? 0 }))
})

export const adminListSubscribers = createServerFn({ method: 'GET' }).handler(async () => {
  await assertAdmin()
  const db = getDb()
  return db
    .select({
      id: subscribers.id,
      email: subscribers.email,
      firstName: subscribers.firstName,
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
      .select({
        type: authEvents.type,
        createdAt: authEvents.createdAt,
        ipAddress: authEvents.ipAddress,
        asOrganization: authEvents.asOrganization,
        country: authEvents.country,
      })
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
      ...authEventRows.map((e) => ({
        type: e.type,
        createdAt: e.createdAt,
        detail: [e.ipAddress, e.asOrganization, e.country].filter(Boolean).join(' · ') || null,
      })),
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

// --- Marketplace orders (DropNotify, or whatever else sells against this
// same Square location/inventory) — see marketplace_orders in schema.ts for
// why these are a separate table rather than rows in orders/order_items. ---

export const adminListMarketplaceOrders = createServerFn({ method: 'GET' }).handler(async () => {
  await assertAdmin()
  const db = getDb()
  const orderRows = await db.select().from(marketplaceOrders).orderBy(desc(marketplaceOrders.placedAt))
  const orderIds = orderRows.map((o) => o.id)
  const itemRows = orderIds.length === 0 ? [] : await db.select().from(marketplaceOrderItems).where(inArray(marketplaceOrderItems.marketplaceOrderId, orderIds))
  const itemsByOrder = groupBy(itemRows, (i) => i.marketplaceOrderId)

  const shipmentRows =
    orderIds.length === 0 ? [] : await db.select().from(marketplaceShipments).where(inArray(marketplaceShipments.marketplaceOrderId, orderIds)).orderBy(asc(marketplaceShipments.createdAt))
  const shipmentIds = shipmentRows.map((s) => s.id)
  const shipmentItemRows =
    shipmentIds.length === 0 ? [] : await db.select().from(marketplaceShipmentItems).where(inArray(marketplaceShipmentItems.shipmentId, shipmentIds))
  const itemById = new Map(itemRows.map((i) => [i.id, i]))
  const shipmentsByOrder = buildMarketplaceShipmentsByOrder(shipmentRows, shipmentItemRows, itemById)

  return orderRows.map((order) => ({
    ...order,
    items: itemsByOrder.get(order.id) ?? [],
    shipments: shipmentsByOrder.get(order.id) ?? [],
  }))
})

// Same shape as buildShipmentsByOrder (lib/shipments.ts), kept local since
// marketplace shipment rows use marketplaceOrderId/marketplaceOrderItemId
// rather than orderId/orderItemId — not worth genericizing the shared
// helper over both field-name shapes.
function buildMarketplaceShipmentsByOrder(
  shipmentRows: (typeof marketplaceShipments.$inferSelect)[],
  shipmentItemRows: (typeof marketplaceShipmentItems.$inferSelect)[],
  itemById: Map<string, { productName: string }>,
) {
  const itemsByShipment = groupBy(shipmentItemRows, (si) => si.shipmentId)
  const shipmentsWithItems = shipmentRows.map((s) => ({
    ...s,
    items: (itemsByShipment.get(s.id) ?? []).map((si) => ({
      marketplaceOrderItemId: si.marketplaceOrderItemId,
      qty: si.qty,
      productName: itemById.get(si.marketplaceOrderItemId)?.productName ?? 'Unknown item',
    })),
  }))
  return groupBy(shipmentsWithItems, (s) => s.marketplaceOrderId)
}

// Pulls orders from Square (filtered to MARKETPLACE_ORDER_SOURCES, paid —
// see searchMarketplaceOrders) and either inserts ones never seen before or
// refreshes ones already imported but still unshipped (contact/carrier/
// tracking/items, including re-resolving each item's photo) — an unshipped
// order hasn't gone out to anyone yet, so overwriting its derived data with
// fresher data from Square is always safe. A SHIPPED order is left alone
// entirely: its email already went out, there's nothing left to refresh,
// and touching it risks clobbering the record of what was actually sent.
export const adminSyncMarketplaceOrders = createServerFn({ method: 'POST' }).handler(async () => {
  await assertAdmin()
  const sourceNames = (process.env.MARKETPLACE_ORDER_SOURCES ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (sourceNames.length === 0) {
    throw new Error('Set MARKETPLACE_ORDER_SOURCES (comma-separated Square order source names, e.g. "DropNotify") to sync marketplace orders.')
  }

  const db = getDb()
  const squareOrders = await searchMarketplaceOrders(sourceNames)
  if (squareOrders.length === 0) return { imported: 0, refreshed: 0 }

  const existing = await db.select({ squareOrderId: marketplaceOrders.squareOrderId, id: marketplaceOrders.id, shippedAt: marketplaceOrders.shippedAt }).from(marketplaceOrders)
  const existingBySquareId = new Map(existing.map((r) => [r.squareOrderId, r]))

  // Orders that already have at least one recorded (partial or full)
  // shipment must never be refreshed below — the refresh path deletes and
  // reinserts marketplace_order_items, and marketplace_shipment_items
  // cascade-deletes off those same item ids, which would silently wipe the
  // shipment history. !row.shippedAt alone isn't enough to guard against
  // this once an order can be partially shipped (shippedAt only gets set
  // once nothing is left to ship — see adminCreateMarketplaceShipment).
  const shipmentCounts = await db
    .select({ marketplaceOrderId: marketplaceShipments.marketplaceOrderId, count: sql<number>`count(*)::int` })
    .from(marketplaceShipments)
    .groupBy(marketplaceShipments.marketplaceOrderId)
  const orderIdsWithShipments = new Set(shipmentCounts.map((r) => r.marketplaceOrderId))

  const newOrders = squareOrders.filter((o) => !existingBySquareId.has(o.squareOrderId))
  const refreshOrders = squareOrders.filter((o) => {
    const row = existingBySquareId.get(o.squareOrderId)
    return row && !row.shippedAt && !orderIdsWithShipments.has(row.id)
  })

  // Best-effort photo for each line item, purely for display — a miss just
  // means no image, never blocks the import/refresh. Square's own catalog
  // photo (see getSquareCatalogImages) is tried first since it doesn't
  // depend on the item being linked to anything on our own site; falls
  // back to a match against our own products table for anything Square
  // has no photo for but happens to also be one of our own linked products.
  const allTouched = [...newOrders, ...refreshOrders]
  const catalogIds = [...new Set(allTouched.flatMap((o) => o.items.map((i) => i.squareCatalogObjectId)).filter((id): id is string => !!id))]
  const [squareImages, matchedProducts] = await Promise.all([
    catalogIds.length === 0 ? Promise.resolve({} as Record<string, string>) : getSquareCatalogImages(catalogIds).catch(() => ({}) as Record<string, string>),
    catalogIds.length === 0
      ? Promise.resolve([])
      : db
          .select({ img: productsTable.img, squareVariationId: productsTable.squareVariationId })
          .from(productsTable)
          .where(inArray(productsTable.squareVariationId, catalogIds)),
  ])
  const imgByCatalogId = new Map(matchedProducts.map((p) => [p.squareVariationId, p.img]))
  const resolveImg = (catalogObjectId: string | null) => (catalogObjectId ? squareImages[catalogObjectId] ?? imgByCatalogId.get(catalogObjectId) ?? null : null)

  for (const order of newOrders) {
    const [row] = await db
      .insert(marketplaceOrders)
      .values({
        squareOrderId: order.squareOrderId,
        sourceName: order.sourceName,
        referenceId: order.referenceId,
        email: order.email,
        firstName: order.firstName,
        lastName: order.lastName,
        phone: order.phone,
        street: order.street,
        apartment: order.apartment,
        city: order.city,
        state: order.state,
        zip: order.zip,
        placedAt: new Date(order.placedAt),
        // Pre-fill from Square when the other storefront already recorded a
        // carrier/tracking number itself — admin still reviews and clicks
        // "send" (see adminSendMarketplaceShipment), this just saves retyping.
        carrier: order.carrier,
        trackingNumber: order.trackingNumber,
      })
      .returning()

    await db.insert(marketplaceOrderItems).values(
      order.items.map((item) => ({
        marketplaceOrderId: row.id,
        productName: item.productName,
        img: resolveImg(item.squareCatalogObjectId),
        squareCatalogObjectId: item.squareCatalogObjectId,
        unitPrice: item.unitPrice,
        qty: item.qty,
      })),
    )
  }

  for (const order of refreshOrders) {
    const row = existingBySquareId.get(order.squareOrderId)!
    await db
      .update(marketplaceOrders)
      .set({
        referenceId: order.referenceId,
        email: order.email,
        firstName: order.firstName,
        lastName: order.lastName,
        phone: order.phone,
        street: order.street,
        apartment: order.apartment,
        city: order.city,
        state: order.state,
        zip: order.zip,
        carrier: order.carrier,
        trackingNumber: order.trackingNumber,
      })
      .where(eq(marketplaceOrders.id, row.id))

    // Simplest correct way to refresh items without diffing line-by-line —
    // safe because this order hasn't shipped, so nothing downstream is
    // pinned to these item ids yet.
    await db.delete(marketplaceOrderItems).where(eq(marketplaceOrderItems.marketplaceOrderId, row.id))
    await db.insert(marketplaceOrderItems).values(
      order.items.map((item) => ({
        marketplaceOrderId: row.id,
        productName: item.productName,
        img: resolveImg(item.squareCatalogObjectId),
        squareCatalogObjectId: item.squareCatalogObjectId,
        unitPrice: item.unitPrice,
        qty: item.qty,
      })),
    )
  }

  return { imported: newOrders.length, refreshed: refreshOrders.length }
})

// Same idea as adminCreateShipment for regular orders — a marketplace order
// can now go out in more than one package. Validates the requested items/
// qty against what's actually still owed (via remainingQtyByItem, using the
// same generic {id,qty}/{orderItemId,qty} shapes as regular orders), records
// the shipment, emails the customer about just this shipment, and only marks
// the order's legacy shippedAt once nothing is left to ship.
export const adminCreateMarketplaceShipment = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      id: z.string(),
      carrier: z.enum(CARRIERS).nullable().optional(),
      trackingNumber: z.string().trim().nullable().optional(),
      items: z.array(z.object({ marketplaceOrderItemId: z.string(), qty: z.number().int().positive() })).min(1),
    }),
  )
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()

    const [order] = await db.select().from(marketplaceOrders).where(eq(marketplaceOrders.id, data.id)).limit(1)
    if (!order) throw new Error('Marketplace order not found.')

    const allItems = await db.select().from(marketplaceOrderItems).where(eq(marketplaceOrderItems.marketplaceOrderId, data.id))
    const itemById = new Map(allItems.map((i) => [i.id, i]))

    const priorShipments = await db.select({ id: marketplaceShipments.id }).from(marketplaceShipments).where(eq(marketplaceShipments.marketplaceOrderId, data.id))
    const priorShipmentIds = priorShipments.map((s) => s.id)
    const priorShipmentItemRows =
      priorShipmentIds.length === 0 ? [] : await db.select().from(marketplaceShipmentItems).where(inArray(marketplaceShipmentItems.shipmentId, priorShipmentIds))
    const priorShippedItems = priorShipmentItemRows.map((si) => ({ orderItemId: si.marketplaceOrderItemId, qty: si.qty }))

    const remaining = remainingQtyByItem(allItems, priorShippedItems)
    for (const line of data.items) {
      const item = itemById.get(line.marketplaceOrderItemId)
      if (!item) throw new Error('One of the selected items does not belong to this order.')
      const available = remaining.get(line.marketplaceOrderItemId) ?? 0
      if (line.qty > available) throw new Error(`Only ${available} of "${item.productName}" remain to be shipped.`)
    }

    const carrier = data.carrier || null
    const trackingNumber = data.trackingNumber || null

    const [shipment] = await db.insert(marketplaceShipments).values({ marketplaceOrderId: data.id, carrier, trackingNumber }).returning()
    await db
      .insert(marketplaceShipmentItems)
      .values(data.items.map((line) => ({ shipmentId: shipment.id, marketplaceOrderItemId: line.marketplaceOrderItemId, qty: line.qty })))

    const thisShipmentItems = data.items.map((line) => ({ orderItemId: line.marketplaceOrderItemId, qty: line.qty }))
    const newStatus = computeFulfillmentStatus(allItems, [...priorShippedItems, ...thisShipmentItems])
    const isFinalShipment = newStatus === 'shipped'

    // Best-effort: a failed/skipped send shouldn't block the shipment record
    // itself — same contract as adminCreateShipment for regular orders.
    let sendResult: { status: 'sent' | 'failed' | 'skipped'; error?: string }
    try {
      const shippedLines = data.items.map((line) => {
        const item = itemById.get(line.marketplaceOrderItemId)!
        return { productName: item.productName, qty: line.qty, unitPrice: item.unitPrice ?? 0, img: item.img }
      })
      sendResult = await sendMarketplaceShipmentEmail({
        sourceName: order.sourceName,
        referenceId: order.referenceId,
        email: order.email,
        firstName: order.firstName,
        lastName: order.lastName,
        street: order.street,
        apartment: order.apartment,
        city: order.city,
        state: order.state,
        zip: order.zip,
        carrier,
        trackingNumber,
        isFinalShipment,
        items: shippedLines,
      })
    } catch (err) {
      console.error(`Failed to send marketplace shipment email for order ${order.id}:`, err)
      sendResult = { status: 'failed', error: err instanceof Error ? err.message : 'Unknown error' }
    }

    await db.update(marketplaceShipments).set({ emailStatus: sendResult.status, emailError: sendResult.error ?? null }).where(eq(marketplaceShipments.id, shipment.id))

    // Legacy columns mirror the most recent shipment (quick-glance display,
    // and orders shipped before this table existed) — shippedAt only once
    // fully shipped, matching orders.fulfillmentStatus's derivation.
    await db
      .update(marketplaceOrders)
      .set({
        carrier,
        trackingNumber,
        emailStatus: sendResult.status,
        emailError: sendResult.error ?? null,
        ...(isFinalShipment ? { shippedAt: new Date() } : {}),
      })
      .where(eq(marketplaceOrders.id, data.id))

    return { ok: true, status: newStatus }
  })

// Sends the real email through the real pipeline (so it's an honest
// preview of what a customer would get, image loading and all) but to an
// address admin picks — never the order's own email — and never writes
// anything (no shipment record, no order row change, doesn't count as
// "sent"). Purely a "does this look right" check before using the real
// send above, previewing whichever items/qty are currently staged for it.
export const adminSendMarketplaceShipmentTest = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      id: z.string(),
      testEmail: z.string().email(),
      carrier: z.enum(CARRIERS).nullable().optional(),
      trackingNumber: z.string().trim().nullable().optional(),
      items: z.array(z.object({ marketplaceOrderItemId: z.string(), qty: z.number().int().positive() })).min(1),
    }),
  )
  .handler(async ({ data }) => {
    await assertAdmin()
    const db = getDb()

    const [order] = await db.select().from(marketplaceOrders).where(eq(marketplaceOrders.id, data.id)).limit(1)
    if (!order) throw new Error('Marketplace order not found.')

    const allItems = await db.select().from(marketplaceOrderItems).where(eq(marketplaceOrderItems.marketplaceOrderId, data.id))
    const itemById = new Map(allItems.map((i) => [i.id, i]))

    const priorShipments = await db.select({ id: marketplaceShipments.id }).from(marketplaceShipments).where(eq(marketplaceShipments.marketplaceOrderId, data.id))
    const priorShipmentIds = priorShipments.map((s) => s.id)
    const priorShipmentItemRows =
      priorShipmentIds.length === 0 ? [] : await db.select().from(marketplaceShipmentItems).where(inArray(marketplaceShipmentItems.shipmentId, priorShipmentIds))
    const priorShippedItems = priorShipmentItemRows.map((si) => ({ orderItemId: si.marketplaceOrderItemId, qty: si.qty }))
    const thisShipmentItems = data.items.map((line) => ({ orderItemId: line.marketplaceOrderItemId, qty: line.qty }))
    const isFinalShipment = computeFulfillmentStatus(allItems, [...priorShippedItems, ...thisShipmentItems]) === 'shipped'

    const sendResult = await sendMarketplaceShipmentEmail({
      sourceName: order.sourceName,
      referenceId: order.referenceId,
      email: data.testEmail,
      firstName: order.firstName,
      lastName: order.lastName,
      street: order.street,
      apartment: order.apartment,
      city: order.city,
      state: order.state,
      zip: order.zip,
      carrier: data.carrier || null,
      trackingNumber: data.trackingNumber?.trim() || null,
      isFinalShipment,
      items: data.items.map((line) => {
        const item = itemById.get(line.marketplaceOrderItemId)
        if (!item) throw new Error('One of the selected items does not belong to this order.')
        return { productName: item.productName, qty: line.qty, unitPrice: item.unitPrice ?? 0, img: item.img }
      }),
    })

    if (sendResult.status !== 'sent') throw new Error(sendResult.error || `Test send ${sendResult.status}.`)
    return { ok: true }
  })
