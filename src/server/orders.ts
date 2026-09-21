import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, inArray, sql } from 'drizzle-orm'
import { getDb } from '~/lib/db/client'
import { withTransaction } from '~/lib/db/transactional-client'
import { emailEvents, orderCounters, orderItems, orderStatusEvents, orders, paymentAttempts, products as productsTable, users } from '~/lib/db/schema'
import { MIXED_PREORDER_ERROR, computeOrderTotals, findUnorderableLine, hasMixedPreorderCart } from '~/lib/order-math'
import { US_STATE_CODES } from '~/lib/us-states'
import { chargeSquarePayment, createSquareOrder, getSquareCatalogPrices, getSquareInventoryCounts, recordSquareInventorySale } from './square'
import { sendOrderConfirmationEmail } from './email'
import { getCurrentUserId } from './customer-auth'
import { resolveSalesTaxRate } from './tax'
import { isHiOrAk, resolveHiAkShippingRate } from './shippo'
import { upsertSubscriber } from './subscribers'

const placeOrderSchema = z.object({
  lines: z.array(z.object({ productId: z.string(), qty: z.number().int().positive() })).min(1),
  contact: z.object({
    email: z.string().trim().email(),
    phone: z.string().optional().default(''),
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    street: z.string().trim().min(1),
    apartment: z.string().optional().default(''),
    city: z.string().trim().min(1),
    state: z.enum(US_STATE_CODES),
    zip: z.string().trim().min(1),
  }),
  billing: z.object({
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    street: z.string().trim().min(1),
    apartment: z.string().optional().default(''),
    city: z.string().trim().min(1),
    state: z.enum(US_STATE_CODES),
    zip: z.string().trim().min(1),
  }),
  sourceId: z.string().nullable().optional(),
  emailOptIn: z.boolean().optional().default(false),
})

