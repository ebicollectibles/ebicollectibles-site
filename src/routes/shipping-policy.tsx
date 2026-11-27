import { createFileRoute } from '@tanstack/react-router'
import { HOLIDAY_SHIPPING_NOTICE, HOLIDAY_SHIPPING_TEXT, SHIPPING_HANDLING_MAX_DAYS, SHIPPING_HANDLING_MIN_DAYS } from '~/lib/policy'

const SITE_URL = 'https://ebicollectibles.com'

export const Route = createFileRoute('/shipping-policy')({
  head: () => ({
    meta: [
      { title: 'Shipping Policy — EBI Collectibles' },
      { name: 'description', content: 'How EBI Collectibles ships orders, including pre-order and handling timelines.' },
      { property: 'og:title', content: 'Shipping Policy — EBI Collectibles' },
      { property: 'og:description', content: 'How EBI Collectibles ships orders, including pre-order and handling timelines.' },
      { property: 'og:url', content: `${SITE_URL}/shipping-policy` },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/shipping-policy` }],
  }),
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
        {HOLIDAY_SHIPPING_NOTICE && (
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#131b28', margin: 0, maxWidth: '65ch', padding: '12px 16px', background: '#fdf3ec', border: '1px solid #e6c4a8', borderRadius: 3 }}>
            {HOLIDAY_SHIPPING_TEXT}
          </p>
        )}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px' }}>Shipping</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: 0, maxWidth: '65ch' }}>
            We currently ship within the United States only. Alaska and Hawaii can't be checked out on the site
            yet; send your cart as an invoice request from the cart or checkout and we'll email you an invoice with shipping. All orders ship flat-rate ($10.00), and each
            order is charged its own shipping, except as described for pre-orders below. In-stock orders
            {HOLIDAY_SHIPPING_NOTICE
              ? `usually ship within ${SHIPPING_HANDLING_MIN_DAYS}-${SHIPPING_HANDLING_MAX_DAYS} business days; during the holidays it can take a few extra days.`
              : `ship within ${SHIPPING_HANDLING_MIN_DAYS}-${SHIPPING_HANDLING_MAX_DAYS} business days.`} Carrier is
            selected by us for the safest, fastest route to your address, and we don't offer carrier choice at
            checkout. Every order ships with tracking, emailed the moment it goes out.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px' }}>Pre-orders &amp; delayed items</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: 0, maxWidth: '65ch' }}>
            Pre-order items are charged in full at checkout. If an order has both a pre-order item and in-stock
            items, you confirm at checkout that the whole order, including the in-stock items, will wait and ship
            together once the pre-order item arrives. To get in-stock items sooner, place them as a separate order.
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', margin: '16px 0 0', maxWidth: '65ch' }}>
            Already placed a pre-order? Signed in to the account with the email you ordered with (creating one with
            that email works too), you can place an in-stock order and
            choose at checkout to ship it with your unshipped pre-order. That order has no shipping charge and
            ships together with the pre-order once it arrives.
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
