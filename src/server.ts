import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'
import type { Register } from '@tanstack/react-router'
import type { RequestHandler } from '@tanstack/react-start/server'
import { handleSquareWebhook } from './server/square-webhook'

const startFetch = createStartHandler(defaultStreamHandler)

type ServerEntry = { fetch: RequestHandler<Register> }

// Square's refund webhook POSTs a raw signed JSON body directly to a fixed
// URL — it can't go through TanStack's createServerFn RPC mechanism, so it's
// intercepted here, ahead of the normal router-driven request handling.
const entry: ServerEntry = {
  async fetch(request, opts) {
    const url = new URL(request.url)
    if (request.method === 'POST' && url.pathname === '/api/webhooks/square') {
      return handleSquareWebhook(request)
    }
    return startFetch(request, opts)
  },
}

export default entry
