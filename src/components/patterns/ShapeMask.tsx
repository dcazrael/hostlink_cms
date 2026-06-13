import * as React from 'react'
import { cn } from '@/utilities/ui'

/**
 * Direction of the diagonal cut on a `ShapeMask`. The `clip-path` is built from
 * these so that two shapes can be butted against each other (e.g. an accent
 * band on top of a navy slab) without leaving a hairline gap.
 */
export type ShapeMaskDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export type ShapeMaskTone = 'navy' | 'mint' | 'subtle' | 'card' | 'background'

/**
 * `ShapeMask` renders a rectangular slab whose leading edge is cut on the
 * diagonal, mirroring the slanted panels on the hostlink pamphlet cover and
 * inside pages.
 *
 * Accessibility:
 *  - When the wrapper is purely decorative — no `children` and no
 *    `ariaLabel` — it renders as `aria-hidden` so screen readers skip it.
 *  - When `children` are provided, the wrapper stays in the accessibility
 *    tree and the descendant content is announced normally. The caller
 *    owns the surrounding semantics.
 *  - When `ariaLabel` is supplied, the wrapper is treated as a labelled
 *    region (decorative or otherwise) and announced with that label.
 */
export const ShapeMask: React.FC<{
  /** Tone applied to the masked slab. Maps to a token-backed background. */
  tone?: ShapeMaskTone
  /** Which corner the diagonal cut points toward. */
  direction?: ShapeMaskDirection
  /** Depth of the diagonal cut as a percentage of the slab height. */
  depth?: number
  /**
   * Optional content rendered inside the masked slab. When present, the
   * wrapper is NOT marked `aria-hidden` and descendant content is
   * announced by assistive tech.
   */
  children?: React.ReactNode
  className?: string
  /**
   * Optional extra Tailwind classes for the inner content container. The
   * outer masked element is a `<div>` so the `clip-path` applies to the
   * fill; the inner container pads content away from the cut edge.
   */
  innerClassName?: string
  /**
   * Accessible label for the wrapper. When supplied, the wrapper is
   * treated as a labelled region and the descendants are still announced.
   * The wrapper is only `aria-hidden` when both this prop and `children`
   * are absent.
   */
  ariaLabel?: string
}> = ({
  tone = 'navy',
  direction = 'top-left',
  depth = 12,
  children,
  className,
  innerClassName,
  ariaLabel,
}) => {
  const safeDepth = Math.max(0, Math.min(40, depth))
  const d = `${safeDepth}%`
  const clipPath = (() => {
    switch (direction) {
      case 'top-left':
        return `polygon(0% ${d}, 100% 0%, 100% 100%, 0% 100%)`
      case 'top-right':
        return `polygon(0% 0%, 100% ${d}, 100% 100%, 0% 100%)`
      case 'bottom-left':
        return `polygon(0% 0%, 100% 0%, 100% 100%, 0% calc(100% - ${d}))`
      case 'bottom-right':
        return `polygon(0% 0%, 100% 0%, 100% calc(100% - ${d}), 0% 100%)`
    }
  })()

  const toneClass: Record<ShapeMaskTone, string> = {
    navy: 'bg-(--secondary) text-(--secondary-foreground)',
    mint: 'bg-(--accent) text-(--accent-foreground)',
    subtle: 'bg-(--subtle-background) text-(--heading)',
    card: 'bg-card text-card-foreground',
    background: 'bg-background text-foreground',
  }

  // Decorative only when there is no label AND no children to announce.
  const isDecorative = !ariaLabel && children == null

  return (
    <div
      aria-hidden={isDecorative || undefined}
      aria-label={ariaLabel}
      className={cn('relative w-full', toneClass[tone], className)}
      style={{ clipPath }}
    >
      <div className={cn('px-6 py-10 md:px-10 md:py-14', innerClassName)}>{children}</div>
    </div>
  )
}
