import { createFileRoute, redirect } from '@tanstack/react-router'
import { resolveShortLink } from '~/server/short-links'

// Old /blogs/news/<slug> links (the blog's previous home) and anything else
// under /blogs forward to the same post under /blog, or to the blog list.
//
// A single-segment /blogs/<slug> is first checked against the tracked short
// links (admin Links page), so a link shared on, say, Reddit can read as a
// blog address and still count its clicks and carry its UTM tags.
export const Route = createFileRoute('/blogs/$')({
  loader: async ({ params }) => {
    const splat = (params._splat ?? '').replace(/\/+$/, '')
    if (splat && !splat.includes('/') && splat !== 'news') {
      const link = await resolveShortLink({ data: { slug: splat } })
      if (link) throw redirect({ href: link.url, statusCode: 302 })
    }
    const rest = (params._splat ?? '')
      .replace(/^news\/?/, '')
      .replace(/\/+$/, '')
      // Release posts were renamed from "...-has-arrived" to "...-release-news".
      .replace(/-(has-arrived|have-arrived|arrive)$/, '-release-news')
    // The combined Black Bolt and White Flare release post was removed; send it to the blog list.
    if (rest === 'black-bolt-white-flare-release-news') throw redirect({ href: '/blog', statusCode: 301 })
    throw redirect({ href: rest ? `/blog/${rest}` : '/blog', statusCode: 301 })
  },
  component: () => null,
})
