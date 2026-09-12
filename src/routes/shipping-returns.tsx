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
            selected by us for the safest, fastest route to your address — we don't offer carrier choice at
            checkout. Every order ships with tracking, emailed the moment it goes out.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px' }}>Returns</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: 0, maxWidth: '65ch' }}>
            Sealed product can't be verified as untouched once it's left our hands, so we don't accept returns
            unless:
          </p>
          <ul style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: '10px 0 0', paddingLeft: 22, maxWidth: '65ch' }}>
            <li>The item that arrives isn't what you ordered</li>
            <li>Something's missing from your order</li>
            <li>It arrives damaged</li>
          </ul>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: '16px 0 0', maxWidth: '65ch' }}>
            Email us within 7 days of delivery with your order number and photos, and we'll work with you on a
            resolution.
          </p>
        </div>
      </div>
    </section>
  )
}
