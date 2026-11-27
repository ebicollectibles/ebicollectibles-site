import { CONTEST_ENDS_LABEL, contestLive } from '~/lib/contest'

export function AnnouncementBar() {
  return (
    <aside
      aria-label="Store notice"
      style={{
        background: '#131b28',
        color: '#ffffff',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '9px 20px',
        textAlign: 'center',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11.5,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      {contestLive() ? (
        // Black Friday Promotion reminder on every page (lib/contest.ts); goes
        // back to the usual notice by itself once the contest ends.
        <>
          <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffd23f', display: 'inline-block', flexShrink: 0 }} />
          <span>
            Black Friday Promotion · Top 3 spenders win prizes · Free Chinese pack on every order · Ends {CONTEST_ENDS_LABEL}
          </span>
          {/* A plain link (not the router's) so it always lands on the section,
              from any page and from the homepage itself. */}
          <a href="/#promotion" style={{ color: '#ffd23f', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            See prizes →
          </a>
        </>
      ) : (
        <>
          <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: '#5fbf97', display: 'inline-block', flexShrink: 0 }} />
          <span>Orders Ship From WA · Family Owned</span>
        </>
      )}
    </aside>
  )
}
