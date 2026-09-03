// Plain fetch against Square's REST API — deliberately avoids the official
// Square Node SDK so this keeps working unmodified on Cloudflare Workers.

const SQUARE_VERSION = '2025-01-23'

interface ChargeResult {
  status: 'paid' | 'test' | 'failed'
  squarePaymentId?: string
  error?: string
}

function squareConfig() {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN
  const locationId = process.env.SQUARE_LOCATION_ID
  const environment = process.env.SQUARE_ENVIRONMENT === 'production' ? 'production' : 'sandbox'
  const baseUrl = environment === 'production' ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com'
  return { accessToken, locationId, baseUrl }
}

function squareHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'Square-Version': SQUARE_VERSION,
  }
}

export async function chargeSquarePayment(opts: {
  sourceId: string | null
  amount: number
  orderNo: number
}): Promise<ChargeResult> {
  const { accessToken, locationId, baseUrl } = squareConfig()

  if (!accessToken || !locationId) {
    // Square isn't configured yet — record the order without charging so the
    // rest of the flow (DB, admin panel) can still be exercised end to end.
    // Set SQUARE_ACCESS_TOKEN / SQUARE_LOCATION_ID to go live.
    return { status: 'test' }
  }

  if (!opts.sourceId) {
    return { status: 'failed', error: 'Missing payment token from Square Web Payments SDK.' }
  }

  const res = await fetch(`${baseUrl}/v2/payments`, {
    method: 'POST',
    headers: squareHeaders(accessToken),
    body: JSON.stringify({
      source_id: opts.sourceId,
      idempotency_key: `ebi-order-${opts.orderNo}`,
      amount_money: {
        amount: Math.round(opts.amount * 100),
        currency: 'USD',
      },
      location_id: locationId,
    }),
  })

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    const message = json?.errors?.[0]?.detail || `Square API error (${res.status})`
    return { status: 'failed', error: message }
  }

  return { status: 'paid', squarePaymentId: json?.payment?.id }
}

export interface SquareCatalogOption {
  variationId: string
  label: string
  sku?: string
}

// Lists item variations from the seller's Square catalog, for the admin
// picker that links one of our products to a Square-tracked item — this is
// how stock ends up shared with whatever other app/POS also sells against
// this same Square account.
export async function searchSquareCatalogItems(query?: string): Promise<SquareCatalogOption[]> {
  const { accessToken, baseUrl } = squareConfig()
  if (!accessToken) throw new Error('Square is not configured (SQUARE_ACCESS_TOKEN missing).')

  const body: Record<string, unknown> = { limit: 100 }
  if (query) body.text_filter = query

  const res = await fetch(`${baseUrl}/v2/catalog/search-catalog-items`, {
    method: 'POST',
    headers: squareHeaders(accessToken),
    body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => null)
  if (!res.ok) throw new Error(json?.errors?.[0]?.detail || `Square API error (${res.status})`)

  const options: SquareCatalogOption[] = []
  for (const item of json?.items ?? []) {
    const itemName = item.item_data?.name ?? 'Unnamed item'
    for (const variation of item.item_data?.variations ?? []) {
      const variationName = variation.item_variation_data?.name
      const label = variationName && variationName !== 'Regular' ? `${itemName} — ${variationName}` : itemName
      options.push({ variationId: variation.id, label, sku: variation.item_variation_data?.sku || undefined })
    }
  }
  return options
}

// Live stock counts for the given Square item-variation ids, keyed by
// variation id. A variation with no inventory data yet (never adjusted, or
// tracking not enabled in Square) is simply absent from the response — the
// caller should treat that as 0, not throw.
export async function getSquareInventoryCounts(variationIds: string[]): Promise<Record<string, number>> {
  const { accessToken, locationId, baseUrl } = squareConfig()
  if (!accessToken || !locationId) throw new Error('Square is not configured (SQUARE_ACCESS_TOKEN / SQUARE_LOCATION_ID missing).')
  if (variationIds.length === 0) return {}

  const res = await fetch(`${baseUrl}/v2/inventory/counts/batch-retrieve`, {
    method: 'POST',
    headers: squareHeaders(accessToken),
    body: JSON.stringify({ catalog_object_ids: variationIds, location_ids: [locationId] }),
  })
  const json = await res.json().catch(() => null)
  if (!res.ok) throw new Error(json?.errors?.[0]?.detail || `Square API error (${res.status})`)

  const counts: Record<string, number> = {}
  for (const count of json?.counts ?? []) {
    if (count.state !== 'IN_STOCK') continue
    counts[count.catalog_object_id] = (counts[count.catalog_object_id] ?? 0) + Number(count.quantity ?? 0)
  }
  return counts
}

// Records a sale against Square's inventory (IN_STOCK -> SOLD) so a purchase
// made here shows up as reduced stock everywhere else selling against the
// same Square account. Best-effort from the caller's side — this runs after
// the order is already placed and paid for, so a failure here shouldn't
// undo the order, just get logged.
export async function recordSquareInventorySale(variationId: string, quantity: number, orderNo: number): Promise<void> {
  const { accessToken, locationId, baseUrl } = squareConfig()
  if (!accessToken || !locationId) return

  const res = await fetch(`${baseUrl}/v2/inventory/changes/batch-create`, {
    method: 'POST',
    headers: squareHeaders(accessToken),
    body: JSON.stringify({
      idempotency_key: `ebi-order-${orderNo}-sale-${variationId}`,
      changes: [
        {
          type: 'ADJUSTMENT',
          adjustment: {
            catalog_object_id: variationId,
            location_id: locationId,
            from_state: 'IN_STOCK',
            to_state: 'SOLD',
            quantity: String(quantity),
            occurred_at: new Date().toISOString(),
          },
        },
      ],
      ignore_unchanged_counts: true,
    }),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    console.error(`Square inventory sale adjustment failed for order ${orderNo}, variation ${variationId}:`, json?.errors?.[0]?.detail || res.status)
  }
}

// Replaces `stock` with the live Square count for any item linked via
// squareVariationId, leaving unmapped items untouched. Falls back to
// whatever `stock` already was if Square can't be reached — a Square outage
// shouldn't take the storefront down, it should just show slightly stale
// numbers for the (opt-in) mapped products.
export async function overlaySquareStock<T extends { squareVariationId?: string | null; stock: number }>(
  items: T[],
): Promise<T[]> {
  const mapped = items.filter((i): i is T & { squareVariationId: string } => !!i.squareVariationId)
  if (mapped.length === 0) return items

  try {
    const counts = await getSquareInventoryCounts(mapped.map((i) => i.squareVariationId))
    return items.map((i) => (i.squareVariationId ? { ...i, stock: counts[i.squareVariationId] ?? 0 } : i))
  } catch (err) {
    console.error('Failed to fetch live Square inventory counts, falling back to stored stock:', err)
    return items
  }
}
