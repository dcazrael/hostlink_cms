import React from 'react'

import type { FaqComponentBlock } from '@/payload-types'

type Props = {
  block: FaqComponentBlock
}

export const FaqBlockComponent: React.FC<Props> = ({ block }) => {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="space-y-3">
        {(block.items || []).map((item, index) => {
          return (
            <details className="rounded-xl border border-border bg-card p-4" key={item.id || index}>
              <summary className="cursor-pointer font-medium">{item.question}</summary>
              <p className="mt-2 text-muted-foreground whitespace-pre-line">{item.answer}</p>
            </details>
          )
        })}
      </div>
    </div>
  )
}
