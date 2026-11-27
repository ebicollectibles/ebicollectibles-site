import { HOLIDAY_SHIPPING_NOTICE, HOLIDAY_SHIPPING_TEXT } from '~/lib/policy'

// Holiday shipping notice (lib/policy.ts) for the cart and checkout.
export function HolidayShippingNote() {
  if (!HOLIDAY_SHIPPING_NOTICE) return null
  return (
    <p role="note" style={{ fontSize: 12.5, lineHeight: 1.5, color: '#5a6875', margin: '12px 0 0', padding: '10px 12px', background: '#f6f7f8', border: '1px solid #e3e6ea', borderRadius: 3 }}>
      {HOLIDAY_SHIPPING_TEXT}
    </p>
  )
}
