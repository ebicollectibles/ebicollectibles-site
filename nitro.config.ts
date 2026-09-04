import { defineNitroConfig } from 'nitro/config'

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
      name: 'ebicollectibles-ebicollectibles-site',
      // Pinned too, so a local `wrangler secret put` can't silently land on
      // a different Cloudflare account than the one CI deploys to.
      account_id: 'bcc6861315d8ff44884e66be1f31eee3',
      // `nodejs_compat` alone does NOT populate process.env from vars/secrets
      // — that needs this separate, explicit flag. Without it, DATABASE_URL
      // etc. are set correctly in Cloudflare but invisible to process.env.
      compatibility_flags: ['nodejs_compat', 'nodejs_compat_populate_process_env'],
      // R2 bucket for product images uploaded from the admin panel. The
      // bucket itself has to be created once (see README-DEPLOY.md) —
      // this just wires the binding so the Worker can reach it.
      r2_buckets: [{ binding: 'PRODUCT_IMAGES', bucket_name: 'ebicollectibles-product-images' }],
      // Binds the real domain to this Worker so it serves ebicollectibles.com
      // directly, not just the workers.dev URL. Requires the zone to already
      // show "Active" in the Cloudflare dashboard (nameservers pointed at
      // Cloudflare) — otherwise the deploy step that provisions this route
      // fails.
      routes: [
        { pattern: 'ebicollectibles.com/*', custom_domain: true },
        { pattern: 'www.ebicollectibles.com/*', custom_domain: true },
      ],
    },
  },
})
