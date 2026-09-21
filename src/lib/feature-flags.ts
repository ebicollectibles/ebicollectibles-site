// Temporary on/off switches for whole nav sections, at Leon's request —
// flip back to true to bring one back. Kept here (not inline) since each
// of these is referenced from more than one place (header + footer).
export const SHOW_ACRYLICS = true

// hello@ebicollectibles.com isn't set up yet (mail bounces) — hides the
// "Contact us" section on /privacy and /terms-of-service until the
// ebicollectibles.com domain email is finished. Flip back to true then
// (or point those sections at eastblueinternational@gmail.com instead,
// like the refund-policy page already does for cancellation requests).
export const SHOW_CONTACT_EMAIL = false

// Shippo itself is wired up and verified working (real API key + ship-from
// address as Cloudflare Worker secrets, live-tested 2026-09-21 against both
// Honolulu, HI and Anchorage, AK). But no products have a real weightLb set
// yet, so resolveHiAkShippingRate (server/shippo.ts) falls back to a flat
// 0.5lb guess per item for every line — that's fine for something small, but
// badly undercharges for anything heavier (e.g. a sealed booster box),
// recreating the exact under-charging risk this feature exists to avoid.
// Block AK/HI checkout again until product weights are actually filled in
// via the admin form, then flip this back to false.
export const BLOCK_HI_AK_CHECKOUT = true
