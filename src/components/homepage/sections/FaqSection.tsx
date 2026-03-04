import React from 'react'

import type { SectionComponentBlock } from '@/components/homepage/types'

type FaqBlock = Extract<SectionComponentBlock, { blockType: 'faq' }>
const SECTION_MAX_WIDTH_CLASS = 'mx-auto w-full max-w-[56rem]'

export const FaqSection: React.FC<{ block: FaqBlock }> = ({ block }) => {
  return (
    // Section max width is design-owned in component (not CMS).
    <div className={SECTION_MAX_WIDTH_CLASS}>
      <div className="space-y-3">
        {(block.items || []).map((item, index) => {
          return (
            <details className="rounded-xl border border-border bg-card p-4" key={item.id || index}>
              <summary className="cursor-pointer font-medium">{item.question}</summary>
              <p className="mt-2 text-muted-foreground">{item.answer}</p>
            </details>
          )
        })}
      </div>
    </div>
  )
}
