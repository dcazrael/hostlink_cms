import React from 'react'

import { Media } from '@/components/Media'
import type { TestimonialsComponentBlock } from '@/payload-types'

type Props = {
  block: TestimonialsComponentBlock
}

export const TestimonialsBlockComponent: React.FC<Props> = ({ block }) => {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(block.items || []).map((item, index) => {
          return (
            <article className="rounded-xl border border-border bg-card p-5" key={item.id || index}>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {item.description}
              </p>

              <div className="mt-4 flex items-center gap-3">
                {item.image && typeof item.image === 'object' ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Media fill imgClassName="object-cover" resource={item.image} />
                  </div>
                ) : null}
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.place ? (
                    <p className="text-xs text-muted-foreground">{item.place}</p>
                  ) : null}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
