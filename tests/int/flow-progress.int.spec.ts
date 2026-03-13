import { describe, expect, it } from 'vitest'

import {
  getFlowConnectorCount,
  isFlowGuideHighlightedStep,
  sortFlowSteps,
  type FlowStep,
} from '@/components/homepage/sections/flowProgress'

const asStep = (step: number, title: string, id?: string): FlowStep => ({
  description: `${title} description`,
  id: id || title,
  step,
  title,
})

describe('flowProgress', () => {
  it('sorts by step number and is stable for duplicates', () => {
    const steps = [
      asStep(4, 'delta'),
      asStep(2, 'beta-1'),
      asStep(2, 'beta-2'),
      asStep(1, 'alpha'),
      asStep(3, 'gamma'),
    ]

    const sortedTitles = sortFlowSteps(steps).map((step) => step.title)

    expect(sortedTitles).toEqual(['alpha', 'beta-1', 'beta-2', 'gamma', 'delta'])
  })

  it('identifies only first rendered step as highlighted', () => {
    expect(isFlowGuideHighlightedStep(0)).toBe(true)
    expect(isFlowGuideHighlightedStep(1)).toBe(false)
    expect(isFlowGuideHighlightedStep(5)).toBe(false)
  })

  it('computes connector count as steps - 1', () => {
    expect(getFlowConnectorCount(0)).toBe(0)
    expect(getFlowConnectorCount(1)).toBe(0)
    expect(getFlowConnectorCount(2)).toBe(1)
    expect(getFlowConnectorCount(6)).toBe(5)
  })
})

