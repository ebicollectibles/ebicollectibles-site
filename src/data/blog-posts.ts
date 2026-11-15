// The blog's own index of posts — same idea as gem-sets-index.ts for
// /sets: one small summary record per post, used to render the /blogs/news
// listing page without importing every post component just to show its
// card. Each post route also imports its own entry here for its head()
// meta, so title/description/image never drift between the listing and
// the post itself.
import { SITE_URL, R2_IMAGE_HOST } from '~/lib/gem-sets/constants'

export type BlogPostSlug = 'gem-vol-7-has-arrived' | 'black-bolt-white-flare-arrive' | 'gem-vol-7-card-origins' | 'gem-vol-6-has-arrived' | 'gem-vol-6-set-guide' | 'gem-vol-6-card-origins' | 'gem-vol-5-has-arrived' | 'gem-vol-5-set-guide' | 'gem-vol-5-card-origins' | 'gem-vol-4-has-arrived' | 'gem-vol-4-set-guide' | 'gem-vol-4-card-origins' | 'gem-vol-3-has-arrived' | 'gem-vol-3-set-guide' | 'gem-vol-3-card-origins' | 'gem-vol-2-has-arrived' | 'gem-vol-2-set-guide' | 'gem-vol-2-card-origins'

export interface BlogPostSummary {
  slug: BlogPostSlug
  path: `/blogs/news/${BlogPostSlug}`
  title: string
  excerpt: string
  tag: string
  date: string // ISO date
  heroImage: string
  heroAlt: string
  glow1: string
  glow2: string
}

