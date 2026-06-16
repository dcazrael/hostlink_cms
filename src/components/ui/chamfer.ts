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

export type SvgCornerCut = { x: number; y: number }

export type SvgPathArgs = {
  width: number
  height: number
  topLeft?: SvgCornerCut
  topRight?: SvgCornerCut
  bottomRight?: SvgCornerCut
  bottomLeft?: SvgCornerCut
}

export type ChamferSizing = 'proportional' | 'fixed'

export type ChamferedCardTone = 'card' | 'subtle' | 'background' | 'navy' | 'mint'

export type ChamferedButtonVariant =
  | 'default'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'destructive'
  | 'link'

/**
 * Walks the perimeter of a rectangle clockwise starting at the top-left edge,
 * emitting the SVG path commands for an arbitrarily chamfered outline.
 *
 * A corner is considered "cut" when either of its edge offsets is > 0; in that
 * case the diagonal `L` segment is included, otherwise the corner is a sharp
 * 90° turn. The final `Z` closes the subpath back to the start and also serves
 * as the implicit top-left chamfer (or sharp edge when topLeft has no cut).
 */
export function buildChamferSvgPath(args: SvgPathArgs): string {
  const { width, height } = args
  const topLeft = args.topLeft ?? { x: 0, y: 0 }
  const topRight = args.topRight ?? { x: 0, y: 0 }
  const bottomRight = args.bottomRight ?? { x: 0, y: 0 }
  const bottomLeft = args.bottomLeft ?? { x: 0, y: 0 }

  const hasCut = (cut: SvgCornerCut): boolean => cut.x > 0 || cut.y > 0

  const parts: string[] = [`M ${topLeft.x} 0`, `H ${width - topRight.x}`]

  if (hasCut(topRight)) {
    parts.push(`L ${width} ${topRight.y}`)
  }

  parts.push(`V ${height - bottomRight.y}`)

  if (hasCut(bottomRight)) {
    parts.push(`L ${width - bottomRight.x} ${height}`)
  }

  parts.push(`H ${bottomLeft.x}`)

  if (hasCut(bottomLeft)) {
    parts.push(`L 0 ${height - bottomLeft.y}`)
  }

  parts.push('Z')

  return parts.join(' ')
}

export const chamferCardToneMap: Record<
  ChamferedCardTone,
  { textClass: string; fill: string; stroke: string }
> = {
  card: {
    textClass: 'text-card-foreground',
    fill: 'var(--card)',
    stroke: 'var(--border)',
  },
  subtle: {
    textClass: 'text-(--heading)',
    fill: 'var(--subtle-background)',
    stroke: 'var(--border)',
  },
  background: {
    textClass: 'text-foreground',
    fill: 'var(--background)',
    stroke: 'var(--border)',
  },
  navy: {
    textClass: 'text-(--secondary-foreground)',
    fill: 'var(--secondary)',
    stroke: 'var(--secondary)',
  },
  mint: {
    textClass: 'text-(--accent-foreground)',
    fill: 'var(--accent)',
    stroke: 'var(--accent)',
  },
}

export const chamferButtonToneMap: Record<
  ChamferedButtonVariant,
  { fill: string; stroke: string }
> = {
  default: {
    fill: 'var(--primary)',
    stroke: 'var(--primary)',
  },
  outline: {
    fill: 'transparent',
    stroke: 'var(--border)',
  },
  secondary: {
    fill: 'var(--secondary)',
    stroke: 'var(--secondary)',
  },
  ghost: {
    fill: 'transparent',
    stroke: 'transparent',
  },
  destructive: {
    fill: 'var(--destructive)',
    stroke: 'var(--destructive)',
  },
  link: {
    fill: 'transparent',
    stroke: 'transparent',
  },
}

export const CHAMFER_DEPTH_CAPS = {
  button: 5,
  card: 10,
  shape: 20,
} as const

export function clampChamferDepth(depth: number, max: number): number {
  return Math.max(0, Math.min(max, Math.round(depth)))
}

export function chamferDepthToPx(depth: number): number {
  return depth * 4
}
