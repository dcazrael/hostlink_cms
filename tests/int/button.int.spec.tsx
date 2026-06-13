import * as React from 'react'
import { describe, expect, it } from 'vitest'

import { Button } from '@/components/ui/button'

describe('Button component contract', () => {
  it('does not create a function-valued style prop by default', () => {
    const element = Button({ children: 'Order now' })

    expect(element.props.style).not.toBeTypeOf('function')
  })

  it('uses symmetric chamfer geometry for chamferDepth shorthand (Tailwind scale, 4 = 1rem)', () => {
    const cases = [
      {
        depth: 2,
        expected:
          'polygon(0% 0%, 100% 0%, 100% calc(100% - 0.5rem), calc(100% - 0.5rem) 100%, 0% 100%)',
      },
      {
        depth: 4,
        expected:
          'polygon(0% 0%, 100% 0%, 100% calc(100% - 1rem), calc(100% - 1rem) 100%, 0% 100%)',
      },
      {
        depth: 6,
        expected:
          'polygon(0% 0%, 100% 0%, 100% calc(100% - 1.5rem), calc(100% - 1.5rem) 100%, 0% 100%)',
      },
    ]

    for (const { depth, expected } of cases) {
      const element = Button({
        children: 'Order now',
        chamferCorner: 'bottom-right',
        chamferDepth: depth,
      })

      expect(element.props.style).toEqual({ clipPath: expected })
    }
  })
})
