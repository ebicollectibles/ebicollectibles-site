import { createFileRoute } from '@tanstack/react-router'
import { SHIPPING_HANDLING_MAX_DAYS, SHIPPING_HANDLING_MIN_DAYS } from '~/lib/policy'

export const Route = createFileRoute('/shipping-policy')({
  component: ShippingPolicyPage,
})

function ShippingPolicyPage() {
  return (
    <section style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 90px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10.5,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#131b28',
        }}
      >
        Support
      </div>
      <h1 style={{ fontSize: 38, letterSpacing: '-0.025em', fontWeight: 700, margin: '10px 0 0' }}>Shipping policy</h1>

      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px' }}>Shipping</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: 0, maxWidth: '65ch' }}>
            We currently ship within the United States only. All orders ship flat-rate ($10.00). In-stock orders
            ship within {SHIPPING_HANDLING_MIN_DAYS}-{SHIPPING_HANDLING_MAX_DAYS} business days. Carrier is
            selected by us for the safest, fastest route to your address, and we don't offer carrier choice at
            checkout. Every order ships with tracking, emailed the moment it goes out.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px' }}>Pre-orders &amp; delayed items</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: 0, maxWidth: '65ch' }}>
            Pre-order items are charged in full at checkout and ship separately from any in-stock items in the
            same order. For this reason, a cart that mixes a pre-order with an in-stock item can't be checked out
            together.
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: '16px 0 0', maxWidth: '65ch' }}>
            Release and ship dates are estimates provided by the manufacturer or distributor and may change
            without notice. We'll email you if a pre-order's timeline changes.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px' }}>Product &amp; packaging condition</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: 0, maxWidth: '65ch' }}>
            We inspect products before shipment and package orders to help protect them during transit. However,
            collectible packaging may still show minor cosmetic imperfections from manufacturing, distribution,
            or shipping, including small dents, scuffs, scratches, corner wear, or loose or uneven shrink wrap.
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: '16px 0 0', maxWidth: '65ch' }}>
            Unless a listing specifically describes an item as mint or collector-grade, minor cosmetic
            imperfections to exterior packaging are not considered product damage.
          </p>
        </div>
      </div>
    </section>
  )
}
