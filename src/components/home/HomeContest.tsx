import * as React from 'react'
import { CONTEST_ENDS_LABEL, CONTEST_PRIZES, contestLive } from '~/lib/contest'

// The Black Friday Promotion, in full, on the homepage (#promotion). The
// announcement bar and the sale banner link here. Hidden once it ends.
const PRIZE_IMAGES: Record<string, { src: string; alt: string }> = {
  '1st place': { src: '/assets/home/contest-pc-etb.webp', alt: 'Pokémon TCG 30th Celebration Pokémon Center Elite Trainer Box in an acrylic case' },
  '2nd place': { src: '/assets/home/contest-etb.webp', alt: 'Pokémon TCG 30th Celebration Elite Trainer Box in an acrylic case' },
  '3rd place': { src: '/assets/home/contest-bundle.webp', alt: 'Pokémon TCG 30th Celebration Booster Bundle in an acrylic case' },
}

export function HomeContest() {
  if (!contestLive()) return null
  return (
    <section id="promotion" className="hp2-contest" aria-labelledby="contest-h">
      <div className="hp2-wrap">
        <div className="hp2-contest-head">
          <span className="hp2-contest-eyebrow">Black Friday Promotion · Ends {CONTEST_ENDS_LABEL}</span>
          <h2 id="contest-h">Shop the sale, win prizes</h2>
        </div>

        <span className="hp2-contest-k hp2-contest-sub">Top spender prizes</span>
        <ol className="hp2-contest-podium">
          {CONTEST_PRIZES.map((p) => {
            const img = PRIZE_IMAGES[p.place]
            return (
              <li key={p.place}>
                <div className="hp2-contest-photo">{img && <img src={img.src} alt={img.alt} loading="lazy" />}</div>
                <div className="hp2-contest-cap">
                  <b>{p.place}</b>
                  <span>{p.prize}</span>
                </div>
              </li>
            )
          })}
        </ol>

        <ul className="hp2-contest-grid">
          <li className="hp2-contest-packs">
            <span className="hp2-contest-k">Free Chinese packs</span>
            <p className="hp2-contest-big">1 free Chinese pack on every order</p>
            <p>Plus 1 more Chinese pack for every $100 you spend. A $250 order gets 3 packs.</p>
          </li>
        </ul>
      </div>
    </section>
  )
}
