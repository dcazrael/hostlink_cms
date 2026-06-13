import { cn } from '@/utilities/ui'
import * as React from 'react'

export type DiagonalBandTone = 'navy' | 'mint' | 'subtle' | 'card' | 'border'

export type DiagonalBandOrientation = 'left' | 'right'

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
  const toneClass: Record<DiagonalBandTone, string> = {
    navy: 'bg-(--secondary)',
    mint: 'bg-(--accent)',
    subtle: 'bg-(--subtle-background)',
    card: 'bg-card',
    border: 'bg-border',
  }

  // Tone-aware label text class. Pairs each band's background token with
  // the matching foreground token declared in globals.css so the label
  // strip stays readable on every exposed tone.
  const toneTextClass: Record<DiagonalBandTone, string> = {
    navy: 'text-(--secondary-foreground)',
    mint: 'text-(--accent-foreground)',
    subtle: 'text-(--heading)',
    card: 'text-foreground',
    border: 'text-foreground',
  }

  // Decorative only when there is no label AND no children to announce.
  const isDecorative = !ariaLabel && children == null

  const style = {
    '--tilt': children == null ? '0.5rem' : '1.5rem',
    clipPath:
      orientation === 'right'
        ? 'polygon(0 100%, var(--tilt) 0, 100% 0, 100% 100%)'
        : 'polygon(0 0, calc(100% - var(--tilt)) 0, 100% 100%, 0 100%)',
  } as React.CSSProperties

  return (
    <div
      aria-hidden={isDecorative || undefined}
      aria-label={ariaLabel}
      className={cn(
        'relative w-full overflow-hidden',
        // Tinted surface that paints the entire band area (not just the
        // bar). This keeps the label strip readable on light tones where
        // the skewed bar is the same color as the page background.
        toneClass[tone],
        className,
      )}
      data-pattern-diagonal-surface
      style={style}
    >
      <div aria-hidden className={cn('block w-full', heightClassName)} />
      {children ? (
        <div
          className={cn(
            // Intrinsic padding (not negative margin) so the label strip
            // occupies visible space below the bar and is never clipped
            // by the parent or hidden under the bar's painted pixels.
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
