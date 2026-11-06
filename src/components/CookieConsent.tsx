import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { COOKIE_CATEGORIES, setConsent, useCookieConsent, type ConsentCategories } from '~/lib/cookie-consent'

const ACCEPT_ALL: ConsentCategories = { analytics: true, marketing: true }
const REJECT_ALL: ConsentCategories = { analytics: false, marketing: false }

interface CookieConsentUIContextValue {
  preferencesOpen: boolean
  openPreferences: () => void
  closePreferences: () => void
}

const CookieConsentUIContext = React.createContext<CookieConsentUIContextValue | null>(null)

/** Lets any component (the banner, the Footer's "Cookie preferences" link) open the same modal. */
export function useCookiePreferencesUI() {
  const ctx = React.useContext(CookieConsentUIContext)
  if (!ctx) throw new Error('useCookiePreferencesUI must be used inside CookieConsentProvider')
  return ctx
}

// Mounted once in __root.tsx, wrapping the whole app — fully self-contained,
// so nothing else needs to remember to render the banner or the modal.
export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [preferencesOpen, setPreferencesOpen] = React.useState(false)

  const value = React.useMemo<CookieConsentUIContextValue>(
    () => ({
      preferencesOpen,
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
    }),
    [preferencesOpen],
  )

  return (
    <CookieConsentUIContext.Provider value={value}>
      {children}
      <CookieBanner />
      <CookiePreferencesModal />
    </CookieConsentUIContext.Provider>
  )
}

function CookieBanner() {
  const consent = useCookieConsent()
  const { preferencesOpen, openPreferences } = useCookiePreferencesUI()

  // Already decided (this visit or a past one), or the preferences modal is
  // open — either way, nothing to show here.
  if (consent !== null || preferencesOpen) return null

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="ebi-cookie-banner"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 200,
        background: '#ffffff',
        borderTop: '1px solid var(--border-strong)',
        boxShadow: '0 -8px 24px rgba(19,27,40,0.08)',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <p style={{ fontSize: 13, lineHeight: 1.6, color: '#131b28', margin: 0, maxWidth: '62ch', flex: '1 1 320px' }}>
          We use necessary cookies to run the site, and optional cookies for analytics and affiliate attribution if you allow
          them. See our{' '}
          <Link to="/cookie-policy" style={{ color: '#131b28', fontWeight: 600 }}>
            Cookie Policy
          </Link>{' '}
          for details.
        </p>
        <div className="ebi-cookie-banner-actions" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flexShrink: 0 }}>
          <button
            type="button"
            onClick={openPreferences}
            style={{ background: 'none', border: 'none', color: '#5a6875', fontSize: 12.5, fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', padding: '10px 4px' }}
          >
            Manage preferences
          </button>
          <button
            type="button"
            onClick={() => setConsent(REJECT_ALL)}
            style={{ background: 'none', border: '1px solid var(--border-strong)', color: '#131b28', borderRadius: 2, padding: '10px 16px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
          >
            Reject non-essential
          </button>
          <button
            type="button"
            className="ebi-btn-dark"
            onClick={() => setConsent(ACCEPT_ALL)}
            style={{ background: '#131b28', color: '#ffffff', border: 0, borderRadius: 2, padding: '10px 18px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  )
}

function CookiePreferencesModal() {
  const { preferencesOpen, closePreferences } = useCookiePreferencesUI()
  const consent = useCookieConsent()
  const [draft, setDraft] = React.useState<ConsentCategories>(consent ?? REJECT_ALL)

  // Re-sync the draft to whatever's actually stored every time the modal is
  // opened, so reopening it later (from the Footer) shows your real current
  // choices rather than stale defaults from the first time you saw it.
  React.useEffect(() => {
    if (preferencesOpen) setDraft(consent ?? REJECT_ALL)
  }, [preferencesOpen, consent])

  if (!preferencesOpen) return null

  const save = () => {
    setConsent(draft)
    closePreferences()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-preferences-title"
      onClick={closePreferences}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(19,27,40,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 4,
          padding: '28px 28px 24px',
          maxWidth: 560,
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        <h2 id="cookie-preferences-title" style={{ fontSize: 19, fontWeight: 700, margin: 0, color: '#131b28' }}>
          Cookie preferences
        </h2>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5a6875', margin: '8px 0 0' }}>
          Choose which optional cookies we can use. Necessary cookies are always on since the site can't function
          without them. You can change this anytime from the link in our footer.
        </p>

        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {COOKIE_CATEGORIES.map((category) => (
            <div key={category.key} style={{ border: '1px solid #e3e6ea', borderRadius: 3, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#131b28' }}>{category.name}</div>
                {category.required ? (
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 10,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#5a6875',
                      whiteSpace: 'nowrap',
                      padding: '3px 0',
                    }}
                  >
                    Always on
                  </span>
                ) : (
                  <label style={{ position: 'relative', display: 'inline-block', width: 38, height: 22, flexShrink: 0, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={draft[category.key as 'analytics' | 'marketing']}
                      onChange={(e) => setDraft((d) => ({ ...d, [category.key]: e.target.checked }))}
                      aria-label={`${category.name} cookies`}
                      style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', margin: 0, cursor: 'pointer' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 11,
                        background: draft[category.key as 'analytics' | 'marketing'] ? '#3f7a63' : '#cfd4da',
                        transition: 'background 0.15s ease',
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: 2,
                        left: draft[category.key as 'analytics' | 'marketing'] ? 18 : 2,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: '#ffffff',
                        boxShadow: '0 1px 3px rgba(19,27,40,0.3)',
                        transition: 'left 0.15s ease',
                      }}
                    />
                  </label>
                )}
              </div>
              <p style={{ fontSize: 12.5, lineHeight: 1.6, color: '#5a6875', margin: '8px 0 0' }}>{category.description}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: '#5a6875', margin: '16px 0 0' }}>
          Full details on every cookie we use are in our{' '}
          <Link to="/cookie-policy" style={{ color: '#131b28', fontWeight: 600 }}>
            Cookie Policy
          </Link>
          .
        </p>

        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              setConsent(REJECT_ALL)
              closePreferences()
            }}
            style={{ background: 'none', border: '1px solid var(--border-strong)', color: '#131b28', borderRadius: 2, padding: '10px 16px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
          >
            Reject all
          </button>
          <button
            type="button"
            onClick={() => {
              setConsent(ACCEPT_ALL)
              closePreferences()
            }}
            style={{ background: 'none', border: '1px solid var(--border-strong)', color: '#131b28', borderRadius: 2, padding: '10px 16px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
          >
            Accept all
          </button>
          <button
            type="button"
            className="ebi-btn-dark"
            onClick={save}
            style={{ background: '#131b28', color: '#ffffff', border: 0, borderRadius: 2, padding: '10px 18px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', marginLeft: 'auto' }}
          >
            Save preferences
          </button>
        </div>
      </div>
    </div>
  )
}
