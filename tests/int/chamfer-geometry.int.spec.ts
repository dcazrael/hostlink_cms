import { describe, expect, it } from 'vitest'

import {
  buildChamferClipPath,
  oppositeChamfer,
  resolveChamferCut,
  type ChamferCut,
} from '@/components/ui/chamfer'

describe('UI chamfer geometry', () => {
  it('depth > 0 produces a symmetric cut using depth for both edges', () => {
    expect(resolveChamferCut('bottom-right', { depth: 4, x: 12, y: 0 })).toEqual({
      corner: 'bottom-right',
      x: 4,
      y: 4,
    })
  })

  it('depth == 0 falls back to the asymmetric x and y values', () => {
    expect(resolveChamferCut('top-right', { depth: 0, x: 3, y: 6 })).toEqual({
      corner: 'top-right',
      x: 3,
      y: 6,
    })
  })

  it('clamps out-of-range depth', () => {
    const cut = resolveChamferCut('top-right', { depth: 100, x: 0, y: 0 })
    expect(cut.x).toBeLessThanOrEqual(24)
    expect(cut.y).toBeLessThanOrEqual(24)
  })

  it('clamps out-of-range x and y', () => {
    const cut = resolveChamferCut('top-right', { depth: 0, x: 99, y: -50 })
    expect(cut.x).toBeLessThanOrEqual(24)
    expect(cut.y).toBe(0)
  })

  it('builds a rem-based bottom-right chamfer clip path', () => {
    const cut: ChamferCut = { corner: 'bottom-right', x: 3, y: 6 }
    expect(buildChamferClipPath([cut])).toBe(
      'polygon(0% 0%, 100% 0%, 100% calc(100% - 1.5rem), calc(100% - 0.75rem) 100%, 0% 100%)',
    )
  })

  it('builds two opposite rem-based chamfers', () => {
    expect(
      buildChamferClipPath([
        { corner: 'top-right', x: 3, y: 2 },
        { corner: 'bottom-left', x: 2, y: 4 },
      ]),
    ).toBe(
      'polygon(0% 0%, calc(100% - 0.75rem) 0%, 100% 0.5rem, 100% 100%, 0.5rem 100%, 0% calc(100% - 1rem))',
    )
  })

  it('returns the opposite corner', () => {
    expect(oppositeChamfer('top-right')).toBe('bottom-left')
    expect(oppositeChamfer('bottom-right')).toBe('top-left')
  })
})
