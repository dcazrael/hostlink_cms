import * as React from 'react'
import { cn } from '@/utilities/ui'

export type NumberBadgeTone = 'navy' | 'mint' | 'card' | 'subtle' | 'border'

export type NumberBadgeShape = 'square' | 'chamfered' | 'circle'

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

  const shapeClass =
    shape === 'circle'
      ? 'rounded-full'
      : shape === 'chamfered'
        ? '[clip-path:polygon(0%_0%,calc(100%-30%)_0%,100%_30%,100%_100%,0%_100%)]'
        : 'rounded-sm'

  return (
    <span
      role="img"
      aria-label={`Step ${value}`}
      className={cn(
        'inline-flex items-center justify-center border font-mono text-xs font-semibold tabular-nums',
        sizeClassName,
        shapeClass,
        toneClass[tone],
        className,
      )}
    >
      <span className={cn(textClassName)}>{value}</span>
    </span>
  )
}
