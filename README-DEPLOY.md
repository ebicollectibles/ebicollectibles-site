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

Any Postgres works — self-hosted, [Neon](https://neon.tech), Supabase, RDS, etc.
Nothing here is Neon-specific.

- Schema lives in `src/lib/db/schema.ts` (products, orders, order_items,
  order_counters).
- `npm run db:generate` writes a new SQL migration into `drizzle/` whenever you
  change the schema.
- `npm run db:migrate` applies pending migrations to whatever `DATABASE_URL`
  points at.
- `npm run db:seed` (`scripts/seed.ts`) is idempotent — it upserts the initial
  13-product catalog by id. Safe to re-run.
- `npm run db:studio` opens Drizzle Studio (a local DB browser) against
  `DATABASE_URL`.

**On Cloudflare, we recommend fronting your Postgres with a
[Hyperdrive](https://developers.cloudflare.com/hyperdrive/) binding** rather than
connecting directly — Workers are highly concurrent and ephemeral, so without
pooling you can exhaust your database's connection limit under real traffic.
Direct `DATABASE_URL` connections work for low traffic / testing (Workers do
support outbound TCP with the `nodejs_compat` flag, which is already enabled
in `nitro.config.ts`), but treat that as a bridge, not the long-term setup.
Once you provision a Hyperdrive resource pointing at your Postgres instance,
wire it in and update `src/lib/db/client.ts` to read from it — this wasn't
wired up automatically since it requires your Cloudflare account/database to
exist first.

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
   ```
   `VITE_SQUARE_*` vars are compiled into the client bundle at build time
   instead (see Square section) — they're not secrets, so they're just
   regular env vars at build time (`.env` locally, repo/CI env in production
   builds).

3. **Continuous deploy via GitHub Actions** (`.github/workflows/deploy.yml`,
   already included) — pushes to `main` build and deploy automatically. Add
   two repository secrets under Settings → Secrets and variables → Actions:
   - `CLOUDFLARE_API_TOKEN` — create at
     https://dash.cloudflare.com/profile/api-tokens ("Edit Cloudflare
     Workers" template is sufficient)
   - `CLOUDFLARE_ACCOUNT_ID` — found on the right sidebar of any page in the
     Cloudflare dashboard

   This session has no GitHub account connected, so nothing has been pushed
   yet — connect GitHub and push this repo to enable it.

## Square

1. Create a [Square Developer](https://developer.squareup.com/apps) app, grab
   the **sandbox** Application ID, Access Token, and a Location ID first.
2. Server-side (private): set `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`,
   `SQUARE_ENVIRONMENT=sandbox` — via `.env` locally, `wrangler secret put` in
   production.
3. Client-side (public, safe to expose): set `VITE_SQUARE_APPLICATION_ID`,
   `VITE_SQUARE_LOCATION_ID`, `VITE_SQUARE_ENVIRONMENT=sandbox` — these get
   baked into the JS bundle at build time, so set them wherever you run
   `npm run build` (`.env` locally; as build-time env vars in CI/production).
4. Test with Square's [sandbox test card
   numbers](https://developer.squareup.com/docs/testing/sandbox#test-values).
5. When ready for real charges: create a production Square app, swap in
   production credentials, set `SQUARE_ENVIRONMENT=production` /
   `VITE_SQUARE_ENVIRONMENT=production` everywhere.

Until step 2–3 are done, checkout still fully works — orders are recorded in
the database with `payment_status: 'test'` and no card is charged (see the
note that renders on the checkout page and confirmation screen in that mode).

## Admin panel

`/admin` — single shared password (`ADMIN_PASSWORD`), no user accounts. Manage
products (create/edit/delete, including stock) and view orders. Session is a
signed, encrypted 7-day cookie (`SESSION_SECRET` must be ≥32 random
characters — `openssl rand -base64 32`).
