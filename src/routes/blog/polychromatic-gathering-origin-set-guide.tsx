import { createFileRoute } from '@tanstack/react-router'
import { BLOG_POSTS } from '~/data/blog-posts'
import { getBlogPostStatus } from '~/server/blog-status'
import { SwshGuidePost, swshHead } from '~/components/blog/swsh/SwshPosts'
import { CS4B } from '~/data/swsh-blog/cs4b'

const post = BLOG_POSTS.find((p) => p.slug === 'polychromatic-gathering-origin-set-guide')!

export const Route = createFileRoute('/blog/polychromatic-gathering-origin-set-guide')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => swshHead(post, loaderData),
  component: Page,
})

function Page() {
  const status = Route.useLoaderData()
  return <SwshGuidePost set={CS4B} post={post} status={status} />
}
