import type * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useCookiePreferencesUI } from '~/components/CookieConsent'
import { COOKIE_CATEGORIES } from '~/lib/cookie-consent'

export const Route = createFileRoute('/cookie-policy')({
  component: CookiePolicyPage,
})

const h2: React.CSSProperties = { fontSize: 18, fontWeight: 700, margin: '0 0 10px' }
const p: React.CSSProperties = { fontSize: 14.5, lineHeight: 1.7, color: '#131b28', margin: '0 0 12px', maxWidth: '70ch' }
const ul: React.CSSProperties = { fontSize: 14.5, lineHeight: 1.7, color: '#131b28', margin: '0 0 12px', paddingLeft: 22, maxWidth: '70ch' }
const th: React.CSSProperties = {
  textAlign: 'left',
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#5a6875',
  padding: '0 14px 8px 0',
  borderBottom: '1px solid #131b28',
}
const td: React.CSSProperties = { fontSize: 13, color: '#131b28', padding: '10px 14px 10px 0', borderBottom: '1px solid #e3e6ea', verticalAlign: 'top' }

function CookiePolicyPage() {
  const { openPreferences } = useCookiePreferencesUI()

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
      <h1 style={{ fontSize: 38, letterSpacing: '-0.025em', fontWeight: 700, margin: '10px 0 0' }}>Cookie policy</h1>
      <p style={{ fontSize: 13, color: '#5a6875', margin: '10px 0 0' }}>Last updated November 6, 2026</p>

      <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 30 }}>
        <div>
          <p style={p}>
            This policy explains what cookies and similar technologies EBI Collectibles ("EBI," "we," "us") uses,
            why, and how you can control them. It supplements our{' '}
            <a href="/privacy" style={{ color: '#3f7a63' }}>
              Privacy Policy
            </a>
            .
          </p>
          <p style={p}>
            A cookie is a small text file a site stores in your browser to remember something between visits or
            requests — who you're signed in as, what's in your cart, or that a page has already been counted once.
            We also use <strong>local storage</strong> the same way in one place: to remember your cookie choices
            themselves, so we don't have to ask you every single page load.
          </p>
        </div>

        <div>
          <h2 style={h2}>Your choice, anytime</h2>
          <p style={p}>
            When you first visit, a banner lets you accept all cookies, reject everything that isn't required, or
            open preferences and choose by category. You can change your mind at any time —{' '}
            <button
              type="button"
              onClick={openPreferences}
              style={{ background: 'none', border: 'none', color: '#3f7a63', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit' }}
            >
              manage your cookie preferences
            </button>{' '}
            here, or via the link in the footer of every page.
          </p>
        </div>

        {COOKIE_CATEGORIES.map((category) => (
          <div key={category.key}>
            <h2 style={h2}>
              {category.name}
              {category.required ? (
                <span style={{ fontSize: 11, fontWeight: 700, color: '#5a6875', textTransform: 'uppercase', letterSpacing: '0.06em', marginLeft: 10 }}>
                  Always on
                </span>
              ) : (
                <span style={{ fontSize: 11, fontWeight: 700, color: '#5a6875', textTransform: 'uppercase', letterSpacing: '0.06em', marginLeft: 10 }}>
                  Off by default
                </span>
              )}
            </h2>
            <p style={p}>{category.description}</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
                <thead>
                  <tr>
                    <th style={th}>Name</th>
                    <th style={th}>Provider</th>
                    <th style={th}>Purpose</th>
                    <th style={th}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {category.cookies.map((cookie) => (
                    <tr key={cookie.name}>
                      <td style={{ ...td, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>{cookie.name}</td>
                      <td style={td}>{cookie.provider}</td>
                      <td style={td}>{cookie.purpose}</td>
                      <td style={td}>{cookie.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div>
          <h2 style={h2}>Browser-level controls</h2>
          <p style={p}>
            Most browsers also let you block or delete cookies yourself, independent of the choice you make here.
            Blocking necessary cookies through your browser will break core site features like sign-in and
            checkout — that's outside our control once it happens at the browser level.
          </p>
        </div>

        <div>
          <h2 style={h2}>Changes to this policy</h2>
          <ul style={ul}>
            <li>If we add a new category of cookie or a new provider, we'll update this page and the date above.</li>
            <li>If the change is material, we'll ask everyone to make a fresh choice the next time they visit, rather than quietly carrying forward an old consent.</li>
          </ul>
        </div>

        <div>
          <h2 style={h2}>Questions</h2>
          <p style={p}>
            Email{' '}
            <a href="mailto:eastblueinternational@gmail.com" style={{ color: '#3f7a63' }}>
              eastblueinternational@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
