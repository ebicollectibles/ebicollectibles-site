import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { useCart } from '~/lib/cart-context'
import { isOnSale } from '~/lib/products'
import { CONTEST_ENDS_LABEL, contestLive } from '~/lib/contest'

// Homepage banner for Black Friday week, in place of the 30th Anniversary
// strip (AnniversaryCountdown) while the sale runs. "Shop the sale" opens
// the shop filtered to marked-down items (?sale=true).

const COLORS = ['#a85b2c', '#ffd23f', '#f2a7c3', '#7fb7e6', '#3f7a63']

// Fixed-seed confetti so the server and the browser draw the same dots.
const CONFETTI = (() => {
  let s = 7
  const r = () => (s = (s * 9301 + 49297) % 233280) / 233280
  return Array.from({ length: 34 }, (_, i) => {
    const band = r() < 0.5
    const left = r() * 100
    const top = band ? r() * 12 : 88 + r() * 12
    const size = 5 + r() * 7
    const square = i % 3 === 0
    const rot = square ? r() * 90 : 0
    return { left, top, size, square, rot, color: COLORS[i % COLORS.length] }
  })
})()

const CSS = `
.bf { background:#fffaf1; border-bottom:1px solid #f0e3cc; overflow:hidden; position:relative; }
.bf-in { max-width:1240px; margin:0 auto; padding:26px 20px; display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:30px; position:relative; z-index:1; }
.bf-conf { position:absolute; inset:0; pointer-events:none; }
.bf-conf i { position:absolute; opacity:.9; }
.bf-sticker { width:116px; height:116px; border-radius:50%; background:#a85b2c; color:#fff; display:grid; place-items:center; text-align:center; transform:rotate(-10deg); box-shadow:0 6px 0 #7e4220; }
.bf-sticker b { display:block; font:700 23px/0.95 Archivo, Helvetica, sans-serif; letter-spacing:-.02em; }
.bf-sticker small { display:block; font:500 10px 'IBM Plex Mono', monospace; letter-spacing:.18em; margin-top:5px; }
.bf h2 { margin:0; font:700 46px/1 Archivo, Helvetica, sans-serif; letter-spacing:-.025em; color:#131b28; }
.bf-stat { display:inline-flex; align-items:center; gap:8px; margin-top:12px; padding:6px 12px; border-radius:999px; background:#131b28; color:#ffd23f; font:500 12px 'IBM Plex Mono', monospace; letter-spacing:.12em; text-transform:uppercase; }
.bf-stat b { color:#fff; font-weight:600; }
.bf h2 span { color:#a85b2c; }
.bf p { margin:8px 0 0; font-size:15px; color:#5a6875; text-wrap:balance; }
.bf-right { display:flex; align-items:center; gap:26px; }
.bf-ctas { display:flex; flex-direction:column; gap:8px; }
.bf-grp { position:relative; width:420px; height:176px; }
.bf-grp img { position:absolute; width:auto; filter:drop-shadow(0 8px 10px rgba(19,27,40,.16)); }
.bf-shadow { position:absolute; left:30px; right:30px; bottom:2px; height:16px; border-radius:50%; background:radial-gradient(closest-side, rgba(19,27,40,.18), rgba(19,27,40,0)); }
.bf-spark { position:absolute; line-height:1; color:#ffc93c; }
.bf-binder { height:162px; left:92px; bottom:12px; transform:rotate(-3deg); z-index:1; }
.bf-gem { height:136px; left:30px; bottom:8px; transform:rotate(-10deg); z-index:2; }
.bf-fig { height:116px; left:300px; bottom:6px; transform:rotate(6deg); z-index:3; }
.bf-dn { height:116px; left:176px; bottom:2px; z-index:4; }
.bf-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; font-weight:600; font-size:14px; text-decoration:none; padding:12px 20px; border-radius:3px; white-space:nowrap; background:#a85b2c; color:#fff; box-shadow:0 3px 0 #7e4220; }
.bf-btn2 { display:inline-flex; justify-content:center; font-weight:600; font-size:13px; text-decoration:none; padding:9px 16px; border-radius:3px; border:1px solid #131b28; color:#131b28; white-space:nowrap; }
.bf-grp-wrap { display:contents; }
@media (max-width:1080px) {
  .bf-in { grid-template-columns:auto 1fr; }
  .bf-right { grid-column:1 / -1; justify-content:center; }
}
@media (max-width:700px) {
  .bf-in { gap:14px; padding:18px 16px 20px; }
  .bf-sticker { width:74px; height:74px; } .bf-sticker b { font-size:14px; } .bf-sticker small { font-size:8px; letter-spacing:.14em; }
  .bf h2 { font-size:27px; } .bf p { font-size:13px; margin-top:5px; }
  .bf-stat { font-size:10.5px; padding:5px 10px; margin-top:9px; }
  .bf-right { flex-direction:column; gap:14px; }
  .bf-grp-wrap { display:block; width:336px; height:141px; }
  .bf-grp { transform:scale(.8); transform-origin:top left; }
  .bf-ctas { width:100%; }
  .bf-conf i { opacity:.45; }
  .bf-conf i:nth-child(n+12) { display:none; }
}
`

