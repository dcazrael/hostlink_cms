import * as React from 'react'
import { cn } from '@/utilities/ui'

export type NumberBadgeTone = 'navy' | 'mint' | 'card' | 'subtle' | 'border'

export type NumberBadgeShape = 'square' | 'chamfered' | 'circle'

/**
 * Number of points sampled per shape polygon. 32 keeps the circle
 * smooth and gives the square/chamfered enough resolution to morph
 * cleanly to/from a circle without visible faceting.
 */
const POLYGON_POINTS = 32

type Point = { x: number; y: number }

/**
 * Build a CSS `polygon(...)` clip-path string from a list of points.
 * Points are formatted as percentages so the polygon scales with the
 * element's box.
 */
const buildPolygonClipPath = (points: Point[]): string =>
  `polygon(${points.map((p) => `${p.x.toFixed(3)}% ${p.y.toFixed(3)}%`).join(', ')})`

/**
 * Subdivide a polygon to `pointCount` total points while preserving the
 * original vertices exactly. Each edge contributes its start vertex plus
 * zero or more interior points, and the end vertex is supplied by the
 * next edge's start vertex. Extra points are distributed proportionally
 * to edge length using a largest-remainder method.
 */
const samplePolygonPreservingVertices = (vertices: Point[], pointCount: number): Point[] => {
  const edges = vertices.map((v, i) => {
    const from = v
    const to = vertices[(i + 1) % vertices.length]
    const dx = to.x - from.x
    const dy = to.y - from.y
    return { from, to, length: Math.sqrt(dx * dx + dy * dy) }
  })
  const totalLength = edges.reduce((sum, e) => sum + e.length, 0)
  const edgeCount = edges.length

  if (pointCount <= edgeCount) return vertices.slice(0, pointCount)

  const remaining = pointCount - edgeCount
  const quotas = edges.map((edge) => (edge.length / totalLength) * remaining)
  const subdivisions = quotas.map((quota) => Math.floor(quota))
  let assigned = subdivisions.reduce((sum, count) => sum + count, 0)

  const order = quotas
    .map((quota, index) => ({ index, remainder: quota - Math.floor(quota) }))
    .sort((a, b) => b.remainder - a.remainder)

  for (let i = 0; assigned < remaining; i += 1) {
    subdivisions[order[i]!.index] += 1
    assigned += 1
  }

  const points: Point[] = []
  edges.forEach((edge, edgeIndex) => {
    const pointSlots = subdivisions[edgeIndex]! + 1
    for (let i = 0; i < pointSlots; i += 1) {
      const t = i / pointSlots
      points.push({
        x: edge.from.x + (edge.to.x - edge.from.x) * t,
        y: edge.from.y + (edge.to.y - edge.from.y) * t,
      })
    }
  })

  return points.slice(0, pointCount)
}

/**
 * Build `count` evenly-spaced points around a circle. Starts at the
 * top-left-ish (225°) angle so the polygon point order matches the
 * chamfered/square polygons, which both start at the top-left corner.
 * Consistent ordering keeps CSS clip-path morphing between shapes
 * smooth (each polygon vertex travels to its counterpart instead of
 * the shapes "teleporting" through intermediate states).
 */
const buildCirclePoints = (count: number): Point[] => {
  const points: Point[] = []
  const startAngle = (5 * Math.PI) / 4
  for (let i = 0; i < count; i++) {
    const angle = startAngle + (2 * Math.PI * i) / count
    points.push({
      x: 50 + 50 * Math.cos(angle),
      y: 50 + 50 * Math.sin(angle),
    })
  }
  return points
}

const SQUARE_VERTICES: Point[] = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 },
]

/**
 * Chamfered vertex set — same 30% top-right cut as the rest of the
 * pamphlet's chamfered elements. Defined as a closed polygon in
 * clockwise screen-coord order: top-left → top edge → chamfer
 * diagonal → right edge → bottom edge → left edge → back to start.
 */
const CHAMFERED_VERTICES: Point[] = [
  { x: 0, y: 0 },
  { x: 70, y: 0 },
  { x: 100, y: 30 },
  { x: 100, y: 100 },
  { x: 0, y: 100 },
]

