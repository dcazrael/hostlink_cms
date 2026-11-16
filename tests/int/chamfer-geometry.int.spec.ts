import { describe, expect, it } from 'vitest'

import {
  buildChamferClipPath,
  buildChamferSvgPath,
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

describe('SVG chamfer path builder', () => {
  it('builds a full rect when no cuts are specified (all x=0, y=0)', () => {
    expect(
      buildChamferSvgPath({
        width: 100,
        height: 100,
        topLeft: { x: 0, y: 0 },
        topRight: { x: 0, y: 0 },
        bottomRight: { x: 0, y: 0 },
        bottomLeft: { x: 0, y: 0 },
      }),
    ).toBe('M 0 0 H 100 V 100 H 0 Z')
  })

  it('builds a single top-right chamfer in proportional mode', () => {
    expect(
      buildChamferSvgPath({
        width: 100,
        height: 100,
        topLeft: { x: 0, y: 0 },
        topRight: { x: 8, y: 8 },
        bottomRight: { x: 0, y: 0 },
        bottomLeft: { x: 0, y: 0 },
      }),
    ).toBe('M 0 0 H 92 L 100 8 V 100 H 0 Z')
  })

  it('builds opposite corner chamfers (top-right + bottom-left)', () => {
    expect(
      buildChamferSvgPath({
        width: 100,
        height: 100,
        topLeft: { x: 0, y: 0 },
        topRight: { x: 12, y: 6 },
        bottomRight: { x: 0, y: 0 },
        bottomLeft: { x: 8, y: 16 },
      }),
    ).toBe('M 0 0 H 88 L 100 6 V 100 H 8 L 0 84 Z')
  })

  it('builds asymmetric cuts on all four corners', () => {
    expect(
      buildChamferSvgPath({
        width: 100,
        height: 100,
        topLeft: { x: 4, y: 2 },
        topRight: { x: 6, y: 3 },
        bottomRight: { x: 5, y: 7 },
        bottomLeft: { x: 3, y: 9 },
      }),
    ).toBe('M 4 0 H 94 L 100 3 V 93 L 95 100 H 3 L 0 91 Z')
  })

  it('builds a fixed-mode path using pixel dimensions', () => {
    expect(
      buildChamferSvgPath({
        width: 320,
        height: 48,
        topLeft: { x: 0, y: 0 },
        topRight: { x: 16, y: 16 },
        bottomRight: { x: 0, y: 0 },
        bottomLeft: { x: 0, y: 0 },
      }),
    ).toBe('M 0 0 H 304 L 320 16 V 48 H 0 Z')
  })
})
