# EBI Collectibles — deployment guide

Stack: TanStack Start (React, SSR) → Cloudflare Workers, Postgres (via `postgres.js` +
Drizzle ORM), Square for payments.

## Local development

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET
npm run db:generate        # only needed after changing src/lib/db/schema.ts
npm run db:migrate         # applies drizzle/*.sql to DATABASE_URL
npm run db:seed            # loads the starting 13-product catalog
npm run dev                 # http://localhost:3000
```

Admin panel: `http://localhost:3000/admin` (password = `ADMIN_PASSWORD`).

Square is optional locally — with `SQUARE_ACCESS_TOKEN`/`VITE_SQUARE_APPLICATION_ID`
unset, checkout still works end-to-end but records orders as `payment_status: 'test'`
without charging a card. See "Square" below to go live.

## Database

Production runs on [Neon](https://neon.tech) (serverless Postgres). Two
different drivers are in play, deliberately:

- **`src/lib/db/client.ts`** (product reads, admin CRUD) uses
  `@neondatabase/serverless`'s HTTP driver — each query is a stateless HTTPS
  request. This is required on Cloudflare Workers: a cached raw TCP
  connection (the original `postgres.js` setup) caused intermittent "works
  on retry" failures, because Workers must not reuse a socket across
  separate requests. The HTTP driver has no persistent socket to go stale.
- **`src/lib/db/transactional-client.ts`** (`withTransaction`, used only by
  order placement) opens a scoped Neon `Pool` (WebSocket-based) for that one
  request, runs a real multi-statement transaction (atomic stock decrement +
  order + order_items insert), and closes it — the HTTP driver can't do
  transactions at all.
- **Local tooling** (`drizzle.config.ts`, `scripts/seed.ts` — migrate/seed,
  run from your machine, not inside a Worker) uses the plain `postgres`
  package over a normal connection, which works with any Postgres.

If you ever move off Neon, `client.ts` and `transactional-client.ts` need to
change (e.g. to `postgres.js` + a [Hyperdrive](https://developers.cloudflare.com/hyperdrive/)
binding for connection pooling on Workers) — the local tooling doesn't.

- Schema lives in `src/lib/db/schema.ts` (products, orders, order_items,
  order_counters).
- `npm run db:generate` writes a new SQL migration into `drizzle/` whenever you
  change the schema.
- **`npm run db:migrate:dev`** and **`npm run db:migrate:prod`** are the
  commands to actually run — each reads its own local, git-ignored file
  (`.env.dev` or `.env.prod`, project root, next to `package.json`) so which
  database gets migrated is never ambiguous or dependent on some `DATABASE_URL`
  left over in your terminal from earlier. Create each file once, containing
  just one line:
  ```
  DATABASE_URL=postgres://...
  ```
  `db:migrate:prod` also prints the target host and requires typing `yes` to
  continue, since a wrong-target migration against production is much harder
  to walk back than against dev. (The bare `npm run db:migrate` still exists,
  reading whatever `DATABASE_URL` is currently set — used by CI/scripts, not
  something to run by hand.)
- **Before migrating, always `git pull origin main` first** — `git status`
  only compares against your locally cached copy of `origin/main` from your
  last fetch, not the live GitHub state, so it can say "up to date" even when
  it isn't. Migrating from a stale checkout means `drizzle-kit` doesn't know
  about migrations that were added after your last pull and silently skips
  them while still printing "applied successfully" (there was just nothing
  *it* knew to apply). Confirm you're current with
  `git fetch origin main && git log -1 --oneline` before migrating.
- `npm run db:seed` (`scripts/seed.ts`) is idempotent — it upserts the initial
  13-product catalog by id. Safe to re-run.
- `npm run db:studio` opens Drizzle Studio (a local DB browser) against
  `DATABASE_URL`.

**Important**: `nitro.config.ts` pins `cloudflare.wrangler.compatibility_flags` to
include `nodejs_compat_populate_process_env` — plain `nodejs_compat` does *not*
populate `process.env` from Cloudflare vars/secrets on its own. Without this
flag, `wrangler secret put DATABASE_URL` genuinely sets the secret (verifiable
with `wrangler secret list`) but the app sees `process.env.DATABASE_URL` as
undefined anyway. Don't remove this flag.

`nitro.config.ts` also pins `cloudflare.wrangler.name` and `.account_id`
explicitly — without them, Nitro auto-generates the Worker name per build
(from git remote context), which can differ between your machine and CI and
silently split traffic/secrets across two different Workers.

## Cloudflare Workers deploy

1. **Create the Worker once:**
   ```bash
   npx wrangler login
   npm run build
   cd .output/server && npx wrangler deploy
   ```
   This uses the `nitro.config.ts` → `cloudflare_module` preset, which
   generates `.output/server/wrangler.json` on every build.

2. **Set production secrets** (one-time, persists on Cloudflare — never put
   these in the repo or in GitHub Actions):
   ```bash
   cd .output/server
   npx wrangler secret put DATABASE_URL
   npx wrangler secret put ADMIN_PASSWORD
   npx wrangler secret put SESSION_SECRET
   npx wrangler secret put SQUARE_ACCESS_TOKEN
   npx wrangler secret put SQUARE_LOCATION_ID
   npx wrangler secret put SQUARE_ENVIRONMENT   # "sandbox" or "production" — defaults to sandbox if unset
   ```
   `VITE_SQUARE_*` vars are compiled into the client bundle at build time
   instead (see Square section below) — they're not secrets, so they're just
   regular env vars at build time, supplied by the GitHub Actions workflow
   from repository *variables* (not secrets — see step 3).

   Verify what's actually set (names only, not values) with:
   ```bash
   npx wrangler secret list
   ```

3. **Continuous deploy via GitHub Actions** (`.github/workflows/deploy.yml`,
   already included) — pushes to `main` build and deploy automatically. Add
   two repository *secrets* under Settings → Secrets and variables → Actions
   → Secrets:
   - `CLOUDFLARE_API_TOKEN` — create at
     https://dash.cloudflare.com/profile/api-tokens ("Edit Cloudflare
     Workers" template is sufficient)
   - `CLOUDFLARE_ACCOUNT_ID` — found on the right sidebar of any page in the
     Cloudflare dashboard

   Live at github.com/ebicollectibles/ebicollectibles-site — pushes to `main`
   already auto-deploy.

## Square

The integration is already fully built (`src/server/square.ts`,
`src/components/SquareCardField.tsx`) and gracefully runs in **test mode**
— orders are recorded, no card is charged — whenever the credentials below
aren't set. Going live is a config-only change, no code changes needed:

1. Create a [Square Developer](https://developer.squareup.com/apps) app, grab
   the **sandbox** Application ID, Access Token, and a Location ID first —
   test the whole flow end to end in sandbox before touching production.
2. Server-side (private, Cloudflare Worker secrets — never in the repo or in
   GitHub Actions): `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`,
   `SQUARE_ENVIRONMENT` (`sandbox` or `production`). Set with
   `npx wrangler secret put <NAME>` from `.output/server` (see step 2 above)
   — takes effect immediately, no redeploy needed.
3. Client-side (public, safe to expose — same idea as a Stripe publishable
   key): `VITE_SQUARE_APPLICATION_ID`, `VITE_SQUARE_LOCATION_ID`,
   `VITE_SQUARE_ENVIRONMENT`. These get baked into the JS bundle at *build*
   time, so they belong in GitHub Actions repository **variables** (Settings
   → Secrets and variables → Actions → **Variables** tab, not Secrets) —
   `.github/workflows/deploy.yml` already passes them through to
   `npm run build` automatically. Setting these requires a new deploy (the
   next push, or re-run the workflow) to actually take effect, unlike the
   server secrets in step 2. Locally, use `.env` instead.
4. Test with Square's [sandbox test card
   numbers](https://developer.squareup.com/docs/testing/sandbox#test-values).
5. When ready for real charges: create a production Square app, swap in
   production credentials, set `SQUARE_ENVIRONMENT=production` (Worker
   secret) and `VITE_SQUARE_ENVIRONMENT=production` (GitHub Actions
   variable) — then redeploy.

Until step 2–3 are done, checkout still fully works — orders are recorded in
the database with `payment_status: 'test'` and no card is charged (see the
note that renders on the checkout page and confirmation screen in that mode).

## Dev site (sandbox Square, isolated database)

A second, separate Cloudflare Worker for testing the full checkout flow
(including real stock decrement) with zero cost and zero risk to production
— fake Square cards, and its own database so test orders never touch real
customer data. `nitro.config.ts` already supports this (an `isDev` branch
gated on `DEPLOY_TARGET=dev`, which every normal build leaves unset), and
`.github/workflows/deploy-dev.yml` already exists as a manual-only workflow.
One-time setup:

1. **Create a separate database.** Easiest option: in the
   [Neon console](https://console.neon.tech), open the project backing
   production and create a **branch** (a full copy-on-write copy, isolated
   from production writes). Copy its connection string.
2. **Create a Square Sandbox app** (or reuse the Sandbox tab of the existing
   app) at the [Square Developer Dashboard](https://developer.squareup.com/apps)
   — grab the Sandbox Application ID, Access Token, and Location ID. These
   are separate from the production credentials and free to use.
3. **Add two GitHub Actions repository *variables*** (Settings → Secrets and
   variables → Actions → Variables): `VITE_SQUARE_APPLICATION_ID_DEV` and
   `VITE_SQUARE_LOCATION_ID_DEV`, set to the Sandbox values from step 2.
   (`VITE_SQUARE_ENVIRONMENT` is hardcoded to `sandbox` in the workflow —
   there's no variable for it, so this can't accidentally point at
   production.)
4. **Set the dev Worker's secrets** — same idea as the production Worker,
   but targeting the dev Worker by name and using the sandbox/dev values
   from steps 1–2:
   ```bash
   npm run build   # the --name flag below overrides whichever Worker name gets built
   cd .output/server
   npx wrangler secret put DATABASE_URL --name ebicollectibles-ebicollectibles-site-dev   # the Neon branch from step 1
   npx wrangler secret put ADMIN_PASSWORD --name ebicollectibles-ebicollectibles-site-dev
   npx wrangler secret put SESSION_SECRET --name ebicollectibles-ebicollectibles-site-dev
   npx wrangler secret put SQUARE_ACCESS_TOKEN --name ebicollectibles-ebicollectibles-site-dev   # Sandbox token from step 2
   npx wrangler secret put SQUARE_LOCATION_ID --name ebicollectibles-ebicollectibles-site-dev     # Sandbox location from step 2
   npx wrangler secret put SQUARE_ENVIRONMENT --name ebicollectibles-ebicollectibles-site-dev      # sandbox
   ```
   Resend/Google OAuth secrets can be left unset on the dev Worker — email
   sending and Google sign-in just no-op/stay disabled, nothing else breaks.
5. **Run migrations against the new database** so its schema matches. Create
   `.env.dev` once (project root, git-ignored) containing just
   `DATABASE_URL=<the Neon branch connection string from step 1>`, then:
   ```bash
   npm run db:migrate:dev
   ```
   Optionally `npm run db:seed` too, if you want sample products to test
   with instead of copying real ones over.
6. **Deploy it**: GitHub repo → Actions tab → "Deploy dev site (sandbox
   Square)" → Run workflow. It never fires automatically (manual-only), so
   it can't be triggered by an ordinary push to `main`.
7. **Find the URL**: Cloudflare dashboard → Workers & Pages →
   `ebicollectibles-ebicollectibles-site-dev` → its `*.workers.dev` URL. No
   custom domain is attached, so it's only reachable there.

From then on, test with [Square's Sandbox test card
numbers](https://developer.squareup.com/docs/testing/sandbox#test-values) —
nothing is ever charged, and stock decrements only in the dev database /
Sandbox Square inventory, never in production. Re-run the same "Deploy dev
site" workflow after future code changes to pick them up; secrets only need
setting once and persist across deploys.

Note: the dev Worker shares production's R2 image bucket (product photos
aren't sensitive and aren't worth a second bucket), so an image uploaded via
the dev admin panel does land in the same bucket production uses.

## Order confirmation emails (Resend)

Already fully built (`src/server/email.ts`) and best-effort — if unset, orders
place and pay just fine, they simply skip sending a confirmation email.

1. Sign up at [resend.com](https://resend.com) (free tier: 3,000 emails/month).
2. Add your sending domain in the Resend dashboard. It will give you a
   handful of DNS records (SPF + DKIM, both TXT records) — add those with
   whoever hosts your domain's DNS, then wait for Resend to show the domain
   as verified (usually a few minutes to a few hours).
3. Create an API key in Resend, then set as Worker secrets (never in the
   repo): `RESEND_API_KEY` and `ORDER_FROM_EMAIL` (e.g.
   `EBI Collectibles <orders@yourdomain.com>` — must be on the verified
   domain from step 2). Set with `npx wrangler secret put <NAME>` — takes
   effect immediately, no redeploy needed.

Until both are set, checkout is unaffected — the email send is skipped
silently (logged, not thrown) and the order still completes normally.

## Customer accounts

Email/password and "Continue with Google" sign-in for customers
(`src/server/customers.ts`, `src/server/google-auth.ts`) — an account page at
`/account` shows order history, including past guest orders placed under the
same email (linked automatically the moment an account is created).

**Note**: this build does not send a "verify your email" link — an account is
usable immediately on signup, including claiming past guest orders by email
match alone. Fine for a small store; add email verification (reusing the
Resend integration above) later if that matters more as the store grows.

Password accounts need nothing beyond what's already set (`SESSION_SECRET`).
Google sign-in is optional — the "Continue with Google" button simply
doesn't work (clear error message) until these are set:

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
   create an OAuth Client ID (type: **Web application**).
2. Add **Authorized redirect URIs** for every environment you'll use:
   `http://localhost:3000/auth/google/callback` for local dev, and your
   production URL, e.g. `https://ebicollectibles.com/auth/google/callback`.
3. Set as Worker secrets: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
   `GOOGLE_REDIRECT_URI` (must exactly match one of the URIs from step 2 —
   use the production one for the deployed Worker). `npx wrangler secret put
   <NAME>` — takes effect immediately, no redeploy needed.

Accounts are matched/linked by email: if someone signs up with a
password using the same email as an existing Google-only account (or vice
versa), Google sign-in only auto-links because Google verifies the email
itself — this is what makes it safe to trust without our own verification
step.

## Product image uploads (R2)

The admin panel's "Upload" buttons store images in a Cloudflare R2 bucket.
One-time setup:

```bash
npx wrangler r2 bucket create ebicollectibles-product-images
npx wrangler r2 bucket dev-url enable ebicollectibles-product-images
```

The second command prints a public URL like `https://pub-xxxxxxxx.r2.dev` —
set it as a secret (same pattern as the others above, from `.output/server`):

```bash
npx wrangler secret put PRODUCT_IMAGES_PUBLIC_URL
```

`nitro.config.ts` already wires the `PRODUCT_IMAGES` binding to that bucket
(`cloudflare.wrangler.r2_buckets`) — nothing else to configure. If the bucket
doesn't exist yet, deploys still succeed for everything except the Worker
step, which fails until the bucket is created; the site keeps running on the
previous deploy in the meantime. Until both steps above are done, the
"Upload" buttons show a clear error instead of a silent failure — pasting an
image URL directly still works either way.

## Google Analytics

Already fully wired (`__root.tsx` loads gtag.js; `src/lib/analytics.ts` fires
events) — just needs the measurement ID:

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
   (Admin → Create Account → Create Property → Web data stream) and grab its
   **Measurement ID** (`G-XXXXXXXXXX`).
2. Same story as the Square `VITE_*` vars above — not secret, baked into the
   client bundle at build time, so set it as a GitHub Actions repository
   **variable** (Settings → Secrets and variables → Actions → **Variables**
   tab): `VITE_GA_MEASUREMENT_ID`. Takes effect on the next deploy. Leave it
   unset locally (`.env`) so dev traffic doesn't pollute real analytics —
   `/admin` is also excluded regardless of environment, since that's the
   operator's own traffic, not a visitor's.
3. Beyond page views, ecommerce events already fire automatically:
   `view_item` (product page), `add_to_cart`, `begin_checkout` (landing on
   `/checkout` with items in the cart), and `purchase` (a completed order,
   with the real order total/tax/items) — shows up under GA4's Monetization
   reports once there's traffic.

## Admin panel

`/admin` — single shared password (`ADMIN_PASSWORD`), no user accounts. Manage
products (create/edit/delete, including stock) and view orders. Session is a
signed, encrypted 7-day cookie (`SESSION_SECRET` must be ≥32 random
characters — `openssl rand -base64 32`).
