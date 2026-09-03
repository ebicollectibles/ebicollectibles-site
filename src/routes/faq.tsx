import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { FAQS } from '~/lib/products'

export const Route = createFileRoute('/faq')({
  component: FaqPage,
})

const RATES = [{ label: 'Flat rate shipping', eta: '3–6 business days, all orders', price: '$10.00' }]

function FaqPage() {
  const [openIndex, setOpenIndex] = React.useState<number>(0)

  return (
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: '40px 20px 80px' }}>
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10.5,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#98a1ab',
        }}
      >
        Support
      </div>
      <h1 style={{ fontSize: 38, letterSpacing: '-0.025em', fontWeight: 700, margin: '10px 0 0' }}>FAQ &amp; shipping</h1>

      <div className="ebi-faq-layout" style={{ marginTop: 40, alignItems: 'start' }}>
        <div style={{ borderTop: '1px solid #131b28' }}>
          {FAQS.map((f, i) => {
            const open = openIndex === i
            return (
              <div key={f.question} style={{ borderBottom: '1px solid #e3e6ea' }}>
                <button
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 20,
                    background: 'transparent',
                    border: 0,
                    padding: '22px 4px',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: 15.5, fontWeight: 600, color: '#131b28' }}>{f.question}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, color: '#98a1ab', flexShrink: 0 }}>
                    {open ? '−' : '+'}
                  </span>
                </button>
                {open && (
                  <p style={{ fontSize: 14.5, lineHeight: 1.65, color: '#5a6875', margin: 0, padding: '0 24px 24px 4px', maxWidth: '72ch' }}>
                    {f.answer}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <div>
          <div style={{ border: '1px solid #e3e6ea', padding: 24 }}>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10.5,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#98a1ab',
              }}
            >
              Shipping rates
            </div>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {RATES.map((r) => (
                <div
                  key={r.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: 12,
                    paddingBottom: 14,
                    borderBottom: '1px solid #f0f2f4',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.label}</div>
                    <div style={{ fontSize: 12, color: '#98a1ab' }}>{r.eta}</div>
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>{r.price}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#f6f7f8', border: '1px solid #e3e6ea', borderTop: 0, padding: 24 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>Still stuck?</div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5a6875', margin: '8px 0 14px' }}>
              We answer every message within one business day, usually much faster.
            </p>
            <a href="mailto:hello@ebicollectibles.com" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, color: '#3f7a63' }}>
              hello@ebicollectibles.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
