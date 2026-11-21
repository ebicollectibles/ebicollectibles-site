# EBI Collectibles site: standing rules

## Blog banners

The owner wants every blog banner to look like part of one set. Do not deviate
from these when making a new banner or changing an old one.

**Canvas**

- Design on a 1920x1080 canvas. Export the banner at 1600x900 as WebP.
- Every banner also needs a `-800.webp` copy (800x450) for phones and a
  1200x630 JPG social banner in `public/assets/share/blog-<name>.jpg`, cropped
  from the centre of the banner. Regenerate both whenever the banner changes.

**Logo (fixed, never adjust per banner)**

- The EBI Collectibles logo is the white mark from `public/assets/ebi-logo.jpg`,
  colour `rgb(243, 245, 248)`.
- On the 1920x1080 canvas it is **80px tall with its top-left corner at
  (150, 120)**. On the exported 1600x900 file that is the box from (125, 100) to
  (384, 167).
- Same size and position on every banner type: release news, set guide, card
  origins, and anything new.
- `src/data/blog-banner-logo.test.ts` measures this on every banner and fails
  the build if one is off. Do not loosen that test to make a banner pass; fix
  the banner.

**Left column**

- All text in the left column starts at x = 150 on the 1920 canvas, in line
  with the logo.
- Keep a clear gap between the end of the title and the artwork on the right.
  Shrink the title a step before letting artwork touch it.

**Artwork on the right**

- Show the whole product or card. Never let it run off an edge or get cut off.
- Compose one group. Do not scatter separate cut-outs with gaps between them.
- When two products are a pair, mirror them about a centre line: same size,
  same distance from the centre, opposite tilt, and no overlap in the middle.
- Do not shrink products to make room. Tuck secondary items further behind the
  main ones instead.
- Use sharp source images. If the only source is small, say so before using it.
- Backgrounds stay an even dark wash. No pale boxes or recognisable shapes
  showing through behind the artwork.

**Which card or product leads**

- Lead with the set's mascot or most recognisable card, the one on the pack or
  in the set's name. A Chinese Exclusive that is not the mascot goes in the
  supporting row.
- Supporting rows on set guide banners use Special Art Rares.

**Files**

- Banner scripts and source images are kept outside the repository.
- Product photos and banners on white must not get a white box behind them on
  dark pages: save cut-outs with transparency.

## Traffic check

The site runs on the Cloudflare Workers free plan: 100,000 Worker requests per
UTC day, after which the site fails until 00:00 UTC. The owner does not want an
automated alert. When working with the owner, occasionally check recent daily
Worker requests (Cloudflare GraphQL, `workersInvocationsAdaptive`) and tell
them if any day has passed 50,000, and recommend Workers Paid ($5/month) before
a big release if it is getting close.

## Blog writing

- No promises the owner did not ask for: no "we will update this post", "we
  will email you", "check back" or similar. Only state commitments the owner
  has made, in their words.

## PokéNews Discord channel

- Never post to the PokéNews Discord channel on your own. Only post there what
  the owner explicitly hands over for it, one post at a time. Publishing a blog
  post does not mean it goes to PokéNews.
- The webhook URL is a secret: never put it in the repository.

## Prices

- The price customers see and pay comes from Square. The site's own stored
  price is never used for Square-linked products, so price changes are made in
  Square only. The site's "compare at" (was) price is still set on the site,
  since Square has no equivalent; it drives the Sale badge.
