import { createFileRoute } from '@tanstack/react-router'
import { BLOG_POSTS } from '~/data/blog-posts'
import { getBlogPostStatus } from '~/server/blog-status'
import { SwshOverviewPost, swshHead } from '~/components/blog/swsh/SwshPosts'
import { CS4B } from '~/data/swsh-blog/cs4b'

const post = BLOG_POSTS.find((p) => p.slug === 'polychromatic-gathering-origin-release-news')!

export const Route = createFileRoute('/blog/polychromatic-gathering-origin-release-news')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => swshHead(post, loaderData),
  component: Page,
})

function Page() {
  const status = Route.useLoaderData()
  return <SwshOverviewPost set={CS4B} post={post} status={status} />
}
