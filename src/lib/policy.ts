// Single source of truth for the handful of shipping/return facts that need
// to stay in sync between the human-readable policy pages (shipping-policy.tsx,
// refund-policy.tsx) and the machine-readable JSON-LD on each product page
// (products.$id.tsx). Change a number here and both update together —
// nowhere else should hardcode these.

export const SHIPPING_HANDLING_MIN_DAYS = 1
export const SHIPPING_HANDLING_MAX_DAYS = 2

// We don't publish a return window because we don't have one — see
// refund-policy.tsx: sealed products aren't returnable for change of mind,
// only for wrong item / missing item / damage, reported within 7 days of
// delivery. That's not a normal "returns accepted within N days" policy, so
// it maps to schema.org's explicit "no returns" category rather than
// inventing a return window that doesn't exist.
export const RETURN_POLICY_CATEGORY_URL = 'https://schema.org/MerchantReturnNotPermitted'

// Only ship within the US (see shipping-policy.tsx) — same code used for
// both the ship-from and ship-to side of the JSON-LD shipping details.
export const SHIPS_TO_COUNTRY = 'US'
