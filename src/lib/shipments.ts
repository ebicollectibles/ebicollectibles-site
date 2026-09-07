// Shared by the admin UI (to pre-fill the "ship items" picker) and the
// server (to validate a shipment request and recompute the order's
// fulfillment status) — kept here rather than in src/server so both sides
// import the exact same logic instead of two copies drifting apart.

export interface OrderItemLike {
  id: string
  qty: number
}

export interface ShippedItem {
  orderItemId: string
  qty: number
}

export function shippedQtyByItem(shippedItems: ShippedItem[]): Map<string, number> {
  const shipped = new Map<string, number>()
  for (const item of shippedItems) {
    shipped.set(item.orderItemId, (shipped.get(item.orderItemId) ?? 0) + item.qty)
  }
  return shipped
}

// Remaining-to-ship quantity for each order item, floored at 0 so an
// over-recorded shipment (shouldn't happen given server-side validation,
// but defensive) never shows as a negative "remaining" in the UI.
export function remainingQtyByItem(items: OrderItemLike[], shippedItems: ShippedItem[]): Map<string, number> {
  const shipped = shippedQtyByItem(shippedItems)
  const remaining = new Map<string, number>()
  for (const item of items) {
    remaining.set(item.id, Math.max(0, item.qty - (shipped.get(item.id) ?? 0)))
  }
  return remaining
}

export function computeFulfillmentStatus(items: OrderItemLike[], shippedItems: ShippedItem[]): 'pending' | 'partially_shipped' | 'shipped' {
  const remaining = remainingQtyByItem(items, shippedItems)
  const totalRemaining = [...remaining.values()].reduce((a, b) => a + b, 0)
  const totalOrdered = items.reduce((a, b) => a + b.qty, 0)
  if (totalRemaining <= 0) return 'shipped'
  if (totalRemaining === totalOrdered) return 'pending'
  return 'partially_shipped'
}
