import { createFileRoute, redirect } from '@tanstack/react-router'

// /go/ is the old prefix, kept only so links already posted somewhere
// (Discord, etc.) don't break — forwards straight to the real /links/$slug
// route, which does the actual resolving. New links should always be
// generated as /links/$slug (see admin/links.tsx); nothing should ever
// point here on purpose anymore.
export const Route = createFileRoute('/go/$slug')({
  loader: ({ params }) => {
    throw redirect({ to: '/links/$slug', params: { slug: params.slug } })
  },
  component: () => null,
})
