import { Link } from '@tanstack/react-router'
import { ProductCard } from '~/components/ProductCard'
import { ResponsiveImage } from '~/components/ResponsiveImage'
import { rankProducts, type Product } from '~/lib/products'
import { SHOW_ACRYLICS } from '~/lib/feature-flags'
import { BLOG_POSTS, type BlogPostSlug } from '~/data/blog-posts'

// Draft homepage layout (see routes/home-preview.tsx): shop-by-category
// tiles up top, then a sale shelf, best sellers, and one swipeable shelf
// per collection, so a visitor scrolling the homepage passes every kind of
// product the shop sells instead of only booster boxes.

type ShopLink = { search: Record<string, unknown> }

interface Collection {
  key: string
  title: string
  blurb: string
  match: (p: Product) => boolean
  link: ShopLink
}

const isGem = (p: Product) => !!p.tags?.includes('Gem Series')
const isCsv = (p: Product) => !!p.tags?.includes('CSV Series')
const is30th = (p: Product) => /30th/i.test(p.name) && p.category === 'Chinese Pokémon Products'
const isSpecial = (p: Product) => p.subcategory === 'Special Products'
const isBlind = (p: Product) => p.subcategory === 'Blind Box'
const isFigure = (p: Product) => p.subcategory === 'Figure' || p.subcategory === 'Plush'
const isBinder = (p: Product) => p.subcategory === 'Binder'

const TILES: Collection[] = [
  { key: 'gem', title: 'Gem Packs', blurb: 'Vol. 1 to 7', match: isGem, link: { search: { q: 'Gem' } } },
  { key: 'csv', title: 'CSV Booster Boxes', blurb: 'Main Chinese sets', match: isCsv, link: { search: { subcategory: 'Booster Box' } } },
  { key: '30th', title: '30th Celebration', blurb: 'Anniversary releases', match: is30th, link: { search: { q: '30th' } } },
  { key: 'special', title: 'Gift & Special Boxes', blurb: 'Premium and gift sets', match: isSpecial, link: { search: { subcategory: 'Special Products' } } },
  { key: 'blind', title: 'Blind Boxes', blurb: 'Figures and plush displays', match: isBlind, link: { search: { subcategory: 'Blind Box' } } },
  { key: 'figure', title: 'Figures & Plush', blurb: 'Collector figures', match: isFigure, link: { search: { subcategories: ['Figure', 'Plush'] } } },
  { key: 'binder', title: 'Binders', blurb: 'Official card binders', match: isBinder, link: { search: { subcategory: 'Binder' } } },
]

const SHELVES: Collection[] = [
  { key: 'gem', title: 'Gem Packs', blurb: 'Every Gem Pack volume we stock.', match: isGem, link: { search: { q: 'Gem' } } },
  { key: 'csv', title: 'CSV Booster Boxes', blurb: 'The main Simplified Chinese sets, slim and jumbo.', match: isCsv, link: { search: { subcategory: 'Booster Box' } } },
  { key: 'special', title: 'Gift & Special Boxes', blurb: 'Premium boxes, gift sets and display boxes.', match: isSpecial, link: { search: { subcategory: 'Special Products' } } },
  {
    key: 'blind',
    title: 'Blind Boxes, Figures & Plush',
    blurb: 'Dream Painting figures, Nuzzle Cheeks and more.',
    match: (p) => isBlind(p) || isFigure(p),
    link: { search: { subcategories: ['Blind Box', 'Figure', 'Plush'] } },
  },
  {
    key: 'accessories',
    title: 'Binders',
    blurb: 'Official card binders.',
    match: (p) => isBinder(p),
    link: { search: { subcategory: 'Binder' } },
  },
]

const GUIDES: BlogPostSlug[] = ['chinese-gem-pack-hit-rates', 'chinese-pokemon-sets-in-order', 'black-bolt-white-flare-release-news']

const SHELF_SIZE = 8
const PHONE_SIZE = 4

// Buyable first, then pre-orders and coming soon, then sold out, so a
// shelf never opens on a dead end. Within each group the admin's own Best
// Selling order wins, then New & Upcoming order.
function availability(p: Product): number {
  if (p.notSellable) return 1
  if (p.comingSoon || p.preorder) return 1
  return p.stock > 0 ? 0 : 2
}

function sortForShelf(list: Product[]): Product[] {
  return list
    .map((p, i) => ({ p, i }))
    .sort(
      (a, b) =>
        availability(a.p) - availability(b.p) ||
        (a.p.bestSellingRank ?? 999) - (b.p.bestSellingRank ?? 999) ||
        (a.p.newAndUpcomingRank ?? 999) - (b.p.newAndUpcomingRank ?? 999) ||
        b.i - a.i,
    )
    .map((x) => x.p)
}

