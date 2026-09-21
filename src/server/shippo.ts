import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

// Real, address-based shipping cost for Alaska/Hawaii only — everywhere
// else keeps the flat FLAT_SHIPPING_RATE. UPS/FedEx ground doesn't even
// reach AK/HI (they're routed onto much pricier air/surface-air service
// tiers, 2-4x mainland cost), while USPS's zone-based cost to AK/HI is only
// a modest premium — so a flat $10 works fine everywhere except these two
// states, where it can be a real loss on heavier orders. See the
// conversation this was built from for the cost research behind it.

const SHIPPO_API_URL = 'https://api.goshippo.com/shipments/'

export const HI_AK_STATES = ['HI', 'AK'] as const

// Used for any cart line whose product has no weightLb set yet (admin adds
// these over time) — conservative-but-not-silent: better to quote against a
// plausible weight than silently skip the item's weight entirely.
const DEFAULT_ITEM_WEIGHT_LB = 0.5

// Plain box dimensions, not a carrier's named "flat rate" template — this
// pricing path must never depend on or resemble USPS Flat Rate (its whole
// point is a single nationwide price, which is exactly what this feature
// exists to NOT use for AK/HI). Reasonable stand-in size for a small-to-
// medium sealed order; revisit if typical orders run larger than this.
const DEFAULT_PARCEL_DIMENSIONS_IN = { length: '10', width: '7', height: '4' }

// USPS Priority Mail Flat Rate service levels are explicitly excluded from
// consideration below (see the filter in resolveHiAkShippingRate) — this
// quote must always reflect real zone/weight-based cost, never coincide
// with the same flat price charged nationwide.
interface ShippoRate {
  amount: string
  provider: string
  servicelevel?: { name?: string; token?: string }
}

interface ShippoShipmentResponse {
  rates?: ShippoRate[]
  messages?: Array<{ text?: string; source?: string }>
}

export function isHiOrAk(state: string | null | undefined): boolean {
  return (HI_AK_STATES as readonly string[]).includes((state ?? '').trim().toUpperCase())
}

// Returns the cheapest quoted rate in dollars, or null if Shippo isn't
// configured or the lookup fails for any reason — callers fall back to the
// flat rate on null rather than blocking checkout on a shipping-API hiccup,
// same philosophy as the WA tax lookup in tax.ts.
export async function resolveHiAkShippingRate(opts: {
  items: Array<{ weightLb?: number | null; qty: number }>
  toAddress: { name: string; street: string; apartment?: string; city: string; state: string; zip: string }
}): Promise<number | null> {
  const apiKey = process.env.SHIPPO_API_KEY
  const fromStreet = process.env.SHIP_FROM_STREET
  const fromCity = process.env.SHIP_FROM_CITY
  const fromState = process.env.SHIP_FROM_STATE
  const fromZip = process.env.SHIP_FROM_ZIP
  if (!apiKey || !fromStreet || !fromCity || !fromState || !fromZip) return null

  const totalWeightLb = opts.items.reduce((t, i) => t + (i.weightLb && i.weightLb > 0 ? i.weightLb : DEFAULT_ITEM_WEIGHT_LB) * i.qty, 0)
  if (totalWeightLb <= 0) return null

  try {
    const res = await fetch(SHIPPO_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `ShippoToken ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        async: false,
        address_from: {
          name: process.env.SHIP_FROM_NAME || 'EBI Collectibles',
          street1: fromStreet,
          city: fromCity,
          state: fromState,
          zip: fromZip,
          country: 'US',
        },
        address_to: {
          name: opts.toAddress.name,
          street1: opts.toAddress.street,
          street2: opts.toAddress.apartment || undefined,
          city: opts.toAddress.city,
          state: opts.toAddress.state,
          zip: opts.toAddress.zip,
          country: 'US',
        },
        parcels: [
          {
            ...DEFAULT_PARCEL_DIMENSIONS_IN,
            distance_unit: 'in',
            weight: totalWeightLb.toFixed(2),
            mass_unit: 'lb',
          },
        ],
      }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as ShippoShipmentResponse
    const amounts = (data.rates ?? [])
      // Never use USPS Flat Rate service levels for this — see the comment
      // on ShippoRate above.
      .filter((r) => !(r.servicelevel?.name ?? '').toLowerCase().includes('flat rate'))
      .map((r) => Number(r.amount))
      .filter((n) => Number.isFinite(n) && n > 0)
    if (amounts.length === 0) return null
    return Math.round(Math.min(...amounts) * 100) / 100
  } catch (err) {
    console.error('Shippo HI/AK rate lookup failed:', err)
    return null
  }
}

// Client-facing preview used while someone is still filling out the
// checkout form, mirroring getSalesTaxRate in tax.ts — the displayed
// estimate uses client-supplied weights/address so it matches what
// placeOrder will actually charge, but placeOrder always recomputes this
// authoritatively server-side from the DB, never trusting this preview.
export const getHiAkShippingEstimate = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      items: z.array(z.object({ weightLb: z.number().nullable().optional(), qty: z.number().int().positive() })),
      name: z.string().optional().default(''),
      state: z.string(),
      street: z.string().optional().default(''),
      apartment: z.string().optional().default(''),
      city: z.string().optional().default(''),
      zip: z.string().optional().default(''),
    }),
  )
  .handler(async ({ data }) => {
    if (!isHiOrAk(data.state)) return { rate: null }
    const rate = await resolveHiAkShippingRate({
      items: data.items,
      toAddress: {
        name: data.name || 'Customer',
        street: data.street,
        apartment: data.apartment,
        city: data.city,
        state: data.state,
        zip: data.zip,
      },
    })
    return { rate }
  })
