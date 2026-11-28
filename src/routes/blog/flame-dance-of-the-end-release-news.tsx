import { createFileRoute } from '@tanstack/react-router'
import { BLOG_POSTS } from '~/data/blog-posts'
import { getBlogPostStatus } from '~/server/blog-status'
import { SwshOverviewPost, swshHead } from '~/components/blog/swsh/SwshPosts'
import { CS4_5 } from '~/data/swsh-blog/cs4-5'

const post = BLOG_POSTS.find((p) => p.slug === 'flame-dance-of-the-end-release-news')!

export const Route = createFileRoute('/blog/flame-dance-of-the-end-release-news')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => swshHead(post, loaderData),
  component: Page,
})

function Page() {
  const status = Route.useLoaderData()
  return <SwshOverviewPost set={CS4_5} post={post} status={status} />
}
