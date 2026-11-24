import { createFileRoute } from '@tanstack/react-router'
import { WhileYouWait } from '~/components/WhileYouWait'

// Owner preview of the "While you wait" picks before they go live for
// customers (SHOW_WHILE_YOU_WAIT in components/WhileYouWait.tsx). Not
// linked from anywhere and kept out of search. Shows the cart version;
// "Add to cart" here adds to your real cart.
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
          Preview · Cart, when it has a pre-order
        </div>
        <WhileYouWait mode="cart" />
      </section>
    </>
  )
}
