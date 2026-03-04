import React from 'react'

import { Media } from '@/components/Media'
import type { SectionComponentBlock } from '@/components/homepage/types'

type TestimonialsBlock = Extract<SectionComponentBlock, { blockType: 'testimonials' }>
const SECTION_MAX_WIDTH_CLASS = 'mx-auto w-full max-w-[64rem]'

export const TestimonialsSection: React.FC<{ block: TestimonialsBlock }> = ({ block }) => {
  return (
    // Section max width is design-owned in component (not CMS).
    <div className={SECTION_MAX_WIDTH_CLASS}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(block.items || []).map((item, index) => {
          return (
            <article className="rounded-xl border border-border bg-card p-5" key={item.id || index}>
              <p className="text-sm text-muted-foreground">{item.description}</p>

              <div className="mt-4 flex items-center gap-3">
                {item.image && typeof item.image === 'object' ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Media fill imgClassName="object-cover" resource={item.image} />
                  </div>
                ) : null}
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.place ? <p className="text-xs text-muted-foreground">{item.place}</p> : null}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
