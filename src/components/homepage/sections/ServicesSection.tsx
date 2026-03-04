import React from 'react'

import { LucideIcon } from '@/components/LucideIcon'
import type { SectionComponentBlock } from '@/components/homepage/types'
import { resolveLucideName } from '@/components/homepage/utils'

type ServicesBlock = Extract<SectionComponentBlock, { blockType: 'services' }>
const SECTION_MAX_WIDTH_CLASS = 'mx-auto w-full max-w-[80rem]'

export const ServicesSection: React.FC<{ block: ServicesBlock }> = ({ block }) => {
  const items = block.items || []

  return (
    // Section max width is design-owned in component (not CMS).
    <div className={SECTION_MAX_WIDTH_CLASS}>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => {
          const iconName = resolveLucideName(item.icon)

          return (
            <article className="rounded-xl border border-border bg-card p-5" key={item.id || index}>
              <h3 className="inline-flex items-center gap-4 text-lg font-semibold">
                {iconName ? <LucideIcon className="size-6 text-primary" name={iconName} /> : null}
                {item.title}
              </h3>
              <p className="mt-2 text-muted-foreground">{item.description}</p>
            </article>
          )
        })}
      </div>
    </div>
  )
}
