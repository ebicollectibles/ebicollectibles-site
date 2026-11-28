import { createFileRoute } from '@tanstack/react-router'
import { BLOG_POSTS } from '~/data/blog-posts'
import { getBlogPostStatus } from '~/server/blog-status'
import { SwshOriginsPost, swshHead } from '~/components/blog/swsh/SwshPosts'
import { CS1B } from '~/data/swsh-blog/cs1b'

const post = BLOG_POSTS.find((p) => p.slug === 'dynamax-clash-flame-card-origins')!

export const Route = createFileRoute('/blog/dynamax-clash-flame-card-origins')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => swshHead(post, loaderData),
  component: Page,
})

function Page() {
  const status = Route.useLoaderData()
  return <SwshOriginsPost set={CS1B} post={post} status={status} />
}
