import { Link } from '@tanstack/react-router'

// Shared by the regular checkout form and express Apple Pay checkout (from
// the cart page) — same order, same confirmation, regardless of how it was
// placed.
export function OrderConfirmation({
  orderNo,
  paymentStatus,
  hasPreorder,
}: {
  orderNo: number
  paymentStatus: string
  // A mixed cart is blocked at checkout, so an order is either all
  // pre-order or none — no need to say which items, just whether this
  // order falls under the pre-order (final sale) terms.
  hasPreorder?: boolean
}) {
  return (
    <section style={{ maxWidth: 640, margin: '0 auto', padding: '110px 28px 140px', textAlign: 'center' }}>
      <div
        style={{
          width: 52,
          height: 52,
          margin: '0 auto',
          border: '1px solid #3f7a63',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#3f7a63',
          fontSize: 22,
        }}
      >
        ✓
      </div>
      <h1 style={{ fontSize: 32, letterSpacing: '-0.02em', fontWeight: 700, margin: '24px 0 0' }}>Order confirmed</h1>
      <p style={{ fontSize: 15, lineHeight: 1.65, color: '#131b28', margin: '12px 0 0' }}>
        Order <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>#EBI-{orderNo}</span> has been placed. You'll
        get a confirmation email shortly.
      </p>
      {paymentStatus === 'test' && (
        <p style={{ fontSize: 12.5, color: '#b4622f', margin: '10px 0 0' }}>
          (Test mode — no card was charged. Configure Square to accept real payments.)
        </p>
      )}
      {hasPreorder && (
        <div
          style={{
            marginTop: 20,
            padding: '12px 16px',
            background: '#fdf3ec',
            border: '1px solid #e6c4a8',
            borderRadius: 2,
            textAlign: 'left',
          }}
        >
          <p style={{ fontSize: 13, lineHeight: 1.6, color: '#131b28', margin: 0 }}>
            This order includes a pre-order item. Pre-orders are charged in full and are final, with no
            cancellations once placed. See our{' '}
            <Link to="/shipping-returns" style={{ color: '#131b28', fontWeight: 600 }}>
              Shipping &amp; Returns Policy
            </Link>{' '}
            for details.
          </p>
        </div>
      )}
      <Link
        to="/shop"
        className="ebi-btn-dark"
        style={{
          display: 'inline-block',
          marginTop: 28,
          background: '#131b28',
          color: '#ffffff',
          border: 0,
          borderRadius: 2,
          padding: '14px 26px',
          fontSize: 13.5,
          fontWeight: 600,
        }}
      >
        Back to the catalogue
      </Link>
    </section>
  )
}
