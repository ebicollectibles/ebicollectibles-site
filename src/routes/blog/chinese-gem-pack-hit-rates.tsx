import { Zh, zh } from '~/components/blog/Zh'
import { ChineseExclusiveBadge } from '~/components/blog/ChineseExclusive'
import { createFileRoute, Link } from '@tanstack/react-router'
import blogCssUrl from '~/styles/blog.css?url'
import { BLOG_POSTS, BLOG_SITE_URL, blogSeoDescription, blogSeoTitle, blogShareImage } from '~/data/blog-posts'
import { BlogPostLayout } from '~/components/blog/BlogPostLayout'
import { getBlogPostStatus } from '~/server/blog-status'
import { safeJsonLd } from '~/lib/gem-sets/head'
import { R2_IMAGE_HOST, SITE_URL } from '~/lib/gem-sets/constants'

const post = BLOG_POSTS.find((p) => p.slug === 'chinese-gem-pack-hit-rates')!

const cardImg = (vol: number, id: string) => `${R2_IMAGE_HOST}/Chinese/Gem%20${vol}/Cards/${id}.webp`

// Each volume's set guide and card list, typed for the router.
const GUIDE = {
  1: '/blog/gem-vol-1-set-guide',
  2: '/blog/gem-vol-2-set-guide',
  3: '/blog/gem-vol-3-set-guide',
  4: '/blog/gem-vol-4-set-guide',
  5: '/blog/gem-vol-5-set-guide',
  6: '/blog/gem-vol-6-set-guide',
  7: '/blog/gem-vol-7-set-guide',
} as const
const CARD_LIST = {
  1: '/sets/chinese/gem-vol-1',
  2: '/sets/chinese/gem-vol-2',
  3: '/sets/chinese/gem-vol-3',
  4: '/sets/chinese/gem-vol-4',
  5: '/sets/chinese/gem-vol-5',
  6: '/sets/chinese/gem-vol-6',
  7: '/sets/chinese/gem-vol-7',
} as const
type Vol = keyof typeof GUIDE

// Pack and box facts. Cards per pack, holos per pack and the odds are from
// Pokémon China's product pages and odds charts for each volume (pokemon.cn
// product pages 15582, 15518, 15431, 20382, 21078, 23048 and 24281). Pokémon
// China gives the box size only for Vol. 1 (15 packs); the other box sizes are
// from our own product listings. Three-star per box = packs x 4 cards x the
// Triple Rare share.
const PACKS = [
  { vol: 1, code: 'CBB1C', released: 'Jan 17, 2025', cards: 115, box: '15', boxNote: 'Pokémon China', perPack: '8.7%', oneIn: '11.5', perBox: '1.30' },
  { vol: 2, code: 'CBB2C', released: 'May 16, 2025', cards: 140, box: '15', boxNote: 'our listing', perPack: '8.7%', oneIn: '11.5', perBox: '1.30' },
  { vol: 3, code: 'CBB3C', released: 'Sep 26, 2025', cards: 136, box: '18', boxNote: 'our listing', perPack: '7.2%', oneIn: '13.8', perBox: '1.30' },
  { vol: 4, code: 'CBB4C', released: 'Feb 6, 2026', cards: 196, box: '18', boxNote: 'our listing', perPack: '7.2%', oneIn: '13.8', perBox: '1.30' },
  { vol: 5, code: 'CBB5C', released: 'Apr 24, 2026', cards: 196, box: '18', boxNote: 'our listing', perPack: '7.2%', oneIn: '13.8', perBox: '1.30' },
  { vol: 6, code: 'CBB6C', released: 'Aug 7, 2026', cards: 196, box: '18', boxNote: 'our listing', perPack: '7.2%', oneIn: '13.8', perBox: '1.30' },
  { vol: 7, code: 'CBB7C', released: 'Nov 6, 2026', cards: 196, box: '18', boxNote: 'our listing', perPack: '7.2%', oneIn: '13.8', perBox: '1.30' },
]

// Production shares exactly as printed on each official odds chart, with the
// number of different cards at each rarity in brackets.
const ODDS = [
  { vol: '1', c: '50.00% (32)', u: '25.00% (23)', r: '17.90% (23)', rr: '4.93% (19)', rrr: '2.17% (18)', what: '11 Pokémon illustration cards, Nemona, 6 Energy' },
  { vol: '2', c: '50.00% (36)', u: '25.00% (36)', r: '18.13% (27)', rr: '4.70% (21)', rrr: '2.17% (20)', what: '9 VMAX, 4 Pokémon full arts, Penny, 6 Energy' },
  { vol: '3', c: '50.00% (36)', u: '25.00% (36)', r: '18.42% (27)', rr: '4.77% (21)', rrr: '1.81% (16)', what: '9 Pokémon full arts, Arven, 6 Energy' },
  { vol: '4 to 7', c: '50.00% (56)', u: '25.00% (56)', r: '17.39% (28)', rr: '5.80% (28)', rrr: '1.81% (28)', what: '28 Pokémon illustration cards, nothing else' },
]

