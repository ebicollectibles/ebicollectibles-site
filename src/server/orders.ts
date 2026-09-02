import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, sql } from 'drizzle-orm'
import { getDb } from '~/lib/db/client'
import { orderCounters, orderItems, orders, products as productsTable } from '~/lib/db/schema'
import { SHIPPING_OPTIONS, FREE_SHIPPING_THRESHOLD, TAX_RATE } from '~/lib/products'
import { chargeSquarePayment } from './square'

const placeOrderSchema = z.object({
  lines: z.array(z.object({ productId: z.string(), qty: z.number().int().positive() })).min(1),
  shipMethod: z.enum(['std', 'exp', 'intl']),
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

    return db.transaction(async (tx) => {
      // Lock and validate stock, decrementing atomically per line.
      const lineDetails: Array<{
        productId: string
        name: string
        code: string
        unitPrice: number
        qty: number
      }> = []

      for (const line of data.lines) {
        const [updated] = await tx
          .update(productsTable)
          .set({ stock: sql`${productsTable.stock} - ${line.qty}`, updatedAt: new Date() })
          .where(sql`${productsTable.id} = ${line.productId} AND ${productsTable.stock} >= ${line.qty}`)
          .returning()

        if (!updated) {
          const [existing] = await tx.select().from(productsTable).where(eq(productsTable.id, line.productId)).limit(1)
          const label = existing?.name ?? line.productId
          throw new Error(`Not enough stock for "${label}" — refresh your cart and try again.`)
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
      const shipOption = SHIPPING_OPTIONS.find((o) => o.id === data.shipMethod)!
      const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD && data.shipMethod === 'std' ? 0 : shipOption.price
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
          shipMethod: data.shipMethod,
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
  })
