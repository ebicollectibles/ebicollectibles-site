import { FLAT_SHIPPING_RATE } from './products'

// Pulled out of server/orders.ts's placeOrder so this money math has one
// source of truth and can be unit tested without a database — a rounding or
// ordering mistake here means every order is charged wrong.
export function computeOrderTotals(lines: Array<{ unitPrice: number; qty: number }>, taxRate: number) {
  const subtotal = lines.reduce((t, l) => t + l.unitPrice * l.qty, 0)
  const shippingCost = subtotal === 0 ? 0 : FLAT_SHIPPING_RATE
  const tax = Math.round(subtotal * taxRate * 100) / 100
  const total = subtotal + shippingCost + tax
  return { subtotal, shippingCost, tax, total }
}

// Same idea for the "is this line even orderable" business rules — kept as
// a pure check over already-fetched product rows so the actual business
// logic (as opposed to the DB/Square calls around it) is directly testable.
export function findUnorderableLine(
  lines: Array<{ productId: string }>,
  productById: Map<string, { name: string; comingSoon: boolean; published: boolean } | undefined>,
): string | null {
  for (const line of lines) {
    const product = productById.get(line.productId)
    if (!product) continue
    if (product.comingSoon) return `"${product.name}" isn't available to order yet — refresh your cart and try again.`
    if (!product.published) return `"${product.name}" is no longer available — refresh your cart and try again.`
  }
  return null
}