// One collection: up to 8 products in the site's usual 4-across grid (two
// rows), 4 of them on phones (two rows of 2), then a button to the rest.
function Shelf({
  id,
  title,
  blurb,
  products,
  total,
  link,
}: {
  id: string
  title: string
  blurb?: string
  products: Product[]
  total?: number
  link?: { to: string; search?: Record<string, unknown> }
}) {
  if (products.length === 0) return null
  const headingId = `hv2-${id}`
  const count = total ?? products.length
  return (
    <section className="hv2-section" aria-labelledby={headingId}>
      <div className="hv2-head">
        <div>
          <h2 id={headingId}>{title}</h2>
          {blurb && <p>{blurb}</p>}
        </div>
      </div>
      <div className="ebi-arrivals-grid hv2-grid">
        {products.slice(0, SHELF_SIZE).map((p, i) => (
          <div key={p.id} className={link && i >= PHONE_SIZE ? 'hv2-cell hv2-desktop-only' : 'hv2-cell'}>
            <ProductCard product={p} variant="compact" />
          </div>
        ))}
      </div>
      {link && (
        <div className="hv2-more">
          <Link to={link.to as never} search={link.search as never} className="ebi-btn-dark hv2-more-btn">
            See all {count > PHONE_SIZE ? `${count} ` : ''}
            {title}
          </Link>
        </div>
      )}
    </section>
  )
}

export function HomeShelves({ products }: { products: Product[] }) {
  // Same eligibility as the shop grid (hideFromShopGrid, the acrylics
  // switch). Not rankProducts: that also drops anything hidden from Best
  // Selling, which would empty the binders and cases shelves.
  const eligible = products.filter((p) => !p.hideFromShopGrid && (SHOW_ACRYLICS || p.category !== 'Acrylic Cases'))
  const bestSellingAll = rankProducts(products, 'bestSellingRank')
  const bestSelling = sortForShelf(bestSellingAll.filter((p) => p.bestSellingRank != null))
  const onSale = sortForShelf(eligible.filter((p) => p.compareAtPrice != null && p.compareAtPrice > p.price && p.stock > 0 && !p.notSellable))
  const newAndUpcoming = rankProducts(products, 'newAndUpcomingRank').filter((p) => p.newAndUpcomingRank != null)

  const tiles = TILES.map((t) => {
    const items = sortForShelf(eligible.filter(t.match))
    const lead = items.find((p) => p.img)
    const inStock = items.filter((p) => availability(p) === 0).length
    return { ...t, items, lead, inStock }
  }).filter((t) => t.items.length > 0)

  const guides = GUIDES.map((s) => BLOG_POSTS.find((p) => p.slug === s)).filter((p) => p != null)

  return (
    <div className="hv2">
      <section className="hv2-section hv2-tiles-section" aria-labelledby="hv2-cats">
        <div className="hv2-head">
          <div>
            <h2 id="hv2-cats">Shop by category</h2>
          </div>
          <div className="hv2-head-actions">
            <Link to="/shop" className="hv2-seeall">
              Shop everything →
            </Link>
          </div>
        </div>
        <ul className="hv2-tiles">
          {tiles.map((t) => (
            <li key={t.key}>
              <Link to="/shop" search={t.link.search as never} className="hv2-tile">
                <div className="hv2-tile-img">
                  {t.lead?.img && <ResponsiveImage desktop={t.lead.img} alt="" loading="lazy" sizes="(max-width: 700px) 40vw, 240px" />}
                </div>
                <div className="hv2-tile-body">
                  <span className="hv2-tile-title">{t.title}</span>
                  <span className="hv2-tile-sub">{t.inStock > 0 ? `${t.inStock} in stock` : t.blurb}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {onSale.length > 0 && (
        <Shelf id="sale" title="On sale now" blurb="Marked down while stock lasts." products={onSale} />
      )}

      <Shelf id="best" title="Best Selling" products={bestSelling} total={bestSellingAll.length} link={{ to: '/best-selling' }} />

      {SHELVES.map((s) => {
        const items = sortForShelf(eligible.filter(s.match))
        return <Shelf key={s.key} id={s.key} title={s.title} blurb={s.blurb} products={items} total={items.length} link={{ to: '/shop', search: s.link.search }} />
      })}

      {newAndUpcoming.length > 0 && (
        <Shelf id="new" title="New & Upcoming" blurb="Just landed, pre-orders and what's next from China." products={newAndUpcoming} total={newAndUpcoming.length} link={{ to: '/new-and-upcoming' }} />
      )}

      {guides.length > 0 && (
        <section className="hv2-section" aria-labelledby="hv2-guides">
          <div className="hv2-head">
            <div>
              <h2 id="hv2-guides">Buying guides</h2>
              <p>What's in each box before you buy.</p>
            </div>
            <div className="hv2-head-actions">
              <Link to="/blog" className="hv2-seeall">
                All guides →
              </Link>
            </div>
          </div>
          <ul className="hv2-guides">
            {guides.map((g) => (
              <li key={g.slug}>
                <a href={g.path} className="hv2-guide">
                  <img src={g.heroImage} alt="" loading="lazy" width={800} height={450} />
                  <span className="hv2-guide-tag">{g.tag}</span>
                  <span className="hv2-guide-title">{g.title}</span>
                </a>
              </li>
            ))}
            <li>
              <Link to="/sets/chinese" className="hv2-guide hv2-guide--sets">
                <span className="hv2-guide-tag">Card lists</span>
                <span className="hv2-guide-title">Every Simplified Chinese set, card by card</span>
                <span className="hv2-guide-sub">Full card lists with rarities for Gem Packs and CSV sets.</span>
              </Link>
            </li>
          </ul>
        </section>
      )}
    </div>
  )
}
