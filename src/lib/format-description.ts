// Product descriptions are typed or pasted into a plain <textarea> in the
// admin panel — no rich-text editor — so a pasted "* Set code: CBB4C" list
// arrives as literal asterisk characters, not a bullet. This turns that
// back into real structure at display time, recognizing the handful of
// markdown conventions people paste from without thinking about it:
// "*"/"-"/"+ " for a bullet list, "1. " for a numbered list, and
// "**bold**"/"*italic*" inline. Every blank line counts toward the gap
// that follows it — whether it's inside one paragraph (rendered as extra
// <br>s) or between two blocks like a list and the paragraph after it
// (rendered as extra margin) — so pressing Enter more times always leaves
// visibly more space, never the same fixed gap no matter how many blank
// lines were typed. Deliberately not a full markdown parser (no headings,
// links, code, nesting) — just enough to stop pasted formatting from being
// silently thrown away.

export type DescriptionBlock =
  | { type: 'paragraph'; lines: string[]; gapBefore?: number }
  | { type: 'bullet-list'; items: string[]; gapBefore?: number }
  | { type: 'numbered-list'; items: string[]; gapBefore?: number }

const BULLET_RE = /^[*\-+]\s+(.*)$/
const NUMBERED_RE = /^\d+[.)]\s+(.*)$/

export function parseDescriptionBlocks(text: string): DescriptionBlock[] {
  const blocks: DescriptionBlock[] = []
  const paragraphLines: string[] = []
  let paragraphGapBefore = 0
  let currentList: { type: 'bullet-list' | 'numbered-list'; items: string[]; gapBefore: number } | null = null
  let blankRun = 0

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      const block: DescriptionBlock = { type: 'paragraph', lines: [...paragraphLines] }
      if (paragraphGapBefore > 1) block.gapBefore = paragraphGapBefore
      blocks.push(block)
      paragraphLines.length = 0
      paragraphGapBefore = 0
    }
  }
  const flushList = () => {
    if (currentList) {
      const block: DescriptionBlock = { type: currentList.type, items: currentList.items }
      if (currentList.gapBefore > 1) block.gapBefore = currentList.gapBefore
      blocks.push(block)
      currentList = null
    }
  }

  for (const rawLine of text.replace(/\r\n/g, '\n').split('\n')) {
    const line = rawLine.trim()
    if (line === '') {
      blankRun++
      continue
    }

    const bulletMatch = line.match(BULLET_RE)
    const numberedMatch = !bulletMatch ? line.match(NUMBERED_RE) : null

    if (bulletMatch || numberedMatch) {
      const type: 'bullet-list' | 'numbered-list' = bulletMatch ? 'bullet-list' : 'numbered-list'
      const captured = (bulletMatch ?? numberedMatch)![1]
      if (blankRun > 0) {
        // A blank line always ends an in-progress list (writing more items
        // after a gap should read as a fresh list, not a continuation), and
        // however many blank lines there were becomes this new list's gap.
        flushParagraph()
        flushList()
        currentList = { type, items: [captured], gapBefore: blankRun }
      } else if (currentList !== null && currentList.type === type) {
        currentList.items.push(captured)
      } else {
        flushParagraph()
        flushList()
        currentList = { type, items: [captured], gapBefore: 0 }
      }
    } else {
      if (currentList) {
        flushList()
        paragraphLines.push(line)
        paragraphGapBefore = blocks.length > 0 ? blankRun : 0
      } else if (blankRun > 0 && paragraphLines.length > 0) {
        // Still inside the same paragraph — each blank line becomes its own
        // empty line so it renders as its own <br> gap.
        for (let i = 0; i < blankRun; i++) paragraphLines.push('')
        paragraphLines.push(line)
      } else {
        if (paragraphLines.length === 0) paragraphGapBefore = blocks.length > 0 ? blankRun : 0
        paragraphLines.push(line)
      }
    }
    blankRun = 0
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
