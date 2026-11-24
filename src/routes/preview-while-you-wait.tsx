import { createFileRoute } from '@tanstack/react-router'
import { OrderConfirmation } from '~/components/OrderConfirmation'
import { WhileYouWait } from '~/components/WhileYouWait'

// Owner preview of the "While you wait" picks before they go live for
// customers (SHOW_WHILE_YOU_WAIT in components/WhileYouWait.tsx). Not
// linked from anywhere and kept out of search. Shows the cart version and
// a sample order confirmation; "Add to cart" here adds to your real cart.
export const Route = createFileRoute('/preview-while-you-wait')({
  head: () => ({
    meta: [
      { title: 'While you wait preview | EBI Collectibles' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: PreviewWhileYouWait,
})

function PreviewWhileYouWait() {
  return (
    <>
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px 20px' }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Preview 1 of 2 · Cart, when it has a pre-order
        </div>
        <WhileYouWait mode="cart" />
      </section>
      <div style={{ borderTop: '2px dashed #cfd4da', maxWidth: 900, margin: '40px auto 0' }} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px 0', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        Preview 2 of 2 · Order confirmation for a pre-order (sample order number)
      </div>
      <OrderConfirmation orderNo={0} paymentStatus="paid" hasPreorder forcePicks />
    </>
  )
}
