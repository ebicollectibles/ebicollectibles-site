import { createFileRoute } from '@tanstack/react-router'
import { BLOG_POSTS } from '~/data/blog-posts'
import { getBlogPostStatus } from '~/server/blog-status'
import { SwshGuidePost, swshHead } from '~/components/blog/swsh/SwshPosts'
import { CS1A } from '~/data/swsh-blog/cs1a'

const post = BLOG_POSTS.find((p) => p.slug === 'dynamax-clash-thunder-set-guide')!

export const Route = createFileRoute('/blog/dynamax-clash-thunder-set-guide')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => swshHead(post, loaderData),
  component: Page,
})

function Page() {
  const status = Route.useLoaderData()
  return <SwshGuidePost set={CS1A} post={post} status={status} />
}
