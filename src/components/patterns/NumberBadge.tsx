import * as React from 'react'
import { buildChamferSvgPath } from '@/components/ui/chamfer'
import { cn } from '@/utilities/ui'

export type NumberBadgeTone = 'navy' | 'mint' | 'card' | 'subtle' | 'border'

export type NumberBadgeShape = 'square' | 'chamfered' | 'circle'

const CHAMFER_PATH = buildChamferSvgPath({
  width: 100,
  height: 100,
  topLeft: { x: 0, y: 0 },
  topRight: { x: 30, y: 30 },
  bottomRight: { x: 0, y: 0 },
  bottomLeft: { x: 0, y: 0 },
})

const toneFill: Record<NumberBadgeTone, string> = {
  navy: 'var(--secondary)',
  mint: 'var(--accent)',
  card: 'var(--card)',
  subtle: 'var(--subtle-background)',
  border: 'var(--background)',
}

const toneStroke: Record<NumberBadgeTone, string> = {
  navy: 'var(--secondary)',
  mint: 'var(--accent)',
  card: 'var(--border)',
  subtle: 'var(--border)',
  border: 'var(--border)',
}

/**
 * `NumberBadge` is the compact numbered chip on the pamphlet — the
 * little "01" / "02" marker that begins each step in a sequence. It
 * always exposes the number as readable text (it is not decorative)
 * and lets callers choose a square, chamfered, or round shape plus a
 * token-backed tone.
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
}> = ({
  value,
  tone = 'navy',
  shape = 'square',
  sizeClassName = 'size-8',
  className,
  textClassName,
}) => {
  const toneClass: Record<NumberBadgeTone, string> = {
    navy: 'bg-(--secondary) text-(--secondary-foreground) border-(--secondary)',
    mint: 'bg-(--accent) text-(--accent-foreground) border-(--accent)',
    card: 'bg-card text-card-foreground border-border',
    subtle: 'bg-(--subtle-background) text-(--heading) border-border',
    border: 'bg-background text-foreground border-border',
  }

  const shapeClass = shape === 'circle' ? 'rounded-full' : shape === 'square' ? 'rounded-sm' : ''

  const isChamfered = shape === 'chamfered'

  return (
    <span
      role="img"
      aria-label={`Step ${value}`}
      className={cn(
        'relative inline-flex items-center justify-center border font-mono text-xs font-semibold tabular-nums',
        sizeClassName,
        shapeClass,
        toneClass[tone],
        className,
      )}
    >
      {isChamfered && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d={CHAMFER_PATH}
            fill={toneFill[tone]}
            stroke={toneStroke[tone]}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
      <span className={cn(isChamfered && 'relative z-10', textClassName)}>{value}</span>
    </span>
  )
}
