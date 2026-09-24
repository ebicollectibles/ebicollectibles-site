import { createFileRoute, redirect } from '@tanstack/react-router'
import { resolveShortLink } from '~/server/short-links'

// Branded shortlink redirect — see shortLinks in lib/db/schema.ts. An
// unknown slug just goes home rather than erroring, since the only way to
// land here with a bad slug is a mistyped/expired link someone else wrote.
export const Route = createFileRoute('/go/$slug')({
  loader: async ({ params }) => {
    const result = await resolveShortLink({ data: { slug: params.slug } })
    if (!result) throw redirect({ to: '/' })
    throw redirect({ href: result.url, statusCode: 302 })
  },
  component: () => null,
})
