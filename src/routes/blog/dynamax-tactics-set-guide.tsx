import { createFileRoute } from '@tanstack/react-router'
import { BLOG_POSTS } from '~/data/blog-posts'
import { getBlogPostStatus } from '~/server/blog-status'
import { SwshGuidePost, swshHead } from '~/components/blog/swsh/SwshPosts'
import { CS1_5 } from '~/data/swsh-blog/cs1-5'

const post = BLOG_POSTS.find((p) => p.slug === 'dynamax-tactics-set-guide')!

export const Route = createFileRoute('/blog/dynamax-tactics-set-guide')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => swshHead(post, loaderData),
  component: Page,
})

function Page() {
  const status = Route.useLoaderData()
  return <SwshGuidePost set={CS1_5} post={post} status={status} />
}