// The fourth card's rarity: each share divided by the 25% that Rare and up
// take together.
const TOP_SLOT = [
  { vol: '1', r: '71.6%', rr: '19.7%', rrr: '8.7%' },
  { vol: '2', r: '72.5%', rr: '18.8%', rrr: '8.7%' },
  { vol: '3', r: '73.7%', rr: '19.1%', rrr: '7.2%' },
  { vol: '4 to 7', r: '69.6%', rr: '23.2%', rrr: '7.2%' },
]

// Expected three-star cards per box, split by card count inside the tier.
// Pokémon China prints one share for the whole tier, so the split assumes each
// three-star card is printed in equal numbers, which the chart does not say.
const PER_BOX = [
  { vol: '1', maths: '15 packs × 4 cards × 2.17% = 1.30', fullArts: 'about 0.87 (12 of 18 cards)', energy: 'about 0.43 (6 of 18)' },
  { vol: '2', maths: '15 packs × 4 cards × 2.17% = 1.30', fullArts: 'about 0.33 full arts (5 of 20) and 0.59 VMAX (9 of 20)', energy: 'about 0.39 (6 of 20)' },
  { vol: '3', maths: '18 packs × 4 cards × 1.81% = 1.30', fullArts: 'about 0.81 (10 of 16 cards)', energy: 'about 0.49 (6 of 16)' },
  { vol: '4 to 7', maths: '18 packs × 4 cards × 1.81% = 1.30', fullArts: 'about 1.30 (all 28 cards)', energy: 'none (no Energy cards)' },
]

// Odds of one named three-star card, e.g. one Chinese Exclusive full art.
// Per pack = 4 cards x the three-star share / the number of three-star cards.
// Chance in 10 boxes = 1 - (1 - per pack) ^ (packs in 10 boxes). Assumes every
// three-star card is printed in equal numbers, which the charts do not say.
const ONE_CARD = [
  { vol: '1', example: 'Sprigatito 0109/09', tier: '18', pack: '1 in 207', box: '1 in 13.8', ten: '52%' },
  { vol: '2', example: 'Eevee 0115/15', tier: '20', pack: '1 in 230', box: '1 in 15.4', ten: '48%' },
  { vol: '3', example: 'Gengar 0307/07', tier: '16', pack: '1 in 221', box: '1 in 12.3', ten: '56%' },
  { vol: '4 to 7', example: "Misty's Psyduck 0307/07 (Vol. 7), Applin 1907/07 (Vol. 6)", tier: '28', pack: '1 in 387', box: '1 in 21.5', ten: '37%' },
]

const ENERGY = [
  { vol: 1, id: '1801', name: 'Basic Grass Energy', no: '1801/06', alt: 'Basic Grass Energy 1801/06, a Triple Rare holo Energy card from Gem Vol 1, with the green leaf Energy symbol' },
  { vol: 2, id: '1105', name: 'Basic Psychic Energy', no: '1105/06', alt: 'Basic Psychic Energy 1105/06, a Triple Rare holo Energy card from Gem Vol 2, with the pink Gem Pack logo stamp' },
  { vol: 3, id: '2003', name: 'Luminous Energy', no: '2003/06', alt: 'Luminous Energy 2003/06, a Triple Rare holo Special Energy card from Gem Vol 3, with a rainbow Energy symbol' },
]

// One lead card per volume: the set's mascot or its best-known Chinese
// Exclusive full art (all marked as Chinese Exclusive in the set data).
const CHASE_NEW = [
  { vol: 7, id: '0307', no: '0307/07', name: "Misty's Psyduck", w: 320, h: 447, alt: "Misty's Psyduck 0307/07 Chinese Exclusive full art from Gem Vol 7: Psyduck lies in a beach chair holding up a beach ball, with Misty behind it" },
  { vol: 6, id: '1907', no: '1907/07', name: 'Applin', w: 320, h: 447, alt: 'Applin 1907/07 Chinese Exclusive full art from Gem Vol 6: Applin hides in an apple on a sunny kitchen table among fruit and drinks' },
  { vol: 5, id: '0107', no: '0107/07', name: 'Captain Pikachu', w: 300, h: 419, alt: 'Captain Pikachu 0107/07 Chinese Exclusive full art from Gem Vol 5: Captain Pikachu salutes beside Friede at a ship rail' },
  { vol: 4, id: '0107', no: '0107/07', name: 'Ponyta', w: 320, h: 447, alt: 'Ponyta 0107/07 Chinese Exclusive full art from Gem Vol 4: Ponyta prances through a sunset meadow while a Rapidash rests behind it' },
]
const CHASE_OLD = [
  { vol: 3, id: '0307', no: '0307/07', name: 'Gengar', w: 300, h: 419, alt: 'Gengar 0307/07 Chinese Exclusive full art from Gem Vol 3: Gengar grins among floating plates and teacups' },
  { vol: 2, id: '0115', no: '0115/15', name: 'Eevee', w: 300, h: 419, alt: 'Eevee 0115/15 Chinese Exclusive full art from Gem Vol 2: Eevee sits in a sunlit forest' },
  { vol: 1, id: '0109', no: '0109/09', name: 'Sprigatito', w: 300, h: 419, alt: 'Sprigatito 0109/09 Chinese Exclusive Pokémon Horizons full art from Gem Vol 1: Sprigatito beside a winking Liko' },
]

