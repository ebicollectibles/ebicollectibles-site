import { describe, expect, it } from 'vitest'
import { parseDescriptionBlocks, parseInline } from './format-description'

describe('parseDescriptionBlocks', () => {
  it('treats plain text with no blank lines as one paragraph', () => {
    expect(parseDescriptionBlocks('Line one\nLine two')).toEqual([{ type: 'paragraph', lines: ['Line one', 'Line two'] }])
  })

  it('splits on blank lines into separate paragraphs', () => {
    expect(parseDescriptionBlocks('First\n\nSecond')).toEqual([
      { type: 'paragraph', lines: ['First'] },
      { type: 'paragraph', lines: ['Second'] },
    ])
  })

  it('turns "* "/"- "/"+ " lines into a bullet list', () => {
    const blocks = parseDescriptionBlocks('* Set code: CBB4C\n- Contents: 18 packs\n+ Ships from: US')
    expect(blocks).toEqual([{ type: 'bullet-list', items: ['Set code: CBB4C', 'Contents: 18 packs', 'Ships from: US'] }])
  })

  it('turns "1. " lines into a numbered list', () => {
    expect(parseDescriptionBlocks('1. Open the box\n2. Remove packs')).toEqual([
      { type: 'numbered-list', items: ['Open the box', 'Remove packs'] },
    ])
  })

  it('keeps a paragraph before and after a list as separate blocks', () => {
    const blocks = parseDescriptionBlocks('Intro line\n* Bullet one\n* Bullet two\nOutro line')
    expect(blocks).toEqual([
      { type: 'paragraph', lines: ['Intro line'] },
      { type: 'bullet-list', items: ['Bullet one', 'Bullet two'] },
      { type: 'paragraph', lines: ['Outro line'] },
    ])
  })

  it('starts a new list when the marker type changes without a blank line', () => {
    const blocks = parseDescriptionBlocks('* Bullet\n1. Numbered')
    expect(blocks).toEqual([
      { type: 'bullet-list', items: ['Bullet'] },
      { type: 'numbered-list', items: ['Numbered'] },
    ])
  })

  it('ignores a bare "*" with no following text as a list marker', () => {
    // no space after the asterisk, or nothing after it, so it isn't "* text"
    expect(parseDescriptionBlocks('*')).toEqual([{ type: 'paragraph', lines: ['*'] }])
  })

  it('returns nothing for empty input', () => {
    expect(parseDescriptionBlocks('')).toEqual([])
    expect(parseDescriptionBlocks('   \n\n  ')).toEqual([])
  })
})

describe('parseInline', () => {
  it('returns the whole line as one plain segment when there is no markup', () => {
    expect(parseInline('Plain text')).toEqual([{ text: 'Plain text' }])
  })

  it('recognizes **bold** spans', () => {
    expect(parseInline('This is **bold** text')).toEqual([
      { text: 'This is ' },
      { text: 'bold', bold: true },
      { text: ' text' },
    ])
  })

  it('recognizes *italic* and _italic_ spans', () => {
    expect(parseInline('*one* and _two_')).toEqual([
      { text: 'one', italic: true },
      { text: ' and ' },
      { text: 'two', italic: true },
    ])
  })

  it('leaves an unmatched single "*" as plain text', () => {
    expect(parseInline('50% off * some exclusions')).toEqual([{ text: '50% off * some exclusions' }])
  })
})