export const placeOrder = createServerFn({ method: 'POST' })
  .validator(placeOrderSchema)
  .handler(async ({ data }) => {
    const sessionUserId = await getCurrentUserId()
    const checkoutMode: 'guest' | 'account' = sessionUserId ? 'account' : 'guest'
    const db = getDb()

    // Guest checkout under an email that already has an account still gets
    // linked to it — same trust reasoning as linking past guest orders at
    // signup (they typed their own email). checkoutMode above still records
    // that this specific purchase happened while logged out.
    let userId = sessionUserId
    if (!userId && data.contact.email) {
      const [existing] = await db
        .select({ id: users.id })
        .from(users)
        .where(sql`lower(${users.email}) = ${data.contact.email.trim().toLowerCase()}`)
        .limit(1)
      userId = existing?.id ?? null
    }

    const productRows = await db
      .select()
      .from(productsTable)
      .where(inArray(productsTable.id, data.lines.map((l) => l.productId)))
    const productById = new Map(productRows.map((p) => [p.id, p]))

    // Resolved outside the transaction below — both are external HTTP calls
    // (WA Dept. of Revenue; Shippo), and a DB transaction holding row locks
    // is the wrong place to be waiting on either. shippingCostOverride stays
    // undefined outside AK/HI (computeOrderTotals then uses the flat rate)
    // and also falls back to it if the Shippo lookup fails for any reason —
    // never blocks checkout on a shipping-API hiccup.
    const [taxRate, shippingCostOverride] = await Promise.all([
      resolveSalesTaxRate(data.contact),
      isHiOrAk(data.contact.state)
        ? resolveHiAkShippingRate({
            items: data.lines.map((l) => ({ weightLb: productById.get(l.productId)?.weightLb, qty: l.qty })),
            toAddress: {
              name: `${data.contact.firstName} ${data.contact.lastName}`.trim(),
              street: data.contact.street,
              apartment: data.contact.apartment,
              city: data.contact.city,
              state: data.contact.state,
              zip: data.contact.zip,
            },
          }).then((rate) => rate ?? undefined)
        : Promise.resolve(undefined),
    ])

    // Defense-in-depth beyond the disabled add-to-cart button — a coming-soon
    // or unpublished product is listed (or was, before being hidden) but
    // never purchasable, so reject it here too even if a stale cart or a
    // direct API call tries to check one out.
    const unorderableError = findUnorderableLine(data.lines, productById)
    if (unorderableError) throw new Error(unorderableError)

    // Pre-order items ship separately from in-stock ones — reject a mixed
    // cart here too, beyond the disabled checkout button, for the same
    // stale-cart/direct-API-call reasons as above.
    if (hasMixedPreorderCart(productRows.map((p) => ({ preorder: p.preorder })))) {
      throw new Error(MIXED_PREORDER_ERROR)
    }

    const squareLines = data.lines.filter((l) => productById.get(l.productId)?.squareVariationId)

    const result = await withTransaction(async (tx) => {
      // Products linked to Square (squareVariationId set) are stock- and
      // price-tracked in Square, not locally — check both live there,
      // right before we build line details and charge, rather than
      // earlier in the request. This is a check-then-charge gap (Square
      // has no atomic reserve/decrement-if-available API the way our own
      // Postgres UPDATE below does), so it can't be made fully race-proof,
      // but doing it this late shrinks the window to essentially just the
      // createSquareOrder + chargeSquarePayment calls that follow, instead
      // of also covering tax resolution and everything else above. Stock:
      // another app selling against the same Square account may have moved
      // it since our last read. Price: the product page already shows
      // Square's live price (see overlaySquareData), so charging the stale
      // locally-stored price here would silently charge a different amount
      // than what the customer saw on the page.
      let squareLivePrices: Record<string, number> = {}
      if (squareLines.length > 0) {
        const variationIds = squareLines.map((l) => productById.get(l.productId)!.squareVariationId!)
        const [counts, prices] = await Promise.all([getSquareInventoryCounts(variationIds), getSquareCatalogPrices(variationIds)])
        squareLivePrices = prices
        for (const line of squareLines) {
          const product = productById.get(line.productId)!
          const available = counts[product.squareVariationId!] ?? 0
          if (available < line.qty) {
            throw new Error(`Not enough stock for "${product.name}" — refresh your cart and try again.`)
          }
        }
      }

      // Lock and validate stock, decrementing atomically per line — only
      // for products not tracked in Square (already validated above).
      const lineDetails: Array<{
        productId: string
        name: string
        img: string | null
        unitPrice: number
        qty: number
      }> = []

      for (const line of data.lines) {
        const product = productById.get(line.productId)
        if (!product) throw new Error('One of the items in your cart no longer exists — refresh your cart and try again.')

        if (product.squareVariationId) {
          // Variable-pricing items have no fixed price in Square (absent from
          // squareLivePrices) — fall back to the stored price rather than
          // treat them as free, same as the product page's own fallback.
          const unitPrice = squareLivePrices[product.squareVariationId] ?? product.price
          lineDetails.push({ productId: product.id, name: product.name, img: product.img, unitPrice, qty: line.qty })
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
          img: updated.img,
          unitPrice: updated.price,
          qty: line.qty,
        })
      }

      const { subtotal, shippingCost, tax, total } = computeOrderTotals(lineDetails, taxRate, shippingCostOverride)

      const [counter] = await tx
        .update(orderCounters)
        .set({ nextOrderNo: sql`${orderCounters.nextOrderNo} + 1` })
        .where(eq(orderCounters.id, 'main'))
        .returning()
      const orderNo = counter.nextOrderNo - 1

      // Best-effort: itemizes the sale in the Square Dashboard by creating a
      // Square Order alongside the payment. Only linked to the payment below
      // if Square's own computed total matches ours exactly — a mismatch
      // (rare rounding edge case) just means this order won't show line
      // items in Square, never a failed or overcharged payment.
      const squareOrder = await createSquareOrder({
        orderNo,
        lineItems: lineDetails.map((l) => ({ name: l.name, quantity: l.qty, unitPrice: l.unitPrice })),
        shippingCost,
        tax,
      })
      const squareOrderId = squareOrder && squareOrder.totalCents === Math.round(total * 100) ? squareOrder.orderId : null

      const charge = await chargeSquarePayment({
        sourceId: data.sourceId ?? null,
        amount: total,
        orderNo,
        squareOrderId,
        billingAddress: {
          addressLine1: data.billing.street,
          addressLine2: data.billing.apartment || undefined,
          locality: data.billing.city,
          administrativeDistrictLevel1: data.billing.state,
          postalCode: data.billing.zip,
        },
      })
      if (charge.status === 'failed') {
        // Logged on the outer (non-transactional) connection so it survives
        // this transaction's rollback — no order row exists for a failed
        // charge, so this is the only record it leaves behind.
        try {
          await db.insert(paymentAttempts).values({
            userId,
            email: data.contact.email || null,
            amount: total,
            errorMessage: charge.error || 'Payment failed',
          })
        } catch (err) {
          console.error('Failed to record payment attempt:', err)
        }
        throw new Error(charge.error || 'Payment failed — please check your card details and try again.')
      }

      const [order] = await tx
        .insert(orders)
        .values({
          orderNo,
          userId,
          checkoutMode,
          email: data.contact.email,
          phone: data.contact.phone || null,
          firstName: data.contact.firstName,
          lastName: data.contact.lastName,
          street: data.contact.street,
          apartment: data.contact.apartment,
          city: data.contact.city,
          state: data.contact.state,
          zip: data.contact.zip,
          billingFirstName: data.billing.firstName,
          billingLastName: data.billing.lastName,
          billingStreet: data.billing.street,
          billingApartment: data.billing.apartment,
          billingCity: data.billing.city,
          billingState: data.billing.state,
          billingZip: data.billing.zip,
          shipMethod: 'flat',
          subtotal,
          shippingCost,
          tax,
          total,
          paymentStatus: charge.status,
          squarePaymentId: charge.squarePaymentId,
          paymentMethodSummary: charge.paymentMethodSummary ?? null,
          riskLevel: charge.riskLevel ?? null,
          avsStatus: charge.avsStatus ?? null,
          cvvStatus: charge.cvvStatus ?? null,
        })
        .returning()

      await tx.insert(orderItems).values(
        lineDetails.map((l) => ({
          orderId: order.id,
          productId: l.productId,
          productName: l.name,
          img: l.img,
          unitPrice: l.unitPrice,
          qty: l.qty,
        })),
      )

      await tx.insert(orderStatusEvents).values({ orderId: order.id, status: order.fulfillmentStatus })

      if (data.emailOptIn && data.contact.email) {
        await upsertSubscriber(tx, data.contact.email.trim().toLowerCase(), 'checkout', data.contact.firstName)
      }

      return {
        orderId: order.id,
        orderNo,
        total,
        paymentStatus: charge.status,
        paymentMethodSummary: charge.paymentMethodSummary ?? null,
        subtotal,
        shippingCost,
        tax,
        lineDetails,
      }
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

    // Best-effort: email the customer a confirmation with what they bought.
    // Also runs after the order is already placed and paid for — a failed
    // send should never undo or block a successful, already-charged order.
    // The outcome is logged to email_events either way so it's visible in
    // admin instead of only living in Cloudflare's worker logs.
    try {
      const sendResult = await sendOrderConfirmationEmail({
        orderNo: result.orderNo,
        email: data.contact.email || null,
        firstName: data.contact.firstName || null,
        lastName: data.contact.lastName || null,
        street: data.contact.street || null,
        apartment: data.contact.apartment || null,
        city: data.contact.city || null,
        state: data.contact.state || null,
        zip: data.contact.zip || null,
        subtotal: result.subtotal,
        shippingCost: result.shippingCost,
        tax: result.tax,
        total: result.total,
        paymentMethodSummary: result.paymentMethodSummary,
        items: result.lineDetails.map((l) => ({ productName: l.name, qty: l.qty, unitPrice: l.unitPrice, img: l.img })),
      })
      await db.insert(emailEvents).values({
        orderId: result.orderId,
        email: data.contact.email || null,
        type: 'order_confirmation',
        status: sendResult.status,
        errorMessage: sendResult.error ?? null,
      })
    } catch (err) {
      console.error(`Failed to send confirmation email for order ${result.orderNo}:`, err)
    }

    return { orderNo: result.orderNo, total: result.total, paymentStatus: result.paymentStatus }
  })
