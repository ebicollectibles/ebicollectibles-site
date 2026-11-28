import { createFileRoute } from '@tanstack/react-router'
import { BLOG_POSTS } from '~/data/blog-posts'
import { getBlogPostStatus } from '~/server/blog-status'
import { SwshGuidePost, swshHead } from '~/components/blog/swsh/SwshPosts'
import { CS3_5 } from '~/data/swsh-blog/cs3-5'

const post = BLOG_POSTS.find((p) => p.slug === 'scorching-skies-set-guide')!

export const Route = createFileRoute('/blog/scorching-skies-set-guide')({
  loader: () => getBlogPostStatus({ data: post.slug }),
  head: ({ loaderData }) => swshHead(post, loaderData),
  component: Page,
})

function Page() {
  const status = Route.useLoaderData()
  return <SwshGuidePost set={CS3_5} post={post} status={status} />
}
