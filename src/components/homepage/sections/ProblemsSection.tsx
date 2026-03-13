import React from 'react'

import { LucideIcon } from '@/components/LucideIcon'
import type { SectionComponentBlock } from '@/components/homepage/types'
import { resolveLucideName } from '@/components/homepage/utils'

type ProblemsBlock = Extract<SectionComponentBlock, { blockType: 'problems' }>
const SECTION_MAX_WIDTH_CLASS = 'mx-auto w-full max-w-[80rem]'

export const ProblemsSection: React.FC<{ block: ProblemsBlock }> = ({ block }) => {
  const items = block.items || []

  return (
    // Section max width is design-owned in component (not CMS).
    <div className={SECTION_MAX_WIDTH_CLASS}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {items.map((item, index) => {
          const iconName = resolveLucideName(item.icon)

          return (
            <article
              className="rounded-xl border border-border bg-card from-bg-card to-primary/10 bg-linear-to-br from-50% to-150% hover:from-0% hover:to-100% p-5 transition-colors duration-300"
              key={item.id || index}
            >
              <h3 className="inline-flex items-center gap-4 text-lg font-semibold">
                {iconName ? <LucideIcon className="size-6 text-primary" name={iconName} /> : null}
                {item.title}
              </h3>
              {item.sub ? <p className="mt-1 text-sm text-muted-foreground">{item.sub}</p> : null}
              <p className="mt-2 text-muted-foreground">{item.description}</p>
            </article>
          )
        })}
      </div>
    </div>
  )
}
