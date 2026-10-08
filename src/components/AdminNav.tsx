import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { useAuth } from '@clerk/tanstack-react-start'

// A few px of vertical padding gives each link a real tap target on touch
// screens — at fontSize 13 with none, taps between wrapped rows are easy
// to miss or mis-hit the wrong link.
const navLinkStyle = { fontSize: 13, color: '#131b28', padding: '6px 2px' }

export function AdminNav() {
  const router = useRouter()
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const logout = async () => {
    await signOut()
    await router.invalidate()
    navigate({ to: '/admin/login' })
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '10px 20px',
        paddingBottom: 16,
        borderBottom: '1px solid #e3e6ea',
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>EBI ADMIN</span>
      <Link to="/admin" style={navLinkStyle}>
        Products
      </Link>
      <Link to="/admin/orders" style={navLinkStyle}>
        Orders
      </Link>
      <Link to="/admin/best-selling" style={navLinkStyle}>
        Best Selling
      </Link>
      <Link to="/admin/new-and-upcoming" style={navLinkStyle}>
        New &amp; Upcoming
      </Link>
      <Link to="/admin/marketplace-orders" style={navLinkStyle}>
        Marketplace
      </Link>
      <Link to="/admin/customers" style={navLinkStyle}>
        Customers
      </Link>
      <Link to="/admin/subscribers" style={navLinkStyle}>
        Subscribers
      </Link>
      <Link to="/admin/security" style={navLinkStyle}>
        Security
      </Link>
      <Link to="/admin/links" style={navLinkStyle}>
        Links
      </Link>
      <Link to="/admin/affiliates" style={navLinkStyle}>
        Affiliates
      </Link>
      <Link to="/admin/notify-me" style={navLinkStyle}>
        Notify me
      </Link>
      <Link to="/admin/bulk-variants" style={navLinkStyle}>
        Bulk variant assign
      </Link>
      <div style={{ flex: 1 }} />
      <button onClick={logout} style={{ background: 'none', border: 0, fontSize: 13, color: '#5a6875', cursor: 'pointer', padding: '6px 2px' }}>
        Log out
      </button>
    </div>
  )
}
