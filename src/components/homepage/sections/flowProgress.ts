import type { SectionComponentBlock } from '@/components/homepage/types'

type FlowBlock = Extract<SectionComponentBlock, { blockType: 'flow' }>

export type FlowStep = NonNullable<FlowBlock['steps']>[number]

export const sortFlowSteps = (steps: FlowStep[]): FlowStep[] => {
  return steps
    .map((step, index) => ({ index, step }))
    .sort((a, b) => {
      const aStep = typeof a.step.step === 'number' ? a.step.step : Number.MAX_SAFE_INTEGER
      const bStep = typeof b.step.step === 'number' ? b.step.step : Number.MAX_SAFE_INTEGER

      if (aStep !== bStep) return aStep - bStep
      return a.index - b.index
    })
    .map(({ step }) => step)
}

export const getFlowConnectorCount = (stepCount: number): number => {
  return Math.max(stepCount - 1, 0)
}

export const isFlowGuideHighlightedStep = (index: number): boolean => index === 0