export const BLOG_POSTS: BlogPostSummary[] = [
  {
    slug: 'gem-vol-7-has-arrived',
    path: '/blogs/news/gem-vol-7-has-arrived',
    title: "Gem Vol 7 Is Here: Misty's Psyduck Leads a Trainer-Paired Lineup",
    excerpt:
      "The seventh Simplified Chinese Gem Pack: 196 all-holo cards, 28 Pokémon with seven versions each, and a brand-new Misty's Psyduck full art you can only pull here.",
    tag: 'New release',
    date: '2026-11-06',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-7-ebi-hero.webp`,
    heroAlt: "Misty's Psyduck full art from Gem Pack Vol. 7 in a display case, with the six holo Psyduck versions lined up beside the EBI Collectibles logo",
    glow1: 'rgb(138 61 120 / .30)',
    glow2: 'rgb(58 110 165 / .25)',
  },
  {
    slug: 'gem-vol-6-has-arrived',
    path: '/blogs/news/gem-vol-6-has-arrived',
    title: 'Gem Vol 6 Is Here: Applin Leads an Orchard of Holos',
    excerpt:
      'The sixth Simplified Chinese Gem Pack: 196 all-holo cards, 28 Pokémon with seven versions each, the whole apple family, and an Applin full art you can only pull here.',
    tag: 'New release',
    date: '2026-08-07',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-6-release-hero.webp`,
    heroAlt: 'Applin full art from Gem Pack Vol. 6 in a display case, with the six holo Applin versions lined up beside the EBI Collectibles logo',
    glow1: 'rgb(199 22 116 / .26)',
    glow2: 'rgb(78 119 104 / .30)',
  },
  {
    slug: 'gem-vol-6-set-guide',
    path: '/blogs/news/gem-vol-6-set-guide',
    title: 'Gem Vol 6 Set Guide: Every Full Art, the Full Roster and Box Math',
    excerpt:
      'How to tell every Gem Vol 6 version apart, all 28 full arts in one place, the full roster, and what a master set really takes.',
    tag: 'Set guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-6-guide-hero.webp`,
    heroAlt: 'Eight Gem Pack Vol. 6 full arts, including Applin, Flapple and Appletun, in a display case beside the EBI Collectibles logo',
    glow1: 'rgb(78 119 104 / .30)',
    glow2: 'rgb(199 22 116 / .22)',
  },
  {
    slug: 'gem-vol-6-card-origins',
    path: '/blogs/news/gem-vol-6-card-origins',
    title: 'Where Every Gem Vol 6 Card Actually Comes From',
    excerpt:
      "55 of the 56 artworks in Gem Vol 6 are reused from English Scarlet & Violet cards, mostly Surging Sparks. Here's the full card-by-card map.",
    tag: 'Collecting guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-6-origins-hero.webp`,
    heroAlt: 'Eight Gem Pack Vol. 6 full arts in a display case beside the EBI Collectibles logo, with the title Gem Vol. 6 Card Origins',
    glow1: 'rgb(78 119 104 / .28)',
    glow2: 'rgb(199 22 116 / .22)',
  },
  {
    slug: 'gem-vol-5-has-arrived',
    path: '/blogs/news/gem-vol-5-has-arrived',
    title: 'Gem Vol 5 Is Here: Pokémon Horizons Sets Sail in the Gem Pack',
    excerpt:
      'The fifth Simplified Chinese Gem Pack: 196 all-holo cards, 28 Pokémon with seven versions each, and four Pokémon Horizons full arts led by Captain Pikachu.',
    tag: 'New release',
    date: '2026-04-24',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-5-release-hero.webp`,
    heroAlt: 'Floragato and Liko full art from Gem Pack Vol. 5 in a display case, with the six holo Floragato versions beside the EBI Collectibles logo',
    glow1: 'rgb(199 22 116 / .26)',
    glow2: 'rgb(214 170 60 / .28)',
  },
  {
    slug: 'gem-vol-5-set-guide',
    path: '/blogs/news/gem-vol-5-set-guide',
    title: 'Gem Vol 5 Set Guide: Every Full Art, the Full Roster and Box Math',
    excerpt:
      'How to tell every Gem Vol 5 version apart, all 28 full arts in one place including the four Horizons cards, the full roster, and what a master set really takes.',
    tag: 'Set guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-5-guide-hero.webp`,
    heroAlt: 'Eight Gem Pack Vol. 5 full arts, including Captain Pikachu and the Horizons cards, in a display case beside the EBI Collectibles logo',
    glow1: 'rgb(214 170 60 / .28)',
    glow2: 'rgb(199 22 116 / .26)',
  },
  {
    slug: 'gem-vol-5-card-origins',
    path: '/blogs/news/gem-vol-5-card-origins',
    title: 'Where Every Gem Vol 5 Card Actually Comes From',
    excerpt:
      '51 of the 56 artworks in Gem Vol 5 are reused from English cards, mostly Surging Sparks. The other five are new Pokémon Horizons art. Here\'s the full card-by-card map.',
    tag: 'Collecting guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-5-origins-hero.webp`,
    heroAlt: 'Eight Gem Pack Vol. 5 full arts in a display case beside the EBI Collectibles logo, with the title Gem Vol. 5 Card Origins',
    glow1: 'rgb(214 170 60 / .28)',
    glow2: 'rgb(199 22 116 / .26)',
  },
  {
    slug: 'gem-vol-4-has-arrived',
    path: '/blogs/news/gem-vol-4-has-arrived',
    title: 'Gem Vol 4 Is Here: Ponyta Gallops In for the Year of the Horse',
    excerpt:
      'The fourth Simplified Chinese Gem Pack: 196 all-holo cards, 28 Pokémon with seven versions each, and a sunset meadow Ponyta full art you can only pull here.',
    tag: 'New release',
    date: '2026-02-06',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-4-release-hero.webp`,
    heroAlt: 'Ponyta full art from Gem Pack Vol. 4 in a display case, with the six holo Ponyta versions beside the EBI Collectibles logo',
    glow1: 'rgb(199 22 116 / .26)',
    glow2: 'rgb(208 129 105 / .30)',
  },
  {
    slug: 'gem-vol-4-set-guide',
    path: '/blogs/news/gem-vol-4-set-guide',
    title: 'Gem Vol 4 Set Guide: Every Full Art, the Full Roster and Box Math',
    excerpt:
      'How to tell every Gem Vol 4 version apart, all 28 full arts in one place, the full roster, and what a master set really takes.',
    tag: 'Set guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-4-guide-hero.webp`,
    heroAlt: 'Eight Gem Pack Vol. 4 full arts, including Ponyta, Eevee and Infernape, in a display case beside the EBI Collectibles logo',
    glow1: 'rgb(208 129 105 / .30)',
    glow2: 'rgb(199 22 116 / .26)',
  },
  {
    slug: 'gem-vol-4-card-origins',
    path: '/blogs/news/gem-vol-4-card-origins',
    title: 'Where Every Gem Vol 4 Card Actually Comes From',
    excerpt:
      '55 of the 56 artworks in Gem Vol 4 are reused from English cards, mostly Temporal Forces and Twilight Masquerade. Here\'s the full card-by-card map.',
    tag: 'Collecting guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-4-origins-hero.webp`,
    heroAlt: 'Eight Gem Pack Vol. 4 full arts in a display case beside the EBI Collectibles logo, with the title Gem Vol. 4 Card Origins',
    glow1: 'rgb(208 129 105 / .30)',
    glow2: 'rgb(199 22 116 / .26)',
  },
  {
    slug: 'gem-vol-3-has-arrived',
    path: '/blogs/news/gem-vol-3-has-arrived',
    title: 'Gem Vol 3 Is Here: Gengar Leads a Night Out in the Gem Pack',
    excerpt:
      'The third Simplified Chinese Gem Pack: 136 all-holo cards of night-time Pokémon, nine Pokémon ex, and five new lantern-lit full arts you can only pull here.',
    tag: 'New release',
    date: '2025-09-26',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-3-release-hero.webp`,
    heroAlt: 'Gengar full art from Gem Pack Vol. 3 in a display case, with the six holo Gengar versions beside the EBI Collectibles logo',
    glow1: 'rgb(102 63 90 / .32)',
    glow2: 'rgb(214 169 151 / .26)',
  },
  {
    slug: 'gem-vol-3-set-guide',
    path: '/blogs/news/gem-vol-3-set-guide',
    title: 'Gem Vol 3 Set Guide: Every Full Art, Every ex and Box Math',
    excerpt:
      'How to read a Gem Vol 3 card, all nine full arts and nine Pokémon ex in one place, the Trainers and Energy, the full roster, and what a master set takes.',
    tag: 'Set guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-3-guide-hero.webp`,
    heroAlt: 'Eight Gem Pack Vol. 3 full arts, including the lantern-lit Meowth, Gengar and Cubone, in a display case beside the EBI Collectibles logo',
    glow1: 'rgb(214 169 151 / .26)',
    glow2: 'rgb(102 63 90 / .32)',
  },
  {
    slug: 'gem-vol-3-card-origins',
    path: '/blogs/news/gem-vol-3-card-origins',
    title: 'Where Every Gem Vol 3 Card Actually Comes From',
    excerpt:
      '35 of the 40 artworks in Gem Vol 3 are reused from English cards, mostly 2023 Scarlet & Violet sets. The other five are the new lantern full arts. Here\'s the full map.',
    tag: 'Collecting guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-3-origins-hero.webp`,
    heroAlt: 'Eight Gem Pack Vol. 3 Pokémon ex and full arts in a display case beside the EBI Collectibles logo, with the title Gem Vol. 3 Card Origins',
    glow1: 'rgb(214 169 151 / .26)',
    glow2: 'rgb(102 63 90 / .32)',
  },
  {
    slug: 'gem-vol-2-has-arrived',
    path: '/blogs/news/gem-vol-2-has-arrived',
    title: 'Gem Vol 2 Is Here: Eevee and Friends, With Four Full Arts That Form One Scene',
    excerpt:
      'The second Simplified Chinese Gem Pack: 140 all-holo cards across Eevee and all eight Eeveelutions, a V and VMAX for each, and four exclusive full arts that join into one forest scene.',
    tag: 'New release',
    date: '2025-05-16',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-2-release-hero.webp`,
    heroAlt: 'The four Gem Pack Vol. 2 full arts of Leafeon, Sylveon, Umbreon and Eevee lined up into one forest scene, beside the EBI Collectibles logo',
    glow1: 'rgb(199 22 116 / .26)',
    glow2: 'rgb(86 134 135 / .30)',
  },
  {
    slug: 'gem-vol-2-set-guide',
    path: '/blogs/news/gem-vol-2-set-guide',
    title: 'Gem Vol 2 Set Guide: Every V, VMAX and Full Art, Plus Box Math',
    excerpt:
      'How to read a Gem Vol 2 card, the four forest full arts, all nine V and VMAX, the Trainers and Energy, the full roster, and what a master set takes.',
    tag: 'Set guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-2-guide-hero.webp`,
    heroAlt: 'The four Gem Pack Vol. 2 full arts and four VMAX cards in a display case beside the EBI Collectibles logo',
    glow1: 'rgb(86 134 135 / .30)',
    glow2: 'rgb(199 22 116 / .26)',
  },
  {
    slug: 'gem-vol-2-card-origins',
    path: '/blogs/news/gem-vol-2-card-origins',
    title: 'Where Every Gem Vol 2 Card Actually Comes From',
    excerpt:
      '40 of the 44 artworks in Gem Vol 2 are reused from English cards, mostly Sword & Shield promos and Evolving Skies. The other four are the new forest full arts. Here\'s the full map.',
    tag: 'Collecting guide',
    date: '2026-11-15',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-2-origins-hero.webp`,
    heroAlt: 'Eight Eeveelution V cards from Gem Pack Vol. 2 in a display case beside the EBI Collectibles logo, with the title Gem Vol. 2 Card Origins',
    glow1: 'rgb(86 134 135 / .30)',
    glow2: 'rgb(199 22 116 / .26)',
  },
  {
    slug: 'black-bolt-white-flare-arrive',
    path: '/blogs/news/black-bolt-white-flare-arrive',
    title: 'Black Bolt and White Flare Arrive Together: Zekrom ex and Reshiram ex Split Unova',
    excerpt:
      'Two Simplified Chinese Scarlet & Violet sets out on the same day, with 174 cards each and a Black White Rare of Zekrom ex or Reshiram ex as the top pull.',
    tag: 'New release',
    date: '2026-11-06',
    heroImage: `${R2_IMAGE_HOST}/Chinese/Blog/black-bolt-white-flare/black-bolt-white-flare-official-key-art.webp`,
    heroAlt: 'Official key art for Black Bolt and White Flare, Zekrom ex and Reshiram ex',
    glow1: 'rgb(171 49 42 / .30)',
    glow2: 'rgb(72 121 119 / .25)',
  },
  {
    slug: 'gem-vol-7-card-origins',
    path: '/blogs/news/gem-vol-7-card-origins',
    title: 'Where Every Gem Vol 7 Card Actually Comes From',
    excerpt:
      "55 of the 56 artworks in Gem Vol 7 are reused from English cards, mostly Destined Rivals and Journey Together. Here's the full card-by-card map.",
    tag: 'Collecting guide',
    date: '2026-11-14',
    heroImage: `${SITE_URL}/assets/blog/gem-vol-7-origins-hero.webp`,
    heroAlt: 'Eight Gem Pack Vol. 7 full arts in a display case beside the EBI Collectibles logo, with the title Gem Vol. 7 Card Origins',
    glow1: 'rgb(58 110 165 / .28)',
    glow2: 'rgb(138 61 120 / .22)',
  },
]

export const BLOG_SITE_URL = SITE_URL
