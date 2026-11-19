import { describe, expect, it } from 'vitest'
import { CSP_REPORT_ONLY, handleCspReport, summarizeCspReport } from './csp'

describe('CSP policy string', () => {
  it('names the hosts checkout and sign-in depend on', () => {
    expect(CSP_REPORT_ONLY).toContain('https://web.squarecdn.com')
    expect(CSP_REPORT_ONLY).toContain('https://clerk.ebicollectibles.com')
    expect(CSP_REPORT_ONLY).toContain('report-uri /api/csp-report')
  })
  it('has no line breaks, which would be an invalid header value', () => {
    expect(CSP_REPORT_ONLY).not.toMatch(/[\r\n]/)
  })
})

describe('summarizeCspReport', () => {
  it('reads the legacy report shape and drops query strings', () => {
    const out = summarizeCspReport({
      'csp-report': {
        'document-uri': 'https://ebicollectibles.com/account/reset-password?token=secret',
        'effective-directive': 'script-src-elem',
        'blocked-uri': 'https://evil.example/x.js?id=1',
        'source-file': 'https://ebicollectibles.com/assets/app.js',
      },
    })
    expect(out).toEqual([
      { directive: 'script-src-elem', blocked: 'https://evil.example', page: '/account/reset-password', source: 'https://ebicollectibles.com' },
    ])
    expect(JSON.stringify(out)).not.toContain('secret')
  })

  it('reads the Reporting API shape', () => {
    const out = summarizeCspReport([
      { type: 'csp-violation', body: { documentURL: 'https://ebicollectibles.com/checkout', effectiveDirective: 'frame-src', blockedURL: 'https://pay.example/frame' } },
    ])
    expect(out).toEqual([{ directive: 'frame-src', blocked: 'https://pay.example', page: '/checkout', source: '' }])
  })

  it('keeps keyword values such as inline and eval', () => {
    const out = summarizeCspReport({ 'csp-report': { 'document-uri': 'https://ebicollectibles.com/', 'effective-directive': 'script-src', 'blocked-uri': 'eval' } })
    expect(out[0].blocked).toBe('eval')
  })

  it('ignores browser extensions and junk', () => {
    expect(summarizeCspReport({ 'csp-report': { 'effective-directive': 'script-src', 'blocked-uri': 'chrome-extension://abc/x.js' } })).toEqual([])
    expect(summarizeCspReport({ 'csp-report': { 'effective-directive': 'script-src', 'blocked-uri': 'inline', 'source-file': 'moz-extension://abc' } })).toEqual([])
    expect(summarizeCspReport(null)).toEqual([])
    expect(summarizeCspReport('text')).toEqual([])
    expect(summarizeCspReport({ 'csp-report': {} })).toEqual([])
  })
})

describe('handleCspReport', () => {
  it('answers 204 for valid, malformed and oversized bodies', async () => {
    const post = (body: string) => handleCspReport(new Request('https://ebicollectibles.com/api/csp-report', { method: 'POST', body }))
    expect((await post('{"csp-report":{}}')).status).toBe(204)
    expect((await post('not json')).status).toBe(204)
    expect((await post('x'.repeat(20000))).status).toBe(204)
  })
})
