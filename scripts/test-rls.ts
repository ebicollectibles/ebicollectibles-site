// Throwaway diagnostic — NOT part of the app, delete once we know the
// answer. Empirically checks what actually happens when we connect using
// the Neon Data API's `authenticated` role's own connection string plus a
// real Clerk session JWT: which Postgres role Neon actually runs the
// query as, whether pg_session_jwt resolves auth.user_id() from a *plain*
// Clerk session token (no custom JWT template), and whether the grants
// from "Grant public schema access" actually let it read a real table.
// No RLS policies exist on any table yet, so this can't leak/restrict
// anything either way — it's purely informational.
//
// Usage:
//   AUTHENTICATED_DATABASE_URL="<connection string for the authenticated role>" \
//   TEST_CLERK_TOKEN="<a real Clerk session token>" \
//   npx tsx scripts/test-rls.ts
//
// Getting TEST_CLERK_TOKEN: sign in on the dev site in your browser, open
// the browser console (F12), and run:
//   await window.Clerk.session.getToken()
// Copy the string it returns (no quotes) as TEST_CLERK_TOKEN.
//
// Getting AUTHENTICATED_DATABASE_URL: Neon console -> dev-testing branch
// -> Roles -> click "authenticated" -> reveal/copy its connection string.
import { neon } from '@neondatabase/serverless'

const authenticatedUrl = process.env.AUTHENTICATED_DATABASE_URL
const clerkToken = process.env.TEST_CLERK_TOKEN

if (!authenticatedUrl || !clerkToken) {
  console.error('\nSet both AUTHENTICATED_DATABASE_URL and TEST_CLERK_TOKEN env vars — see the comment at the top of this file.\n')
  process.exit(1)
}

async function main() {
  const sql = neon(authenticatedUrl!, { authToken: clerkToken! })

  console.log('\n--- Which Postgres role is this actually running as? ---')
  try {
    console.log(await sql`select current_user, session_user`)
  } catch (err) {
    console.log('FAILED:', err instanceof Error ? err.message : err)
  }

  console.log('\n--- Does auth.user_id() resolve from a plain Clerk session token? ---')
  try {
    console.log(await sql`select auth.user_id() as clerk_user_id`)
  } catch (err) {
    console.log('FAILED:', err instanceof Error ? err.message : err)
  }

  console.log('\n--- Can it read a real table (users) at all? ---')
  try {
    console.log(await sql`select count(*) from users`)
  } catch (err) {
    console.log('FAILED:', err instanceof Error ? err.message : err)
  }
}

main()
