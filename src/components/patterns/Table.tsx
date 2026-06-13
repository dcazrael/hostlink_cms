import { cn } from '@/utilities/ui'
import * as React from 'react'
import { PATTERN_TONE_CLASSES, type PatternTone } from './tones'

export type TableProps = {
  columns: string[]
  rows: string[][]
  tone?: PatternTone
  className?: string
}

export const Table: React.FC<TableProps> = ({ columns, rows, tone = 'card', className }) => {
  const toneClass = PATTERN_TONE_CLASSES[tone]

  return (
    <div
      className={cn('overflow-hidden border bg-card', toneClass.border, className)}
      data-testid="pattern-table-matrix"
    >
      <table className="w-full border-collapse text-left text-sm">
        <thead className={cn('text-sm font-semibold', toneClass.background, toneClass.text)}>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-4 py-3 font-mono text-xs uppercase tracking-widest"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={row.join('|')}>
              {row.map((cell) => (
                <td key={cell} className="px-4 py-4 text-muted-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