// Every Chinese Exclusive full art, from each set's data file.
const CHASE_TABLE = [
  { vol: 7, cards: "Misty's Psyduck 0307/07", other: '27 more Pokémon full arts, many with their Trainer' },
  { vol: 6, cards: 'Applin 1907/07', other: '27 more Pokémon full arts' },
  { vol: 5, cards: 'Captain Pikachu 0107/07, Floragato 2207/07, Crocalor 2307/07, Quaxwell 2407/07', other: '24 more Pokémon full arts' },
  { vol: 4, cards: 'Ponyta 0107/07', other: '27 more Pokémon full arts' },
  { vol: 3, cards: 'Meowth 0207/07, Gengar 0307/07, Cubone 0407/07, Chandelure 1107/07, Ceruledge 1507/07', other: '4 more Pokémon full arts, Arven, 9 Pokémon ex (Rare)' },
  { vol: 2, cards: 'Eevee 0115/15, Umbreon 0615/15, Leafeon 0715/15, Sylveon 0915/15', other: '9 VMAX, Penny, 9 Pokémon V (Rare)' },
  { vol: 1, cards: 'Sprigatito 0109/09, Fuecoco 0309/09, Quaxly 0509/09, Captain Pikachu 0709/09', other: '7 illustration full arts, Nemona' },
]

const TOC = [
  { id: 'short-answer', label: 'The short answer, in plain English' },
  { id: 'pack', label: 'What every pack guarantees' },
  { id: 'odds', label: 'Official odds for Vol. 1 to 7' },
  { id: 'pack-and-box', label: 'Pack and box facts, volume by volume' },
  { id: 'top-slot', label: 'What the fourth card turns out to be' },
  { id: 'box', label: 'What a box guarantees' },
  { id: 'per-box', label: 'Full arts per box, with the maths' },
  { id: 'energy', label: 'The holo Energy question' },
  { id: 'vs-main-sets', label: 'How Gem Packs differ from slim and jumbo packs' },
  { id: 'chase', label: 'Each volume’s chase full arts' },
  { id: 'one-card', label: 'Odds of pulling one specific full art' },
  { id: 'faq', label: 'FAQ' },
]

