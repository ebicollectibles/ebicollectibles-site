import { createFileRoute } from '@tanstack/react-router'
import { BLOG_POSTS } from '~/data/blog-posts'
import { getBlogPostStatus } from '~/server/blog-status'
import { SwshGuidePost, swshHead } from '~/components/blog/swsh/SwshPosts'
import { CS2A } from '~/data/swsh-blog/cs2a'

const post = BLOG_POSTS.find((p) => p.slug === 'vivid-portrayals-obsidian-set-guide')!

export const Route = createFileRoute('/blog/vivid-portrayals-obsidian-set-guide')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => swshHead(post, loaderData),
  component: Page,
})

function Page() {
  const status = Route.useLoaderData()
  return <SwshGuidePost set={CS2A} post={post} status={status} />
}
