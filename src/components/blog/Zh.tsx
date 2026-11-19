import * as React from 'react'
import { splitZh } from '~/lib/zh'

/** A Chinese-language snippet in English copy, marked so screen readers pronounce it in Chinese. */
export function Zh({ children }: { children: React.ReactNode }) {
  return <span lang="zh-Hans">{children}</span>
}

/** A string (an FAQ answer, say) with any Chinese snippets in it wrapped in <Zh>. */
export function zh(text: string): React.ReactNode {
  const parts = splitZh(text)
  if (!parts.some((p) => p.zh)) return text
  return parts.map((p, i) => (p.zh ? <Zh key={i}>{p.text}</Zh> : <React.Fragment key={i}>{p.text}</React.Fragment>))
}
