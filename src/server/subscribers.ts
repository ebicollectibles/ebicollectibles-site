import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

// Db/schema import is dynamic (not top-level) — same reasoning as
// customer-auth.ts/admin-auth.ts: keeps the Postgres driver out of the
// client bundle even though this only ever runs inside the handler body.

export const subscribeToNewsletter = createServerFn({ method: 'POST' })
  .validator(z.object({ email: z.string().trim().email() }))
  .handler(async ({ data }) => {
    const { getDb } = await import('~/lib/db/client')
    const { subscribers } = await import('~/lib/db/schema')
    const db = getDb()

    await db
      .insert(subscribers)
      .values({ email: data.email.trim().toLowerCase(), source: 'homepage' })
      .onConflictDoNothing()

    return { ok: true }
  })
