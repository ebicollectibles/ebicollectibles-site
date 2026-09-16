import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/shipping-returns')({
  component: ShippingReturnsPage,
})

function ShippingReturnsPage() {
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
      <h1 style={{ fontSize: 38, letterSpacing: '-0.025em', fontWeight: 700, margin: '10px 0 0' }}>Shipping &amp; returns</h1>

      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px' }}>Shipping</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: 0, maxWidth: '65ch' }}>
            We currently ship within the United States only. All orders ship flat-rate ($10.00). Carrier is
            selected by us for the safest, fastest route to your address, and we don't offer carrier choice at
            checkout. Every order ships with tracking, emailed the moment it goes out.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px' }}>Pre-orders</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: 0, maxWidth: '65ch' }}>
            Pre-order items are charged in full at checkout and ship separately from any in-stock items in the
            same order. For this reason, a cart that mixes a pre-order with an in-stock item can't be checked out
            together.
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: '16px 0 0', maxWidth: '65ch' }}>
            Release and ship dates are estimates provided by the manufacturer or distributor and may change
            without notice. We'll email you if a pre-order's timeline changes.
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: '16px 0 0', maxWidth: '65ch' }}>
            Pre-orders are final. Once placed, a pre-order can't be canceled or refunded for a change of mind.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px' }}>Cancellations</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: 0, maxWidth: '65ch' }}>
            Cancellation requests may be submitted prior to shipment. Approved cancellations are subject to a 3%
            cancellation fee, unless otherwise stated on the product listing. The fee is deducted from your
            refund and covers the non-refundable payment processing fees incurred when your original transaction
            was processed.
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: '16px 0 0', maxWidth: '65ch' }}>
            To request a cancellation, email{' '}
            <a href="mailto:eastblueinternational@gmail.com">eastblueinternational@gmail.com</a> with the subject
            line "CANCEL ORDER #[ORDER NUMBER]".
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: '16px 0 0', maxWidth: '65ch' }}>
            Submitting a cancellation request does not guarantee that an order can be canceled. Orders that have
            already been processed for shipment or shipped can't be canceled, and pre-orders can't be canceled at
            all once placed (see "Pre-orders" above).
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px' }}>Returns</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: 0, maxWidth: '65ch' }}>
            Due to the nature of sealed collectible products, we're unable to verify that an item has remained
            unopened or unaltered once it has been delivered. For this reason, we do not accept returns or
            exchanges on sealed products except in the following circumstances:
          </p>
          <ul style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: '10px 0 0', paddingLeft: 22, maxWidth: '65ch' }}>
            <li>You received an item different from what you ordered.</li>
            <li>An item is missing from your order.</li>
            <li>Your order arrived damaged.</li>
          </ul>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: '16px 0 0', maxWidth: '65ch' }}>
            If there is an issue with your order, please contact us within 7 days of delivery and include your
            order number, a description of the issue, and clear photos of the item and packaging. We'll review
            the information and work with you toward an appropriate resolution.
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
