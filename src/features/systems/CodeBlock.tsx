import type { ReactNode } from 'react'
import styles from './Systems.module.css'

const keywords = new Set([
  'and', 'else', 'elseif', 'end', 'false', 'for', 'function', 'if', 'in', 'local',
  'nil', 'not', 'or', 'repeat', 'return', 'then', 'true', 'type', 'until', 'while',
])

const types = new Set([
  'boolean', 'CFrame', 'Instance', 'number', 'Player', 'Profile', 'string', 'table',
])

function renderLine(line: string): ReactNode[] {
  const tokens: ReactNode[] = []
  const pattern = /--.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b/g
  let cursor = 0
  let key = 0

  for (const match of line.matchAll(pattern)) {
    const token = match[0]
    const start = match.index ?? 0
    if (start > cursor) tokens.push(line.slice(cursor, start))

    let tokenClass = ''
    if (token.startsWith('--')) tokenClass = styles.comment
    else if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) tokenClass = styles.string
    else if (keywords.has(token)) tokenClass = styles.keyword
    else if (/^\d/.test(token)) tokenClass = styles.number
    else if (types.has(token)) tokenClass = styles.type
    else if (/^\s*\(/.test(line.slice(start + token.length))) tokenClass = styles.call

    tokens.push(tokenClass ? <span className={tokenClass} key={key++}>{token}</span> : token)
    cursor = start + token.length
  }

  if (cursor < line.length) tokens.push(line.slice(cursor))
  return tokens
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className={styles.code}><code>{code.split('\n').map((line, index) => (
      <span className={styles.codeLine} key={`${index}-${line}`}>
        <span className={styles.lineNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.lineContent}>{renderLine(line)}</span>
      </span>
    ))}</code></pre>
  )
}
