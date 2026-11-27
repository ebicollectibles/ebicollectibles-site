import * as React from 'react'
import { CONTEST_ENDS_LABEL, CONTEST_PRIZES, contestLive } from '~/lib/contest'

// The Black Friday Promotion, in full, on the homepage (#promotion). The
// announcement bar and the sale banner link here. Hidden once it ends.
export function HomeContest() {
  if (!contestLive()) return null
  return (
    <section id="promotion" className="hp2-contest" aria-labelledby="contest-h">
      <div className="hp2-wrap">
        <div className="hp2-contest-head">
          <span className="hp2-contest-eyebrow">Black Friday Promotion · Ends {CONTEST_ENDS_LABEL}</span>
          <h2 id="contest-h">Shop the sale, win prizes</h2>
        </div>

        <div className="hp2-contest-prizes-row">
          <div className="hp2-contest-photo is-wide">
            <img
              src="/assets/home/promo-prizes-photo.webp"
              alt="The three prizes in acrylic cases: a 30th Celebration Booster Bundle on top of a 30th Celebration Pokémon Center Elite Trainer Box and a 30th Celebration Elite Trainer Box"
              loading="lazy"
            />
          </div>
          <div>
            <span className="hp2-contest-k">Top spender prizes</span>
            <ol className="hp2-contest-list">
              {CONTEST_PRIZES.map((p) => (
                <li key={p.place}>
                  <b>{p.place}</b>
                  <span>{p.prize}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

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
