import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

// Washington is destination-based — the combined state+local rate depends
// on exactly where the package is going (it can vary block to block within
// a city), not just the state. WA's Department of Revenue publishes a free,
// unauthenticated address lookup for exactly this purpose; hitting it live
// beats shipping a rate table that goes stale every time a jurisdiction
// changes its rate. See https://dor.wa.gov/wa-sales-tax-rate-lookup-url-interface
const WA_DOR_ENDPOINT = 'https://webgis.dor.wa.gov/webapi/AddressRates.aspx'

// Used only if the live DOR lookup fails (network hiccup, endpoint down) —
// an approximate statewide blended average so checkout never hard-blocks on
// a government API being unreachable. Real jurisdictions range roughly
// 7%–10.6%; revisit this number periodically rather than trusting it long-term.
export const WA_FALLBACK_TAX_RATE = 0.092

async function lookupWaRate(opts: { street: string; city: string; zip: string }): Promise<number | null> {
  try {
    const params = new URLSearchParams({ output: 'text', addr: opts.street, city: opts.city, zip: opts.zip })
    const res = await fetch(`${WA_DOR_ENDPOINT}?${params.toString()}`)
    if (!res.ok) return null
    const text = await res.text()
    const resultCode = text.match(/ResultCode=(\d+)/)?.[1]
    const rate = text.match(/Rate=([\d.]+)/)?.[1]
    if (resultCode !== '0' || !rate) return null
    return Number(rate)
  } catch {
    return null
  }
}

/** Only WA is taxed right now — everywhere else is 0 until the business registers there. */
export async function resolveSalesTaxRate(contact: { state: string; street: string; city: string; zip: string }): Promise<number> {
  if (contact.state.trim().toUpperCase() !== 'WA') return 0
  const liveRate = await lookupWaRate(contact)
  return liveRate ?? WA_FALLBACK_TAX_RATE
}

// Client-facing preview used while someone is still filling out the
// checkout form, so the displayed estimate matches what they'll actually be
// charged instead of guessing. The authoritative figure is always
// recomputed server-side again in placeOrder — this is display-only.
export const getSalesTaxRate = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      state: z.string(),
      street: z.string().optional().default(''),
      city: z.string().optional().default(''),
      zip: z.string().optional().default(''),
    }),
  )
  .handler(async ({ data }) => {
    const rate = await resolveSalesTaxRate(data)
    return { rate }
  })