export function BlackFridayBanner() {
  // Live from the catalog, so the numbers stay right as sale prices change.
  const { products } = useCart()
  const stats = React.useMemo(() => {
    const listed = products.filter((p) => !p.hideFromShopGrid && isOnSale(p, products))
    const pct = products
      .filter((p) => p.price > 0 && !p.hidePrice && p.compareAtPrice != null && p.compareAtPrice > p.price)
      .map((p) => Math.round((1 - p.price / p.compareAtPrice!) * 100))
    return { count: listed.length, max: pct.length ? Math.max(...pct) : 0 }
  }, [products])
  return (
    <section className="bf" aria-label="Black Friday Week sale">
      <style>{CSS}</style>
      <div className="bf-conf" aria-hidden="true">
        {CONFETTI.map((c, i) => (
          <i
            key={i}
            style={{
              left: `${c.left}%`,
              top: `${c.top}%`,
              width: c.size,
              height: c.size,
              background: c.color,
              borderRadius: c.square ? 2 : '50%',
              transform: c.square ? `rotate(${c.rot}deg)` : undefined,
            }}
          />
        ))}
      </div>
      <div className="bf-in">
        <div className="bf-sticker" aria-hidden="true">
          <div>
            <b>
              BLACK
              <br />
              FRIDAY
              <br />
              WEEK
            </b>
            <small>SALE</small>
          </div>
        </div>
        <div>
          <h2>
            Black Friday <span>Week</span>
          </h2>
          {contestLive() ? (
            <p>
              Every order gets a free Chinese pack. Every $100 adds another. Spend the most and you take home a 30th Celebration Pokémon
              Center Elite Trainer Box. Ends <b style={{ color: '#131b28' }}>{CONTEST_ENDS_LABEL}</b>.
            </p>
          ) : (
            <p>Booster boxes, gift boxes, figures, keychains and more, all marked down.</p>
          )}
          {stats.count > 0 && (
            <div className="bf-stat">
              {stats.max >= 5 && (
                <>
                  <b>Up to {stats.max}% off</b> ·{' '}
                </>
              )}
              {stats.count} items on sale
            </div>
          )}
        </div>
        <div className="bf-right">
          <div className="bf-grp-wrap">
          <div className="bf-grp" aria-hidden="true">
            <div className="bf-shadow" />
            <img className="bf-binder" src="/assets/home/bf-binder.webp" alt="" width={239} height={320} />
            <img className="bf-gem" src="/assets/home/bf-gem7-pack.webp" alt="" width={180} height={320} />
            <img className="bf-fig" src="/assets/home/bf-pikachu-figure.webp" alt="" width={262} height={320} />
            <img className="bf-dn" src="/assets/home/bf-daynight-v2.webp" alt="" width={455} height={420} />
            <span className="bf-spark" style={{ left: 80, top: 6, fontSize: 18 }}>✦</span>
            <span className="bf-spark" style={{ left: 380, top: 20, fontSize: 13 }}>✦</span>
            <span className="bf-spark" style={{ left: 8, top: 36, fontSize: 12, color: '#f2a7c3' }}>✦</span>
          </div>
          </div>
          <div className="bf-ctas">
            <Link to="/shop" search={{ sale: true }} className="bf-btn">
              Shop the sale →
            </Link>
            {contestLive() && (
              <a href="/black-friday" className="bf-btn2">
                See what you can win
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
