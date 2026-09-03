export function AnnouncementBar() {
  return (
    <div
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
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5fbf97', display: 'inline-block', flexShrink: 0 }} />
      <span>A Family-Owned Business · Shipped From WA</span>
    </div>
  )
}
