import { Link } from '@tanstack/react-router'

export function AdminNav({ onLogout }: { onLogout: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingBottom: 16, borderBottom: '1px solid #e3e6ea' }}>
      <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.06em' }}>EBI ADMIN</span>
      <Link to="/admin" style={{ fontSize: 13, color: '#5a6875' }}>
        Products
      </Link>
      <Link to="/admin/orders" style={{ fontSize: 13, color: '#5a6875' }}>
        Orders
      </Link>
      <Link to="/admin/customers" style={{ fontSize: 13, color: '#5a6875' }}>
        Customers
      </Link>
      <div style={{ flex: 1 }} />
      <button onClick={onLogout} style={{ background: 'none', border: 0, fontSize: 13, color: '#98a1ab', cursor: 'pointer' }}>
        Log out
      </button>
    </div>
  )
}
