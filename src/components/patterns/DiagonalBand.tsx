'use client'
import { cn } from '@/utilities/ui'
import * as React from 'react'

export type DiagonalBandTone = 'navy' | 'mint' | 'subtle' | 'card' | 'border'

export type DiagonalBandOrientation = 'left' | 'right'

const toneFill: Record<DiagonalBandTone, string> = {
  navy: 'var(--secondary)',
  mint: 'var(--accent)',
  subtle: 'var(--subtle-background)',
  card: 'var(--card)',
  border: 'var(--border)',
}

const toneTextClass: Record<DiagonalBandTone, string> = {
  navy: 'text-(--secondary-foreground)',
  mint: 'text-(--accent-foreground)',
  subtle: 'text-(--heading)',
  card: 'text-foreground',
  border: 'text-foreground',
}

/**
 * Build a CSS `clip-path: polygon(...)` for the diagonal trapezoid.
 * For `right` the top-left edge is sloped; for `left` the top-right edge.
 * `tilt` is the horizontal offset in *px* for the sloped edge.
 */
function buildBandClipPath(orientation: DiagonalBandOrientation, tilt: number): string {
  if (orientation === 'right') {
    return `polygon(${tilt}px 0%, 100% 0%, 100% 100%, 0% 100%)`
  }
  return `polygon(0% 0%, calc(100% - ${tilt}px) 0%, 100% 100%, 0% 100%)`
}

/**
 * `DiagonalBand` is the slim angled slab that runs across the top of a
 * pamphlet section — the deep navy bar with a small mint wedge on the
 * hostlink cover, or the thin utility bar above a content block.
 *
 * Accessibility:
 *  - When the band is purely decorative — no `children` and no
 *    `ariaLabel` — it renders as `aria-hidden` so screen readers skip it.
 *  - When `children` are provided, the band stays in the accessibility
 *    tree and the descendant label text is announced normally.
 *  - When `ariaLabel` is supplied, the band is treated as a labelled
 *    region (decorative or otherwise) and announced with that label.
 */
export const DiagonalBand: React.FC<{
  tone?: DiagonalBandTone
  orientation?: DiagonalBandOrientation
  /** Visual thickness in Tailwind spacing units. Defaults to `h-2`. */
  heightClassName?: string
  /**
   * Optional content rendered below the angled bar as a label strip.
   * When present, the band is NOT marked `aria-hidden` and the
   * descendant label is announced by assistive tech.
   */
  children?: React.ReactNode
  className?: string
  /**
   * Accessible label for the band. When supplied, the band is treated as
   * a labelled region and the descendants are still announced. The band
   * is only `aria-hidden` when both this prop and `children` are absent.
   */
  ariaLabel?: string
}> = ({
  tone = 'navy',
  orientation = 'left',
  heightClassName = 'h-2',
  children,
  className,
  ariaLabel,
}) => {
  const tilt = children == null ? 12 : 36
  const clipPath = buildBandClipPath(orientation, tilt)

  // Decorative only when there is no label AND no children to announce.
  const isDecorative = !ariaLabel && children == null

  return (
    <div
      aria-hidden={isDecorative || undefined}
      aria-label={ariaLabel}
      data-chamfer
      className={cn('relative w-full overflow-hidden', className)}
      data-pattern-diagonal-surface
      style={
        {
          '--cf-fill': toneFill[tone],
          '--cf-stroke': 'transparent',
          '--cf-inset': '0px',
          '--cf-clip': clipPath,
          background: 'transparent',
        } as React.CSSProperties & Record<string, string>
      }
    >
      <div aria-hidden className={cn('relative block w-full', heightClassName)} />
      {children ? (
        <div
          className={cn(
            'relative px-4 pb-3 pt-1 text-xs font-mono uppercase tracking-widest',
            toneTextClass[tone],
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}
