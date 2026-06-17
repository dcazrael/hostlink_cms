import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button component contract', () => {
  it('does not create a function-valued style prop by default', () => {
    const { container } = render(<Button>Order now</Button>)
    const button = container.querySelector('button')!
    const styleAttr = button.getAttribute('style') ?? ''
    expect(styleAttr).not.toMatch(/function/i)
  })

  it('sets data-chamfer and clip-path style when chamferDepth > 0', () => {
    const { container } = render(<Button chamferDepth={4}>Chamfered</Button>)
    const button = container.querySelector('button')!
    expect(button.getAttribute('data-chamfer')).not.toBeNull()
    const style = button.getAttribute('style') || ''
    expect(style).toContain('--cf-clip')
    expect(style).toContain('polygon')
    expect(style).toContain('--cf-fill')
    expect(style).toContain('--cf-stroke')
    expect(style).toContain('--cf-inset')
    expect(style).toContain('background: transparent')
  })

  it('omits data-chamfer when chamferDepth is 0', () => {
    const { container } = render(<Button chamferDepth={0}>Plain</Button>)
    const button = container.querySelector('button')!
    expect(button.getAttribute('data-chamfer')).toBeNull()
    const style = button.getAttribute('style') || ''
    expect(style).not.toContain('--cf-clip')
  })

  it('clamps chamferDepth to maximum of 5 without crashing', () => {
    const { container } = render(<Button chamferDepth={20}>Clamped</Button>)
    const button = container.querySelector('button')!
    expect(button).not.toBeNull()
    // data-chamfer is present (depth clamped to 5 > 0)
    expect(button.getAttribute('data-chamfer')).not.toBeNull()
  })

  it('does not set data-chamfer for link variant even with chamferDepth', () => {
    const { container } = render(
      <Button variant="link" chamferDepth={4}>
        Link
      </Button>,
    )
    const button = container.querySelector('button')!
    expect(button.getAttribute('data-chamfer')).toBeNull()
  })
})
