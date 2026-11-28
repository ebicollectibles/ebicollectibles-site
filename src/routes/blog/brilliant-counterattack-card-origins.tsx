import { createFileRoute } from '@tanstack/react-router'
import { BLOG_POSTS } from '~/data/blog-posts'
import { getBlogPostStatus } from '~/server/blog-status'
import { SwshOriginsPost, swshHead } from '~/components/blog/swsh/SwshPosts'
import { CS2_5 } from '~/data/swsh-blog/cs2-5'

const post = BLOG_POSTS.find((p) => p.slug === 'brilliant-counterattack-card-origins')!

export const Route = createFileRoute('/blog/brilliant-counterattack-card-origins')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => swshHead(post, loaderData),
  component: Page,
})

function Page() {
  const status = Route.useLoaderData()
  return <SwshOriginsPost set={CS2_5} post={post} status={status} />
}
