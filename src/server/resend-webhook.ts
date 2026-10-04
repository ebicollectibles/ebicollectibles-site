// Handles Resend's delivery webhook (delivered/opened/clicked/bounced/
// complained). Invoked directly from the custom server entry
// (src/server.ts), same reasoning as square-webhook.ts: Resend POSTs a raw
// signed JSON body directly to this URL, not through TanStack's client RPC
// call format. DB/schema imports are dynamic for the same reason listed
// there (see customer-auth.ts for the full explanation).

// Resend signs webhooks the Svix way: secret is "whsec_<base64>", and the
// signed content is "<svix-id>.<svix-timestamp>.<raw body>" HMAC-SHA256'd
// with the base64-decoded secret. svix-signature can carry multiple
// space-separated "v1,<base64 sig>" candidates — any match is valid.
function base64ToBytes(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
}

async function verifyResendSignature(rawBody: string, svixId: string | null, svixTimestamp: string | null, svixSignature: string | null): Promise<boolean> {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret || !svixId || !svixTimestamp || !svixSignature) return false

  let secretBytes: Uint8Array
  try {
    secretBytes = base64ToBytes(secret.startsWith('whsec_') ? secret.slice('whsec_'.length) : secret)
  } catch {
    return false
  }

  const key = await crypto.subtle.importKey('raw', secretBytes as BufferSource, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
  const signedContent = new TextEncoder().encode(`${svixId}.${svixTimestamp}.${rawBody}`)

  // Each candidate is "v1,<base64 sig>" — crypto.subtle.verify does the
  // actual comparison (constant-time), same reasoning as square-webhook.ts.
  for (const candidate of svixSignature.split(' ')) {
    const b64Sig = candidate.split(',')[1]
    if (!b64Sig) continue
    let sigBytes: Uint8Array
    try {
      sigBytes = base64ToBytes(b64Sig)
    } catch {
      continue
    }
    if (await crypto.subtle.verify('HMAC', key, sigBytes as BufferSource, signedContent)) return true
  }
  return false
}

// Which email_events summary column each Resend event type updates — see
// the comment on email_events in lib/db/schema.ts. Events not listed here
// (e.g. 'email.sent', 'email.delivery_delayed') still get logged to
// email_delivery_events but don't move a summary column.
const SUMMARY_COLUMN: Record<string, 'deliveredAt' | 'openedAt' | 'clickedAt' | 'bouncedAt' | 'complainedAt'> = {
  'email.delivered': 'deliveredAt',
  'email.opened': 'openedAt',
  'email.clicked': 'clickedAt',
  'email.bounced': 'bouncedAt',
  'email.complained': 'complainedAt',
}

export async function handleResendWebhook(request: Request): Promise<Response> {
  const rawBody = await request.text()
  const valid = await verifyResendSignature(
    rawBody,
    request.headers.get('svix-id'),
    request.headers.get('svix-timestamp'),
    request.headers.get('svix-signature'),
  )
  if (!valid) {
    return new Response('Invalid signature', { status: 401 })
  }

  let event: any
  try {
    event = JSON.parse(rawBody)
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const type = event?.type as string | undefined
  const resendId = event?.data?.email_id as string | undefined
  if (!type || !resendId) return new Response('ok', { status: 200 })

  const { getDb } = await import('~/lib/db/client')
  const { emailEvents, emailDeliveryEvents } = await import('~/lib/db/schema')
  const { eq } = await import('drizzle-orm')
  const db = getDb()

  const [existing] = await db.select({ id: emailEvents.id }).from(emailEvents).where(eq(emailEvents.resendId, resendId)).limit(1)
  // No matching send on file (tracking added after this email went out, or
  // Resend retrying after we already 200'd a prior delivery of the same
  // event) — nothing to attach this to, so just acknowledge.
  if (!existing) return new Response('ok', { status: 200 })

  await db.insert(emailDeliveryEvents).values({ emailEventId: existing.id, resendId, type })

  const column = SUMMARY_COLUMN[type]
  if (column) {
    await db.update(emailEvents).set({ [column]: new Date() }).where(eq(emailEvents.id, existing.id))
  }

  return new Response('ok', { status: 200 })
}
