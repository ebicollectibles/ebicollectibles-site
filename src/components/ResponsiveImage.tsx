import type * as React from 'react'
import thumbs from '~/data/image-thumbs.json'

// Admin-supplied pre-sized image variants (see ProductForm) — the browser
// picks the right one at load time via <picture>. On top of that, product
// photos have pre-made 400px and 800px copies in /assets/thumbs (see
// src/data/image-thumbs.json, generated from the product photo URLs), so the
// browser can download a small file for small tiles. A photo without an
// entry (e.g. one uploaded after the thumbnails were last generated) simply
// loads at full size as before.
type ThumbEntry = { h: string; w: number; sizes: number[] }
const THUMBS = thumbs as Record<string, ThumbEntry>

export function thumbSrcSet(url: string): string | undefined {
  const t = THUMBS[url]
  if (!t || t.sizes.length === 0) return undefined
  return [...t.sizes.map((w) => `/assets/thumbs/${t.h}-${w}.webp ${w}w`), `${url} ${t.w}w`].join(', ')
}

export function ResponsiveImage({
  desktop,
  tablet,
  mobile,
  alt,
  loading,
  priority = false,
  sizes,
  style,
}: {
  desktop: string
  tablet?: string
  mobile?: string
  alt: string
  loading?: 'lazy' | 'eager'
  /** The page's main image: load immediately at high priority (helps Largest Contentful Paint). */
  priority?: boolean
  /** How wide the image displays, so the browser can pick a thumbnail size. */
  sizes?: string
  style?: React.CSSProperties
}) {
  const srcSet = thumbSrcSet(desktop)
  return (
    <picture>
      {mobile && <source media="(max-width: 640px)" srcSet={mobile} />}
      {tablet && <source media="(max-width: 1024px)" srcSet={tablet} />}
      <img
        src={desktop}
        srcSet={srcSet}
        sizes={srcSet ? (sizes ?? '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px') : undefined}
        alt={alt}
        loading={priority ? 'eager' : loading}
        fetchPriority={priority ? 'high' : undefined}
        decoding={priority ? 'sync' : 'async'}
        style={style}
      />
    </picture>
  )
}
