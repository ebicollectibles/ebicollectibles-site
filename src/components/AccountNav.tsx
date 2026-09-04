import type * as React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'

export function AccountNav({
  email,
  name,
  onLogout,
}: {
  email?: string | null
  name?: string | null
  onLogout: () => void
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const tabStyle = (active: boolean): React.CSSProperties => ({
    fontSize: 13.5,
    fontWeight: 600,
    color: active ? '#131b28' : '#98a1ab',
    padding: '0 0 12px',
    borderBottom: active ? '2px solid #131b28' : '2px solid transparent',
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>My account</h1>
          {(name || email) && (
            <p style={{ fontSize: 13.5, color: '#5a6875', marginTop: 6 }}>
              {name ? `${name} · ` : ''}
              {email}
            </p>
          )}
        </div>
        <button
          onClick={onLogout}
          style={{ background: 'none', border: '1px solid #cfd4da', borderRadius: 2, padding: '9px 14px', fontSize: 12.5, cursor: 'pointer', color: '#5a6875' }}
        >
          Log out
        </button>
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 32, borderBottom: '1px solid #e3e6ea' }}>
        <Link to="/account/orders" style={tabStyle(pathname.startsWith('/account/orders'))}>
          Orders
        </Link>
        <Link to="/account/profile" style={tabStyle(pathname.startsWith('/account/profile'))}>
          Profile
        </Link>
      </div>
    </div>
  )
}
