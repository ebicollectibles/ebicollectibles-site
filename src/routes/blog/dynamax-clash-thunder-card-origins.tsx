import { createFileRoute } from '@tanstack/react-router'
import { BLOG_POSTS } from '~/data/blog-posts'
import { getBlogPostStatus } from '~/server/blog-status'
import { SwshOriginsPost, swshHead } from '~/components/blog/swsh/SwshPosts'
import { CS1A } from '~/data/swsh-blog/cs1a'

const post = BLOG_POSTS.find((p) => p.slug === 'dynamax-clash-thunder-card-origins')!

export const Route = createFileRoute('/blog/dynamax-clash-thunder-card-origins')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => swshHead(post, loaderData),
  component: Page,
})

function Page() {
  const status = Route.useLoaderData()
  return <SwshOriginsPost set={CS1A} post={post} status={status} />
}
