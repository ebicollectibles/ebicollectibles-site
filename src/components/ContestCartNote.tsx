import * as React from 'react'
import { useCart } from '~/lib/cart-context'
import { CONTEST_ENDS_LABEL, contestLive, freePacksFor, toNextPack } from '~/lib/contest'
import { formatMoney } from '~/lib/products'

// Black Friday Promotion reminder in the cart and checkout (lib/contest.ts):
// how many free packs this order gets and how close the next one is.
export function ContestCartNote() {
  const { subtotal, cartEmpty } = useCart()
  if (!contestLive() || cartEmpty) return null
  const packs = freePacksFor(subtotal)
  return (
    <div
      role="note"
      style={{ marginTop: 14, padding: '12px 14px', background: '#131b28', color: '#fff', borderRadius: 4, fontSize: 12.5, lineHeight: 1.55 }}
    >
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#ffd23f' }}>
        Black Friday Promotion · Ends {CONTEST_ENDS_LABEL}
      </div>
      <div style={{ marginTop: 4, fontWeight: 700, fontSize: 14 }}>
        This order gets {packs} free Chinese pack{packs === 1 ? '' : 's'}
      </div>
      <div style={{ color: '#c9d1da' }}>
        Spend {formatMoney(toNextPack(subtotal))} more for another pack. The top 3 spenders get prizes.{' '}
        <a href="/black-friday" style={{ color: '#ffd23f' }}>
          See prizes
        </a>
      </div>
    </div>
  )
}
