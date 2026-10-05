import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { AddToCartControl } from '~/components/AddToCartControl'
import { FormattedText } from '~/components/FormattedText'
import { NotifyMeButton } from '~/components/NotifyMeButton'
import { ProductCard } from '~/components/ProductCard'
import { ResponsiveImage } from '~/components/ResponsiveImage'
import { trackEvent } from '~/lib/analytics'
import { useCart } from '~/lib/cart-context'
import { FLAT_SHIPPING_RATE, formatMoney, type Product } from '~/lib/products'
import { RETURN_POLICY_CATEGORY_URL, SHIPPING_HANDLING_MAX_DAYS, SHIPPING_HANDLING_MIN_DAYS, SHIPS_TO_COUNTRY } from '~/lib/policy'
import { getProduct } from '~/server/products'

const SITE_URL = 'https://ebicollectibles.com'

// schema.org's itemCondition values Google's structured-data guidance maps
// its condition attribute onto — see the comment on products.condition in
// lib/db/schema.ts for why the same product can legitimately be either.
const CONDITION_SCHEMA_URL: Record<string, string> = {
  new: 'https://schema.org/NewCondition',
  used: 'https://schema.org/UsedCondition',
  refurbished: 'https://schema.org/RefurbishedCondition',
}

function absoluteImageUrl(img: string | undefined): string | undefined {
  if (!img) return undefined
  return img.startsWith('http') ? img : `${SITE_URL}${img.startsWith('/') ? '' : '/'}${img}`
}

export const Route = createFileRoute('/products/$id')({
  // Separate from the cart's product list (populated by the root loader) —
  // this exists purely to give head() below something to build per-product
  // meta tags from; the page itself still reads from useCart() as before.
  loader: ({ params }) => getProduct({ data: { id: params.id } }),
  head: ({ loaderData, params }) => {
    if (!loaderData) return {}
    const title = `${loaderData.name} — EBI Collectibles`
    const description = `${formatMoney(loaderData.price)} — ${loaderData.name}. Simplified Chinese Pokémon, verified before it ships. ${
      loaderData.stock > 0 ? 'In stock' : 'Currently sold out'
    }, ships from Washington.`
    const url = `${SITE_URL}/products/${params.id}`
    const image = absoluteImageUrl(loaderData.img)

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'product' },
        { property: 'og:url', content: url },
        ...(image ? [{ property: 'og:image', content: image }] : []),
        {
          'script:ld+json': {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: loaderData.name,
            ...(image ? { image: [image] } : {}),
            description,
            // Feeds Google's free Shopping listings via automated feeds
            // (structured data read straight off the page, no submitted
            // feed file) — omitted entirely when not yet filled in on a
            // product, rather than emitting an empty string, since Google
            // treats a present-but-empty identifier as an error rather
            // than "not provided."
            ...(loaderData.gtin ? { gtin13: loaderData.gtin } : {}),
            ...(loaderData.brand ? { brand: { '@type': 'Brand', name: loaderData.brand } } : {}),
            ...(loaderData.googleProductCategory ? { category: loaderData.googleProductCategory } : {}),
            // No mpn field exists, so brand alone never satisfies Google's
            // identifier requirement — anything without a gtin genuinely has
            // no qualifying identifier. Telling Google that explicitly (vs.
            // just omitting gtin13) stops it from flagging the product as
            // "missing identifier" indefinitely, since it can't otherwise
            // tell "none exists" from "forgot to add it."
            ...(loaderData.gtin ? {} : { identifierExists: false }),
            offers: {
              '@type': 'Offer',
              url,
              priceCurrency: 'USD',
              price: loaderData.price,
              availability: loaderData.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              ...(loaderData.condition ? { itemCondition: CONDITION_SCHEMA_URL[loaderData.condition] } : {}),
              // Flat rate is accurate for every order that can currently be
              // placed — Alaska/Hawaii checkout is blocked while their real
              // Shippo-quoted rate is being rolled out (BLOCK_HI_AK_CHECKOUT
              // in feature-flags.ts); revisit this once that's lifted, since
              // those two states won't pay the flat rate anymore.
              shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingRate: { '@type': 'MonetaryAmount', value: FLAT_SHIPPING_RATE, currency: 'USD' },
                shippingDestination: { '@type': 'DefinedRegion', addressCountry: SHIPS_TO_COUNTRY },
                deliveryTime: {
                  '@type': 'ShippingDeliveryTime',
                  handlingTime: {
                    '@type': 'QuantitativeValue',
                    minValue: SHIPPING_HANDLING_MIN_DAYS,
                    maxValue: SHIPPING_HANDLING_MAX_DAYS,
                    unitCode: 'DAY',
                  },
                },
              },
              // No general returns on sealed collectibles (see
              // refund-policy.tsx) — RETURN_POLICY_CATEGORY_URL reflects that
              // honestly rather than implying a return window that doesn't
              // exist.
              hasMerchantReturnPolicy: {
                '@type': 'MerchantReturnPolicy',
                returnPolicyCategory: RETURN_POLICY_CATEGORY_URL,
                applicableCountry: SHIPS_TO_COUNTRY,
              },
            },
          },
        },
      ],
    }
  },
  component: ProductDetailPage,
})

