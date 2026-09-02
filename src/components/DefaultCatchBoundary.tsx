import { ErrorComponent, Link, useLocation, useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useLocation({
    select: (location) => location.pathname === '/',
  })

  console.error('DefaultCatchBoundary Error:', error)

  return (
    <div
      style={{
        minWidth: 0,
        flex: 1,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        textAlign: 'center',
      }}
    >
      <ErrorComponent error={error} />
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            router.invalidate()
          }}
          style={{
            background: '#131b28',
            color: '#ffffff',
            border: 0,
            borderRadius: 2,
            padding: '10px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
        {isRoot ? (
          <Link
            to="/"
            style={{
              background: '#ffffff',
              color: '#131b28',
              border: '1px solid #cfd4da',
              borderRadius: 2,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Home
          </Link>
        ) : (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.history.back()
            }}
            style={{
              background: '#ffffff',
              color: '#131b28',
              border: '1px solid #cfd4da',
              borderRadius: 2,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Go back
          </a>
        )}
      </div>
    </div>
  )
}