const FAQ = [
  {
    q: 'What is the hit rate of a Chinese Gem Pack?',
    a: "Every Gem Pack has one card that is Rare (★) or better. The three-star Triple Rare tier, where the full arts are, is 2.17% of the print run in Vols. 1 and 2 and 1.81% in Vols. 3 to 7. That works out to about one three-star card in every 11 to 12 packs in Vols. 1 and 2, and about one in every 14 packs in Vols. 3 to 7.",
  },
  {
    q: 'Does every Gem Pack have a guaranteed hit?',
    a: "Every pack has one card that is Rare, Double Rare or Triple Rare, and Pokémon China states this for Vol. 1 and Vol. 2. Most of the time that card is a Rare: about 70% of these cards are Rares, about 19% to 23% Double Rares and only about 7% to 9% Triple Rares.",
  },
  {
    q: 'Does a Gem Pack booster box guarantee a full art?',
    a: "No. Pokémon China does not promise a full art or any three-star card per box, for any volume. Its odds charts note that cards are packed at random and that even a whole case may not complete the set. A box averages about 1.3 three-star cards, which is an average, not a promise.",
  },
  {
    q: 'How many full arts are in a Gem Pack box?',
    a: 'On average about 1.3 three-star cards per box in every volume (for Vols. 3 to 7, 18 packs × 4 cards × 1.81% = 1.30). In Vols. 4 to 7 every three-star card is a Pokémon full art. In Vols. 1 to 3 the three-star tier also holds Energy and Trainer cards, so a box averages fewer Pokémon full arts than that.',
  },
  {
    q: 'What are the odds of pulling a full art from a Gem Pack?',
    a: 'About 7.2% per pack in Vols. 3 to 7 (4 cards × 1.81%) and about 8.7% per pack in Vols. 1 and 2 (4 cards × 2.17%), counting every three-star card. In Vols. 1 to 3 some of that three-star tier is Energy and Trainer cards.',
  },
  {
    q: "What are the odds of pulling Misty's Psyduck from Gem Pack Vol. 7?",
    a: "Misty's Psyduck 0307/07 is one of 28 three-star cards in Vol. 7. If each is printed in equal numbers, which Pokémon China does not say, that is about 1 in 387 packs or 1 in 21.5 boxes, and about a 37% chance across 10 boxes. The same odds apply to Applin 1907/07 in Vol. 6 and to any one full art in Vols. 4 to 7.",
  },
  {
    q: 'How many Gem Pack boxes does it take to pull a specific full art?',
    a: 'On average about 21.5 boxes for one named full art in Vols. 4 to 7, about 12 to 15 boxes in Vols. 1 to 3, where the three-star tier has fewer cards. These are averages: cards are packed at random, so it can take many more boxes or far fewer.',
  },
  {
    q: 'Can the three-star card in a Gem Pack be an Energy?',
    a: 'Yes, in Vols. 1, 2 and 3. Each of those sets has six Energy cards, all Triple Rares, so they share the three-star tier with the full arts. Vols. 4 to 7 have no Energy cards at all, and every three-star card in them is a Pokémon full art.',
  },
  {
    q: 'What share of three-star pulls are Energy cards?',
    a: "Pokémon China does not say. Its charts give one share for the whole three-star tier and only count the cards in it. By card count, Energy is 6 of 18 three-star cards in Vol. 1, 6 of 20 in Vol. 2 and 6 of 16 in Vol. 3, so about a third, if each three-star card is printed in equal numbers.",
  },
  {
    q: 'How many packs are in a Gem Pack booster box?',
    a: 'Pokémon China says 15 packs per box for Vol. 1. The Vol. 2 boxes we sell hold 15 packs, and the Vol. 3 to Vol. 7 boxes hold 18. Every pack has 4 cards.',
  },
  {
    q: 'Are all the cards in a Gem Pack holo?',
    a: 'Yes. Pokémon China lists every Gem Pack as 4 cards per pack, all holo, including the Trainer and Energy cards in Vols. 1 to 3.',
  },
  {
    q: 'What do the ●, ◆ and ★ symbols on Gem Pack cards mean?',
    a: 'They are the rarity marks: ● Common, ◆ Uncommon, ★ Rare, ★★ Double Rare and ★★★ Triple Rare. Pokémon China notes that Gem Pack rarity marks differ from those in regular booster packs.',
  },
  {
    q: 'Which Gem Pack volume has the best full art odds?',
    a: 'Per box, every volume averages about 1.3 three-star cards. Per pack, Vols. 1 and 2 are higher (about 8.7% against 7.2%), but their boxes are smaller and their three-star tier includes Energy and Trainer cards. In Vols. 4 to 7 every three-star card is a Pokémon full art.',
  },
  {
    q: 'Can you play the game with Gem Pack cards?',
    a: 'Pokémon China says a Gem Pack on its own cannot be used to play, and suggests combining the cards with other products to build a deck.',
  },
  {
    q: 'Are Gem Packs sold under other names?',
    a: 'Yes. Shops also call them Gem Volume, Chinese Gem Pack or Baokemeng Gem Pack, and some list Vol. 1 as Horizons Gem. They are the same Simplified Chinese products.',
  },
]
// Card list links shown after an FAQ answer, and added to its JSON-LD text.
type FaqLink = { to: string; label: string }
const faqLinksText = (links?: readonly FaqLink[]) =>
  links && links.length
    ? ` See the card list for ${links.map((l) => l.label).join(', ').replace(/, ([^,]*)$/, ' and $1')}.`
    : ''
function FaqLinks({ links }: { links?: readonly FaqLink[] }) {
  if (!links || !links.length) return null
  return (
    <>
      {' '}See the card list for{' '}
      {links.map((l, i) => (
        <span key={l.to}>
          {i > 0 && (i === links.length - 1 ? ' and ' : ', ')}
          <Link to={l.to}>{l.label}</Link>
        </span>
      ))}
      .
    </>
  )
}

export const Route = createFileRoute('/blog/chinese-gem-pack-hit-rates')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => ({
    meta: [
      { title: blogSeoTitle(post) },
      { name: 'robots', content: loaderData?.live ? 'index, follow' : 'noindex, nofollow' },
      { name: 'description', content: blogSeoDescription(post) },
      { property: 'og:title', content: post.title },
      { property: 'og:description', content: post.excerpt },
      { property: 'og:image', content: blogShareImage(post) },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: post.heroAlt },
      { name: 'twitter:image', content: blogShareImage(post) },
      { name: 'twitter:image:alt', content: post.heroAlt },
      { property: 'article:published_time', content: post.date },
      ...(loaderData?.liveAt ? [{ property: 'article:modified_time', content: loaderData.liveAt.slice(0, 10) }] : []),
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: `${BLOG_SITE_URL}${post.path}` },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: blogCssUrl },
      { rel: 'canonical', href: `${BLOG_SITE_URL}${post.path}` },
    ],
  }),
  component: ChineseGemPackHitRatesPost,
})

