import { parseDescriptionBlocks, parseInline } from '~/lib/format-description'

function Inline({ line }: { line: string }) {
  return (
    <>
      {parseInline(line).map((seg, i) =>
        seg.bold ? <strong key={i}>{seg.text}</strong> : seg.italic ? <em key={i}>{seg.text}</em> : seg.text,
      )}
    </>
  )
}

// Renders admin-typed/pasted product descriptions with the handful of
// formatting conventions people paste without thinking about it — see
// lib/format-description.ts for exactly what's recognized.
export function FormattedText({ text, style }: { text: string; style?: React.CSSProperties }) {
  const blocks = parseDescriptionBlocks(text)

  return (
    <div style={{ whiteSpace: 'pre-wrap', ...style }}>
      {blocks.map((block, i) => {
        if (block.type === 'bullet-list') {
          return (
            <ul key={i} style={{ margin: '0 0 12px', paddingLeft: 22 }}>
              {block.items.map((item, j) => (
                <li key={j} style={{ marginBottom: 4 }}>
                  <Inline line={item} />
                </li>
              ))}
            </ul>
          )
        }
        if (block.type === 'numbered-list') {
          return (
            <ol key={i} style={{ margin: '0 0 12px', paddingLeft: 22 }}>
              {block.items.map((item, j) => (
                <li key={j} style={{ marginBottom: 4 }}>
                  <Inline line={item} />
                </li>
              ))}
            </ol>
          )
        }
        return (
          <p key={i} style={{ margin: i === blocks.length - 1 ? 0 : '0 0 12px' }}>
            {block.lines.map((line, j) => (
              <span key={j}>
                {j > 0 && <br />}
                <Inline line={line} />
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}
