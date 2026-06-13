export type ChamferCorner = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

/**
 * Edge distance from the corner along each adjacent edge, expressed in
 * Tailwind spacing units. One unit equals 0.25rem (4px at 16px root),
 * so `4` equals 1rem / 16px. The scale matches Tailwind's spacing tokens.
 */
export type ChamferCut = {
  corner: ChamferCorner
  x: number
  y: number
}

const MAX_UNITS = 24

function clampUnits(value: number): number {
  return Math.max(0, Math.min(MAX_UNITS, value))
}

function formatUnits(value: number): string {
  return `${clampUnits(value) * 0.25}rem`
}

export interface ChamferInput {
  depth: number
  x: number
  y: number
}

export function oppositeChamfer(corner: ChamferCorner): ChamferCorner {
  switch (corner) {
    case 'top-right':
      return 'bottom-left'
    case 'top-left':
      return 'bottom-right'
    case 'bottom-right':
      return 'top-left'
    case 'bottom-left':
      return 'top-right'
  }
}

/**
 * A symmetric cut is used when `depth > 0`. Otherwise the asymmetric x/y
 * values are used. This lets the same control surface describe both modes
 * without an explicit `mode` prop.
 */
export function resolveChamferCut(corner: ChamferCorner, input: ChamferInput): ChamferCut {
  if (input.depth > 0) {
    return { corner, x: clampUnits(input.depth), y: clampUnits(input.depth) }
  }
  return { corner, x: clampUnits(input.x), y: clampUnits(input.y) }
}

export function buildChamferClipPath(cuts: ChamferCut[]): string | undefined {
  if (cuts.length === 0) return undefined

  const cutMap = new Map<ChamferCorner, ChamferCut>()
  for (const cut of cuts) {
    cutMap.set(cut.corner, {
      corner: cut.corner,
      x: clampUnits(cut.x),
      y: clampUnits(cut.y),
    })
  }

  const topLeft = cutMap.get('top-left')
  const topRight = cutMap.get('top-right')
  const bottomRight = cutMap.get('bottom-right')
  const bottomLeft = cutMap.get('bottom-left')

  const points = [
    topLeft ? `0% ${formatUnits(topLeft.y)}` : '0% 0%',
    topLeft ? `${formatUnits(topLeft.x)} 0%` : undefined,
    topRight ? `calc(100% - ${formatUnits(topRight.x)}) 0%` : '100% 0%',
    topRight ? `100% ${formatUnits(topRight.y)}` : undefined,
    bottomRight ? `100% calc(100% - ${formatUnits(bottomRight.y)})` : '100% 100%',
    bottomRight ? `calc(100% - ${formatUnits(bottomRight.x)}) 100%` : undefined,
    bottomLeft ? `${formatUnits(bottomLeft.x)} 100%` : '0% 100%',
    bottomLeft ? `0% calc(100% - ${formatUnits(bottomLeft.y)})` : undefined,
  ].filter((point): point is string => Boolean(point))

  return `polygon(${points.join(', ')})`
}
