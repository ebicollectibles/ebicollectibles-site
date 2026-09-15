// Product descriptions are typed or pasted into a plain <textarea> in the
// admin panel — no rich-text editor — so a pasted "* Set code: CBB4C" list
// arrives as literal asterisk characters, not a bullet. This turns that
// back into real structure at display time, recognizing the handful of
// markdown conventions people paste from without thinking about it: blank
// lines between paragraphs, "*"/"-"/"+ " for a bullet list, "1. " for a
// numbered list, and "**bold**"/"*italic*" inline. Deliberately not a full
// markdown parser (no headings, links, code, nesting) — just enough to stop
// pasted formatting from being silently thrown away.

export type DescriptionBlock =
  | { type: 'paragraph'; lines: string[] }
  | { type: 'bullet-list'; items: string[] }
  | { type: 'numbered-list'; items: string[] }

const BULLET_RE = /^[*\-+]\s+(.*)$/
const NUMBERED_RE = /^\d+[.)]\s+(.*)$/

export function parseDescriptionBlocks(text: string): DescriptionBlock[] {
  const blocks: DescriptionBlock[] = []
  const paragraphLines: string[] = []
  let currentList: { type: 'bullet-list' | 'numbered-list'; items: string[] } | null = null

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      blocks.push({ type: 'paragraph', lines: [...paragraphLines] })
      paragraphLines.length = 0
    }
  }
  const flushList = () => {
    if (currentList) {
      blocks.push(currentList)
      currentList = null
    }
  }

  for (const rawLine of text.replace(/\r\n/g, '\n').split('\n')) {
    const line = rawLine.trim()
    if (line === '') {
      flushParagraph()
      flushList()
      continue
    }

    const bulletMatch = line.match(BULLET_RE)
    const numberedMatch = !bulletMatch ? line.match(NUMBERED_RE) : null

    if (bulletMatch) {
      flushParagraph()
      if (currentList?.type !== 'bullet-list') {
        flushList()
        currentList = { type: 'bullet-list', items: [] }
      }
      currentList.items.push(bulletMatch[1])
    } else if (numberedMatch) {
      flushParagraph()
      if (currentList?.type !== 'numbered-list') {
        flushList()
        currentList = { type: 'numbered-list', items: [] }
      }
      currentList.items.push(numberedMatch[1])
    } else {
      flushList()
      paragraphLines.push(line)
    }
  }
  flushParagraph()
  flushList()

  return blocks
}

export type InlineSegment = { text: string; bold?: boolean; italic?: boolean }

// Splits a line on **bold** and *italic*/_italic_ spans. Only recognizes a
// span when it's fully closed on the same line — an unmatched marker (e.g.
// a lone "*" from oddly-pasted text) is left as plain text rather than
// eating the rest of the line.
export function parseInline(line: string): InlineSegment[] {
  const segments: InlineSegment[] = []
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|_(.+?)_/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = re.exec(line))) {
    if (match.index > lastIndex) segments.push({ text: line.slice(lastIndex, match.index) })
    if (match[1] !== undefined) segments.push({ text: match[1], bold: true })
    else segments.push({ text: match[2] ?? match[3], italic: true })
    lastIndex = re.lastIndex
  }
  if (lastIndex < line.length) segments.push({ text: line.slice(lastIndex) })

  return segments
}
