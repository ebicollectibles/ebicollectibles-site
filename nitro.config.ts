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
    },
  },
})
