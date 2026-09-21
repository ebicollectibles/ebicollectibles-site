// Standard reason codes for a store credit grant/adjustment — same idea as
// Shopify's own store credit / refund reason lists. Picked from a dropdown
// rather than typed freely so the ledger stays consistent and scannable;
// "Other" is the deliberate escape hatch, paired with a required detail
// field in the admin UI (see admin/customers/$id.tsx) rather than left as
// pure free text everywhere.
export const STORE_CREDIT_REASONS = [
  'Customer service goodwill',
  'Order cancellation',
  'Return or refund',
  'Price adjustment',
  'Damaged or defective item',
  'Shipping delay',
  'Duplicate charge',
  'Promotional credit',
  'Referral or loyalty reward',
  'Balance correction',
  'Other',
] as const

export type StoreCreditReason = (typeof STORE_CREDIT_REASONS)[number]
