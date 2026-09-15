import * as React from 'react'

// Midnight on the release date, in whatever timezone the browser itself is
// in — so every visitor counts down to their own local midnight rather than
// one fixed instant worldwide.
const TARGET = new Date(2026, 8, 16, 0, 0, 0)

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function diffToParts(diffMs: number): TimeLeft {
  const clamped = Math.max(0, diffMs)
  return {
    days: Math.floor(clamped / 86_400_000),
    hours: Math.floor(clamped / 3_600_000) % 24,
    minutes: Math.floor(clamped / 60_000) % 60,
    seconds: Math.floor(clamped / 1_000) % 60,
  }
}

function useCountdown(target: Date) {
  // Starts null (not "00:00:00:00") so nothing renders until the first
  // client-side tick — the server has no reliable "now" to render this
  // from, and guessing would just produce a hydration mismatch.
  const [timeLeft, setTimeLeft] = React.useState<TimeLeft | null>(null)

  React.useEffect(() => {
    const tick = () => setTimeLeft(diffToParts(target.getTime() - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  return timeLeft
}

const unitLabel: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 9.5,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#a3adb8',
  marginTop: 3,
}

export function AnniversaryCountdown() {
  const timeLeft = useCountdown(TARGET)

  // Nothing to count down to yet (pre-hydration) or the date has passed —
  // either way, just don't show the banner.
  if (!timeLeft) return null
  const elapsed = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0
  if (elapsed) return null

  const units: { label: string; value: number }[] = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hrs', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ]

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
          <div style={{ fontSize: 16.5, fontWeight: 700, letterSpacing: '-0.01em', marginTop: 3 }}>
            Global release — 09.16.2026
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {units.map((u) => (
            <div
              key={u.label}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 2,
                padding: '8px 12px',
                minWidth: 52,
              }}
            >
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 21,
                  fontWeight: 700,
                  color: '#ffd23f',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                }}
              >
                {String(u.value).padStart(2, '0')}
              </div>
              <div style={unitLabel}>{u.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
