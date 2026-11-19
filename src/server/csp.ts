// Content-Security-Policy, currently in REPORT-ONLY mode: browsers log what
// this policy would have blocked and send a report to /api/csp-report, but
// block nothing. It cannot break the site in this mode. The point of this
// stage is to learn, from real visits (including the card form, Apple Pay
// and sign-in, which can't be exercised from outside), every outside host
// the site legitimately uses before the policy is ever enforced.
//
// Hosts below come from two places: what the live pages were observed
// loading, and what Square and Clerk document for their hosted pieces.
// Anything missing shows up as a report, which is how the list gets
// finished.
const R2_IMAGES = 'https://pub-3542440da5494e0aab4dd505a4e0a36a.r2.dev'
const CLERK = 'https://clerk.ebicollectibles.com'
const SQUARE_CDN = 'https://web.squarecdn.com https://sandbox.web.squarecdn.com'

const DIRECTIVES: Array<[string, string]> = [
  ['default-src', "'self'"],
  // 'unsafe-inline' is needed for now: the framework writes its page data
  // as inline scripts, and Google Analytics' consent setup is inline too.
  // Replacing it with per-request nonces is the follow-up that makes this
  // policy stop injected inline scripts as well.
  [
    'script-src',
    `'self' 'unsafe-inline' ${CLERK} https://challenges.cloudflare.com ${SQUARE_CDN} https://js.squareup.com https://www.googletagmanager.com https://static.cloudflareinsights.com https://applepay.cdn-apple.com https://pay.google.com`,
  ],
  // Inline style attributes are used throughout the components.
  ['style-src', `'self' 'unsafe-inline' ${SQUARE_CDN}`],
  [
    'img-src',
    `'self' data: blob: ${R2_IMAGES} https://img.clerk.com https://www.googletagmanager.com https://*.google-analytics.com ${SQUARE_CDN}`,
  ],
  ['font-src', "'self' data: https://square-fonts-production-f.squarecdn.com https://d1g145x70srn7h.cloudfront.net"],
  [
    'connect-src',
    `'self' ${CLERK} https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://cloudflareinsights.com https://pci-connect.squareup.com https://pci-connect.squareupsandbox.com https://connect.squareup.com https://connect.squareupsandbox.com`,
  ],
  ['frame-src', `${SQUARE_CDN} https://challenges.cloudflare.com https://pay.google.com`],
  // Clerk runs a worker from a blob: URL.
  ['worker-src', "'self' blob:"],
  ['object-src', "'none'"],
  ['base-uri', "'self'"],
  ['form-action', "'self'"],
  ['frame-ancestors', "'none'"],
  ['report-uri', '/api/csp-report'],
]

export const CSP_REPORT_ONLY = DIRECTIVES.map(([name, value]) => `${name} ${value}`).join('; ')

export const CSP_REPORT_PATH = '/api/csp-report'

// Largest report body read. Real reports are well under 2 KB; anything
// bigger is not a browser report and is dropped unread.
const MAX_REPORT_BYTES = 8192

export type CspReportSummary = {
  directive: string
  blocked: string
  page: string
  source: string
}

const clip = (value: unknown, max = 200) => (typeof value === 'string' ? value.slice(0, max) : '')

// Path only, no query string: report URLs can carry things like a reset
// token or an order reference, and those have no business in a log line.
function pathOnly(value: unknown): string {
  const raw = clip(value, 500)
  if (!raw) return ''
  try {
    return new URL(raw).pathname.slice(0, 120)
  } catch {
    return raw.split('?')[0].slice(0, 120)
  }
}

// Same idea for the blocked resource: keep the host, drop the rest.
function originOnly(value: unknown): string {
  const raw = clip(value, 500)
  if (!raw) return ''
  try {
    const url = new URL(raw)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.origin : url.protocol
  } catch {
    return raw.slice(0, 60)
  }
}

// Browser extensions inject their own scripts and styles into every page
// and trip the policy constantly. They say nothing about this site.
const EXTENSION = /^(chrome|moz|safari|safari-web|ms-browser)-extension:/i

// Accepts both report shapes browsers send: the older {"csp-report": {...}}
// and the newer Reporting API array of {type: "csp-violation", body: {...}}.
export function summarizeCspReport(payload: unknown): CspReportSummary[] {
  const bodies: Array<Record<string, unknown>> = []
  if (Array.isArray(payload)) {
    for (const entry of payload.slice(0, 10)) {
      if (entry && typeof entry === 'object' && (entry as any).body && typeof (entry as any).body === 'object') {
        bodies.push((entry as any).body)
      }
    }
  } else if (payload && typeof payload === 'object') {
    const legacy = (payload as any)['csp-report']
    if (legacy && typeof legacy === 'object') bodies.push(legacy)
  }

  const out: CspReportSummary[] = []
  for (const body of bodies) {
    const blockedRaw = clip(body['blocked-uri'] ?? body.blockedURL, 500)
    const sourceRaw = clip(body['source-file'] ?? body.sourceFile, 500)
    if (EXTENSION.test(blockedRaw) || EXTENSION.test(sourceRaw)) continue
    const directive = clip(body['effective-directive'] ?? body.effectiveDirective ?? body['violated-directive'], 60)
    if (!directive) continue
    out.push({
      directive,
      blocked: originOnly(blockedRaw),
      page: pathOnly(body['document-uri'] ?? body.documentURL),
      source: originOnly(sourceRaw),
    })
  }
  return out
}

// Public and unauthenticated by necessity (browsers post here on their
// own), so it does as little as possible: bounded read, no database, no
// echo of the input. Each report becomes one short log line.
export async function handleCspReport(request: Request): Promise<Response> {
  const done = new Response(null, { status: 204 })
  const declared = Number(request.headers.get('content-length') ?? '0')
  if (declared > MAX_REPORT_BYTES) return done
  try {
    const text = await request.text()
    if (text.length > MAX_REPORT_BYTES) return done
    for (const summary of summarizeCspReport(JSON.parse(text))) {
      console.warn('csp-report ' + JSON.stringify(summary))
    }
  } catch {
    // Malformed body: nothing to learn from it.
  }
  return done
}
