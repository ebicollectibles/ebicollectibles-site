import type * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPolicyPage,
})

const h2: React.CSSProperties = { fontSize: 18, fontWeight: 700, margin: '0 0 10px' }
const p: React.CSSProperties = { fontSize: 14.5, lineHeight: 1.7, color: '#131b28', margin: '0 0 12px', maxWidth: '70ch' }
const ul: React.CSSProperties = { fontSize: 14.5, lineHeight: 1.7, color: '#131b28', margin: '0 0 12px', paddingLeft: 22, maxWidth: '70ch' }
const h3: React.CSSProperties = { fontSize: 14.5, fontWeight: 700, margin: '18px 0 8px' }

function PrivacyPolicyPage() {
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
        Legal
      </div>
      <h1 style={{ fontSize: 38, letterSpacing: '-0.025em', fontWeight: 700, margin: '10px 0 0' }}>Privacy policy</h1>
      <p style={{ fontSize: 13, color: '#5a6875', margin: '10px 0 0' }}>Last updated September 10, 2026</p>

      <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 30 }}>
        <div>
          <p style={p}>
            EBI Collectibles ("EBI," "we," "us") sells sealed Simplified Chinese Pokémon product and related
            collectibles from Washington State. This policy explains what personal information we collect, how we
            use it, and who we share it with.
          </p>
        </div>

        <div>
          <h2 style={h2}>Information we collect</h2>
          <ul style={ul}>
            <li>Contact and shipping details — name, email, phone (optional), shipping and billing address</li>
            <li>Account information — email and a password (stored as a salted, one-way hash, never the password itself), or your Google account email/name if you sign in with Google</li>
            <li>Order history — what you bought, when, and its status</li>
            <li>IP address, recorded on login/signup for account security — not used to track browsing</li>
            <li>Standard web analytics (pages viewed, general device/browser type) via Google Analytics, if enabled</li>
          </ul>
          <p style={p}>
            We never see your full card number, CVV, or bank details — card payments are handled entirely by Square,
            our payment processor.
          </p>
        </div>

        <div>
          <h2 style={h2}>How we use it</h2>
          <ul style={ul}>
            <li>Process and ship your order, and contact you about it</li>
            <li>Maintain your account and let you sign in</li>
            <li>Calculate applicable sales tax for Washington addresses</li>
            <li>Send order confirmations and shipment notices</li>
            <li>Send restock/new-drop emails, only if you opt in — every such email includes an unsubscribe link</li>
            <li>Detect and prevent fraud and account abuse</li>
          </ul>
        </div>

        <div>
          <h2 style={h2}>Who we share it with</h2>
          <p style={p}>
            We don't sell your personal information. We share it only with the service providers that make the store
            work:
          </p>
          <ul style={ul}>
            <li>
              <strong>Square</strong> — processes payments and card data directly
            </li>
            <li>
              <strong>Resend</strong> — delivers our transactional and opt-in marketing emails
            </li>
            <li>
              <strong>Google</strong> — provides "Sign in with Google" (if you use it) and Google Analytics (if
              enabled)
            </li>
            <li>
              <strong>Cloudflare</strong> — hosts the site
            </li>
            <li>
              <strong>Washington State Department of Revenue</strong> — for WA orders only, just the street, city,
              and ZIP, to calculate sales tax
            </li>
          </ul>
          <p style={p}>We may also disclose information if required by law.</p>
        </div>

        <div>
          <h2 style={h2}>Your choices</h2>
          <p style={p}>
            Unsubscribe from marketing email anytime via the link in any such email. To update, get a copy of, or
            delete your personal information, email us below.
          </p>
        </div>

        <div>
          <h2 style={h2}>Contact us</h2>
          <p style={p}>
            Questions about this policy? Email{' '}
            <a href="mailto:hello@ebicollectibles.com" style={{ color: '#3f7a63' }}>
              hello@ebicollectibles.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
