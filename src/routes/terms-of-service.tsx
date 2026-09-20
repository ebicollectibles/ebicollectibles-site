import type * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/terms-of-service')({
  component: TermsOfServicePage,
})

const h2: React.CSSProperties = { fontSize: 18, fontWeight: 700, margin: '0 0 10px' }
const p: React.CSSProperties = { fontSize: 14.5, lineHeight: 1.7, color: '#131b28', margin: '0 0 12px', maxWidth: '70ch' }
const ul: React.CSSProperties = { fontSize: 14.5, lineHeight: 1.7, color: '#131b28', margin: '0 0 12px', paddingLeft: 22, maxWidth: '70ch' }
const link: React.CSSProperties = { color: '#3f7a63' }

function TermsOfServicePage() {
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
      <h1 style={{ fontSize: 38, letterSpacing: '-0.025em', fontWeight: 700, margin: '10px 0 0' }}>Terms of service</h1>
      <p style={{ fontSize: 13, color: '#5a6875', margin: '10px 0 0' }}>Last updated September 20, 2026</p>

      <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 30 }}>
        <div>
          <p style={p}>
            These terms govern your use of the EBI Collectibles website ("EBI," "we," "us") and any purchase you
            make through it. By using this site or placing an order, you agree to these terms. If you don't
            agree, please don't use the site.
          </p>
        </div>

        <div>
          <h2 style={h2}>Accounts</h2>
          <ul style={ul}>
            <li>You're responsible for keeping your account credentials secure and for activity under your account.</li>
            <li>You must provide accurate, current information when creating an account or placing an order.</li>
            <li>We may suspend or terminate an account for suspected fraud, abuse, or violation of these terms.</li>
          </ul>
        </div>

        <div>
          <h2 style={h2}>Orders, pricing &amp; payment</h2>
          <ul style={ul}>
            <li>All orders are subject to acceptance and product availability — placing an order isn't a guarantee it will be fulfilled.</li>
            <li>We make reasonable efforts to ensure prices, images, and descriptions are accurate, but errors can happen. If we discover a pricing or listing error after you've ordered, we'll contact you before charging or shipping, and you may cancel for a full refund.</li>
            <li>Payments are processed by Square. We never see or store your full card number, CVV, or bank details.</li>
            <li>
              Cancellations, returns, and refunds are governed by our{' '}
              <Link to="/return-policy" style={link}>
                refund policy
              </Link>
              .
            </li>
            <li>
              Shipping, delivery estimates, and pre-order terms are governed by our{' '}
              <Link to="/shipping-policy" style={link}>
                shipping policy
              </Link>
              .
            </li>
          </ul>
        </div>

        <div>
          <h2 style={h2}>Product listings</h2>
          <p style={p}>
            We sell sealed Simplified Chinese Pokémon product and related collectibles, sourced through
            authorized mainland distribution. Photos are representative — the exact card/box art or print run
            may vary within the same listing unless the listing says otherwise. Grading, print quality, and
            secondary-market value are outside our control and not guaranteed.
          </p>
        </div>

        <div>
          <h2 style={h2}>Acceptable use</h2>
          <p style={p}>You agree not to:</p>
          <ul style={ul}>
            <li>Use the site for any unlawful purpose or in violation of any applicable law</li>
            <li>Attempt to gain unauthorized access to the site, other accounts, or our systems</li>
            <li>Interfere with the site's normal operation (e.g. scraping at disruptive volume, automated bulk ordering)</li>
            <li>Use another person's payment information without authorization</li>
          </ul>
        </div>

        <div>
          <h2 style={h2}>Intellectual property</h2>
          <p style={p}>
            The site's design, text, and original photography are owned by EBI Collectibles or licensed to us.
            Product names, characters, and artwork remain the property of their respective rights holders. EBI
            Collectibles is not affiliated with, or endorsed by, any card publisher.
          </p>
        </div>

        <div>
          <h2 style={h2}>Disclaimer &amp; limitation of liability</h2>
          <p style={p}>
            The site and products are provided "as is," without warranties of any kind beyond what's required by
            law. To the fullest extent permitted by law, EBI Collectibles isn't liable for indirect, incidental,
            or consequential damages arising from your use of the site or purchase of a product. Nothing here
            limits liability that can't be limited under applicable law.
          </p>
        </div>

        <div>
          <h2 style={h2}>Governing law</h2>
          <p style={p}>These terms are governed by the laws of the State of Washington, without regard to conflict-of-law principles.</p>
        </div>

        <div>
          <h2 style={h2}>Changes to these terms</h2>
          <p style={p}>
            We may update these terms from time to time. Continued use of the site after a change means you
            accept the updated terms. We'll update the "last updated" date above when we do.
          </p>
        </div>

        <div>
          <h2 style={h2}>Contact us</h2>
          <p style={p}>
            Questions about these terms? Email{' '}
            <a href="mailto:hello@ebicollectibles.com" style={link}>
              hello@ebicollectibles.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
