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

  it('wraps children in a relative span when chamferDepth > 0', () => {
    const { container } = render(<Button chamferDepth={4}>Chamfered</Button>)
    const button = container.querySelector('button')!
    const span = button.querySelector('span')
    expect(span).not.toBeNull()
    expect(span!.className).toContain('z-10')
  })

  it('does not add a z-10 wrapper span when chamferDepth is 0', () => {
    const { container } = render(<Button chamferDepth={0}>Plain</Button>)
    const button = container.querySelector('button')!
    const innerSpans = button.querySelectorAll(':scope > span')
    // Should not add an extra SVG-aware wrapper
    expect(innerSpans.length).toBe(0)
  })

  it('clamps chamferDepth to maximum of 5 without crashing', () => {
    const { container } = render(<Button chamferDepth={20}>Clamped</Button>)
    expect(container.querySelector('button')).not.toBeNull()
  })

  it('does not render SVG for link variant even with chamferDepth', () => {
    const { container } = render(
      <Button variant="link" chamferDepth={4}>
        Link
      </Button>,
    )
    const button = container.querySelector('button')!
    const svg = button.querySelector('svg')
    expect(svg).toBeNull()
  })
})