const STRIPES = 'repeating-linear-gradient(45deg, #eef0f2 0px, #eef0f2 7px, #f6f7f8 7px, #f6f7f8 14px)'

const monoLabel: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10.5,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#131b28',
}

// Prev/next buttons flanking the photo counter below the main image —
// kept off the photo itself so they never cover part of the shot.
const navArrowStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  border: '1px solid #e3e6ea',
  background: '#ffffff',
  color: '#131b28',
  fontSize: 16,
  lineHeight: 1,
  padding: 0,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

// One photo in the product's gallery strip — tagged with the variant it
// belongs to on a notSellable hub page (undefined for the hub's own collage
// shots), so clicking it or arrowing onto it can sync the Options dropdown,
// and so picking an Option can jump the gallery to that variant's photo.
// isHero marks the product's main `img` (the one with tablet/mobile
// responsive sources) vs. a plain extra shot from `images[]`.
type GalleryPhoto = {
  url: string
  variantId?: string
  imgTablet?: string
  imgMobile?: string
  imgAlt?: string
  isHero: boolean
}

function ProductDetailPage() {
  const { id } = Route.useParams()
  const { products } = useCart()
  const product = products.find((p) => p.id === id)
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!product) return
    trackEvent('view_item', {
      currency: 'USD',
      value: product.price,
      items: [{ item_id: product.id, item_name: product.name, price: product.price }],
    })
  }, [product?.id])

  const notSellable = product?.notSellable === true

  // Every sellable product sharing this one's variantGroupId (including
  // itself, so it renders inline as the selected option) — see the comment
  // on Product.variantGroupId in lib/products.ts. Already available in
  // `products` (the full root-loaded list), no extra fetch needed: every
  // variant is a real product in its own right, including the ones with
  // hideFromShopGrid set.
  const variants = React.useMemo(() => {
    if (!product?.variantGroupId) return []
    return products
      .filter((p) => p.variantGroupId === product.variantGroupId)
      // The notSellable hub/collage listing itself is never a pickable
      // option — there's nothing to buy about it — even on its own page.
      .filter((p) => !p.notSellable)
      // A sibling with no variantLabel set isn't offered as a pickable
      // option (admin forgot to label it, or it's meant to only be reached
      // directly/via admin) — except the one currently being viewed, which
      // always stays in so the dropdown's selected value still matches the
      // actual page instead of silently falling back to some other option.
      .filter((p) => p.id === product.id || (p.variantLabel && p.variantLabel.trim()))
      .sort((a, b) => (a.variantSortOrder ?? Infinity) - (b.variantSortOrder ?? Infinity) || a.name.localeCompare(b.name))
  }, [products, product])

  // On a notSellable hub page, the "Options" dropdown picks which real
  // variant to show/add to cart in place, instead of navigating away —
  // starts unselected ("Style: Select") rather than defaulting to the
  // first variant, so the shopper actively picks one.
  const [selectedVariantId, setSelectedVariantId] = React.useState('')
  React.useEffect(() => {
    setSelectedVariantId('')
  }, [product?.id])
  const selectedVariant = notSellable ? variants.find((v) => v.id === selectedVariantId) : undefined

  // The gallery strip: this page's own photos first, then — on a notSellable
  // hub page only — every variant's own photos appended after them, each
  // tagged with the variant it belongs to.
  const galleryItems = React.useMemo((): GalleryPhoto[] => {
    const photosOf = (p: Product, variantId: string | undefined): GalleryPhoto[] => {
      const photos: GalleryPhoto[] = []
      if (p.img) photos.push({ url: p.img, variantId, imgTablet: p.imgTablet, imgMobile: p.imgMobile, imgAlt: p.imgAlt || p.name, isHero: true })
      for (const url of p.images ?? []) {
        if (url) photos.push({ url, variantId, imgAlt: p.imgAlt || p.name, isHero: false })
      }
      return photos
    }
    if (!product) return []
    const own = photosOf(product, undefined)
    if (!notSellable) return own
    return [...own, ...variants.flatMap((v) => photosOf(v, v.id))]
  }, [product, notSellable, variants])

  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0)
  React.useEffect(() => {
    setSelectedImageIndex(0)
  }, [product?.id])
  const currentPhoto = galleryItems[selectedImageIndex] ?? galleryItems[0]

  // Jumps the gallery to a variant's own photo (used when the Options
  // dropdown changes) and syncs the dropdown to match whichever photo is
  // currently in view (used when arrowing/clicking through the gallery).
  const selectVariant = (variantId: string) => {
    setSelectedVariantId(variantId)
    const idx = galleryItems.findIndex((item) => item.variantId === variantId)
    if (idx !== -1) setSelectedImageIndex(idx)
  }
  const goToPhoto = (index: number) => {
    if (galleryItems.length === 0) return
    const wrapped = ((index % galleryItems.length) + galleryItems.length) % galleryItems.length
    setSelectedImageIndex(wrapped)
    const item = galleryItems[wrapped]
    if (notSellable && item.variantId && item.variantId !== selectedVariantId) {
      setSelectedVariantId(item.variantId)
    }
  }

  // Caps the thumbnail rail to the main photo's own rendered height (a
  // square, so this tracks it at any viewport width) instead of letting a
  // long gallery push the rail — and the whole row — taller than the photo.
  const mainPhotoRef = React.useRef<HTMLDivElement>(null)
  const [railMaxHeight, setRailMaxHeight] = React.useState<number>()
  React.useLayoutEffect(() => {
    const el = mainPhotoRef.current
    if (!el) return
    const update = () => setRailMaxHeight(el.clientHeight)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const related = React.useMemo(() => {
    if (!product) return []
    const sameType = products.filter((p) => p.id !== product.id && p.subcategory === product.subcategory)
    const rest = products.filter((p) => p.id !== product.id && p.subcategory !== product.subcategory)
    return [...sameType, ...rest].slice(0, 4)
  }, [products, product])

  if (!product) {
    return (
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '96px 20px', textAlign: 'center' }}>
        <div style={monoLabel}>Not found</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: '10px 0 24px' }}>We couldn&apos;t find that product.</h1>
        <Link
          to="/shop"
          className="ebi-btn-dark"
          style={{ background: '#131b28', color: '#ffffff', border: 0, borderRadius: 2, padding: '13px 24px', fontSize: 13.5, fontWeight: 600 }}
        >
          Back to shop
        </Link>
      </section>
    )
  }

  // notSellable wins over soldOut but not comingSoon — see the comment in
  // AddToCartControl.tsx.
  const comingSoon = product.comingSoon === true
  const soldOut = !notSellable && product.stock === 0
  const onSale = product.compareAtPrice != null && product.compareAtPrice > product.price
  // Price is "to be announced" when none has been set yet, or when admin
  // explicitly hid it (hidePrice overrides even a price synced live from a
  // linked Square item) — a coming-soon item with a real, shown price
  // displays it like any other product.
  const priceKnown = product.price > 0 && !product.hidePrice
  const badge = comingSoon ? 'Coming soon' : product.preorder ? 'Pre-order' : soldOut ? 'Sold out' : onSale ? 'Sale' : null
  const badgeBg = comingSoon || soldOut ? '#5a6875' : product.preorder ? '#3f7a63' : '#b4622f'
  const stockLabel = comingSoon ? 'Coming soon' : soldOut ? 'Out of stock' : product.preorder ? 'Ships after release' : `${product.stock} in stock`
  const stockColor = comingSoon || soldOut ? '#5a6875' : '#3f7a63'

  return (
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: '40px 20px 90px' }}>
      <div style={monoLabel}>
        <Link to="/shop" style={{ color: 'inherit' }}>
          Shop
        </Link>{' '}
        / {product.subcategory}
      </div>

      <div className="ebi-product-detail-grid" style={{ marginTop: 24 }}>
        <div>
          <div className="ebi-gallery">
            {galleryItems.length > 1 && (
              <div className="ebi-gallery-rail" style={{ maxHeight: railMaxHeight }}>
                {galleryItems.map((item, i) => (
                  <button
                    key={`${item.url}-${i}`}
                    onClick={() => goToPhoto(i)}
                    aria-label={`View photo ${i + 1} of ${galleryItems.length}`}
                    aria-pressed={i === selectedImageIndex}
                    style={{
                      width: 88,
                      height: 88,
                      flexShrink: 0,
                      padding: 0,
                      background: '#f6f7f8',
                      border: `1px solid ${i === selectedImageIndex ? '#131b28' : '#e3e6ea'}`,
                      borderRadius: 2,
                      cursor: 'pointer',
                      overflow: 'hidden',
                    }}
                  >
                    <img src={item.url} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            )}

            <div
              ref={mainPhotoRef}
              style={{ position: 'relative', flex: 1, minWidth: 0, aspectRatio: '1 / 1', background: '#f6f7f8', overflow: 'hidden' }}
            >
              {currentPhoto ? (
                currentPhoto.isHero ? (
                  <ResponsiveImage
                    desktop={currentPhoto.url}
                    tablet={currentPhoto.imgTablet}
                    mobile={currentPhoto.imgMobile}
                    alt={currentPhoto.imgAlt || product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <img
                    src={currentPhoto.url}
                    alt={currentPhoto.imgAlt || product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                )
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundImage: STRIPES }} />
              )}
              {!currentPhoto && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#5a6875',
                    textAlign: 'center',
                    padding: 24,
                  }}
                >
                  {product.placeholder || 'product shot'}
                </div>
              )}
              {badge && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '6px 10px',
                    background: badgeBg,
                    color: '#ffffff',
                  }}
                >
                  {badge}
                </div>
              )}
            </div>
          </div>

          {galleryItems.length > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 18,
                marginTop: 10,
              }}
            >
              <button onClick={() => goToPhoto(selectedImageIndex - 1)} aria-label="Previous photo" style={navArrowStyle}>
                ‹
              </button>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  color: '#5a6875',
                  minWidth: 50,
                  textAlign: 'center',
                }}
              >
                {selectedImageIndex + 1} / {galleryItems.length}
              </span>
              <button onClick={() => goToPhoto(selectedImageIndex + 1)} aria-label="Next photo" style={navArrowStyle}>
                ›
              </button>
            </div>
          )}
        </div>

        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: '#131b28' }}>
            {product.subcategory}
          </div>
          <h1 style={{ fontSize: 32, letterSpacing: '-0.02em', fontWeight: 700, lineHeight: 1.15, margin: '10px 0 0', textWrap: 'pretty' }}>
            {product.name}
          </h1>
          {notSellable && !comingSoon ? (
            selectedVariant && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: '#131b28' }}>{formatMoney(selectedVariant.price)}</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: selectedVariant.stock === 0 ? '#5a6875' : '#3f7a63' }}>
                  {selectedVariant.stock === 0 ? 'Out of stock' : `${selectedVariant.stock} in stock`}
                </span>
              </div>
            )
          ) : (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
              {comingSoon && !priceKnown ? (
                <span style={{ fontSize: 18, fontWeight: 500, color: '#5a6875' }}>Price to be announced</span>
              ) : (
                <>
                  {onSale && (
                    <span style={{ fontSize: 18, color: '#5a6875', textDecoration: 'line-through' }}>
                      {formatMoney(product.compareAtPrice!)}
                    </span>
                  )}
                  <span style={{ fontSize: 26, fontWeight: 700, color: comingSoon ? '#5a6875' : '#131b28' }}>
                    {formatMoney(product.price)}
                  </span>
                </>
              )}
              {!(comingSoon && !priceKnown) && (
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: stockColor }}>{stockLabel}</span>
              )}
            </div>
          )}
          {!comingSoon && !soldOut && !notSellable && product.shipsWithDelay && (
            <p style={{ fontSize: 12.5, color: '#b4622f', margin: '8px 0 0', lineHeight: 1.5 }}>
              This item is still on its way to us — an order with it ships once it arrives.
            </p>
          )}

          {(notSellable ? !comingSoon && variants.length >= 1 : variants.length > 1) && (
            <div style={{ marginTop: 22, maxWidth: 320 }}>
              <label htmlFor="product-variant-select" style={monoLabel}>
                Options
              </label>
              <select
                id="product-variant-select"
                value={notSellable ? selectedVariantId : product.id}
                onChange={(e) => {
                  if (notSellable) {
                    selectVariant(e.target.value)
                  } else {
                    navigate({ to: '/products/$id', params: { id: e.target.value } })
                  }
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: 10,
                  padding: '11px 13px',
                  fontSize: 14,
                  border: '1px solid #cfd4da',
                  borderRadius: 2,
                  background: '#ffffff',
                  color: '#131b28',
                }}
              >
                {notSellable && (
                  <option value="" disabled>
                    Style: Select
                  </option>
                )}
                {variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.variantLabel || v.name}
                    {v.stock === 0 ? ' — Out of stock' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {product.description && (
            <FormattedText text={product.description} style={{ fontSize: 14.5, lineHeight: 1.65, color: '#131b28', maxWidth: '52ch', margin: '20px 0 0' }} />
          )}

          {notSellable && !comingSoon ? (
            <>
              {selectedVariant && (
                <>
                  <AddToCartControl product={selectedVariant} padding={14} fontSize={13.5} qtyBtnWidth={48} maxWidth={320} marginTop={26} />
                  {(selectedVariant.comingSoon || selectedVariant.stock === 0) && (
                    <NotifyMeButton productId={selectedVariant.id} padding={14} fontSize={13.5} maxWidth={320} marginTop={12} />
                  )}
                </>
              )}
              {product.variantGroupId && (
                <Link
                  to="/shop"
                  search={{ variantGroup: product.variantGroupId }}
                  style={{
                    display: 'block',
                    width: '100%',
                    maxWidth: 320,
                    marginTop: 12,
                    textAlign: 'center',
                    background: '#ffffff',
                    color: '#131b28',
                    border: '1px solid #131b28',
                    borderRadius: 2,
                    padding: 14,
                    fontSize: 13.5,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Browse full collection ({variants.length})
                </Link>
              )}
            </>
          ) : (
            <>
              <AddToCartControl product={product} padding={14} fontSize={13.5} qtyBtnWidth={48} maxWidth={320} marginTop={26} />
              {(comingSoon || soldOut) && <NotifyMeButton productId={product.id} padding={14} fontSize={13.5} maxWidth={320} marginTop={12} />}
            </>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 80 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 24,
              paddingBottom: 22,
              borderBottom: '1px solid #131b28',
            }}
          >
            <div>
              <div style={monoLabel}>Keep browsing</div>
              <h2 style={{ fontSize: 26, letterSpacing: '-0.02em', fontWeight: 700, margin: '9px 0 0' }}>You may also like</h2>
            </div>
          </div>
          <div className="ebi-arrivals-grid" style={{ background: '#e3e6ea', border: '1px solid #e3e6ea', borderTop: 0 }}>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} variant="compact" />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
