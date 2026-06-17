import * as React from 'react'
import { buildChamferClipPathPct } from '@/components/ui/chamfer'
import { cn } from '@/utilities/ui'

export type NumberBadgeTone = 'navy' | 'mint' | 'card' | 'subtle' | 'border'

export type NumberBadgeShape = 'square' | 'chamfered' | 'circle'

const CHAMFER_CLIP_PATH = buildChamferClipPathPct([{ corner: 'top-right', xPct: 30, yPct: 30 }])

/**
 * Tone-fill CSS variable reference that matches the bg-colour the
 * tone class would have set (which is overridden to `transparent`
 * when chamfered).
 */
const toneFillVar: Record<NumberBadgeTone, string> = {
  navy: 'var(--secondary)',
  mint: 'var(--accent)',
  card: 'var(--card)',
  subtle: 'var(--subtle-background)',
  border: 'var(--background)',
}

const toneStrokeVar: Record<NumberBadgeTone, string> = {
  navy: 'var(--border)',
  mint: 'var(--border)',
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
      data-chamfer={isChamfered ? '' : undefined}
      className={cn(
        'relative inline-flex items-center justify-center font-mono text-xs font-semibold tabular-nums',
        // Border is only on square/circle — the chamfered shape renders its
        // own stroke via the `::before` pseudo-element, so the parent's
        // 1px border would show as a square outline around the chamfer.
        isChamfered ? null : 'border',
        sizeClassName,
        shapeClass,
        toneClass[tone],
        className,
      )}
      style={
        isChamfered
          ? ({
              '--cf-fill': toneFillVar[tone],
              '--cf-stroke': toneStrokeVar[tone],
              '--cf-inset': '1px',
              '--cf-clip': CHAMFER_CLIP_PATH,
              background: 'transparent',
            } as React.CSSProperties & Record<string, string>)
          : undefined
      }
    >
      <span className={cn(textClassName)}>{value}</span>
    </span>
  )
}
