// Finds the Chinese-language snippets inside otherwise English text (a set's
// Chinese name such as 无畏太晶, a phrase printed on a box such as 3粒/盒), so
// they can be marked up with lang="zh-Hans". Screen readers and e-readers
// then switch to a Chinese voice for them instead of spelling them out or
// skipping them.

// A run starts at a Han character (with any digits glued to its front, as in
// "3粒/盒" or "30周年庆典") and carries on through Han characters and the
// punctuation that sits inside such a phrase, ending on a Han character.
const HAN_RUN = /\d*\p{Script=Han}(?:[\p{Script=Han}\d“”‘’/·]*\p{Script=Han})?/gu

export interface ZhPart {
  text: string
  zh: boolean
}

export function splitZh(text: string): ZhPart[] {
  const parts: ZhPart[] = []
  let last = 0
  for (const m of text.matchAll(HAN_RUN)) {
    const at = m.index ?? 0
    if (at > last) parts.push({ text: text.slice(last, at), zh: false })
    parts.push({ text: m[0], zh: true })
    last = at + m[0].length
  }
  if (last < text.length) parts.push({ text: text.slice(last), zh: false })
  return parts
}
