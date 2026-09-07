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
