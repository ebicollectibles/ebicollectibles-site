import * as React from 'react'
import { CONTEST_ENDS_LABEL, CONTEST_PRIZES, contestLive } from '~/lib/contest'

// The Black Friday contest, in full, on the homepage (#contest). The
// announcement bar and the sale banner link here. Hidden once it ends.
export function HomeContest() {
  if (!contestLive()) return null
  return (
    <section id="contest" className="hp2-contest" aria-labelledby="contest-h">
      <div className="hp2-wrap">
        <div className="hp2-contest-head">
          <span className="hp2-contest-eyebrow">Black Friday contest · Ends {CONTEST_ENDS_LABEL}</span>
          <h2 id="contest-h">Shop the sale, win prizes</h2>
        </div>
        <ul className="hp2-contest-grid">
          <li>
            <span className="hp2-contest-k">Top spender prizes</span>
            <ol className="hp2-contest-prizes">
              {CONTEST_PRIZES.map((p) => (
                <li key={p.place}>
                  <b>{p.place}</b>
                  <span>{p.prize}</span>
                </li>
              ))}
            </ol>
          </li>
          <li>
            <span className="hp2-contest-k">Free packs</span>
            <p className="hp2-contest-big">1 free pack on every order</p>
            <p>Plus 1 more pack for every $100 you spend. A $250 order gets 3 packs.</p>
          </li>
          <li>
            <span className="hp2-contest-k">First 10 orders</span>
            <p className="hp2-contest-big">The first 10 orders get a Pikachu Dream Painting figure blind box</p>
            <p>
              One Pikachu Dream Painting 30th Celebration figure blind box, one of 12 figures, ships with each of the first 10 orders. It&rsquo;s a
              blind box, so it&rsquo;s a surprise.
            </p>
          </li>
        </ul>
      </div>
    </section>
  )
}
