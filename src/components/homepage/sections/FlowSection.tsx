import React from 'react'

import {
  getFlowConnectorCount,
  isFlowGuideHighlightedStep,
  sortFlowSteps,
} from '@/components/homepage/sections/flowProgress'
import type { SectionComponentBlock } from '@/components/homepage/types'

type FlowBlock = Extract<SectionComponentBlock, { blockType: 'flow' }>
const SECTION_MAX_WIDTH_CLASS = 'mx-auto w-full max-w-[56rem]'

export const FlowSection: React.FC<{ block: FlowBlock }> = ({ block }) => {
  const steps = sortFlowSteps(block.steps || [])
  const connectorCount = getFlowConnectorCount(steps.length)

  return (
    // Section max width is design-owned in component (not CMS).
    <div className={SECTION_MAX_WIDTH_CLASS}>
      <article className="p-6">
        <ol className="space-y-8">
          {steps.map((step, index) => {
            const highlighted = isFlowGuideHighlightedStep(index)
            const hasNext = index < connectorCount

            return (
              <li
                className="grid grid-cols-[2rem_1fr] gap-6 p-4 hover:bg-primary/10 rounded-lg transition-colors duration-300"
                key={step.id || index}
              >
                <div className="relative flex justify-center">
                  <span
                    className={`relative z-10 flex size-12 aspect-square items-center justify-center rounded-full border-2 text-lg font-bold ${
                      highlighted
                        ? 'border-primary bg-primary/60 text-foreground'
                        : 'border-accent border-dotted bg-accent/30 text-muted-foreground'
                    }`}
                  >
                    {step.step}
                  </span>
                  {hasNext ? (
                    <span
                      aria-hidden
                      className="absolute top-12 h-[calc(100%+1rem)] w-0.5 bg-accent"
                    />
                  ) : null}
                </div>
                <div className="pt-0.5">
                  <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </article>
    </div>
  )
}
