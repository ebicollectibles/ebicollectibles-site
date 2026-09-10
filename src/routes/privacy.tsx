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
            collectibles from Washington State. This policy explains what personal information we collect when you
            visit ebicollectibles.com or place an order, how we use it, who we share it with, and the choices you
            have.
          </p>
        </div>

        <div>
          <h2 style={h2}>Information we collect</h2>
          <p style={p}>We collect information you give us directly and a small amount collected automatically.</p>
          <h3 style={h3}>You give us:</h3>
          <ul style={ul}>
            <li>Contact and shipping details — name, email, phone (optional), shipping and billing address</li>
            <li>Account information — email and a password (we store a salted, one-way hash, never the password itself), or your Google account email/name if you sign in with Google</li>
            <li>Order history — what you bought, when, and its status</li>
            <li>Anything you send us directly, like a support email</li>
          </ul>
          <h3 style={h3}>Collected automatically:</h3>
          <ul style={ul}>
            <li>IP address and the network/country it resolves to — recorded on login and signup events for account security (detecting suspicious login activity), not used to track browsing</li>
            <li>Standard web analytics (pages viewed, general device/browser type) via Google Analytics, if enabled — this excludes our own admin traffic</li>
            <li>Cookies that keep you signed in and your cart working — see "Cookies" below</li>
          </ul>
          <h3 style={h3}>We do not collect or store:</h3>
          <ul style={ul}>
            <li>Your full card number, CVV, or bank details — card payments are handled entirely by Square, our payment processor; we only receive a redacted summary (card brand and last 4 digits) and Square's fraud-risk signals for the transaction</li>
          </ul>
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
            <li>Understand overall site traffic and improve the store</li>
          </ul>
        </div>

        <div>
          <h2 style={h2}>Who we share it with</h2>
          <p style={p}>
            We don't sell your personal information. We share it only with the service providers that make the store
            work, each of whom is only given what they need to do their job:
          </p>
          <ul style={ul}>
            <li>
              <strong>Square</strong> — processes payments and card data directly; we never see your full card number
            </li>
            <li>
              <strong>Resend</strong> — delivers our transactional and opt-in marketing emails
            </li>
            <li>
              <strong>Google</strong> — provides "Sign in with Google" (if you use it) and, separately, Google
              Analytics for site traffic (if enabled)
            </li>
            <li>
              <strong>Cloudflare</strong> — hosts the site and handles its infrastructure and security
            </li>
            <li>
              <strong>Washington State Department of Revenue</strong> — for WA orders only, we send just the street,
              city, and ZIP (nothing else) to their public rate-lookup service to calculate the correct sales tax
            </li>
          </ul>
          <p style={p}>We may also disclose information if required by law, or to protect our rights, customers, or the public.</p>
        </div>

        <div>
          <h2 style={h2}>Cookies</h2>
          <p style={p}>
            We use a small number of first-party cookies to keep you signed in and remember your cart — these are
            required for the site to function and aren't used to track you across other sites. If Google Analytics
            is enabled, it sets its own cookies to distinguish visitors for traffic reporting.
          </p>
        </div>

        <div>
          <h2 style={h2}>Data retention</h2>
          <p style={p}>
            We keep order records for as long as needed for accounting, tax, and warranty/support purposes. Account
            data is kept while your account is active; you can ask us to delete it (see "Your choices" below).
          </p>
        </div>

        <div>
          <h2 style={h2}>Security</h2>
          <p style={p}>
            We use industry-standard safeguards — encrypted connections (HTTPS) everywhere, salted password hashing,
            and access controls limiting who can see customer data — and we monitor for suspicious account activity.
            No method of transmission or storage is 100% secure, but we work to protect your information
            appropriately for its sensitivity.
          </p>
        </div>

        <div>
          <h2 style={h2}>Your choices</h2>
          <ul style={ul}>
            <li>Unsubscribe from marketing email anytime via the link in any such email</li>
            <li>Update your account details by signing in, or by emailing us</li>
            <li>Request a copy of, correction to, or deletion of your personal information by emailing us below</li>
          </ul>
        </div>

        <div>
          <h2 style={h2}>Children's privacy</h2>
          <p style={p}>
            EBI Collectibles is not directed to children under 13, and we do not knowingly collect personal
            information from them.
          </p>
        </div>

        <div>
          <h2 style={h2}>California residents</h2>
          <p style={p}>
            Under the California Consumer Privacy Act (CCPA/CPRA), California residents have the right to know what
            personal information we've collected about them, request its deletion, request correction of inaccurate
            information, and not be discriminated against for exercising these rights.
          </p>
          <p style={p}>
            We do not sell personal information, and we do not "share" it (as CPRA defines that term, meaning for
            cross-context behavioral advertising) — our Google Analytics use is limited to standard site-traffic
            reporting, not ad targeting.
          </p>
          <p style={p}>
            To exercise any of these rights, email us at the address below. We'll verify your request using the
            information already on file for your account or order before acting on it.
          </p>
        </div>

        <div>
          <h2 style={h2}>New York residents</h2>
          <p style={p}>
            In line with New York's SHIELD Act, we maintain reasonable administrative, technical, and physical
            safeguards for personal information belonging to New York residents, and we will notify affected New
            York residents (and any state agencies required by law) in the event of a data breach involving that
            information, as required under New York law.
          </p>
        </div>

        <div>
          <h2 style={h2}>Changes to this policy</h2>
          <p style={p}>
            We may update this policy from time to time. Material changes will be reflected by updating the date at
            the top of this page.
          </p>
        </div>

        <div>
          <h2 style={h2}>Contact us</h2>
          <p style={p}>
            Questions about this policy, or want to exercise any of the choices above? Email{' '}
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
