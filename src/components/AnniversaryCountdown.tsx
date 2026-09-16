export function AnniversaryCountdown() {
  return (
    <section style={{ background: '#131b28', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '22px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 22,
          textAlign: 'center',
        }}
      >
        <img
          src="/assets/Pokemon_30th_Logo.png"
          alt="Pokémon 30th Anniversary"
          style={{ height: 46, width: 'auto', flexShrink: 0 }}
        />

        <div style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#a3adb8' }}>
            Pokémon TCG · 30th Anniversary
          </div>
          <div style={{ fontSize: 16.5, fontWeight: 700, letterSpacing: '-0.01em', marginTop: 3, color: '#ffd23f' }}>
            Happy 30th Anniversary!
          </div>
        </div>
      </div>
    </section>
  )
}
