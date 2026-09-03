import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, inArray, sql } from 'drizzle-orm'
import { getDb } from '~/lib/db/client'
import { withTransaction } from '~/lib/db/transactional-client'
import { orderCounters, orderItems, orders, products as productsTable } from '~/lib/db/schema'
import { FLAT_SHIPPING_RATE, TAX_RATE } from '~/lib/products'
import { chargeSquarePayment, getSquareInventoryCounts, recordSquareInventorySale } from './square'

const placeOrderSchema = z.object({
  lines: z.array(z.object({ productId: z.string(), qty: z.number().int().positive() })).min(1),
  contact: z.object({
    email: z.string().optional().default(''),
    firstName: z.string().optional().default(''),
    lastName: z.string().optional().default(''),
    street: z.string().optional().default(''),
    apartment: z.string().optional().default(''),
    city: z.string().optional().default(''),
    zip: z.string().optional().default(''),
  }),
  sourceId: z.string().nullable().optional(),
})

export const placeOrder = createServerFn({ method: 'POST' })
  .validator(placeOrderSchema)
  .handler(async ({ data }) => {
    const db = getDb()
    const productRows = await db
      .select()
      .from(productsTable)
      .where(inArray(productsTable.id, data.lines.map((l) => l.productId)))
    const productById = new Map(productRows.map((p) => [p.id, p]))

    // Products linked to Square (squareVariationId set) are stock-tracked in
    // Square, not locally — check live there before charging, since another
    // app selling against the same Square account may have moved stock
    // since our last read.
    const squareLines = data.lines.filter((l) => productById.get(l.productId)?.squareVariationId)
    if (squareLines.length > 0) {
      const variationIds = squareLines.map((l) => productById.get(l.productId)!.squareVariationId!)
      const counts = await getSquareInventoryCounts(variationIds)
      for (const line of squareLines) {
        const product = productById.get(line.productId)!
        const available = counts[product.squareVariationId!] ?? 0
        if (available < line.qty) {
          throw new Error(`Not enough stock for "${product.name}" — refresh your cart and try again.`)
        }
      }
    }

    const result = await withTransaction(async (tx) => {
      // Lock and validate stock, decrementing atomically per line — only
      // for products not tracked in Square (already validated above).
      const lineDetails: Array<{
        productId: string
        name: string
        code: string
        unitPrice: number
        qty: number
      }> = []

      for (const line of data.lines) {
        const product = productById.get(line.productId)
        if (!product) throw new Error('One of the items in your cart no longer exists — refresh your cart and try again.')

        if (product.squareVariationId) {
          lineDetails.push({ productId: product.id, name: product.name, code: product.code, unitPrice: product.price, qty: line.qty })
          continue
        }

        const [updated] = await tx
          .update(productsTable)
          .set({ stock: sql`${productsTable.stock} - ${line.qty}`, updatedAt: new Date() })
          .where(sql`${productsTable.id} = ${line.productId} AND ${productsTable.stock} >= ${line.qty}`)
          .returning()

        if (!updated) {
          throw new Error(`Not enough stock for "${product.name}" — refresh your cart and try again.`)
        }

        lineDetails.push({
          productId: updated.id,
          name: updated.name,
          code: updated.code,
          unitPrice: updated.price,
          qty: line.qty,
        })
      }

      const subtotal = lineDetails.reduce((t, l) => t + l.unitPrice * l.qty, 0)
      const shippingCost = subtotal === 0 ? 0 : FLAT_SHIPPING_RATE
      const tax = Math.round(subtotal * TAX_RATE * 100) / 100
      const total = subtotal + shippingCost + tax

      const [counter] = await tx
        .update(orderCounters)
        .set({ nextOrderNo: sql`${orderCounters.nextOrderNo} + 1` })
        .where(eq(orderCounters.id, 'main'))
        .returning()
      const orderNo = counter.nextOrderNo - 1

      const charge = await chargeSquarePayment({ sourceId: data.sourceId ?? null, amount: total, orderNo })
      if (charge.status === 'failed') {
        throw new Error(charge.error || 'Payment failed — please check your card details and try again.')
      }

      const [order] = await tx
        .insert(orders)
        .values({
          orderNo,
          email: data.contact.email,
          firstName: data.contact.firstName,
          lastName: data.contact.lastName,
          street: data.contact.street,
          apartment: data.contact.apartment,
          city: data.contact.city,
          zip: data.contact.zip,
          shipMethod: 'flat',
          subtotal,
          shippingCost,
          tax,
          total,
          paymentStatus: charge.status,
          squarePaymentId: charge.squarePaymentId,
        })
        .returning()

      await tx.insert(orderItems).values(
        lineDetails.map((l) => ({
          orderId: order.id,
          productId: l.productId,
          productName: l.name,
          productCode: l.code,
          unitPrice: l.unitPrice,
          qty: l.qty,
        })),
      )

      return { orderNo, total, paymentStatus: charge.status }
    })

    // Best-effort: record the sale in Square so it shows up as reduced
    // stock for any other app selling against the same Square account. Runs
    // after the order is already placed and paid for — a failure here
    // shouldn't undo a successful, already-charged order.
    for (const line of squareLines) {
      const product = productById.get(line.productId)!
      try {
        await recordSquareInventorySale(product.squareVariationId!, line.qty, result.orderNo)
      } catch (err) {
        console.error(`Failed to record Square inventory sale for order ${result.orderNo}:`, err)
      }
    }

    return result
  })
