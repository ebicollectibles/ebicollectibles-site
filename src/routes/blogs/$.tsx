import { createFileRoute, redirect } from '@tanstack/react-router'

// Old /blogs/news/<slug> links (the blog's previous home) and anything else
// under /blogs forward to the same post under /blog, or to the blog list.
export const Route = createFileRoute('/blogs/$')({
  loader: ({ params }) => {
    const rest = (params._splat ?? '')
      .replace(/^news\/?/, '')
      .replace(/\/+$/, '')
      // Release posts were renamed from "...-has-arrived" to "...-release-news".
      .replace(/-(has-arrived|have-arrived|arrive)$/, '-release-news')
    throw redirect({ href: rest ? `/blog/${rest}` : '/blog', statusCode: 301 })
  },
  component: () => null,
})
