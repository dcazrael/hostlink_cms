import * as React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { NumberBadge } from '@/components/patterns/NumberBadge'
import { Stepper, type StepperStep } from '@/components/patterns/Stepper'

afterEach(() => {
  cleanup()
})

const THREE_STEPS: StepperStep[] = [
  {
    step: 1,
    title: 'Audit',
    description: 'Confirm hosting, CMS, and content constraints.',
  },
  { step: 2, title: 'Build', description: 'Prepare the managed environment.' },
  { step: 3, title: 'Launch', description: 'Coordinate DNS and final checks.' },
]

describe('NumberBadge polygon shapes', () => {
  it('renders square as a polygon-based clip-path shape', () => {
    const { container } = render(<NumberBadge value="01" shape="square" />)
    const badge = container.querySelector('[data-badge-shape="square"]')
    expect(badge).not.toBeNull()
    expect(badge?.getAttribute('data-chamfer')).not.toBeNull()
    const style = badge?.getAttribute('style') || ''
    expect(style).toContain('--cf-clip')
    expect(style).toContain('polygon(')
  })

  it('renders circle as a polygon-based clip-path shape', () => {
    const { container } = render(<NumberBadge value="01" shape="circle" />)
    const badge = container.querySelector('[data-badge-shape="circle"]')
    expect(badge).not.toBeNull()
    expect(badge?.getAttribute('data-chamfer')).not.toBeNull()
    const style = badge?.getAttribute('style') || ''
    expect(style).toContain('--cf-clip')
    expect(style).toContain('polygon(')
  })

  it('renders chamfered as a polygon-based clip-path shape', () => {
    const { container } = render(<NumberBadge value="01" shape="chamfered" />)
    const badge = container.querySelector('[data-badge-shape="chamfered"]')
    expect(badge).not.toBeNull()
    expect(badge?.getAttribute('data-chamfer')).not.toBeNull()
    const style = badge?.getAttribute('style') || ''
    expect(style).toContain('--cf-clip')
    expect(style).toContain('polygon(')
  })

  it('keeps the exact chamfer vertices instead of rounding them through resampling', () => {
    const { container } = render(<NumberBadge value="01" shape="chamfered" />)
    const badge = container.querySelector('[data-badge-shape="chamfered"]')
    const style = badge?.getAttribute('style') || ''

    expect(style).toContain('70.000% 0.000%')
    expect(style).toContain('100.000% 30.000%')
    expect(style).toContain('0.000% 100.000%')
  })
})

describe('Stepper state-driven badge shapes', () => {
  it('uses chamfered for active and circle for upcoming at the initial state', () => {
    const { container } = render(<Stepper steps={THREE_STEPS} variant="interactive" />)
    const badges = Array.from(container.querySelectorAll('[data-badge-shape]'))
    expect(badges).toHaveLength(3)
    expect(badges[0]?.getAttribute('data-badge-shape')).toBe('chamfered')
    expect(badges[1]?.getAttribute('data-badge-shape')).toBe('circle')
    expect(badges[2]?.getAttribute('data-badge-shape')).toBe('circle')
  })

  it('uses chamfered + checkmark for completed and chamfered for active after advancing', async () => {
    const user = userEvent.setup()
    const { container } = render(<Stepper steps={THREE_STEPS} variant="interactive" />)

    await user.click(screen.getByText('Next →'))

    const badges = Array.from(container.querySelectorAll('[data-badge-shape]'))
    expect(badges[0]?.getAttribute('data-badge-shape')).toBe('chamfered')
    expect(badges[1]?.getAttribute('data-badge-shape')).toBe('chamfered')
    expect(badges[2]?.getAttribute('data-badge-shape')).toBe('circle')

    expect(badges[0]?.querySelector('svg')).not.toBeNull()
  })
})
