import { createFileRoute } from '@tanstack/react-router'
import { BLOG_POSTS } from '~/data/blog-posts'
import { getBlogPostStatus } from '~/server/blog-status'
import { SwshOverviewPost, swshHead } from '~/components/blog/swsh/SwshPosts'
import { CS2A } from '~/data/swsh-blog/cs2a'

const post = BLOG_POSTS.find((p) => p.slug === 'vivid-portrayals-obsidian-release-news')!

export const Route = createFileRoute('/blog/vivid-portrayals-obsidian-release-news')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => swshHead(post, loaderData),
  component: Page,
})

function Page() {
  const status = Route.useLoaderData()
  return <SwshOverviewPost set={CS2A} post={post} status={status} />
}
