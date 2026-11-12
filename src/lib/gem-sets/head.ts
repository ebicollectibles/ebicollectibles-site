import gemSetCssUrl from '~/styles/gem-set.css?url'
import { R2_IMAGE_HOST, SITE_URL } from './constants'
import type { BuiltGemSetData, GemSetConfig, GemSetData } from './types'

// Safe to drop inside a <script type="application/ld+json"> tag.
// JSON.stringify alone doesn't escape "</script>" or "<!--" — either one
// inside a card name, FAQ answer, or any other sourced string would let it
// break out of the script tag and inject raw HTML. Escaping every "<" to
// its unicode-escaped form keeps the JSON semantically identical (parses
// to the exact same value) while making that impossible.
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

export function buildGemSetHead(data: BuiltGemSetData, config: GemSetConfig) {
  const heroImage = data.cardById.get(config.fanIds[Math.floor(config.fanIds.length / 2)])?.image
  return {
    meta: [
      { title: config.metaTitle },
      { name: 'description', content: config.metaDescription },
      { property: 'og:title', content: config.ogTitle },
      { property: 'og:description', content: config.ogDescription },
      ...(heroImage
        ? [
            { property: 'og:image', content: heroImage },
            { property: 'og:image:width', content: '300' },
            { property: 'og:image:height', content: '419' },
          ]
        : []),
      { property: 'og:url', content: `${SITE_URL}${config.routePath}` },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: config.ogTitle },
      { name: 'twitter:description', content: config.ogDescription },
      ...(heroImage ? [{ name: 'twitter:image', content: heroImage }] : []),
    ],
    links: [
      { rel: 'stylesheet', href: gemSetCssUrl },
      { rel: 'canonical', href: `${SITE_URL}${config.routePath}` },
      // Every card image on this page loads from the same R2 host —
      // opening that connection as soon as the page starts parsing, rather
      // than waiting for the first <img> to be discovered, shaves real
      // time off the hero fan's own image load (likely this page's LCP).
      { rel: 'preconnect', href: R2_IMAGE_HOST },
      // The hero fan's own front/center card — almost always this page's
      // actual LCP element. Without this the browser only discovers it
      // once it parses deep enough into the hero section's JSX output;
      // preloading starts that fetch the instant <head> is parsed.
      ...(heroImage ? [{ rel: 'preload', as: 'image', href: heroImage, fetchpriority: 'high' }] : []),
    ],
  }
}

export function buildGemSetJsonLd(raw: GemSetData, data: BuiltGemSetData, config: GemSetConfig) {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${raw.name} Card List`,
    numberOfItems: data.cards.length,
    itemListElement: data.cards.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${c.name} ${c.id}/${data.versionSuffix}`,
      url: `${SITE_URL}${config.routePath}?card=${c.id}`,
      image: c.image ?? undefined,
    })),
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  // Mirrors the page's own visible breadcrumb trail (Shop > Sets > this
  // set) — a cheap, standard signal for how this page sits in the site,
  // useful to both Google's rich results and anything else parsing
  // structured data for site structure.
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Shop', item: `${SITE_URL}/shop` },
      { '@type': 'ListItem', position: 2, name: 'Sets', item: `${SITE_URL}/sets` },
      { '@type': 'ListItem', position: 3, name: raw.name, item: `${SITE_URL}${config.routePath}` },
    ],
  }
  return { itemListJsonLd, faqJsonLd, breadcrumbJsonLd }
}
