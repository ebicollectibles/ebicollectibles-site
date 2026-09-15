import { Link } from '@tanstack/react-router'

// Shared by the regular checkout form and express Apple Pay checkout (from
// the cart page) — same order, same confirmation, regardless of how it was
// placed.
export function OrderConfirmation({ orderNo, paymentStatus }: { orderNo: number; paymentStatus: string }) {
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
        Order <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>#EBI-{orderNo}</span> is in the queue.
        You'll get the authentication photo set and tracking number by email within 48 hours.
      </p>
      {paymentStatus === 'test' && (
        <p style={{ fontSize: 12.5, color: '#b4622f', margin: '10px 0 0' }}>
          (Test mode — no card was charged. Configure Square to accept real payments.)
        </p>
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
