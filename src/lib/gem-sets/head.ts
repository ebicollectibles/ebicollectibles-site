import gemSetCssUrl from '~/styles/gem-set.css?url'
import { SITE_URL } from './constants'
import type { BuiltGemSetData, GemSetConfig, GemSetData } from './types'

export function buildGemSetHead(data: BuiltGemSetData, config: GemSetConfig) {
  const heroImage = data.cardById.get(config.fanIds[Math.floor(config.fanIds.length / 2)])?.image
  return {
    meta: [
      { title: config.metaTitle },
      { name: 'description', content: config.metaDescription },
      { property: 'og:title', content: config.ogTitle },
      { property: 'og:description', content: config.ogDescription },
      ...(heroImage ? [{ property: 'og:image', content: heroImage }] : []),
      { property: 'og:url', content: `${SITE_URL}${config.routePath}` },
      { property: 'og:type', content: 'website' },
    ],
    links: [
      { rel: 'stylesheet', href: gemSetCssUrl },
      { rel: 'canonical', href: `${SITE_URL}${config.routePath}` },
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
  return { itemListJsonLd, faqJsonLd }
}
