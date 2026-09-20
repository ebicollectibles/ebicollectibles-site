import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/return-policy')({
  component: RefundPolicyPage,
})

function RefundPolicyPage() {
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
      <h1 style={{ fontSize: 38, letterSpacing: '-0.025em', fontWeight: 700, margin: '10px 0 0' }}>Refund policy</h1>

      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px' }}>Pre-orders are final</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: 0, maxWidth: '65ch' }}>
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
            all once placed (see above).
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
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: '16px 0 0', maxWidth: '65ch' }}>
            See our{' '}
            <Link to="/shipping-policy" style={{ color: '#3f7a63' }}>
              shipping policy
            </Link>{' '}
            for what counts as normal cosmetic wear versus product damage.
          </p>
        </div>
      </div>
    </section>
  )
}
