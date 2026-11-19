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

  const openPreferences = React.useCallback(() => setPreferencesOpen(true), [])
  const closePreferences = React.useCallback(() => setPreferencesOpen(false), [])
  const value = React.useMemo<CookieConsentUIContextValue>(
    () => ({ preferencesOpen, openPreferences, closePreferences }),
    [preferencesOpen, openPreferences, closePreferences],
  )

  return (
    <CookieConsentUIContext.Provider value={value}>
      {/* First in the page (it is fixed to the bottom of the screen either
          way), so keyboard and screen-reader users meet the choice right
          after the skip link instead of after the whole page. */}
      <CookieBanner />
      {children}
      <CookiePreferencesModal />
    </CookieConsentUIContext.Provider>
  )
}

function CookieBanner() {
  const consent = useCookieConsent()
  const { preferencesOpen, openPreferences } = useCookiePreferencesUI()

  // Already decided (this visit or a past one), or the preferences modal is
  // open — either way, nothing to show here.
  const showing = consent === null && !preferencesOpen
  const ref = React.useRef<HTMLDivElement>(null)

  // The banner is fixed over the bottom of the screen. While it shows, its
  // height is published as --ebi-cookie-banner-h on <html>, and app.css
  // uses that to pad the page, the open mobile menu and the card dialog so
  // nothing (the last menu item, a dialog's buttons, the footer) is left
  // underneath it and focused elements scroll clear of it.
  React.useEffect(() => {
    const el = ref.current
    if (!showing || !el) return
    const root = document.documentElement
    const publish = () => root.style.setProperty('--ebi-cookie-banner-h', `${Math.ceil(el.getBoundingClientRect().height)}px`)
    publish()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(publish) : null
    ro?.observe(el)
    window.addEventListener('resize', publish)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', publish)
      root.style.removeProperty('--ebi-cookie-banner-h')
    }
  }, [showing])

  if (!showing) return null

  return (
    <div
      ref={ref}
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
      <div className="ebi-cookie-banner-inner">
        <p className="ebi-cookie-banner-text">
          We use necessary cookies to run the site, and optional cookies for analytics and affiliate attribution if you allow
          them. See our{' '}
          <Link to="/cookie-policy" style={{ color: '#131b28', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Cookie Policy
          </Link>{' '}
          for details.
        </p>
        <div className="ebi-cookie-banner-actions">
          <button
            type="button"
            data-cookie-manage
            className="ebi-cookie-btn"
            onClick={openPreferences}
            style={{ background: 'none', border: 'none', color: '#5a6875', fontSize: 12.5, fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', padding: '10px 4px' }}
          >
            Manage preferences
          </button>
          <button
            type="button"
            className="ebi-cookie-btn"
            onClick={() => setConsent(REJECT_ALL)}
            style={{ background: 'none', border: '1px solid var(--border-strong)', color: '#131b28', borderRadius: 2, padding: '10px 16px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
          >
            Reject non-essential
          </button>
          <button
            type="button"
            className="ebi-btn-dark ebi-cookie-btn"
            onClick={() => setConsent(ACCEPT_ALL)}
            style={{ background: '#131b28', color: '#ffffff', border: '1px solid #131b28', borderRadius: 2, padding: '10px 18px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
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

  // Focus: remembered when the dialog opens, moved into the dialog, kept
  // inside it while it is open (Tab and Shift+Tab wrap), and handed back
  // on close. Escape closes without changing the stored choice.
  const panelRef = React.useRef<HTMLDivElement>(null)
  const returnFocusRef = React.useRef<HTMLElement | null>(null)
  React.useEffect(() => {
    if (!preferencesOpen) return
    returnFocusRef.current = document.activeElement as HTMLElement | null
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      const panel = panelRef.current
      if (!panel) return
      if (e.key === 'Escape') {
        e.stopPropagation()
        closePreferences()
        return
      }
      if (e.key !== 'Tab') return
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])'))
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement
      if (!panel.contains(active) || active === panel) {
        e.preventDefault()
        ;(e.shiftKey ? last : first).focus()
      } else if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    // Capture phase, so this runs before any page-level key handler (the
    // set page's card dialog also listens for Escape and the arrow keys).
    document.addEventListener('keydown', onKey, true)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey, true)
      document.body.style.overflow = prevOverflow
      // After React has re-rendered: the banner (and its "Manage
      // preferences" button) is unmounted while the dialog is open and is
      // a new element afterwards, so fall back to it when the original
      // opener is gone, and to the page's main content when the banner is
      // gone too (a choice was just saved).
      const opener = returnFocusRef.current
      returnFocusRef.current = null
      window.setTimeout(() => {
        const target =
          opener && opener.isConnected && opener !== document.body
            ? opener
            : document.querySelector<HTMLElement>('[data-cookie-manage]') ?? document.getElementById('main-content')
        target?.focus({ preventScroll: target.id === 'main-content' })
      }, 0)
    }
  }, [preferencesOpen, closePreferences])

  if (!preferencesOpen) return null

  const save = () => {
    setConsent(draft)
    closePreferences()
  }

  return (
    <div
      data-ebi-modal
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
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-preferences-title"
        aria-describedby="cookie-preferences-desc"
        tabIndex={-1}
        className="ebi-cookie-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 4,
          padding: '28px 28px 24px',
          maxWidth: 560,
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <button type="button" className="ebi-cookie-dialog-close" aria-label="Close cookie preferences" onClick={closePreferences}>
          <span aria-hidden="true">×</span>
        </button>
        <h2 id="cookie-preferences-title" style={{ fontSize: 19, fontWeight: 700, margin: 0, color: '#131b28', paddingRight: 44 }}>
          Cookie preferences
        </h2>
        <p id="cookie-preferences-desc" style={{ fontSize: 13, lineHeight: 1.6, color: '#5a6875', margin: '8px 0 0' }}>
          Choose which optional cookies we can use. Necessary cookies are always on since the site can't function
          without them. You can change this anytime from the link in our footer.
        </p>

        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {COOKIE_CATEGORIES.map((category) => (
            <div key={category.key} style={{ border: '1px solid #e3e6ea', borderRadius: 3, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
                <h3 id={`cookie-cat-${category.key}`} style={{ fontSize: 13.5, fontWeight: 700, color: '#131b28', margin: 0 }}>
                  {category.name}
                </h3>
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
                  <label className="ebi-switch" style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, flexShrink: 0, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      role="switch"
                      checked={draft[category.key as 'analytics' | 'marketing']}
                      onChange={(e) => setDraft((d) => ({ ...d, [category.key]: e.target.checked }))}
                      aria-label={`${category.name} cookies`}
                      aria-describedby={`cookie-cat-desc-${category.key}`}
                      style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', margin: 0, cursor: 'pointer' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 12,
                        // The "off" track is #76808c (4:1 on white) rather than the old
                        // #cfd4da (1.5:1), so the control can be seen when it is off.
                        background: draft[category.key as 'analytics' | 'marketing'] ? '#3f7a63' : '#76808c',
                        transition: 'background 0.15s ease',
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: 2,
                        left: draft[category.key as 'analytics' | 'marketing'] ? 22 : 2,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: '#ffffff',
                        boxShadow: '0 1px 3px rgba(19,27,40,0.3)',
                        transition: 'left 0.15s ease',
                      }}
                    />
                  </label>
                )}
              </div>
              <p id={`cookie-cat-desc-${category.key}`} style={{ fontSize: 12.5, lineHeight: 1.6, color: '#5a6875', margin: '8px 0 0' }}>
                {category.description}
              </p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: '#5a6875', margin: '16px 0 0' }}>
          Full details on every cookie we use are in our{' '}
          <Link to="/cookie-policy" onClick={closePreferences} style={{ color: '#131b28', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>
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
