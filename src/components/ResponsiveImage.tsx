import type * as React from 'react'

// Admin-supplied pre-sized image variants (see ProductForm) — the browser
// picks the right one at load time via <picture>, no server-side resizing
// involved. Falls back to `desktop` whenever a size-specific version isn't
// set for a product.
export function ResponsiveImage({
  desktop,
  tablet,
  mobile,
  alt,
  loading,
  style,
}: {
  desktop: string
  tablet?: string
  mobile?: string
  alt: string
  loading?: 'lazy' | 'eager'
  style?: React.CSSProperties
}) {
  return (
    <picture>
      {mobile && <source media="(max-width: 640px)" srcSet={mobile} />}
      {tablet && <source media="(max-width: 1024px)" srcSet={tablet} />}
      <img src={desktop} alt={alt} loading={loading} style={style} />
    </picture>
  )
}
