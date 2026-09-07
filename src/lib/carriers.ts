export const CARRIERS = ['USPS', 'UPS', 'FedEx', 'DHL', 'Other'] as const
export type Carrier = (typeof CARRIERS)[number]

const CARRIER_TRACKING_URL: Partial<Record<Carrier, (trackingNumber: string) => string>> = {
  USPS: (n) => `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(n)}`,
  UPS: (n) => `https://www.ups.com/track?tracknum=${encodeURIComponent(n)}`,
  FedEx: (n) => `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(n)}`,
  DHL: (n) => `https://www.dhl.com/us-en/home/tracking.html?tracking-id=${encodeURIComponent(n)}`,
}

export function carrierTrackingUrl(carrier: string | null | undefined, trackingNumber: string | null | undefined): string | null {
  if (!carrier || !trackingNumber) return null
  return CARRIER_TRACKING_URL[carrier as Carrier]?.(trackingNumber) ?? null
}
