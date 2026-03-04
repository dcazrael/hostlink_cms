import React from 'react'

import type { SectionComponentBlock } from '@/components/homepage/types'

type FlowBlock = Extract<SectionComponentBlock, { blockType: 'flow' }>
const SECTION_MAX_WIDTH_CLASS = 'mx-auto w-full max-w-[56rem]'

export const FlowSection: React.FC<{ block: FlowBlock }> = ({ block }) => {
  const steps = block.steps || []

  return (
    // Section max width is design-owned in component (not CMS).
    <div className={SECTION_MAX_WIDTH_CLASS}>
      <ol className="space-y-4">
        {steps.map((step, index) => {
          return (
            <li className="flex gap-4" key={step.id || index}>
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-primary text-sm font-semibold">
                {step.step}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-1 text-muted-foreground">{step.description}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
