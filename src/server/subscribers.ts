import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

// Db/schema import is dynamic (not top-level) — same reasoning as
// customer-auth.ts/admin-auth.ts: keeps the Postgres driver out of the
// client bundle even though this only ever runs inside the handler body.

// Upserts a subscriber and logs a 'subscribed' event, but ONLY when this
// email actually transitions to subscribed — either it's brand new, or it
// was previously unsubscribed (a real resubscribe). If it's already
// currently subscribed, this is a silent no-op: no row change, no event,
// so submitting the form twice never looks like re-subscribing.
//
// Single atomic upsert (setWhere guards the conflict-update), safe even on
// the non-transactional neon-http driver — no separate select-then-branch
// needed, so no race between concurrent submissions either.
export async function upsertSubscriber(
  db: { insert: (table: any) => any },
  email: string,
  source: string,
): Promise<void> {
  const { subscribers, subscriberEvents } = await import('~/lib/db/schema')
  const { sql } = await import('drizzle-orm')

  const [row] = await db
    .insert(subscribers)
    .values({ email, source })
    .onConflictDoUpdate({
      target: subscribers.email,
      set: { source, subscribedAt: sql`now()`, unsubscribedAt: null },
      setWhere: sql`${subscribers.unsubscribedAt} is not null`,
    })
    .returning({ id: subscribers.id })

  if (row) {
    await db.insert(subscriberEvents).values({ email, type: 'subscribed', source })
  }
}

export const subscribeToNewsletter = createServerFn({ method: 'POST' })
  .validator(z.object({ email: z.string().trim().email() }))
  .handler(async ({ data }) => {
    const { getDb } = await import('~/lib/db/client')
    const db = getDb()
    await upsertSubscriber(db, data.email.trim().toLowerCase(), 'homepage')
    return { ok: true }
  })
