import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { useCart } from '~/lib/cart-context'
import { CONTEST_ENDS_LABEL, contestLive, freePacksFor, toNextPack } from '~/lib/contest'
import { formatMoney } from '~/lib/products'

// Black Friday contest reminder in the cart and checkout (lib/contest.ts):
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
        Black Friday contest · Ends {CONTEST_ENDS_LABEL}
      </div>
      <div style={{ marginTop: 4, fontWeight: 700, fontSize: 14 }}>
        This order gets {packs} free pack{packs === 1 ? '' : 's'}
      </div>
      <div style={{ color: '#c9d1da' }}>
        Spend {formatMoney(toNextPack(subtotal))} more for another pack. The first 10 orders also get a Pikachu figure blind box, and the top 3
        spenders win prizes.{' '}
        <Link to="/" hash="contest" style={{ color: '#ffd23f' }}>
          See prizes
        </Link>
      </div>
    </div>
  )
}
