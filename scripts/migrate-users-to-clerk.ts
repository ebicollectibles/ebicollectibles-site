// One-off migration: creates a Clerk account for every existing users row
// that doesn't have one yet (clerkUserId is null), so real customers land
// in Clerk instead of getting stuck on the old email+password system once
// it's retired. Per the deliberate decision made for this migration: no
// password is carried over — each migrated account has none set, so their
// first sign-in goes through Clerk's own "forgot password" flow. A Google
// signup account is unaffected by this: Clerk auto-links a Google sign-in
// to the matching verified email regardless of whether a password exists,
// so those customers just click "Continue with Google" as always.
//
// Same target/env-file convention as migrate-target.mjs: run against dev
// first with `npm run migrate-users:clerk dev`, and only run against prod
// once the dev run has been checked over. Requires .env.<target> to carry
// BOTH DATABASE_URL and CLERK_SECRET_KEY (dev keys for dev, a real
// production Clerk instance's secret key for prod — that instance doesn't
// exist yet as of writing this, see task #29).
//
// Defaults to a dry run (prints what it would do, touches nothing). Pass
// --commit to actually create accounts, which then requires typing
// "migrate" to confirm before anything happens — this creates real,
// externally-visible Clerk accounts and can't be cleanly undone the way a
// schema migration can, so it gets its own explicit confirmation on top of
// migrate-target.mjs's prod-only one.
import { config } from 'dotenv'
import { existsSync } from 'node:fs'
import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { drizzle } from 'drizzle-orm/postgres-js'
import { eq, isNull } from 'drizzle-orm'
import postgres from 'postgres'
import { createClerkClient } from '@clerk/backend'
import { users } from '../src/lib/db/schema'

const target = process.argv[2] // 'dev' or 'prod'
const commit = process.argv.includes('--commit')

if (target !== 'dev' && target !== 'prod') {
  console.error('\nUsage: npm run migrate-users:clerk <dev|prod> [--commit]\n')
  process.exit(1)
}

const envFile = `.env.${target}`
if (!existsSync(envFile)) {
  console.error(
    `\n${envFile} not found.\n\n` +
      `Create it once (project root, next to package.json) with the ${target.toUpperCase()} database's\n` +
      `connection string AND that target's Clerk secret key:\n\n` +
      `  DATABASE_URL=postgres://...\n` +
      `  CLERK_SECRET_KEY=sk_...\n\n` +
      `Git-ignored — never committed or pushed.\n`,
  )
  process.exit(1)
}

// override: true for the same reason as migrate-target.mjs — never silently
// fall back to whatever's already in the shell's env.
config({ path: envFile, override: true })

if (!process.env.DATABASE_URL) {
  console.error(`${envFile} exists but has no DATABASE_URL line in it.`)
  process.exit(1)
}
if (!process.env.CLERK_SECRET_KEY) {
  console.error(`${envFile} exists but has no CLERK_SECRET_KEY line in it.`)
  process.exit(1)
}

async function main() {
  const host = new URL(process.env.DATABASE_URL!).host
  const sql = postgres(process.env.DATABASE_URL!, { max: 1 })
  const db = drizzle(sql)
  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! })

  const rows = await db.select().from(users).where(isNull(users.clerkUserId))

  console.log(`\nTarget: ${target.toUpperCase()} — ${host}`)
  console.log(`${rows.length} user(s) without a clerkUserId.\n`)

  if (rows.length === 0) {
    await sql.end()
    return
  }

  if (!commit) {
    console.log('DRY RUN — nothing will be created. Re-run with --commit to actually migrate.\n')
    for (const row of rows) console.log(`  would create: ${row.email}`)
    await sql.end()
    return
  }

  if (target === 'prod') {
    console.log('⚠️  This will create REAL Clerk accounts for real customers.')
  }
  const rl = readline.createInterface({ input: stdin, output: stdout })
  const answer = await rl.question(`Type "migrate" to create ${rows.length} Clerk account(s) against ${target.toUpperCase()}: `)
  rl.close()
  if (answer.trim() !== 'migrate') {
    console.log('Aborted — nothing was created.')
    await sql.end()
    return
  }

  let created = 0
  let linked = 0
  let failed = 0

  for (const row of rows) {
    process.stdout.write(`${row.email} ... `)
    try {
      const clerkUser = await clerk.users.createUser({
        emailAddress: [row.email],
        firstName: row.name ?? undefined,
        // No password field — deliberately not carrying old passwords
        // over. skipPasswordRequirement lets the account exist without
        // one; Clerk's own "forgot password" flow (or Google sign-in,
        // for accounts that used it) is how they get in the first time.
        skipPasswordRequirement: true,
        // Our own id, for tracing a Clerk account back to its source row
        // if anything needs auditing later.
        externalId: row.id,
      })
      await db.update(users).set({ clerkUserId: clerkUser.id }).where(eq(users.id, row.id))
      created++
      console.log(`created ${clerkUser.id}`)
    } catch (err) {
      // Email already exists in Clerk — e.g. the script partially ran
      // before (already-migrated rows are skipped above, but a crash
      // mid-write could leave one created in Clerk without clerkUserId
      // saved back), or the person already signed up directly. Link to
      // that existing Clerk account instead of failing outright.
      const message = err instanceof Error ? err.message : String(err)
      const isDuplicate = /already exists|is taken|identifier_exists/i.test(message)
      let handled = false
      if (isDuplicate) {
        try {
          const existing = await clerk.users.getUserList({ emailAddress: [row.email] })
          const match = existing.data[0]
          if (match) {
            await db.update(users).set({ clerkUserId: match.id }).where(eq(users.id, row.id))
            linked++
            console.log(`linked to existing ${match.id}`)
            handled = true
          }
        } catch {
          // Fall through to the failure branch below.
        }
      }
      if (!handled) {
        failed++
        console.log(`FAILED — ${message}`)
      }
    }
    // Cheap pacing insurance, well under Clerk's per-instance rate limit —
    // not required at this volume, just costs nothing to include.
    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  console.log(`\nDone. Created ${created}, linked ${linked} existing, failed ${failed}, out of ${rows.length}.`)
  await sql.end()
}

main()
