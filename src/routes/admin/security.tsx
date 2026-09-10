import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AdminNav } from '~/components/AdminNav'
import { requireAdmin, adminLogout } from '~/server/admin-auth'
import { adminListSecurityEvents } from '~/server/admin'
import { looksLikeDatacenter } from '~/server/request-signals'

const EVENTS_PER_PAGE = 30

export const Route = createFileRoute('/admin/security')({
  beforeLoad: () => requireAdmin(),
  loader: () => adminListSecurityEvents(),
  component: AdminSecurityPage,
})

const eventLabel: Record<string, string> = {
  admin_login: 'Admin login',
  admin_login_failed: 'Admin login failed',
  login: 'Customer login',
  login_failed: 'Customer login failed',
  signup: 'Account created',
  google_link: 'Linked Google sign-in',
  password_reset: 'Password reset',
  email_verified: 'Email verified',
}

const eventColor: Record<string, string> = {
  admin_login: '#3f7a63',
  admin_login_failed: '#a13a3a',
  login: '#3f7a63',
  login_failed: '#b4622f',
  signup: '#3f7a63',
}

function AdminSecurityPage() {
  const navigate = useNavigate()
  const events = Route.useLoaderData()
  const [page, setPage] = React.useState(1)

  const totalPages = Math.max(1, Math.ceil(events.length / EVENTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageEvents = events.slice((currentPage - 1) * EVENTS_PER_PAGE, currentPage * EVENTS_PER_PAGE)

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 28px 80px', fontFamily: 'Archivo, Helvetica, sans-serif' }}>
      <AdminNav
        onLogout={async () => {
          await adminLogout()
          navigate({ to: '/admin/login' })
        }}
      />
      <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 24 }}>Security</h1>
      <p style={{ fontSize: 12.5, color: '#98a1ab', margin: '8px 0 0', maxWidth: '60ch' }}>
        Every signup, login, admin login and related event, most recent first, with the IP, network owner and country
        Cloudflare reported for that request. A "Hosting network" flag means the request came from a datacenter/cloud
        network rather than a home connection — a signal worth a second look, not proof of anything.
      </p>

      {events.length === 0 ? (
        <p style={{ fontSize: 13.5, color: '#131b28', marginTop: 16 }}>No activity yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 24 }}>
          {pageEvents.map((e) => {
            const flagged = looksLikeDatacenter(e.asOrganization)
            return (
              <div
                key={e.id}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  padding: '10px 0',
                  borderBottom: '1px solid #f0f2f4',
                  fontSize: 12.5,
                  gap: 8,
                }}
              >
                <span>
                  <span style={{ color: eventColor[e.type] ?? '#131b28', fontWeight: 600 }}>{eventLabel[e.type] ?? e.type}</span>
                  {e.email && <span> — {e.email}</span>}
                  <span style={{ color: '#98a1ab' }}>
                    {' '}
                    {[e.ipAddress, e.asOrganization, e.country].filter(Boolean).join(' · ')}
                  </span>
                  {flagged && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 10,
                        textTransform: 'uppercase',
                        color: '#a13a3a',
                        border: '1px solid #a13a3a',
                        borderRadius: 2,
                        padding: '1px 5px',
                      }}
                    >
                      Hosting network
                    </span>
                  )}
                </span>
                <span style={{ color: '#98a1ab', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, whiteSpace: 'nowrap' }}>
                  {new Date(e.createdAt).toLocaleString()}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setPage((p) => p - 1)}
            style={{
              background: 'none',
              border: '1px solid #cfd4da',
              borderRadius: 2,
              padding: '5px 10px',
              fontSize: 12,
              color: '#131b28',
              cursor: currentPage === 1 ? 'default' : 'pointer',
              opacity: currentPage === 1 ? 0.4 : 1,
            }}
          >
            ← Prev
          </button>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: '#5a6875' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => p + 1)}
            style={{
              background: 'none',
              border: '1px solid #cfd4da',
              borderRadius: 2,
              padding: '5px 10px',
              fontSize: 12,
              color: '#131b28',
              cursor: currentPage === totalPages ? 'default' : 'pointer',
              opacity: currentPage === totalPages ? 0.4 : 1,
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
