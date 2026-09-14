import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCart } from '~/lib/cart-context'

const MAX_RESULTS = 6

// Shared by the desktop header and the mobile menu — each mounts its own
// instance (own input, own dropdown state) since they're never open at the
// same time, so there's no need to hoist this into Header's own state.
export function HeaderSearch({
  variant,
  onNavigate,
}: {
  variant: 'desktop' | 'mobile'
  // Called right before navigating away (e.g. so the mobile menu closes).
  onNavigate?: () => void
}) {
  const navigate = useNavigate()
  const { products } = useCart()
  const [value, setValue] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [highlighted, setHighlighted] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const inputId = React.useId()

  const query = value.trim().toLowerCase()
  const matches = query ? products.filter((p) => p.name.toLowerCase().includes(query)).slice(0, MAX_RESULTS) : []

  React.useEffect(() => {
    setHighlighted(0)
  }, [query])

  React.useEffect(() => {
    if (!open) return
    const onClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  const goToProduct = (id: string) => {
    setOpen(false)
    onNavigate?.()
    navigate({ to: '/products/$id', params: { id } })
  }

  const submitFullSearch = () => {
    const q = value.trim()
    if (!q) return
    setOpen(false)
    onNavigate?.()
    navigate({ to: '/shop', search: { q } })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false)
      return
    }
    if (!open || matches.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((i) => (i + 1) % matches.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((i) => (i - 1 + matches.length) % matches.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      goToProduct(matches[highlighted].id)
    }
  }

  const desktop = variant === 'desktop'

  return (
    <div
      ref={containerRef}
      className={desktop ? 'ebi-header-search' : undefined}
      style={{ position: 'relative', width: desktop ? 260 : '100%' }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submitFullSearch()
        }}
        onClick={() => inputRef.current?.focus()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: '1px solid #e3e6ea',
          borderRadius: 2,
          padding: desktop ? '11px 14px' : '10px 12px',
          width: '100%',
          background: '#f6f7f8',
          cursor: 'text',
        }}
      >
        <span aria-hidden="true" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#98a1ab' }}>
          ⌕
        </span>
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setOpen(true)
          }}
          onFocus={() => value.trim() && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search products…"
          aria-label="Search products"
          role="combobox"
          aria-expanded={open && matches.length > 0}
          aria-controls={`${inputId}-results`}
          autoComplete="off"
          style={{ border: 0, background: 'transparent', fontSize: desktop ? 13.5 : 16, width: '100%', color: '#131b28' }}
        />
      </form>

      {open && query && (
        <div
          id={`${inputId}-results`}
          role="listbox"
          style={{
            position: desktop ? 'absolute' : 'static',
            top: desktop ? 'calc(100% + 6px)' : undefined,
            // Anchored to the search box's right edge but allowed to grow
            // wider than the box itself (leftward) — the box is narrow by
            // design, the dropdown doesn't need to be.
            right: desktop ? 0 : 0,
            left: desktop ? 'auto' : 0,
            width: desktop ? 360 : '100%',
            marginTop: desktop ? 0 : 8,
            background: '#ffffff',
            border: '1px solid #e3e6ea',
            borderRadius: 3,
            boxShadow: desktop ? '0 8px 24px rgba(19,27,40,0.1)' : 'none',
            zIndex: 40,
            overflow: 'hidden',
          }}
        >
          {matches.length === 0 ? (
            <div style={{ padding: '14px 14px', fontSize: 12.5, color: '#98a1ab' }}>No products found.</div>
          ) : (
            matches.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="option"
                aria-selected={i === highlighted}
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => goToProduct(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  textAlign: 'left',
                  background: i === highlighted ? '#f6f7f8' : 'transparent',
                  border: 0,
                  borderBottom: i === matches.length - 1 ? 0 : '1px solid #f0f2f4',
                  padding: desktop ? '12px 14px' : '9px 12px',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: desktop ? 48 : 36,
                    height: desktop ? 48 : 36,
                    flexShrink: 0,
                    borderRadius: 2,
                    border: '1px solid #e3e6ea',
                    background: '#f6f7f8',
                    overflow: 'hidden',
                  }}
                >
                  {p.img && (
                    <img src={p.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  )}
                </div>
                <span
                  style={{
                    flex: 1,
                    fontSize: desktop ? 13.5 : 12.5,
                    color: '#131b28',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.name}
                </span>
              </button>
            ))
          )}
          {matches.length > 0 && (
            <button
              type="button"
              onClick={submitFullSearch}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'center',
                background: '#f6f7f8',
                border: 0,
                borderTop: '1px solid #e3e6ea',
                padding: '9px 12px',
                fontSize: 11.5,
                fontFamily: "'IBM Plex Mono', monospace",
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#131b28',
                cursor: 'pointer',
              }}
            >
              See all results for "{value.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  )
}
