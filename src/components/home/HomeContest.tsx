import * as React from 'react'
import { CONTEST_ENDS_LABEL, CONTEST_PRIZES, contestLive } from '~/lib/contest'

// The Black Friday Promotion, in full, on the homepage (#promotion). The
// announcement bar and the sale banner link here. Hidden once it ends.
export const PRIZE_IMAGES: Record<string, { src: string; alt: string }> = {
  '1st place': { src: '/assets/home/promo-prize-1st.webp', alt: 'Pokémon TCG 30th Celebration Pokémon Center Elite Trainer Box' },
  '2nd place': { src: '/assets/home/promo-prize-2nd.webp', alt: 'Pokémon TCG 30th Celebration Elite Trainer Box' },
  '3rd place': { src: '/assets/home/promo-prize-3rd.webp', alt: 'Pokémon TCG 30th Celebration Booster Bundle' },
}

export function HomeContest() {
  if (!contestLive()) return null
  return (
    <section id="promotion" className="hp2-contest" aria-labelledby="contest-h">
      <div className="hp2-wrap hp2-contest-row">
        <div className="hp2-contest-head">
          <span className="hp2-contest-eyebrow">Black Friday Promotion · Ends {CONTEST_ENDS_LABEL}</span>
          <h2 id="contest-h">Spend more, get more</h2>
          <p>
            <b>Every order gets a free Chinese pack</b>, and every $100 adds another. Keep going: the top 3 spenders by {CONTEST_ENDS_LABEL} get:
          </p>
          <a href="/black-friday" className="hp2-contest-more">
            See prizes and picks →
          </a>
        </div>
        <ol className="hp2-contest-podium">
          {CONTEST_PRIZES.map((p) => {
            const img = PRIZE_IMAGES[p.place]
            return (
              <li key={p.place}>
                <div className="hp2-contest-photo">{img && <img src={img.src} alt={img.alt} loading="eager" />}</div>
                <div className="hp2-contest-cap">
                  <b>{p.label}</b>
                  <span>{p.prize}</span>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
