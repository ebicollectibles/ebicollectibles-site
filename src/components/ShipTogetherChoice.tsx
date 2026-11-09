import { formatMoney } from '~/lib/products'
import type { CombineCandidate } from '~/lib/use-combine-shipping'

// The two-option "ship now vs. wait for my pending pre-order" card, shared
// between checkout.tsx and the cart page's Express Apple Pay flow so both
// look and behave identically — see useCombineShippingChoice for the state
// this renders.
export function ShipTogetherChoice({
  combineCandidate,
  shipTogetherChoice,
  onChange,
  missing,
  standardShippingCost,
}: {
  combineCandidate: CombineCandidate
  shipTogetherChoice: boolean | null
  onChange: (value: boolean) => void
  missing: boolean
  standardShippingCost: number
}) {
  return (
    <div>
      <div
        style={{
          border: `1px solid ${missing ? '#a85b2c' : '#e3e6ea'}`,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '11px 12px',
            cursor: 'pointer',
            background: shipTogetherChoice === false ? '#f6f7f8' : '#ffffff',
            borderBottom: '1px solid #e3e6ea',
          }}
        >
          <input type="radio" name="combine-shipping" checked={shipTogetherChoice === false} onChange={() => onChange(false)} style={{ flexShrink: 0 }} />
          <span style={{ flex: '1 1 auto', fontSize: 12.5, color: '#131b28', lineHeight: 1.4 }}>Ship this now</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, fontWeight: 600, color: '#131b28', whiteSpace: 'nowrap' }}>
            {formatMoney(standardShippingCost)}
          </span>
        </label>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '11px 12px',
            cursor: 'pointer',
            background: shipTogetherChoice === true ? '#eaf2ee' : '#ffffff',
          }}
        >
          <input type="radio" name="combine-shipping" checked={shipTogetherChoice === true} onChange={() => onChange(true)} style={{ flexShrink: 0 }} />
          <span style={{ flex: '1 1 auto', fontSize: 12.5, color: '#131b28', lineHeight: 1.4 }}>
            Wait and ship with <strong>#EBI-{combineCandidate.orderNo}</strong>
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, fontWeight: 600, color: '#3f7a63', whiteSpace: 'nowrap' }}>Free</span>
        </label>
      </div>
      <p style={{ fontSize: 11, color: missing ? '#a85b2c' : '#5a6875', margin: '6px 0 0', lineHeight: 1.5 }}>
        {missing
          ? '⚠ Please choose one of the options above before placing your order.'
          : shipTogetherChoice === true
            ? "This order won't ship until your pending pre-order does."
            : shipTogetherChoice === false
              ? 'This ships on its own, independent of your pending pre-order.'
              : "Your pending pre-order hasn't shipped yet — choose how this one should ship."}
      </p>
    </div>
  )
}
