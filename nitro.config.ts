import { defineNitroConfig } from 'nitro/config'

// Set only by .github/workflows/deploy-dev.yml, to build/deploy a second,
// separate Worker for sandbox testing (fake Square cards, its own database)
// without ever touching the production Worker's name or domain routes. Any
// build that doesn't set this — including every local build — is
// byte-identical to before this existed.
const isDev = process.env.DEPLOY_TARGET === 'dev'

export default defineNitroConfig({
  compatibilityDate: '2024-09-19',
  preset: 'cloudflare_module',
  // Square's Apple Pay domain verification fetches this file and requires
  // it to come back as an actual download (Content-Disposition: attachment)
  // rather than rendered inline — the default static-asset response for an
  // extensionless file doesn't set that on its own.
  routeRules: {
    '/.well-known/apple-developer-merchantid-domain-association': {
      headers: {
        'content-type': 'application/octet-stream',
        'content-disposition': 'attachment; filename="apple-developer-merchantid-domain-association"',
      },
    },
    // Baseline security headers on every response. Deliberately NOT
    // including Content-Security-Policy here — a wrong CSP can silently
    // break Clerk's login iframe/scripts or Square's payment form, and
    // that needs real testing against every third-party domain in use
    // (Clerk, Square, Google Analytics/Fonts, Cloudflare), not a drive-by
    // addition. These four are safe regardless of what scripts the page
    // loads, since none of them restrict *what* can load — only clickjacking,
    // MIME-sniffing, referrer leakage, and unused browser APIs.
    '/**': {
      headers: {
        // Nothing on this site is meant to be framed by another origin —
        // there's no embeddable widget use case, so DENY (not just
        // SAMEORIGIN) is safe and closes off clickjacking attempts.
        'x-frame-options': 'DENY',
        // Stops a browser from re-interpreting a response as a different
        // content type than what was declared (e.g. treating an uploaded
        // "image" as HTML/JS) purely from sniffing its bytes.
        'x-content-type-options': 'nosniff',
        // Sends the full referrer on same-origin navigation (so internal
        // analytics/links keep working) but only the origin — not the full
        // path/query — cross-origin, so e.g. an order confirmation URL
        // never leaks to a third-party link's destination via the Referer
        // header.
        'referrer-policy': 'strict-origin-when-cross-origin',
        // Explicitly denies browser APIs this site has no use for.
        // Deliberately NOT including payment=() even though it looks like
        // it'd apply here — Square's Apple Pay button (ApplePayButton.tsx,
        // ExpressApplePayButton.tsx) goes through Square's own SDK wrapper
        // (`payments.applePay(...)`), and whether that's built on the W3C
        // PaymentRequest API this directive actually gates isn't something
        // to guess at from outside Square's (minified, externally hosted)
        // SDK — getting it wrong would silently break Apple Pay checkout,
        // not throw an obvious error. geolocation/camera/microphone are
        // confirmed unused anywhere in this app, so those are safe to deny.
        'permissions-policy': 'geolocation=(), camera=(), microphone=()',
      },
    },
  },
  cloudflare: {
    deployConfig: true,
    nodeCompat: true,
    // Pinned explicitly — without this, Nitro auto-generates the Worker name
    // per-build (from git remote / directory context), which can differ
    // between a local build and a CI build and silently split traffic and
    // secrets across two different Workers. This must match the name
    // already live in the Cloudflare dashboard.
    wrangler: {
      name: isDev ? 'ebicollectibles-ebicollectibles-site-dev' : 'ebicollectibles-ebicollectibles-site',
      // Pinned too, so a local `wrangler secret put` can't silently land on
      // a different Cloudflare account than the one CI deploys to.
      account_id: 'bcc6861315d8ff44884e66be1f31eee3',
      // `nodejs_compat` alone does NOT populate process.env from vars/secrets
      // — that needs this separate, explicit flag. Without it, DATABASE_URL
      // etc. are set correctly in Cloudflare but invisible to process.env.
      compatibility_flags: ['nodejs_compat', 'nodejs_compat_populate_process_env'],
      // R2 bucket for product images uploaded from the admin panel. The
      // bucket itself has to be created once (see README-DEPLOY.md) —
      // this just wires the binding so the Worker can reach it. Shared with
      // the dev Worker too — it only holds product photos, not order/
      // customer data, so isolating it isn't worth a second bucket.
      r2_buckets: [{ binding: 'PRODUCT_IMAGES', bucket_name: 'ebicollectibles-product-images' }],
      // The dev Worker gets no custom domain — it's reachable only at its
      // own workers.dev URL, so it can never intercept production traffic.
      routes: isDev
        ? []
        : [
            { pattern: 'ebicollectibles.com', custom_domain: true },
            { pattern: 'www.ebicollectibles.com', custom_domain: true },
          ],
    },
  },
})
