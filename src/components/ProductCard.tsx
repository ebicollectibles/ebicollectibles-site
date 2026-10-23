import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { formatMoney, getHubPriceRange, getHubVariants, type Product } from '~/lib/products'
import { ResponsiveImage } from '~/components/ResponsiveImage'
import { AddToCartControl } from '~/components/AddToCartControl'
import { useCart } from '~/lib/cart-context'

const STRIPES = 'repeating-linear-gradient(45deg, #eef0f2 0px, #eef0f2 7px, #f6f7f8 7px, #f6f7f8 14px)'

export function ProductCard({ product, variant = 'full' }: { product: Product; variant?: 'compact' | 'full' }) {
  // notSellable wins over soldOut (a hub/collage listing has no stock of its
  // own) but not comingSoon — see the comment in AddToCartControl.tsx.
  const notSellable = product.notSellable === true
  const comingSoon = product.comingSoon === true
  // <= 0, not === 0 — a Square-linked item can report negative stock
  // (oversold across another channel sharing the same Square inventory),
  // and that still means sold out here, not "available."
  const soldOut = !notSellable && product.stock <= 0
  const onSale = product.compareAtPrice != null && product.compareAtPrice > product.price
  // Price is "to be announced" when none has been set yet, or when admin
  // explicitly hid it (hidePrice overrides even a price synced live from a
  // linked Square item) — a coming-soon item with a real, shown price
  // displays it like any other product.
  const priceKnown = product.price > 0 && !product.hidePrice
  // A notSellable hub has no price of its own — same reasoning as the
  // product detail page's hubPriceRange (see products.$id.tsx), reusing
  // the same shared helpers so a hub's card always agrees with its own
  // page. Pulls the full catalog from CartProvider rather than a prop,
  // since every page that renders a ProductCard already sits inside it.
  const { products: allProducts } = useCart()
  const hubVariants = notSellable ? getHubVariants(product, allProducts) : []
  const hubPriceRange = notSellable && comingSoon ? getHubPriceRange(hubVariants) : null
  const badge = comingSoon ? 'Coming soon' : product.preorder ? 'Pre-order' : soldOut ? 'Sold out' : onSale ? 'Sale' : null
  const badgeBg = comingSoon || soldOut ? '#5a6875' : product.preorder ? '#3f7a63' : '#a85b2c'

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
        params={{ id: product.id }}
        style={{ display: 'contents', color: 'inherit', textDecoration: 'none' }}
      >
      <div style={{ position: 'relative', aspectRatio: '1 / 1', background: '#f6f7f8', overflow: 'hidden' }}>
        {product.img ? (
          <ResponsiveImage
            desktop={product.img}
            tablet={product.imgTablet}
            mobile={product.imgMobile}
            alt={product.imgAlt || product.name}
            loading="lazy"
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
      {(!notSellable || comingSoon) && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 10 }}>
          {notSellable ? (
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
            <>
              {onSale && (
                <span style={{ fontSize: priceFontSize - 3, color: '#5a6875', textDecoration: 'line-through' }}>
                  {formatMoney(product.compareAtPrice!)}
                </span>
              )}
              <span style={{ fontSize: priceFontSize, fontWeight: 600, color: comingSoon ? '#5a6875' : '#131b28' }}>
                {formatMoney(product.price)}
              </span>
            </>
          )}
        </div>
      )}
      </Link>
      {notSellable && !comingSoon ? (
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
