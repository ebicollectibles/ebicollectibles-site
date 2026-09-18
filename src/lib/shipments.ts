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

export function groupBy<T, K>(rows: T[], key: (row: T) => K): Map<K, T[]> {
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
// groups the resulting shipments by order id — shared by the admin order
// views and the customer-facing tracking view so they never drift.
export function buildShipmentsByOrder(
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
