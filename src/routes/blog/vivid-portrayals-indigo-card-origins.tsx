import { createFileRoute } from '@tanstack/react-router'
import { BLOG_POSTS } from '~/data/blog-posts'
import { getBlogPostStatus } from '~/server/blog-status'
import { SwshOriginsPost, swshHead } from '~/components/blog/swsh/SwshPosts'
import { CS2B } from '~/data/swsh-blog/cs2b'

const post = BLOG_POSTS.find((p) => p.slug === 'vivid-portrayals-indigo-card-origins')!

export const Route = createFileRoute('/blog/vivid-portrayals-indigo-card-origins')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => swshHead(post, loaderData),
  component: Page,
})

function Page() {
  const status = Route.useLoaderData()
  return <SwshOriginsPost set={CS2B} post={post} status={status} />
}
