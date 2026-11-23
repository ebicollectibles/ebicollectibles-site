import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { formatMoney, getHubPriceRange, getHubSale, getHubVariants, getInStockVariant, type Product } from '~/lib/products'
import { ResponsiveImage } from '~/components/ResponsiveImage'
import { AddToCartControl } from '~/components/AddToCartControl'
import { useCart } from '~/lib/cart-context'

const STRIPES = 'repeating-linear-gradient(45deg, #eef0f2 0px, #eef0f2 7px, #f6f7f8 7px, #f6f7f8 14px)'

export function ProductCard({
  product,
  variant = 'full',
  priority = false,
}: {
  product: Product
  variant?: 'compact' | 'full'
  /** First cards on a page: load the photo immediately (Largest Contentful Paint). */
  priority?: boolean
}) {
  // notSellable wins over soldOut (a hub/collage listing has no stock of its
  // own) but not comingSoon — see the comment in AddToCartControl.tsx.
  const notSellable = product.notSellable === true
  const comingSoon = product.comingSoon === true
  // <= 0, not === 0 — a Square-linked item can report negative stock
  // (oversold across another channel sharing the same Square inventory),
  // and that still means sold out here, not "available."
  const ownSoldOut = !notSellable && product.stock <= 0
  const { products: allProducts } = useCart()
  // A sold-out product with another variant in stock (e.g. the new
  // briefcase is gone but a damaged-packaging one is left) stays on the
  // grid as available: the card shows that variant's price and sends the
  // shopper to its page.
  const inStockVariant = ownSoldOut && !product.comingSoon ? getInStockVariant(product, allProducts) : undefined
  const soldOut = ownSoldOut && !inStockVariant
  const shown = inStockVariant ?? product
  const linkId = shown.id
  const onSale = shown.compareAtPrice != null && shown.compareAtPrice > shown.price
  // Price range across the group's buyable options (e.g. $249.99–$299.99).
  const variantRange = inStockVariant ? getHubPriceRange(allProducts.filter((p) => p.variantGroupId === product.variantGroupId && !p.notSellable && !p.comingSoon)) : null
  // Price is "to be announced" when none has been set yet, or when admin
  // explicitly hid it (hidePrice overrides even a price synced live from a
  // linked Square item) — a coming-soon item with a real, shown price
  // displays it like any other product.
  const priceKnown = shown.price > 0 && !shown.hidePrice
  // A notSellable hub has no price of its own — same reasoning as the
  // product detail page's hubPriceRange (see products.$id.tsx), reusing
  // the same shared helpers so a hub's card always agrees with its own
  // page. Pulls the full catalog from CartProvider rather than a prop,
  // since every page that renders a ProductCard already sits inside it.
  const hubVariants = notSellable ? getHubVariants(product, allProducts) : []
  const hubPriceRange = notSellable ? getHubPriceRange(hubVariants) : null
  const hubSale = notSellable && !comingSoon && !product.hidePrice ? getHubSale(hubVariants) : { onSale: false, wasPrice: null }
  const badge = comingSoon ? (product.preorder ? 'Pre-order' : 'Coming soon') : product.preorder ? 'Pre-order' : soldOut ? 'Sold out' : onSale || hubSale.onSale ? 'Sale' : null
  const badgeBg = product.preorder && !soldOut ? '#3f7a63' : comingSoon || soldOut ? '#5a6875' : '#a85b2c'

  const compact = variant === 'compact'
  const padding = compact ? 18 : 20
  // Name font-size and line-clamp live in .ebi-card-name / .ebi-card-name-compact
  // (see app.css) rather than inline, so a mobile media query can shrink
  // them — an inline style would always win over a stylesheet rule.
  const priceFontSize = compact ? 16 : 17
  const buttonPadding = compact ? 11 : 12
  const buttonMarginTop = compact ? 14 : 16

  return (
    <article style={{ background: '#ffffff', padding, display: 'flex', flexDirection: 'column' }}>
      <Link
        to="/products/$id"
        params={{ id: linkId }}
        style={{ display: 'contents', color: 'inherit', textDecoration: 'none' }}
      >
      <div style={{ position: 'relative', aspectRatio: '1 / 1', background: '#f6f7f8', overflow: 'hidden' }}>
        {product.img ? (
          <ResponsiveImage
            desktop={product.img}
            tablet={product.imgTablet}
            mobile={product.imgMobile}
            // The card's link already reads out the product name, so the photo is decorative here.
            alt=""
            loading="lazy"
            priority={priority}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundImage: STRIPES }} />
        )}
        {!product.img && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#5a6875',
              textAlign: 'center',
              padding: compact ? 16 : 18,
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
              fontSize: 9.5,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '5px 9px',
              background: badgeBg,
              color: '#ffffff',
            }}
          >
            {badge}
          </div>
        )}
      </div>

      <h3
        className={`ebi-card-name${compact ? ' ebi-card-name-compact' : ''}`}
        style={{
          fontWeight: 600,
          lineHeight: 1.35,
          margin: 0,
          marginTop: compact ? 14 : 16,
          textWrap: 'pretty',
        }}
      >
        {product.name}
      </h3>
      {/* Always rendered (even when a plain notSellable hub has nothing to
          show here) rather than conditionally omitted — a card missing this
          whole row sits shorter than its neighbors, and since the grid
          stretches every card to the row's tallest, that left the Add to
          cart / View options buttons misaligned across a row whenever one
          card had a price line and the one next to it didn't.
          visibility:hidden keeps the same layout height without showing
          anything. */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 10, visibility: notSellable && !comingSoon && hubPriceRange == null ? 'hidden' : 'visible' }}>
        {notSellable && !comingSoon && (product.hidePrice || hubPriceRange == null) ? (
          <span style={{ fontSize: priceFontSize, fontWeight: 600 }}>&nbsp;</span>
        ) : notSellable && !comingSoon && hubPriceRange ? (
          <>
          {hubSale.wasPrice != null && (
            <span style={{ fontSize: priceFontSize - 3, color: '#5a6875', textDecoration: 'line-through' }}>{formatMoney(hubSale.wasPrice)}</span>
          )}
          <span style={{ fontSize: priceFontSize, fontWeight: 600, color: '#131b28' }}>
            {hubPriceRange.min === hubPriceRange.max ? formatMoney(hubPriceRange.min) : `${formatMoney(hubPriceRange.min)}–${formatMoney(hubPriceRange.max)}`}
          </span>
          </>
        ) : notSellable ? (
          product.hidePrice || hubPriceRange == null ? (
            <span style={{ fontSize: priceFontSize - 2, fontWeight: 500, color: '#5a6875' }}>
              Price to be announced
            </span>
          ) : hubPriceRange.min === hubPriceRange.max ? (
            <span style={{ fontSize: priceFontSize, fontWeight: 600, color: '#5a6875' }}>{formatMoney(hubPriceRange.min)}</span>
          ) : (
            <span style={{ fontSize: priceFontSize, fontWeight: 600, color: '#5a6875' }}>
              {formatMoney(hubPriceRange.min)}–{formatMoney(hubPriceRange.max)}
            </span>
          )
        ) : comingSoon && !priceKnown ? (
          <span style={{ fontSize: priceFontSize - 2, fontWeight: 500, color: '#5a6875' }}>
            Price to be announced
          </span>
        ) : (
          variantRange && variantRange.min !== variantRange.max ? (
            <span style={{ fontSize: priceFontSize, fontWeight: 600, color: '#131b28' }}>
              {formatMoney(variantRange.min)}–{formatMoney(variantRange.max)}
            </span>
          ) : (
          <>
            {onSale && (
              <span style={{ fontSize: priceFontSize - 3, color: '#5a6875', textDecoration: 'line-through' }}>
                {formatMoney(shown.compareAtPrice!)}
              </span>
            )}
            <span style={{ fontSize: priceFontSize, fontWeight: 600, color: comingSoon ? '#5a6875' : '#131b28' }}>
              {formatMoney(shown.price)}
            </span>
          </>
          )
        )}
      </div>
      </Link>
      {inStockVariant ? (
        <Link
          to="/products/$id"
          params={{ id: inStockVariant.id }}
          style={{
            marginTop: buttonMarginTop,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #131b28',
            background: '#131b28',
            color: '#ffffff',
            borderRadius: 2,
            padding: buttonPadding,
            fontSize: 12.5,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          View options
        </Link>
      ) : notSellable && !comingSoon ? (
        // A live hub has nothing of its own to add to cart — AddToCartControl
        // would just render a dead "Choose an option below" button here,
        // which is misleading on a card (there's no dropdown "below" it to
        // choose from). This goes to the same place the photo/name already
        // link to, so the card's CTA is honest about what clicking it does.
        <Link
          to="/products/$id"
          params={{ id: product.id }}
          style={{
            marginTop: buttonMarginTop,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #131b28',
            background: '#131b28',
            color: '#ffffff',
            borderRadius: 2,
            padding: buttonPadding,
            fontSize: 12.5,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          View options{hubVariants.length > 0 ? ` (${hubVariants.length})` : ''}
        </Link>
      ) : (
        <AddToCartControl product={product} padding={buttonPadding} marginTop={buttonMarginTop} />
      )}
    </article>
  )
}