const shapeClipPathMap: Record<NumberBadgeShape, string> = {
  square: buildPolygonClipPath(samplePolygonPreservingVertices(SQUARE_VERTICES, POLYGON_POINTS)),
  chamfered: buildPolygonClipPath(
    samplePolygonPreservingVertices(CHAMFERED_VERTICES, POLYGON_POINTS),
  ),
  circle: buildPolygonClipPath(buildCirclePoints(POLYGON_POINTS)),
}

/**
 * Fill colour for the badge body. Matches the bg- colour each tone
 * would have set (so the visual reads the same after the migration
 * to clip-path-based shapes).
 */
const toneFillVar: Record<NumberBadgeTone, string> = {
  navy: 'var(--secondary)',
  mint: 'var(--accent)',
  card: 'var(--card)',
  subtle: 'var(--subtle-background)',
  border: 'var(--background)',
}

/**
 * Stroke colour for the 1px outline. For the solid tones (navy/mint)
 * the stroke matches the fill so the badge reads as a solid filled
 * shape. For the light tones (card/subtle/border) the stroke uses the
 * theme border so the outline is visible against the fill.
 */
const toneStrokeVar: Record<NumberBadgeTone, string> = {
  navy: 'var(--secondary)',
  mint: 'var(--accent)',
  card: 'var(--border)',
  subtle: 'var(--border)',
  border: 'var(--border)',
}

/**
 * `NumberBadge` is the compact numbered chip on the pamphlet — the
 * little "01" / "02" marker that begins each step in a sequence.
 *
 * All three shapes (`square`, `chamfered`, `circle`) render via a
 * 32-point CSS `clip-path: polygon(...)` so they share the same
 * clip-path morph pipeline as the rest of the chamfered system.
 * This means transitioning between shapes (e.g. Stepper moving an
 * indicator from `upcoming` → `active`) can animate the `clip-path`
 * smoothly when paired with a CSS `transition`.
 *
 * Callers can pass `children` to override the rendered content (used
 * by Stepper for the completed-state checkmark). An optional `style`
 * prop is merged on top of the base custom-property style, so callers
 * can override `--cf-fill` / `--cf-stroke` per-state without losing
 * the base `--cf-clip` and `--cf-inset`.
 */
export const NumberBadge: React.FC<{
  /** Numeric or short string label rendered inside the badge. */
  value: string | number
  tone?: NumberBadgeTone
  shape?: NumberBadgeShape
  /** Size of the badge in Tailwind spacing units. Defaults to `size-8`. */
  sizeClassName?: string
  className?: string
  /** Optional className for the inner number text. */
  textClassName?: string
  /** Optional content override; takes precedence over `value`. */
  children?: React.ReactNode
  /** Override the auto-generated `aria-label` (e.g. for non-numeric badges). */
  ariaLabel?: string
  /** Inline style merged on top of the base chamfer custom-property style. */
  style?: React.CSSProperties
}> = ({
  value,
  tone = 'navy',
  shape = 'square',
  sizeClassName = 'size-8',
  className,
  textClassName,
  children,
  ariaLabel,
  style: incomingStyle,
}) => {
  const toneClass: Record<NumberBadgeTone, string> = {
    navy: 'text-(--secondary-foreground)',
    mint: 'text-(--accent-foreground)',
    card: 'text-card-foreground',
    subtle: 'text-(--heading)',
    border: 'text-foreground',
  }

  const baseStyle: React.CSSProperties = {
    '--cf-fill': toneFillVar[tone],
    '--cf-stroke': toneStrokeVar[tone],
    '--cf-inset': '1px',
    '--cf-clip': shapeClipPathMap[shape],
    background: 'transparent',
  } as React.CSSProperties

  // Merge incoming style on top of the base so callers can override
  // individual custom properties (e.g. `--cf-fill`) per-state.
  const style = { ...baseStyle, ...incomingStyle } as React.CSSProperties

  const resolvedAriaLabel =
    ariaLabel ??
    (typeof value === 'number' || typeof value === 'string' ? `Step ${value}` : undefined)

  return (
    <span
      role="img"
      aria-label={resolvedAriaLabel}
      data-chamfer=""
      data-badge-shape={shape}
      className={cn(
        'relative inline-flex items-center justify-center font-mono text-xs font-semibold tabular-nums',
        sizeClassName,
        toneClass[tone],
        className,
      )}
      style={style}
    >
      <span className={cn(textClassName)}>{children ?? value}</span>
    </span>
  )
}

export default NumberBadge
