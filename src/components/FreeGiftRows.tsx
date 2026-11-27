import * as React from 'react'
import { useCart } from '~/lib/cart-context'

// The free gifts a cart has earned (lib/promotions.ts), shown as $0 lines
// marked FREE, plus a kind note when the gift is running low or gone. The
// server works out the real gift at checkout from live stock, so this is
// only what the shopper sees; it can never give away more than is left.
export function FreeGiftRows({ compact = false }: { compact?: boolean }) {
  const { gifts, giftNotice } = useCart()
  if (gifts.length === 0 && !giftNotice) return null
  const img = compact ? 54 : 120
  return (
    <>
      {gifts.map((g) => (
        <div
          key={g.product.id}
          style={
            compact
              ? { display: 'flex', gap: 14, alignItems: 'flex-start' }
              : { display: 'flex', gap: 20, padding: '24px 4px', borderBottom: '1px solid #e3e6ea', alignItems: 'center' }
          }
        >
          <div style={{ width: img, height: img, flexShrink: 0, background: '#f6f7f8', overflow: 'hidden' }}>
            {g.product.img && <img src={g.product.img} alt={g.product.imgAlt || g.product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: compact ? 13 : 16, fontWeight: 600, lineHeight: 1.35 }}>{g.product.name}</div>
            <div style={{ fontSize: compact ? 11.5 : 12.5, fontWeight: 600, color: '#3f7a63', marginTop: compact ? 3 : 6 }}>
              Free gift · {g.label}
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: compact ? 11 : 13, color: '#5a6875', marginTop: 3 }}>Qty {g.qty}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: compact ? 13 : 16, fontWeight: 600, color: '#3f7a63' }}>FREE</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: compact ? 11 : 12.5, color: '#5a6875' }}>$0.00</div>
          </div>
        </div>
      ))}
      {giftNotice && (
        <p role="status" style={{ fontSize: compact ? 12.5 : 13.5, color: '#5a6875', lineHeight: 1.5, margin: compact ? 0 : '14px 4px 0' }}>
          {giftNotice}
        </p>
      )}
    </>
  )
}