type Chase = { vol: number; id: string; no: string; name: string; w: number; h: number; alt: string }
function ChaseCard({ c }: { c: Chase }) {
  return (
    <li>
      <figure>
        <img src={cardImg(c.vol, c.id)} alt={c.alt} loading="lazy" width={c.w} height={c.h} />
        <figcaption>
          <ChineseExclusiveBadge />
          <strong>{c.name}</strong>
          {c.no} · Gem Vol. {c.vol} ·{' '}
          <Link to={GUIDE[c.vol as Vol]}>Set guide</Link> ·{' '}
          <Link to={CARD_LIST[c.vol as Vol]}>Card list</Link>
        </figcaption>
      </figure>
    </li>
  )
}

function ChineseGemPackHitRatesPost() {
  const status = Route.useLoaderData()
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: status.liveAt?.slice(0, 10) ?? post.date,
    image: post.heroImage,
    url: `${BLOG_SITE_URL}${post.path}`,
    mainEntityOfPage: `${BLOG_SITE_URL}${post.path}`,
    author: { '@type': 'Organization', name: 'EBI Collectibles', url: BLOG_SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'EBI Collectibles',
      url: BLOG_SITE_URL,
      logo: { '@type': 'ImageObject', url: `${BLOG_SITE_URL}/assets/ebi-logo.jpg`, width: 240, height: 240 },
    },
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a + faqLinksText('links' in f ? (f.links as FaqLink[]) : undefined) },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <BlogPostLayout
        updated={status.liveAt}
        wide
        post={post}
        lede="Every Chinese Gem Pack has 4 shiny cards, and one of them is always a star card. That is the only guarantee. A box usually has about one full art, but Pokémon China does not promise one, and in the first three volumes that top card can be an Energy."
        cta={{
          heading: 'Shop Gem Pack booster boxes',
          body: 'Sealed Simplified Chinese Gem Pack booster boxes, newest volume first.',
          links: [
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-7-booster-box' }, label: 'Gem Vol. 7 booster box' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-6-booster-box' }, label: 'Gem Vol. 6 booster box', variant: 'ghost' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-5-booster-box' }, label: 'Gem Vol. 5 booster box', variant: 'ghost' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-4-booster-box' }, label: 'Gem Vol. 4 booster box', variant: 'ghost' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-3-booster-box' }, label: 'Gem Vol. 3 booster box', variant: 'ghost' },
            { to: '/products/$id', params: { id: 'pokemon-chinese-gem-volume-2-booster-box' }, label: 'Gem Vol. 2 booster box', variant: 'ghost' },
          ],
        }}
      >
        <h2 id="short-answer">The short answer, in plain English</h2>
        <ul>
          <li>
            <strong>Every pack has 4 shiny cards.</strong> One of the 4 is always a &ldquo;star&rdquo; card, the kind with one, two or
            three stars printed by the card number.
          </li>
          <li>
            <strong>Most of the time that star card has one star.</strong> The full arts are the three-star cards, and you get one in
            about 1 pack out of every 14 (about 1 in 12 in Vols. 1 and 2).
          </li>
          <li>
            <strong>A box is not guaranteed a full art.</strong> On average a box has about one, but some boxes have two or more and
            some have none. Pok&eacute;mon China does not promise any.
          </li>
          <li>
            <strong>Vols. 1 to 3 only:</strong> a three-star card can be an Energy card in place of a Pok&eacute;mon. From Vol. 4 on,
            every three-star card is a Pok&eacute;mon full art.
          </li>
          <li>
            <strong>Chasing full arts?</strong> A whole box gives you the best run at one: 18 packs, 72 holo cards, and about one
            three-star card on average. Vols. 4 to 7 are the ones where every three-star card is a Pok&eacute;mon.
          </li>
        </ul>
        <p>The rest of this guide shows where these numbers come from, volume by volume, using Pok&eacute;mon China&rsquo;s own odds charts.</p>

        <aside className="fact-box" aria-label="Gem Pack key facts">
          <img
            src={`${SITE_URL}/assets/sets/packs/gem-vol-7.webp`}
            alt="A Gem Pack Vol. 7 booster pack with Psyduck on the front"
            loading="lazy"
            width={428}
            height={760}
            style={{ background: 'transparent', boxShadow: 'none' }}
          />
          <div>
            <p className="fact-box-title">Key facts</p>
            <dl>
              <dt>Product</dt>
              <dd>
                Pokémon Gem Pack (<Zh>Pokémon宝石包</Zh>), Vols. 1 to 7
              </dd>
              <dt>Set codes</dt>
              <dd>CBB1C to CBB7C</dd>
              <dt>Cards per pack</dt>
              <dd>4, all holo</dd>
              <dt>Pack guarantee</dt>
              <dd>1 card Rare (★) or better</dd>
              <dt>Packs per box</dt>
              <dd>15 (Vols. 1 and 2), 18 (Vols. 3 to 7)</dd>
              <dt>Box guarantee</dt>
              <dd>None stated by Pokémon China</dd>
              <dt>Three-star per box</dt>
              <dd>About 1.3 on average, every volume</dd>
              <dt>Language</dt>
              <dd>Simplified Chinese</dd>
            </dl>
          </div>
        </aside>

        <nav className="toc" aria-label="In this guide">
          <p className="toc-title">In this guide</p>
          <ol>
            {TOC.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`}>{t.label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <h2 id="pack">What every pack guarantees</h2>
        <p>
          Every Gem Pack holds 4 cards, and Pokémon China lists all of them as holo, in every volume from Vol. 1 to Vol. 7. Its Vol. 1
          and Vol. 2 pages also spell out how the four are split: three cards are ● or ◆, and the other one is ★, ★★ or ★★★. In
          Chinese that reads <Zh>每一包的4张卡牌中，3张是●或◆稀有度，另外1张是★或★★或★★★稀有度中的其中1种</Zh>.
        </p>
        <p>
          The pages for Vols. 3 to 7 do not repeat that sentence, but their odds charts fit the same split: Common and Uncommon make
          up exactly 75% of the print run in every volume, which is three cards out of four. So the one card you can count on is a
          Rare or better. On average a pack holds two Commons, one Uncommon and that one higher card.
        </p>

        <h2 id="odds">Official odds for Vol. 1 to 7</h2>
        <p>
          Pokémon China prints an odds chart for each volume. It gives each rarity's production share, which it defines as that
          rarity's share of all cards produced, and how many different cards sit at each rarity. Vols. 5, 6 and 7 use the same chart
          image, and Vol. 4's has the same numbers.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-odds" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-odds" className="sr-only">
              Official production share of each rarity in Gem Pack Vols. 1 to 7, with the number of different cards in brackets
            </caption>
            <thead>
              <tr>
                <th scope="col">Vol.</th>
                <th scope="col">● Common</th>
                <th scope="col">◆ Uncommon</th>
                <th scope="col">★ Rare</th>
                <th scope="col">★★ Double Rare</th>
                <th scope="col">★★★ Triple Rare</th>
                <th scope="col">What the three-star tier holds</th>
              </tr>
            </thead>
            <tbody>
              {ODDS.map((o) => (
                <tr key={o.vol}>
                  <th scope="row">{o.vol}</th>
                  <td>{o.c}</td>
                  <td>{o.u}</td>
                  <td>{o.r}</td>
                  <td>{o.rr}</td>
                  <td>{o.rrr}</td>
                  <td>{o.what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">Share of the print run, with the number of different cards in brackets. Source: Pokémon China's odds charts.</p>
        <p>
          The charts split the three-star tier further, by card count only. Vol. 1 has 11 Pokémon illustration holos, 4 holos without
          gold stamping and 3 with it. Vol. 2 has 13 Pokémon holos and the same 4 and 3. Vol. 3 has 9 Pokémon holos and the same 4 and
          3. In each of those sets, the 4 and 3 are the Supporter full art and the six Energy cards. Vols. 4 to 7 list a single group:
          28 Pokémon illustration holos.
        </p>

        <h2 id="pack-and-box">Pack and box facts, volume by volume</h2>
        <div className="table-scroll" role="group" aria-labelledby="tbl-packs" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-packs" className="sr-only">
              Cards per pack, packs per box and three-star Triple Rare odds for Gem Pack Vols. 1 to 7
            </caption>
            <thead>
              <tr>
                <th scope="col">Vol.</th>
                <th scope="col">Set code</th>
                <th scope="col">Released</th>
                <th scope="col">Cards in set</th>
                <th scope="col">Cards per pack</th>
                <th scope="col">Packs per box</th>
                <th scope="col">Three-star chance per pack</th>
                <th scope="col">Three-star per box (average)</th>
              </tr>
            </thead>
            <tbody>
              {PACKS.map((p) => (
                <tr key={p.vol}>
                  <th scope="row">
                    <Link to={CARD_LIST[p.vol as Vol]}>Vol. {p.vol}</Link>
                  </th>
                  <td>{p.code}</td>
                  <td>{p.released}</td>
                  <td>
                    <Link to={CARD_LIST[p.vol as Vol]}>
                      {p.cards}
                      <span className="sr-only"> cards: Gem Vol. {p.vol} card list</span>
                    </Link>
                  </td>
                  <td>4, all holo</td>
                  <td>{p.box}</td>
                  <td>
                    {p.perPack} (1 in {p.oneIn})
                  </td>
                  <td>{p.perBox}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Averages, not guarantees. Tap a volume or its card count for the full card list.
        </p>

        <h2 id="top-slot">What the fourth card turns out to be</h2>
        <p>
          Because Rare and up make up exactly 25% of every print run, one card in four, you can read each rarity's share of that
          fourth card straight off the chart. For Vols. 4 to 7, 17.39% out of 25% means the fourth card is a Rare 69.6% of the time.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-top" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-top" className="sr-only">
              How often the fourth, Rare-or-better card in a Gem Pack is a Rare, Double Rare or Triple Rare
            </caption>
            <thead>
              <tr>
                <th scope="col">Vol.</th>
                <th scope="col">★ Rare</th>
                <th scope="col">★★ Double Rare</th>
                <th scope="col">★★★ Triple Rare</th>
              </tr>
            </thead>
            <tbody>
              {TOP_SLOT.map((t) => (
                <tr key={t.vol}>
                  <th scope="row">{t.vol}</th>
                  <td>{t.r}</td>
                  <td>{t.rr}</td>
                  <td>{t.rrr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          In Vols. 4 to 7 the Rare is the Master Ball pattern holo and the Double Rare is the card with the pink Gem Pack logo stamp.
          In Vol. 2 the nine Pokémon V are also Rares, and in Vol. 3 the nine Pokémon ex are Rares, so those turn up far more often
          than the full arts.
        </p>

        <h2 id="box">What a box guarantees</h2>
        <p>
          Nothing beyond what is in its packs. None of Pokémon China's seven Gem Pack pages promises a full art, a three-star card or
          any other card per box. Every odds chart carries the same notes: cards are packed at random and duplicates are possible (
          <Zh>卡牌随机封包，有概率获得重复卡牌</Zh>), and even buying a whole case may not get you every card (
          <Zh>整件购买可能也无法集齐全种类卡牌</Zh>).
        </p>
        <p>
          A box is said online to guarantee one full art, or one illustration card. That is not an official guarantee. It matches the
          average, about 1.3 three-star cards per box, so many boxes do land one, but an average is not a promise, and Pokémon China
          does not say how boxes are packed.
        </p>

        <h2 id="per-box">Full arts per box, with the maths</h2>
        <p>
          Each box's average is its number of cards times the three-star share: for Vols. 3 to 7, 18 packs × 4 cards × 1.81% = 1.30
          three-star cards per box. Vols. 1 and 2 have smaller boxes and a higher share, and land on the same 1.30.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-perbox" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-perbox" className="sr-only">
              Average three-star cards, full arts and Energy cards per Gem Pack booster box
            </caption>
            <thead>
              <tr>
                <th scope="col">Vol.</th>
                <th scope="col">Three-star cards per box</th>
                <th scope="col">Of which full arts</th>
                <th scope="col">Of which Energy</th>
              </tr>
            </thead>
            <tbody>
              {PER_BOX.map((b) => (
                <tr key={b.vol}>
                  <th scope="row">{b.vol}</th>
                  <td>{b.maths}</td>
                  <td>{b.fullArts}</td>
                  <td>{b.energy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          The split assumes every three-star card is printed in equal numbers. Pokémon China gives one share for the whole tier and
          does not say this. Full arts include the Supporter full art in Vols. 1 to 3.
        </p>

        <h2 id="energy">The holo Energy question</h2>
        <p>
          The common understanding is that a Gem Pack box guarantees a full art, and that the guaranteed slot can instead be a holo
          basic Energy. Part of that is right. The guaranteed card in each pack is a Rare or better, not a three-star card. The
          three-star tier is the rare outcome of that slot, and in Vols. 1, 2 and 3 Energy cards are part of it.
        </p>
        <p>
          Each of those three sets has six Energy cards, three types printed twice, and all six are Triple Rares. Pokémon China lists
          them as Energy holos (<Zh>能量闪卡</Zh>) in the pack. The second printing of each type carries the pink Gem Pack logo stamp.
        </p>
        <ul>
          <li>
            <strong>Vol. 1:</strong> Basic Grass, Fire and Water Energy, matching Sprigatito, Fuecoco and Quaxly.
          </li>
          <li>
            <strong>Vol. 2:</strong> Basic Lightning, Psychic and Darkness Energy.
          </li>
          <li>
            <strong>Vol. 3:</strong> Basic Fighting Energy, Basic Metal Energy and Luminous Energy. Luminous Energy is a Special
            Energy, not a basic one.
          </li>
        </ul>
        <ul className="card-grid cols-3">
          {ENERGY.map((e) => (
            <li key={e.id}>
              <figure>
                <img src={cardImg(e.vol, e.id)} alt={e.alt} loading="lazy" width={300} height={419} />
                <figcaption>
                  <strong>{e.name}</strong>
                  {e.no} · Gem Vol. {e.vol} · Triple Rare
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p>
          The three-star tier in those sets also holds a full-art Supporter: Nemona in Vol. 1, Penny in Vol. 2 and Arven in Vol. 3.
          Pokémon China's chart gives one production share for the whole tier, so it does not say how often a three-star pull is an
          Energy. By card count, Energy is 6 of 18 three-star cards in Vol. 1, 6 of 20 in Vol. 2 and 6 of 16 in Vol. 3.
        </p>
        <p>
          From Vol. 4 on, there are no Trainer or Energy cards at all. Every volume is 28 Pokémon with seven cards each, and the
          seventh card of each is its three-star full art. So in Vols. 4 to 7, a three-star pull is always a Pokémon full art.
        </p>

        <h2 id="vs-main-sets">How Gem Packs differ from slim and jumbo packs</h2>
        <p>
          The main Simplified Chinese expansions come in two pack sizes: a 5-card slim pack with one holo and a 20-card jumbo pack with
          six or seven holos, each with its own odds chart. Our{' '}
          <Link to="/blog/blade-awakening-set-guide">Blade Awakening set guide</Link> compares the two side by side, and our guide to{' '}
          <Link to="/blog/chinese-booster-box-guaranteed-hits">whether Chinese booster boxes have guaranteed hits</Link> covers what
          slim and jumbo boxes hold.
        </p>
        <ul>
          <li>
            <strong>Every card is a holo.</strong> A Gem Pack has 4 cards and all 4 are holo, where a slim pack has 1 holo in 5.
          </li>
          <li>
            <strong>Its own rarity marks.</strong> Gem Packs use five marks, ●, ◆, ★, ★★ and ★★★, and Pokémon China notes that these
            differ from the marks in regular booster packs.
          </li>
          <li>
            <strong>Its own card list.</strong> Gem Packs are a separate collector line with set codes CBB1C to CBB7C, not part of a
            main expansion.
          </li>
          <li>
            <strong>Built for collecting.</strong> Pokémon China notes that a Gem Pack on its own cannot be used to play, and suggests
            combining it with other products.
          </li>
        </ul>
        <p>
          For where the Gem Packs fall among the other Chinese releases, see{' '}
          <Link to="/blog/chinese-pokemon-sets-in-order">every Simplified Chinese set in order</Link>.
        </p>

        <h2 id="chase">Each volume’s chase full arts</h2>
        <p>
          Each volume has its own Chinese Exclusive full arts with new illustrations, and these are the cards most collectors open a
          box for. Each set guide shows every full art, and each card list has the full set.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-chase" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-chase" className="sr-only">
              Chinese Exclusive full arts and other three-star cards in each Gem Pack volume
            </caption>
            <thead>
              <tr>
                <th scope="col">Vol.</th>
                <th scope="col">Chinese Exclusive full arts</th>
                <th scope="col">Other top cards</th>
                <th scope="col">Guides</th>
              </tr>
            </thead>
            <tbody>
              {CHASE_TABLE.map((c) => (
                <tr key={c.vol}>
                  <th scope="row">{c.vol}</th>
                  <td>{c.cards}</td>
                  <td>{c.other}</td>
                  <td>
                    <Link to={GUIDE[c.vol as Vol]}>Set guide</Link>
                    {', '}
                    <Link to={CARD_LIST[c.vol as Vol]}>card list</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="card-grid cols-4">
          {CHASE_NEW.map((c) => (
            <ChaseCard key={`${c.vol}-${c.id}`} c={c} />
          ))}
        </ul>
        <ul className="card-grid cols-3">
          {CHASE_OLD.map((c) => (
            <ChaseCard key={`${c.vol}-${c.id}`} c={c} />
          ))}
        </ul>

        <h2 id="one-card">Odds of pulling one specific full art</h2>
        <p>
          The 1.3 three-star cards per box are shared across every card in the tier. Your odds of one named card, such as a volume's
          Chinese Exclusive full art, are that share divided by the number of three-star cards in the set.
        </p>
        <div className="table-scroll" role="group" aria-labelledby="tbl-onecard" tabIndex={0}>
          <table className="data-table">
            <caption id="tbl-onecard" className="sr-only">
              Odds of pulling one specific three-star card per pack, per box and across 10 boxes for each Gem Pack volume
            </caption>
            <thead>
              <tr>
                <th scope="col">Vol.</th>
                <th scope="col">Example card</th>
                <th scope="col">Three-star cards</th>
                <th scope="col">Per pack</th>
                <th scope="col">Per box</th>
                <th scope="col">Chance in 10 boxes</th>
              </tr>
            </thead>
            <tbody>
              {ONE_CARD.map((o) => (
                <tr key={o.vol}>
                  <th scope="row">{o.vol}</th>
                  <td>{o.example}</td>
                  <td>{o.tier}</td>
                  <td>{o.pack}</td>
                  <td>{o.box}</td>
                  <td>{o.ten}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Per pack is 4 cards × the three-star share ÷ the number of three-star cards. The chance in 10 boxes is 1 − (1 − per pack)
          to the power of the packs in 10 boxes (150 for Vols. 1 and 2, 180 for Vols. 3 to 7). Both assume every three-star card is
          printed in equal numbers, which Pokémon China does not say.
        </p>

        <h2 id="faq">FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>
                {zh(f.a)}
                <FaqLinks links={'links' in f ? (f.links as FaqLink[]) : undefined} />
              </p>
            </details>
          ))}
        </div>

        <h2 id="our-take">Our take</h2>
        <p>
          Gem Packs are an easy line to open: every card is a holo and every pack has a Rare or better. Go in expecting about one
          three-star card per box, not a promised one. If Pokémon full arts are what you are chasing, Vols. 4 to 7 are the ones to open:
          they have no Energy cards sharing the top tier, so every three-star pull is a Pokémon.
        </p>
      </BlogPostLayout>
    </>
  )
}
