import { FLAT_SHIPPING_RATE } from './products'

// Pulled out of server/orders.ts's placeOrder so this money math has one
// source of truth and can be unit tested without a database — a rounding or
// ordering mistake here means every order is charged wrong.
// shippingCostOverride lets a caller substitute a real Shippo-quoted rate
// (Alaska/Hawaii — see server/shippo.ts) in place of the flat rate; omit it
// for the normal flat-rate-everywhere-else behavior. creditApplied (see
// server/store-credit.ts) is store credit redeemed against this order —
// `total` stays the order's true gross value (what the receipt/admin should
// show), while `amountDue` is what's actually charged to a card, clamped to
// never go negative.
export function computeOrderTotals(
  lines: Array<{ unitPrice: number; qty: number }>,
  taxRate: number,
  shippingCostOverride?: number,
  creditApplied = 0,
) {
  const subtotal = lines.reduce((t, l) => t + l.unitPrice * l.qty, 0)
  const shippingCost = subtotal === 0 ? 0 : (shippingCostOverride ?? FLAT_SHIPPING_RATE)
  const tax = Math.round(subtotal * taxRate * 100) / 100
  const total = subtotal + shippingCost + tax
  const amountDue = Math.max(0, Math.round((total - creditApplied) * 100) / 100)
  return { subtotal, shippingCost, tax, total, creditApplied, amountDue }
}

// Same idea for the "is this line even orderable" business rules — kept as
// a pure check over already-fetched product rows so the actual business
// logic (as opposed to the DB/Square calls around it) is directly testable.
export function findUnorderableLine(
  lines: Array<{ productId: string }>,
  productById: Map<string, { name: string; comingSoon: boolean; published: boolean; notSellable: boolean } | undefined>,
): string | null {
  for (const line of lines) {
    const product = productById.get(line.productId)
    if (!product) continue
    if (product.notSellable) return `"${product.name}" isn't available to order directly — refresh your cart and try again.`
    if (product.comingSoon) return `"${product.name}" isn't available to order yet — refresh your cart and try again.`
    if (!product.published) return `"${product.name}" is no longer available — refresh your cart and try again.`
  }
  return null
}

// Thrown/shown only when a mixed cart is actually submitted without the
// preorder-agreement checkbox checked — see MIXED_PREORDER_INFO for the
// always-visible explanation of the (now non-blocking) alternative.
export const MIXED_PREORDER_ERROR =
  'Your cart mixes pre-order and in-stock items — check the box below to keep it as one order, or check out in two orders instead.'

// Shown as soon as the cart is mixed, regardless of whether the checkbox is
// checked yet — explains both paths rather than presenting the mix as a
// dead end. A pre-order product ships on its own later date, separate from
// anything in stock now; by default that still means two orders, but a
// shopper can instead explicitly choose to keep it as one order and wait
// for the whole thing to ship together once the pre-order item arrives
// (see preorderAcknowledged in server/orders.ts, which now gates this
// instead of unconditionally rejecting it).
export const MIXED_PREORDER_INFO =
  'Your cart mixes a pre-order item with in-stock item(s). By default these ship separately — check out in two orders to get the in-stock item(s) sooner. Or check the box below to keep it as one order instead; everything will ship together once the pre-order item arrives.'

// A pre-order product ships on its own later date, separate from anything
// in stock now — mixing the two in one order means either checking out in
// two orders (the in-stock item ships right away) or explicitly choosing
// to keep it as one order and wait for all of it to ship together (see
// MIXED_PREORDER_INFO). Same minimal shape works for both client-side cart
// lines and server-side product rows.
export function hasMixedPreorderCart(items: Array<{ preorder: boolean }>): boolean {
  return items.some((i) => i.preorder) && items.some((i) => !i.preorder)
}

// Unlike preorder, a delayed-shipment item doesn't block checkout when mixed
// with other items — it's a heads-up, not a hard rule, so this is just "is
// there at least one" rather than a mixed-cart check.
export function hasDelayedShipment(items: Array<{ shipsWithDelay: boolean }>): boolean {
  return items.some((i) => i.shipsWithDelay)
}

// Whether the delayed item shares the cart/order with something else —
// decides which warning copy to show. "Everything in this order ships
// together" only makes sense when there's another item being held up by the
// delay; an order that's entirely the delayed item (even at qty > 1) reads
// as if other stuff is in there too, which isn't true.
export function hasMixedDelayedShipment(items: Array<{ shipsWithDelay: boolean }>): boolean {
  return items.some((i) => i.shipsWithDelay) && items.some((i) => !i.shipsWithDelay)
}

export const DELAYED_SHIPMENT_WARNING =
  "This order includes an item that's still on its way to us — everything in this order ships together once it arrives."

export const ALL_DELAYED_SHIPMENT_WARNING = "This item is still on its way to us and will ship as soon as it arrives."

// Shared by checkout.tsx (early "we can't ship there yet" messaging) and
// server/orders.ts + server/shippo.ts (the real cost lookup and, while
// BLOCK_HI_AK_CHECKOUT is on, the hard reject) — kept here rather than in
// server/shippo.ts so client code can check it without importing a server
// module.
export const HI_AK_STATES = ['HI', 'AK'] as const
export function isHiOrAk(state: string | null | undefined): boolean {
  return (HI_AK_STATES as readonly string[]).includes((state ?? '').trim().toUpperCase())
}
