import { createServerFn } from '@tanstack/react-start'
import { assertAdmin } from './admin-auth'

// Minimal shape of the R2 binding we actually use — avoids pulling in
// @cloudflare/workers-types just for two methods.
interface R2Bucket {
  put(
    key: string,
    value: ArrayBuffer,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>
  list(options?: { limit?: number }): Promise<{ objects: Array<{ key: string; uploaded: Date }> }>
}

interface CloudflareEnv {
  PRODUCT_IMAGES?: R2Bucket
  PRODUCT_IMAGES_PUBLIC_URL?: string
}

// Nitro's cloudflare_module preset stashes the request's Cloudflare bindings
// here on every request (see node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs)
// — bindings are identical across requests in a deployment, so reading this
// global is safe even with concurrent requests.
function getCloudflareEnv(): CloudflareEnv {
  return (globalThis as { __env__?: CloudflareEnv }).__env__ ?? {}
}

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024 // 8MB

export const uploadProductImage = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error('Expected a file upload.')
    return data
  })
  .handler(async ({ data }) => {
    await assertAdmin()

    const env = getCloudflareEnv()
    if (!env.PRODUCT_IMAGES) {
      throw new Error('Image storage is not set up yet — create the R2 bucket and add its binding (see README-DEPLOY.md).')
    }
    if (!env.PRODUCT_IMAGES_PUBLIC_URL) {
      throw new Error('PRODUCT_IMAGES_PUBLIC_URL is not set — see README-DEPLOY.md.')
    }

    const file = data.get('file')
    if (!(file instanceof File)) throw new Error('No file provided.')
    if (!file.type.startsWith('image/')) throw new Error('Only image files are allowed.')
    if (file.size > MAX_UPLOAD_BYTES) throw new Error('Image is too large — 8MB max.')

    const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : ''
    const key = `${crypto.randomUUID()}${ext}`

    await env.PRODUCT_IMAGES.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type },
    })

    return { url: `${env.PRODUCT_IMAGES_PUBLIC_URL.replace(/\/$/, '')}/${key}` }
  })

export const listProductImages = createServerFn({ method: 'GET' }).handler(async () => {
  await assertAdmin()

  const env = getCloudflareEnv()
  if (!env.PRODUCT_IMAGES) {
    throw new Error('Image storage is not set up yet — create the R2 bucket and add its binding (see README-DEPLOY.md).')
  }
  if (!env.PRODUCT_IMAGES_PUBLIC_URL) {
    throw new Error('PRODUCT_IMAGES_PUBLIC_URL is not set — see README-DEPLOY.md.')
  }

  const base = env.PRODUCT_IMAGES_PUBLIC_URL.replace(/\/$/, '')
  const { objects } = await env.PRODUCT_IMAGES.list({ limit: 200 })
  return objects
    .sort((a, b) => new Date(b.uploaded).getTime() - new Date(a.uploaded).getTime())
    .map((obj) => ({ key: obj.key, url: `${base}/${obj.key}` }))
})
