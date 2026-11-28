import { createFileRoute } from '@tanstack/react-router'
import { BLOG_POSTS } from '~/data/blog-posts'
import { getBlogPostStatus } from '~/server/blog-status'
import { SwshOverviewPost, swshHead } from '~/components/blog/swsh/SwshPosts'
import { CS3B } from '~/data/swsh-blog/cs3b'

const post = BLOG_POSTS.find((p) => p.slug === 'primordial-arts-torrent-release-news')!

export const Route = createFileRoute('/blog/primordial-arts-torrent-release-news')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => swshHead(post, loaderData),
  component: Page,
})

function Page() {
  const status = Route.useLoaderData()
  return <SwshOverviewPost set={CS3B} post={post} status={status} />
}
